import time
from typing import List, Dict, Any
from fastapi import APIRouter, status, HTTPException
from pydantic import BaseModel, Field

from app.schemas.contracts import (
    BrandBriefPayload,
    StrategistOutput,
    CreativeAngleVariant,
)
from app.agents.strategist import run_strategist_agent
from app.agents.hook_generator import run_all_hook_branches_parallel

router = APIRouter()


class GraphTopologyResponse(BaseModel):
    graph_id: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


class GraphExecutionResponse(BaseModel):
    graph_id: str
    brief: BrandBriefPayload
    strategy: StrategistOutput
    variants: List[CreativeAngleVariant]
    total_duration_ms: int


@router.post(
    "/graphs/compile",
    response_model=GraphTopologyResponse,
    status_code=status.HTTP_200_OK,
    summary="Compile brief payload into DAG computational topology",
)
async def compile_graph(payload: BrandBriefPayload):
    graph_id = f"graph-{payload.project_id}-{int(time.time())}"

    # Build node manifests matching spec requirements
    nodes = [
        {
            "id": "node_brief_01",
            "type": "briefNode",
            "data": {
                "product_name": payload.product_name,
                "product_url": payload.product_url,
                "target_platform": payload.target_platform,
                "brief_excerpt": payload.raw_brief_text,
                "forbidden_terms": payload.forbidden_terms,
            },
        },
        {
            "id": "node_strategist_01",
            "type": "strategistNode",
            "data": {
                "persona_name": f"Target Customer for {payload.product_name}",
                "status": "idle",
            },
        },
        {
            "id": "node_hook_branch_a",
            "type": "angleBranchNode",
            "data": {"variant_id": "VAR-A-PAIN-001", "archetype": "pain_agitation"},
        },
        {
            "id": "node_hook_branch_b",
            "type": "angleBranchNode",
            "data": {"variant_id": "VAR-B-VALUE-INVERT-002", "archetype": "value_inversion"},
        },
        {
            "id": "node_hook_branch_c",
            "type": "angleBranchNode",
            "data": {"variant_id": "VAR-C-SOCIAL-003", "archetype": "social_proof"},
        },
        {
            "id": "node_critic_02",
            "type": "brandCriticNode",
            "data": {"status": "idle"},
        },
    ]

    edges = [
        {"id": "e1-2", "source": "node_brief_01", "target": "node_strategist_01"},
        {"id": "e2-3a", "source": "node_strategist_01", "target": "node_hook_branch_a"},
        {"id": "e2-3b", "source": "node_strategist_01", "target": "node_hook_branch_b"},
        {"id": "e2-3c", "source": "node_strategist_01", "target": "node_hook_branch_c"},
        {"id": "e3b-4", "source": "node_hook_branch_b", "target": "node_critic_02"},
    ]

    return GraphTopologyResponse(graph_id=graph_id, nodes=nodes, edges=edges)


@router.post(
    "/graphs/execute",
    response_model=GraphExecutionResponse,
    status_code=status.HTTP_200_OK,
    summary="Execute multi-agent strategy pipeline (Strategist -> 3 Parallel Hook Generators)",
)
async def execute_graph(payload: BrandBriefPayload):
    start_time = time.time()
    graph_id = f"exec-{payload.project_id}-{int(start_time)}"

    try:
        # Tier 1: Strategist Agent
        strategy = await run_strategist_agent(payload)

        # Tier 2: Parallel Hook Generators (3 branches concurrently)
        variants = await run_all_hook_branches_parallel(payload, strategy)

        duration_ms = int((time.time() - start_time) * 1000)

        return GraphExecutionResponse(
            graph_id=graph_id,
            brief=payload,
            strategy=strategy,
            variants=variants,
            total_duration_ms=duration_ms,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Execution pipeline failed: {str(exc)}",
        )
