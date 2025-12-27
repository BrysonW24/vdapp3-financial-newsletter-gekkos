"""Router for YouTube transcript processing and summarization."""

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel

from app.services.youtube_service import YouTubeService
from app.services.llm_service import LLMService


router = APIRouter(prefix="/youtube", tags=["youtube"])


# Pydantic schemas
class YouTubeSummarizeRequest(BaseModel):
    url: str
    llm_provider: str = "anthropic"  # or "openai"
    format: str = "bullet_points"  # or "paragraphs"


class YouTubeSummarizeResponse(BaseModel):
    status: str
    video_id: str
    message: str


# Store for tracking jobs (in production, use a database or task queue)
processing_jobs = {}


async def process_youtube_transcript(
    video_id: str,
    llm_provider: str = "anthropic",
    format: str = "bullet_points"
):
    """
    Background task: Process YouTube transcript end-to-end.

    Args:
        video_id: YouTube video ID
        llm_provider: LLM provider to use
        format: Output format for summary
    """
    try:
        # Get transcript
        youtube_service = YouTubeService()
        transcript = await youtube_service.get_transcript(video_id)

        if not transcript:
            processing_jobs[video_id] = {
                "status": "error",
                "message": "No transcript found"
            }
            return

        # Chunk transcript
        chunks = youtube_service.chunk_transcript(transcript)

        # Initialize LLM service
        llm_service = LLMService(provider=llm_provider)

        # Summarize each chunk
        all_summaries = []
        for chunk in chunks:
            text = youtube_service.format_transcript_chunk(chunk)
            summary = await llm_service.summarize_transcript(text, format=format)
            all_summaries.extend(summary)

        # Store results
        processing_jobs[video_id] = {
            "status": "completed",
            "summary_count": len(all_summaries),
            "summaries": all_summaries
        }

    except Exception as e:
        processing_jobs[video_id] = {
            "status": "error",
            "message": str(e)
        }


@router.post("/summarize", response_model=YouTubeSummarizeResponse)
async def summarize_youtube(
    request: YouTubeSummarizeRequest,
    background_tasks: BackgroundTasks
):
    """
    Submit a YouTube video for transcript extraction and summarization.

    Args:
        request: YouTubeSummarizeRequest with video URL
        background_tasks: FastAPI background tasks

    Returns:
        Status response with video_id for tracking
    """
    # Validate URL
    youtube_service = YouTubeService()

    if not youtube_service.validate_url(request.url):
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    # Extract video ID
    video_id = youtube_service.extract_video_id(request.url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Could not extract video ID from URL")

    # Add background task
    background_tasks.add_task(
        process_youtube_transcript,
        video_id=video_id,
        llm_provider=request.llm_provider,
        format=request.format
    )

    # Mark as processing
    processing_jobs[video_id] = {"status": "processing"}

    return YouTubeSummarizeResponse(
        status="processing",
        video_id=video_id,
        message="Transcript is being processed. Check back soon."
    )


@router.get("/status/{video_id}")
async def get_processing_status(video_id: str):
    """
    Get the status of a YouTube processing job.

    Args:
        video_id: YouTube video ID

    Returns:
        Current processing status and results if complete
    """
    if video_id not in processing_jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = processing_jobs[video_id]

    return {
        "video_id": video_id,
        "status": job.get("status"),
        "message": job.get("message"),
        "summary_count": job.get("summary_count"),
        "summaries": job.get("summaries", [])
    }


@router.get("/results/{video_id}")
async def get_youtube_results(video_id: str):
    """
    Get summarization results for a completed job.

    Args:
        video_id: YouTube video ID

    Returns:
        Summary results if job is complete
    """
    if video_id not in processing_jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = processing_jobs[video_id]

    if job.get("status") != "completed":
        raise HTTPException(
            status_code=202,
            detail=f"Job status: {job.get('status')}"
        )

    return {
        "video_id": video_id,
        "status": "completed",
        "summary_count": job.get("summary_count"),
        "summaries": job.get("summaries", [])
    }


@router.post("/extract-timestamps")
async def extract_timestamps(
    request: YouTubeSummarizeRequest,
    background_tasks: BackgroundTasks
):
    """
    Extract key points with timestamps from a YouTube video.

    Args:
        request: YouTubeSummarizeRequest with video URL

    Returns:
        Video ID for tracking the job
    """
    # Validate URL
    youtube_service = YouTubeService()

    if not youtube_service.validate_url(request.url):
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    # Extract video ID
    video_id = youtube_service.extract_video_id(request.url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Could not extract video ID from URL")

    async def process_with_timestamps():
        try:
            transcript = await youtube_service.get_transcript(video_id)

            if not transcript:
                processing_jobs[video_id] = {
                    "status": "error",
                    "message": "No transcript found"
                }
                return

            # Format with timestamps
            text_with_ts = youtube_service.format_transcript_with_timestamps(transcript)

            # Initialize LLM service
            llm_service = LLMService(provider=request.llm_provider)

            # Extract timestamps and points
            points = await llm_service.extract_timestamps_and_points(text_with_ts)

            processing_jobs[video_id] = {
                "status": "completed",
                "points_count": len(points),
                "points": points
            }

        except Exception as e:
            processing_jobs[video_id] = {
                "status": "error",
                "message": str(e)
            }

    # Add background task
    background_tasks.add_task(process_with_timestamps)
    processing_jobs[video_id] = {"status": "processing"}

    return {
        "status": "processing",
        "video_id": video_id,
        "message": "Extracting timestamps. Check back soon."
    }
