import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

SAMPLE_PAYLOAD = {
    "project_id": "test-uuid-003",
    "product_name": "AuraPulse Watch",
    "raw_brief_text": "Affordable recovery smartwatch for collegiate athletes focusing on sleep and HRV.",
    "target_platform": "instagram_reels",
    "forbidden_terms": ["cheap", "unreliable"],
}


@pytest.mark.asyncio
async def test_selective_node_rerun_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "brief": SAMPLE_PAYLOAD,
            "archetype": "value_inversion",
            "override_prompt": "You don't need a $400 watch to track REM recovery.",
        }
        response = await client.post(
            "/api/v1/nodes/node_hook_branch_b/rerun",
            json=payload,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["node_id"] == "node_hook_branch_b"
        assert data["variant"]["headline_hook"] == "You don't need a $400 watch to track REM recovery."
        assert data["variant"]["evaluation"]["composite_index"] >= 0.0
        assert data["recomputation_latency_ms"] >= 0
