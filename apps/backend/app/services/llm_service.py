"""LLM service for transcript summarization and analysis.

NOTE: Paid LLM providers (Anthropic, OpenAI) are commented out.
Use the free Hugging Face Llama 3.1 70B implementation in frontend ai-analysis.ts instead.
"""

# COMMENTED OUT - Using free Hugging Face Llama 3.1 70B instead
# import anthropic
# import openai

# from app.core.config import settings


class LLMService:
    """Service for LLM-based text summarization and analysis.

    DEPRECATED: This service used paid LLM APIs (Anthropic Claude, OpenAI GPT-4).
    All methods now raise NotImplementedError.

    Use the free alternative instead:
    - Frontend: apps/web/src/lib/ai-analysis.ts (Hugging Face Llama 3.1 70B)
    - Free, no API keys required
    - Same functionality for financial news analysis
    """

    def __init__(self, provider: str = "huggingface"):
        """
        Initialize LLM service.

        Args:
            provider: Must be "huggingface" - paid providers are disabled

        Raises:
            ValueError: If trying to use paid providers
        """
        self.provider = provider

        if provider != "huggingface":
            raise ValueError(
                f"Only 'huggingface' provider is currently enabled. "
                f"Paid LLMs (anthropic, openai) are commented out. "
                f"Use frontend ai-analysis.ts instead."
            )

    async def summarize_transcript(
        self,
        text: str,
        format: str = "bullet_points"
    ) -> list[str]:
        """
        DEPRECATED: Use frontend ai-analysis.ts with Hugging Face instead.

        Args:
            text: Transcript text to summarize
            format: "bullet_points" or "paragraphs"

        Raises:
            NotImplementedError: This method is disabled
        """
        raise NotImplementedError(
            "Paid LLM providers are disabled. "
            "Use the free Hugging Face implementation in apps/web/src/lib/ai-analysis.ts instead."
        )

    async def extract_timestamps_and_points(
        self,
        text_with_timestamps: str
    ) -> list[dict]:
        """
        DEPRECATED: Use frontend ai-analysis.ts with Hugging Face instead.

        Args:
            text_with_timestamps: Text formatted as "[HH:MM] content"

        Raises:
            NotImplementedError: This method is disabled
        """
        raise NotImplementedError(
            "Paid LLM providers are disabled. "
            "Use the free Hugging Face implementation in apps/web/src/lib/ai-analysis.ts instead."
        )

    async def generate_newsletter_section(
        self,
        content: str,
        section_type: str = "insights"
    ) -> str:
        """
        DEPRECATED: Use frontend ai-analysis.ts with Hugging Face instead.

        Args:
            content: Raw content to process
            section_type: "insights", "summary", "recommendations"

        Raises:
            NotImplementedError: This method is disabled
        """
        raise NotImplementedError(
            "Paid LLM providers are disabled. "
            "Use the free Hugging Face implementation in apps/web/src/lib/ai-analysis.ts instead."
        )


# ==================== COMMENTED OUT PAID LLM CODE ====================
# All code below is commented out - it used paid APIs (Anthropic Claude, OpenAI GPT-4)
# Use apps/web/src/lib/ai-analysis.ts with free Hugging Face Llama 3.1 70B instead
# =====================================================================

# async def _summarize_anthropic(
#     self,
#     text: str,
#     format: str = "bullet_points"
# ) -> list[str]:
#     """Summarize using Claude API."""
#     if format == "bullet_points":
#         prompt = f"""Extract the key points from this transcript as concise bullet points.
# Focus on actionable insights, important facts, and main arguments.
# Format as a numbered list.
#
# Transcript:
# {text}
#
# Key points:"""
#     else:
#         prompt = f"""Summarize this transcript into 2-3 clear paragraphs.
# Focus on the main themes and important takeaways.
#
# Transcript:
# {text}
#
# Summary:"""
#
#     try:
#         response = self.client.messages.create(
#             model="claude-3-sonnet-20250219",
#             max_tokens=2000,
#             messages=[
#                 {"role": "user", "content": prompt}
#             ]
#         )
#
#         result = response.content[0].text
#
#         if format == "bullet_points":
#             # Parse numbered list into array
#             lines = result.strip().split("\n")
#             points = [
#                 line.strip().lstrip("0123456789.-) ").strip()
#                 for line in lines
#                 if line.strip() and not line.strip().startswith("-")
#             ]
#             return points
#         else:
#             return [result]
#
#     except Exception as e:
#         raise Exception(f"Anthropic API error: {str(e)}")

