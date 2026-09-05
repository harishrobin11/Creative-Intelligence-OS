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

export interface GraphTopologyResponse {
  graph_id: string;
  nodes: any[];
  edges: any[];
}

export interface GraphExecutionResponse {
  graph_id: string;
  brief: BrandBriefPayloadClient;
  strategy: any;
  variants: any[];
  total_duration_ms: number;
}

export interface NodeRerunResponse {
  node_id: string;
  variant: any;
  status: string;
  recomputation_latency_ms: number;
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

/**
 * Compiles brief payload into DAG computational topology.
 */
export async function compileGraphApi(payload: BrandBriefPayloadClient): Promise<GraphTopologyResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/graphs/compile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to compile graph topology (${response.status})`);
  }

  return response.json();
}

/**
 * Executes multi-agent strategy pipeline (Strategist -> 3 Parallel Hook Generators -> Critic).
 */
export async function executeGraphApi(payload: BrandBriefPayloadClient): Promise<GraphExecutionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/graphs/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to execute agent graph (${response.status})`);
  }

  return response.json();
}

/**
 * Reruns single target branch node without resetting upstream Strategy state.
 */
export async function rerunNodeApi(
  nodeId: string,
  brief: BrandBriefPayloadClient,
  archetype: string,
  overridePrompt?: string
): Promise<NodeRerunResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/nodes/${nodeId}/rerun`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      brief,
      archetype,
      override_prompt: overridePrompt,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to rerun node ${nodeId} (${response.status})`);
  }

  return response.json();
}
