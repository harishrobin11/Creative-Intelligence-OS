export interface URLExtractionRequest {
  url: string;
}

export interface URLExtractionResponse {
  url: string;
  title: string;
  description: string;
  extracted_text: string;
  suggested_brief: string;
}

export interface BrandBriefPayloadClient {
  project_id: string;
  product_name: string;
  product_url?: string;
  raw_brief_text: string;
  target_platform: "tiktok" | "instagram_reels" | "youtube_shorts";
  forbidden_terms: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Scrapes product landing page URL for brief context.
 */
export async function extractUrlContent(url: string): Promise<URLExtractionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/extract-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to extract URL content (${response.status})`);
  }

  return response.json();
}
