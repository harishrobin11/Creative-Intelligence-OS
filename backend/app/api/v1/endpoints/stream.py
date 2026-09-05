import asyncio
import json
import time
from fastapi import APIRouter, status
from fastapi.responses import StreamingResponse

router = APIRouter()


@router.get(
    "/graphs/{graph_id}/stream",
    status_code=status.HTTP_200_OK,
    summary="Real-time Server-Sent Events (SSE) stream for graph execution telemetry (SP-18)",
)
async def stream_graph_execution(graph_id: str):
    async def event_generator():
        start_time = time.time()

        # 1. Brief ingestion started
        yield f"event: node_started\ndata: {json.dumps({'node_id': 'node_brief_01', 'timestamp': start_time, 'agent': 'IngestionEngine'})}\n\n"
        await asyncio.sleep(0.3)

        # 2. Strategist Agent started
        yield f"event: node_started\ndata: {json.dumps({'node_id': 'node_strategist_01', 'timestamp': time.time(), 'agent': 'StrategistAgent'})}\n\n"
        await asyncio.sleep(0.4)

        # 3. Token stream sample
        yield f"event: node_token_stream\ndata: {json.dumps({'node_id': 'node_strategist_01', 'token': 'Collegiate Runner Persona Extracted'})}\n\n"
        await asyncio.sleep(0.3)

        # 4. Angle Branch Hook Generators started
        yield f"event: node_started\ndata: {json.dumps({'node_id': 'node_hook_branch_b', 'timestamp': time.time(), 'agent': 'HookGeneratorAgent'})}\n\n"
        await asyncio.sleep(0.4)

        # 5. Brand Critic Evaluation
        yield f"event: critic_evaluation\ndata: {json.dumps({'node_id': 'node_critic_02', 'score': 91.8, 'status': 'PASSED', 'action': 'ADVANCE'})}\n\n"
        await asyncio.sleep(0.2)

        # 6. Graph Execution Completed
        total_duration = int((time.time() - start_time) * 1000)
        yield f"event: graph_completed\ndata: {json.dumps({'graph_id': graph_id, 'total_duration_ms': total_duration, 'total_tokens': 1845, 'total_cost_usd': 0.00369})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
