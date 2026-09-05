import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock, patch
from app.main import app

SAMPLE_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>AuraPulse Fitness Watch — Precision Recovery</title>
    <meta name="description" content="Affordable recovery smartwatch for collegiate athletes focusing on sleep and HRV." />
</head>
<body>
    <h1>Elevate Your Athletic Performance</h1>
    <p>Track your REM sleep, split times, and recovery index without overpaying.</p>
</body>
</html>
"""


@pytest.mark.asyncio
async def test_extract_url_success():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        with patch("httpx.AsyncClient.get") as mock_get:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.text = SAMPLE_HTML
            mock_response.raise_for_status = MagicMock()
            mock_get.return_value = mock_response

            response = await client.post(
                "/api/v1/extract-url",
                json={"url": "aurapulse.com"},
            )

            assert response.status_code == 200
            data = response.json()
            assert data["url"] == "https://aurapulse.com"
            assert "AuraPulse Fitness Watch" in data["title"]
            assert "Affordable recovery smartwatch" in data["description"]
            assert "Elevate Your Athletic Performance" in data["extracted_text"]
            assert "Product Title" in data["suggested_brief"]


@pytest.mark.asyncio
async def test_extract_url_invalid_connection():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        with patch("httpx.AsyncClient.get", side_effect=Exception("Connection refused")):
            response = await client.post(
                "/api/v1/extract-url",
                json={"url": "aurapulse.com"},
            )
            assert response.status_code == 200
            data = response.json()
            assert "Aurapulse" in data["title"]
            assert "Synthesized extraction" in data["extracted_text"]
