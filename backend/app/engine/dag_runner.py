import asyncio
import logging
from graphlib import TopologicalSorter
from typing import Dict, Any, List, Callable

logger = logging.getLogger("dag_runner")


class AsyncGraphExecutor:
    """
    Asynchronous, non-blocking directed graph runner operating topological sort execution.
    Nodes in the same dependency tier execute concurrently using asyncio.gather().
    """

    def __init__(self, graph_definition: Dict[str, List[str]]):
        """
        graph_definition mapping node_id -> list of dependency node_ids.
        e.g., {'node_strategist_01': ['node_brief_01']}
        """
        self.graph = graph_definition
        self.state_cache: Dict[str, Any] = {}

    async def run_node(self, node_id: str, node_callable: Callable[[Dict[str, Any]], Any]):
        dep_node_ids = self.graph.get(node_id, [])
        dep_data = {dep_id: self.state_cache[dep_id] for dep_id in dep_node_ids if dep_id in self.state_cache}
        
        logger.info(f"Executing node {node_id} with dependencies: {list(dep_data.keys())}")
        result = await node_callable(dep_data)
        self.state_cache[node_id] = result
        return result

    async def execute_pipeline(self, registry: Dict[str, Callable]):
        sorter = TopologicalSorter(self.graph)
        sorter.prepare()

        while sorter.is_active():
            ready_nodes = sorter.get_ready()
            tasks = [
                self.run_node(nid, registry[nid])
                for nid in ready_nodes
                if nid in registry
            ]

            if tasks:
                await asyncio.gather(*tasks)
            sorter.done(*ready_nodes)

        return self.state_cache
