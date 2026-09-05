import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.schemas.contracts import BrandBriefPayload, StrategistOutput, CreativeAngleVariant
from app.agents.strategist import run_strategist_agent
from app.agents.hook_generator import run_all_hook_branches_parallel, run_hook_generator_branch
from app.engine.dag_runner import AsyncGraphExecutor

SAMPLE_PAYLOAD = {
    "project_id": "test-uuid-001",
    "product_name": "AuraPulse Fitness Watch",
    "raw_brief_text": "Affordable recovery smartwatch for collegiate athletes focusing on REM sleep and HRV recovery index.",
    "target_platform": "instagram_reels",
    "forbidden_terms": ["cheap", "unreliable"],
}


@pytest.mark.asyncio
async def test_strategist_agent_runner():
    brief = BrandBriefPayload(**SAMPLE_PAYLOAD)
    strategy = await run_strategist_agent(brief)
    
    assert isinstance(strategy, StrategistOutput)
    assert len(strategy.personas) >= 1
    assert len(strategy.core_value_props) >= 2
    assert len(strategy.positioning_statement) > 10


@pytest.mark.asyncio
async def test_parallel_hook_generator_branches():
    brief = BrandBriefPayload(**SAMPLE_PAYLOAD)
    strategy = await run_strategist_agent(brief)
    
    variants = await run_all_hook_branches_parallel(brief, strategy)
    
    assert len(variants) == 3
    archetypes = [v.angle_archetype for v in variants]
    assert "pain_agitation" in archetypes
    assert "value_inversion" in archetypes
    assert "social_proof" in archetypes
    
    for variant in variants:
        assert isinstance(variant, CreativeAngleVariant)
        assert len(variant.storyboard) >= 4
        assert variant.evaluation.composite_index >= 0.0


@pytest.mark.asyncio
async def test_dag_graph_executor():
    graph_def = {
        "node_strategist": ["node_brief"],
        "node_hook_a": ["node_strategist"],
        "node_hook_b": ["node_strategist"],
    }
    executor = AsyncGraphExecutor(graph_def)
    
    executed_nodes = []

    async def brief_runner(deps):
        executed_nodes.append("brief")
        return {"brief": "ok"}

    async def strategist_runner(deps):
        executed_nodes.append("strategist")
        return {"strategy": "ok"}

    async def hook_runner(deps):
        executed_nodes.append("hook")
        return {"hook": "ok"}

    registry = {
        "node_brief": brief_runner,
        "node_strategist": strategist_runner,
        "node_hook_a": hook_runner,
        "node_hook_b": hook_runner,
    }

    results = await executor.execute_pipeline(registry)
    assert "node_brief" in results
    assert "node_strategist" in results
    assert "node_hook_a" in results
    assert "node_hook_b" in results


@pytest.mark.asyncio
async def test_graph_compile_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/graphs/compile", json=SAMPLE_PAYLOAD)
        assert response.status_code == 200
        data = response.json()
        assert "graph_id" in data
        assert len(data["nodes"]) >= 5
        assert len(data["edges"]) >= 4


@pytest.mark.asyncio
async def test_graph_execute_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/graphs/execute", json=SAMPLE_PAYLOAD)
        assert response.status_code == 200
        data = response.json()
        assert "graph_id" in data
        assert "strategy" in data
        assert len(data["variants"]) == 3
        assert data["total_duration_ms"] >= 0
