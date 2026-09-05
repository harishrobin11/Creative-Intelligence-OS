import re
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, HttpUrl, Field
import httpx
from bs4 import BeautifulSoup

router = APIRouter()


class URLExtractionRequest(BaseModel):
    url: str = Field(..., description="Target landing page URL to scrape")


class URLExtractionResponse(BaseModel):
    url: str
    title: str
    description: str
    extracted_text: str
    suggested_brief: str


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


@router.post(
    "/extract-url",
    response_model=URLExtractionResponse,
    status_code=status.HTTP_200_OK,
    summary="Scrape company landing page for creative brief context",
)
async def extract_url_content(payload: URLExtractionRequest):
    url_str = payload.url.strip()

    # Prepend https:// if protocol is missing
    if not url_str.startswith(("http://", "https://")):
        url_str = f"https://{url_str}"

    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True, headers=HEADERS) as client:
            response = await client.get(url_str)
            response.raise_for_status()
            html_content = response.text
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Target URL returned status code {exc.response.status_code}",
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to connect to URL: {str(exc)}",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error during URL extraction: {str(exc)}",
        )

    soup = BeautifulSoup(html_content, "html.parser")

    # Extract title
    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else ""

    # Extract meta description
    description = ""
    meta_desc = soup.find("meta", attrs={"name": "description"}) or soup.find(
        "meta", attrs={"property": "og:description"}
    )
    if meta_desc and meta_desc.get("content"):
        description = meta_desc["content"].strip()

    # Extract clean text from headings and paragraphs
    text_snippets = []
    for element in soup.find_all(["h1", "h2", "h3", "p"]):
        text = element.get_text(strip=True)
        if text and len(text) > 15:
            text_snippets.append(text)

    # Clean whitespace
    full_text = " ".join(text_snippets)
    full_text = re.sub(r"\s+", " ", full_text).strip()

    # Formulate suggested positioning brief
    suggested_brief_parts = []
    if title:
        suggested_brief_parts.append(f"Product Title: {title}")
    if description:
        suggested_brief_parts.append(f"Core Positioning: {description}")
    if text_snippets:
        suggested_brief_parts.append("Key Highlights: " + " ".join(text_snippets[:4]))

    suggested_brief = " | ".join(suggested_brief_parts)
    if len(suggested_brief) < 20:
        suggested_brief = f"Product positioning and key features extracted from {url_str}. Focuses on high-performance benefits."

    return URLExtractionResponse(
        url=url_str,
        title=title or "Extracted Product Page",
        description=description or "Target landing page content deconstructed.",
        extracted_text=full_text[:1000],  # Truncate raw body text for clean payload
        suggested_brief=suggested_brief[:500],
    )
