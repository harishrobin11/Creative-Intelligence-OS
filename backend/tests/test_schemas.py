import pytest
from pydantic import ValidationError
from app.schemas.contracts import (
    BrandBriefPayload,
    AudiencePersona,
    StrategistOutput,
    EvaluationVector,
    SceneStoryboardBeat,
    CreativeAngleVariant,
)


def test_brand_brief_payload_valid():
    payload = BrandBriefPayload(
        project_id="proj-1234-uuid",
        product_name="AuraPulse Fitness Watch",
        product_url="https://aurapulse.com",
        raw_brief_text="Affordable recovery smartwatch designed specifically for collegiate athletes.",
        target_platform="instagram_reels",
        forbidden_terms=["cheap", "fake"],
    )
    assert payload.product_name == "AuraPulse Fitness Watch"
    assert payload.target_platform == "instagram_reels"
    assert len(payload.forbidden_terms) == 2


def test_brand_brief_payload_invalid_platform():
    with pytest.raises(ValidationError):
        BrandBriefPayload(
            project_id="proj-1234",
            product_name="AuraPulse",
            raw_brief_text="Affordable recovery smartwatch for collegiate athletes.",
            target_platform="facebook_feed",  # Invalid enum value
        )


def test_brand_brief_payload_too_short_brief():
    with pytest.raises(ValidationError):
        BrandBriefPayload(
            project_id="proj-1234",
            product_name="AuraPulse",
            raw_brief_text="Too short",  # < 20 characters
        )


def test_strategist_output_valid():
    persona = AudiencePersona(
        persona_name="Collegiate Runner",
        demographic_range="18-24",
        primary_anxiety="Inaccurate recovery metrics leading to overtraining",
        buying_trigger="Affordable split tracking with sleep recovery analysis",
        skepticism_barrier="Belief that sub-$100 watches lack sensor precision",
    )
    output = StrategistOutput(
        personas=[persona],
        core_value_props=[
            "Medical-grade optical heart rate tracking at student pricing",
            "7-day battery life with zero subscription paywalls",
        ],
        positioning_statement="The precision recovery watch built for dedicated collegiate athletes.",
    )
    assert len(output.personas) == 1
    assert len(output.core_value_props) == 2


def test_strategist_output_empty_props():
    persona = AudiencePersona(
        persona_name="Collegiate Runner",
        demographic_range="18-24",
        primary_anxiety="Inaccurate recovery metrics",
        buying_trigger="Affordable split tracking",
        skepticism_barrier="Belief that cheap watches fail",
    )
    with pytest.raises(ValidationError):
        StrategistOutput(
            personas=[persona],
            core_value_props=["Only one prop"],  # Needs at least 2
            positioning_statement="Positioning statement...",
        )


def test_evaluation_vector_bounds():
    # Valid bounds
    eval_vec = EvaluationVector(
        novelty_score=88.5,
        clarity_score=92.0,
        hook_velocity_score=94.0,
        brand_alignment_score=90.0,
        composite_index=91.4,
        pass_audit=True,
        critique_notes="Strong tension established in first 0.8 seconds.",
    )
    assert eval_vec.pass_audit is True

    # Invalid score > 100
    with pytest.raises(ValidationError):
        EvaluationVector(
            novelty_score=105.0,  # Invalid
            clarity_score=90.0,
            hook_velocity_score=90.0,
            brand_alignment_score=90.0,
            composite_index=90.0,
            pass_audit=True,
            critique_notes="Invalid",
        )


def test_creative_angle_variant_valid():
    beat = SceneStoryboardBeat(
        beat_number=1,
        duration_seconds=3.2,
        visual_description="Macro handheld shot of runner tying shoes at dawn.",
        audio_voiceover="Stop spending four hundred dollars just to track your splits.",
        on_screen_text="Stop Overpaying For Recovery Data",
    )
    eval_vec = EvaluationVector(
        novelty_score=88.0,
        clarity_score=90.0,
        hook_velocity_score=95.0,
        brand_alignment_score=92.0,
        composite_index=91.2,
        pass_audit=True,
        critique_notes="Passed audit seamlessly.",
    )
    variant = CreativeAngleVariant(
        variant_id="VAR-B-VALUE-INVERT-001",
        angle_archetype="value_inversion",
        headline_hook="You don't need a $400 watch to run a sub-20 minute 5K.",
        narrative_thesis="Subvert premium fitness watch status symbols.",
        storyboard=[beat],
        evaluation=eval_vec,
        execution_latency_ms=1420,
        token_cost_usd=0.0012,
    )
    assert variant.variant_id == "VAR-B-VALUE-INVERT-001"
    assert variant.angle_archetype == "value_inversion"
    assert len(variant.storyboard) == 1
