"""YouTube service for extracting and processing video transcripts."""

import re
from typing import Optional
from urllib.parse import urlparse, parse_qs


class YouTubeService:
    """Service for handling YouTube transcript extraction and processing."""

    @staticmethod
    def extract_video_id(url: str) -> Optional[str]:
        """
        Extract video ID from various YouTube URL formats.

        Args:
            url: YouTube URL in various formats (youtube.com, youtu.be, etc.)

        Returns:
            Video ID or None if invalid URL
        """
        try:
            # Handle youtu.be short links
            if "youtu.be" in url:
                match = re.search(r"youtu\.be/([^?&]+)", url)
                if match:
                    return match.group(1)

            # Handle youtube.com/watch?v= URLs
            if "youtube.com" in url:
                parsed = urlparse(url)
                video_id = parse_qs(parsed.query).get("v", [None])[0]
                if video_id:
                    return video_id

            # Handle youtube.com/embed/ URLs
            match = re.search(r"youtube\.com/embed/([^?&]+)", url)
            if match:
                return match.group(1)

            return None
        except Exception:
            return None

    @staticmethod
    async def get_transcript(video_id: str) -> list[dict]:
        """
        Get YouTube video transcript using youtube-transcript-api.

        Args:
            video_id: YouTube video ID

        Returns:
            List of transcript segments with timing information
            [{"text": "...", "start": 0.0, "duration": 2.5}, ...]
        """
        try:
            from youtube_transcript_api import YouTubeTranscriptApi

            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            return transcript

        except Exception as e:
            raise Exception(f"Failed to get transcript for video {video_id}: {str(e)}")

    @staticmethod
    def chunk_transcript(
        transcript: list[dict],
        max_tokens: int = 8000,
        model: str = "claude-3-sonnet"
    ) -> list[list[dict]]:
        """
        Chunk transcript into segments that fit within LLM token limits.

        Args:
            transcript: List of transcript segments
            max_tokens: Maximum tokens per chunk (defaults to 8000 for Claude Sonnet)
            model: Model name for reference (default "claude-3-sonnet")

        Returns:
            List of transcript chunks
        """
        chunks = []
        current_chunk = []
        current_tokens = 0

        # Rough estimation: 1 token ≈ 4 characters
        tokens_per_char = 0.25

        for segment in transcript:
            text = segment.get("text", "")
            estimated_tokens = int(len(text) * tokens_per_char) + 10  # Add buffer

            # If adding this segment exceeds limit, start new chunk
            if current_tokens + estimated_tokens > max_tokens and current_chunk:
                chunks.append(current_chunk)
                current_chunk = []
                current_tokens = 0

            current_chunk.append(segment)
            current_tokens += estimated_tokens

        # Add final chunk
        if current_chunk:
            chunks.append(current_chunk)

        return chunks

    @staticmethod
    def format_transcript_chunk(chunk: list[dict]) -> str:
        """
        Format transcript chunk for LLM processing.

        Args:
            chunk: List of transcript segments

        Returns:
            Formatted transcript text
        """
        lines = []
        for segment in chunk:
            text = segment.get("text", "").strip()
            if text:
                lines.append(text)
        return " ".join(lines)

    @staticmethod
    def format_transcript_with_timestamps(chunk: list[dict]) -> str:
        """
        Format transcript chunk with timestamps for reference.

        Args:
            chunk: List of transcript segments

        Returns:
            Formatted transcript with timestamps
        """
        lines = []
        for segment in chunk:
            text = segment.get("text", "").strip()
            start = segment.get("start", 0)
            minutes = int(start // 60)
            seconds = int(start % 60)
            timestamp = f"[{minutes:02d}:{seconds:02d}]"

            if text:
                lines.append(f"{timestamp} {text}")

        return "\n".join(lines)

    @staticmethod
    def extract_key_segments(
        transcript: list[dict],
        keywords: Optional[list[str]] = None
    ) -> list[dict]:
        """
        Extract transcript segments containing specific keywords.

        Args:
            transcript: Full transcript
            keywords: List of keywords to search for (case-insensitive)

        Returns:
            List of segments matching keywords
        """
        if not keywords:
            return transcript

        keywords_lower = [kw.lower() for kw in keywords]
        matching = []

        for segment in transcript:
            text = segment.get("text", "").lower()
            if any(kw in text for kw in keywords_lower):
                matching.append(segment)

        return matching

    @staticmethod
    def validate_url(url: str) -> bool:
        """
        Validate if URL is a YouTube URL.

        Args:
            url: URL to validate

        Returns:
            True if valid YouTube URL, False otherwise
        """
        youtube_patterns = [
            r"youtube\.com",
            r"youtu\.be",
            r"youtube-nocookie\.com"
        ]
        return any(re.search(pattern, url, re.IGNORECASE) for pattern in youtube_patterns)
