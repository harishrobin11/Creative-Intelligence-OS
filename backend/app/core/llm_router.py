import os
import json
import logging
from typing import Type, TypeVar, Optional
from pydantic import BaseModel

logger = logging.getLogger("llm_router")

T = TypeVar("T", bound=BaseModel)


async def call_structured_llm(
    prompt: str,
    system_prompt: str,
    response_model: Type[T],
    model: str = "gpt-4o-mini",
) -> Optional[T]:
    """
    Calls LLM provider via LiteLLM abstraction with structured output enforcement.
    If no API key is present or invocation fails, returns None for fallback handling.
    """
    has_api_key = any(
        os.getenv(k)
        for k in ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GEMINI_API_KEY", "MODEL_API_KEY"]
    )

    if has_api_key:
        try:
            import litellm

            response = await litellm.acompletion(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                timeout=15.0,
            )

            raw_json = response.choices[0].message.content
            parsed = json.loads(raw_json)
            return response_model.model_validate(parsed)
        except Exception as exc:
            logger.warning(f"LLM API call failed or timed out ({str(exc)}). Using fallback.")

    return None
