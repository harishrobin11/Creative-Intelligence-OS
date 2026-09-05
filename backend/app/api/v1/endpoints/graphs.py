import asyncio
import time
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, status, HTTPException
from pydantic import BaseModel, Field

from app.schemas.contracts import (
    BrandBriefPayload,
    StrategistOutput,
    CreativeAngleVariant,
    EvaluationVector,
)
from app.agents.strategist import run_strategist_agent
from app.agents.hook_generator import run_all_hook_branches_parallel, run_hook_generator_branch
from app.agents.critic import evaluate_and_refine

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


class NodeRerunPayload(BaseModel):
    brief: BrandBriefPayload
    strategy: Optional[StrategistOutput] = None
    archetype: str = Field("value_inversion", description="Target angle archetype e.g. pain_agitation, value_inversion, social_proof")
    override_prompt: Optional[str] = Field(None, description="Optional custom revision prompt")


class NodeRerunResponse(BaseModel):
    node_id: str
    variant: CreativeAngleVariant
    status: str
    recomputation_latency_ms: int


@router.post(
    "/graphs/compile",
    response_model=GraphTopologyResponse,
    status_code=status.HTTP_200_OK,
    summary="Compile brief payload into DAG computational topology",
)
async def compile_graph(payload: BrandBriefPayload):
    graph_id = f"graph-{payload.project_id}-{int(time.time())}"

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
    summary="Execute multi-agent strategy pipeline with Brand Critic self-correction reflection loop",
)
async def execute_graph(payload: BrandBriefPayload):
    start_time = time.time()
    graph_id = f"exec-{payload.project_id}-{int(start_time)}"

    try:
        # Tier 1: Strategist Agent
        strategy = await run_strategist_agent(payload)

        # Tier 2: Parallel Hook Generators (3 branches concurrently)
        initial_variants = await run_all_hook_branches_parallel(payload, strategy)

        # Tier 3: Brand Critic Reflection Loop (evaluate and refine each branch concurrently)
        refinement_tasks = [
            evaluate_and_refine(variant, payload, strategy, max_retries=2)
            for variant in initial_variants
        ]

        evaluated_pairs = await asyncio.gather(*refinement_tasks)
        evaluated_variants = [pair[0] for pair in evaluated_pairs]

        duration_ms = int((time.time() - start_time) * 1000)

        return GraphExecutionResponse(
            graph_id=graph_id,
            brief=payload,
            strategy=strategy,
            variants=evaluated_variants,
            total_duration_ms=duration_ms,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Execution pipeline failed: {str(exc)}",
        )


@router.post(
    "/nodes/{node_id}/rerun",
    response_model=NodeRerunResponse,
    status_code=status.HTTP_200_OK,
    summary="Selective single-node recomputation without resetting upstream Strategist state (SP-15)",
)
async def rerun_single_node(node_id: str, payload: NodeRerunPayload):
    start_time = time.time()

    try:
        # Step 1: Preserve upstream Strategy or run if missing
        strategy = payload.strategy or await run_strategist_agent(payload.brief)

        archetype_val = payload.archetype
        if archetype_val not in ["pain_agitation", "value_inversion", "social_proof"]:
            archetype_val = "value_inversion"

        # Step 2: Recompute ONLY target branch variant
        variant = await run_hook_generator_branch(payload.brief, strategy, archetype_val) # type: ignore

        # Override headline hook if custom override prompt provided
        if payload.override_prompt and payload.override_prompt.strip():
            variant.headline_hook = payload.override_prompt.strip()

        # Step 3: Evaluate target variant through Brand Critic
        refined_variant, eval_status = await evaluate_and_refine(
            variant, payload.brief, strategy, max_retries=2
        )

        latency_ms = int((time.time() - start_time) * 1000)

        return NodeRerunResponse(
            node_id=node_id,
            variant=refined_variant,
            status=eval_status,
            recomputation_latency_ms=latency_ms,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Single-node rerun failed: {str(exc)}",
        )
