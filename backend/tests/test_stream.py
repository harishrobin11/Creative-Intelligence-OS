import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_sse_stream_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/graphs/test-graph-001/stream")
        assert response.status_code == 200
        assert "text/event-stream" in response.headers.get("content-type", "")
        
        content = response.text
        assert "event: node_started" in content
        assert "event: critic_evaluation" in content
        assert "event: graph_completed" in content