# async def _summarize_openai(
#     self,
#     text: str,
#     format: str = "bullet_points"
# ) -> list[str]:
#     """Summarize using OpenAI API."""
#     if format == "bullet_points":
#         prompt = f"""Extract the key points from this transcript as concise bullet points.
# Focus on actionable insights, important facts, and main arguments.
# Format as a numbered list.
#
# Transcript:
# {text}
#
# Key points:"""
#     else:
#         prompt = f"""Summarize this transcript into 2-3 clear paragraphs.
# Focus on the main themes and important takeaways.
#
# Transcript:
# {text}
#
# Summary:"""
#
#     try:
#         response = self.client.chat.completions.create(
#             model="gpt-4-turbo",
#             max_tokens=2000,
#             messages=[
#                 {"role": "user", "content": prompt}
#             ]
#         )
#
#         result = response.choices[0].message.content
#
#         if format == "bullet_points":
#             # Parse numbered list into array
#             lines = result.strip().split("\n")
#             points = [
#                 line.strip().lstrip("0123456789.-) ").strip()
#                 for line in lines
#                 if line.strip() and not line.strip().startswith("-")
#             ]
#             return points
#         else:
#             return [result]
#
#     except Exception as e:
#         raise Exception(f"OpenAI API error: {str(e)}")

# async def extract_timestamps_and_points(
#     self,
#     text_with_timestamps: str
# ) -> list[dict]:
#     """
#     Extract key points with their timestamps.
#
#     Args:
#         text_with_timestamps: Text formatted as "[HH:MM] content"
#
#     Returns:
#         List of dicts with {timestamp, point}
#     """
#     prompt = f"""Extract the key points from this timestamped transcript.
# For each key point, preserve the timestamp.
# Return as a structured list.
#
# Transcript:
# {text_with_timestamps}
#
# Key points with timestamps:"""
#
#     try:
#         if self.provider == "anthropic":
#             response = self.client.messages.create(
#                 model="claude-3-sonnet-20250219",
#                 max_tokens=2000,
#                 messages=[
#                     {"role": "user", "content": prompt}
#                 ]
#             )
#         else:
#             response = self.client.chat.completions.create(
#                 model="gpt-4-turbo",
#                 max_tokens=2000,
#                 messages=[
#                     {"role": "user", "content": prompt}
#                 ]
#             )
#
#         result_text = (
#             response.content[0].text
#             if self.provider == "anthropic"
#             else response.choices[0].message.content
#         )
#
#         # Parse results - look for [HH:MM] pattern
#         import re
#         points = []
#         pattern = r"\[(\d{2}:\d{2})\]\s*(.+)"
#
#         for match in re.finditer(pattern, result_text):
#             timestamp = match.group(1)
#             point = match.group(2).strip()
#             points.append({
#                 "timestamp": timestamp,
#                 "point": point
#             })
#
#         return points
#
#     except Exception as e:
#         raise Exception(f"LLM API error: {str(e)}")

# async def generate_newsletter_section(
#     self,
#     content: str,
#     section_type: str = "insights"
# ) -> str:
#     """
#     Generate a newsletter section from content.
#
#     Args:
#         content: Raw content to process
#         section_type: "insights", "summary", "recommendations"
#
#     Returns:
#         Formatted section text
#     """
#     prompts = {
#         "insights": f"""Based on this content, generate an "Insights" section for a newsletter.
# Make it engaging, concise, and highlight the most important takeaways.
#
# Content:
# {content}
#
# Insights section:""",
#         "summary": f"""Create a brief 2-3 paragraph summary suitable for a newsletter.
# Focus on the main points and actionable information.
#
# Content:
# {content}
#
# Summary:""",
#         "recommendations": f"""Generate a "Recommended Actions" section based on this content.
# Provide 3-5 concrete action items.
#
# Content:
# {content}
#
# Recommended Actions:"""
#     }
#
#     prompt = prompts.get(section_type, prompts["summary"])
#
#     try:
#         if self.provider == "anthropic":
#             response = self.client.messages.create(
#                 model="claude-3-sonnet-20250219",
#                 max_tokens=1000,
#                 messages=[
#                     {"role": "user", "content": prompt}
#                 ]
#             )
#             return response.content[0].text
#         else:
#             response = self.client.chat.completions.create(
#                 model="gpt-4-turbo",
#                 max_tokens=1000,
#                 messages=[
#                     {"role": "user", "content": prompt}
#                 ]
#             )
#             return response.choices[0].message.content
#
#     except Exception as e:
#         raise Exception(f"LLM API error: {str(e)}")
