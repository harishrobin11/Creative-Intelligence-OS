import pytest
from app.schemas.contracts import (
    BrandBriefPayload,
    StrategistOutput,
    CreativeAngleVariant,
    SceneStoryboardBeat,
    EvaluationVector,
)
from app.agents.critic import run_critic_agent, evaluate_and_refine
from app.agents.strategist import run_strategist_agent
from app.agents.hook_generator import run_hook_generator_branch

SAMPLE_PAYLOAD = {
    "project_id": "test-uuid-002",
    "product_name": "AuraPulse Watch",
    "raw_brief_text": "Affordable recovery smartwatch for collegiate athletes focusing on sleep and HRV.",
    "target_platform": "instagram_reels",
    "forbidden_terms": ["fake", "unreliable"],
}


@pytest.mark.asyncio
async def test_critic_agent_scoring_math():
    brief = BrandBriefPayload(**SAMPLE_PAYLOAD)
    strategy = await run_strategist_agent(brief)
    variant = await run_hook_generator_branch(brief, strategy, "value_inversion")

    eval_result = await run_critic_agent(variant, brief)

    assert isinstance(eval_result, EvaluationVector)
    assert 0.0 <= eval_result.composite_index <= 100.0
    assert eval_result.pass_audit is True

    # Verify formula match within rounding
    expected_composite = round(
        (0.35 * eval_result.hook_velocity_score)
        + (0.25 * eval_result.novelty_score)
        + (0.25 * eval_result.clarity_score)
        + (0.15 * eval_result.brand_alignment_score),
        1,
    )
    assert abs(eval_result.composite_index - expected_composite) <= 0.1


@pytest.mark.asyncio
async def test_critic_agent_forbidden_term_penalty():
    brief = BrandBriefPayload(**SAMPLE_PAYLOAD)
    strategy = await run_strategist_agent(brief)
    variant = await run_hook_generator_branch(brief, strategy, "pain_agitation")

    # Inject forbidden term into variant headline hook
    variant.headline_hook = "Why this watch is totally fake and unreliable."

    eval_result = await run_critic_agent(variant, brief)

    assert eval_result.pass_audit is False
    assert eval_result.brand_alignment_score <= 50.0
    assert "forbidden term violation" in eval_result.critique_notes.lower()


@pytest.mark.asyncio
async def test_self_correction_reflection_loop():
    brief = BrandBriefPayload(**SAMPLE_PAYLOAD)
    strategy = await run_strategist_agent(brief)
    variant = await run_hook_generator_branch(brief, strategy, "social_proof")

    refined_variant, status_code = await evaluate_and_refine(
        variant, brief, strategy, max_retries=2
    )

    assert isinstance(refined_variant, CreativeAngleVariant)
    assert status_code in ["PASSED", "FLAGGED_FOR_MANUAL_REVIEW"]
    assert refined_variant.evaluation.composite_index >= 0.0
