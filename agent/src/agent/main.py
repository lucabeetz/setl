from pathlib import Path
from typing import Optional
import uuid

from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

from agent.prompts.react_ffmpeg import ffmpeg_agent


app = FastAPI(middleware=[
    Middleware(CORSMiddleware, allow_origins=["*"],
               allow_methods=["DELETE", "GET", "POST", "PUT"],

               allow_headers=["*"]
               )
])


class FfmpegRequest(BaseModel):
    task: str
    file_path: str
    previous: Optional[str] = None
    feedback: Optional[str] = None


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/ffmpeg")
async def run_ffmpeg_command(ffmpeg_request: FfmpegRequest):
    base_path = Path("~/Downloads").expanduser()
    path = str(list(base_path.glob(f"**/{ffmpeg_request.file_path}"))[0])
    print("Path", path)

    output_id = str(uuid.uuid4())
    public_path = Path(__file__).resolve(
    ).parent.parent.parent.parent / "app" / "public"

    output_folder = public_path / "outputs" / output_id
    output_folder.mkdir()

    result = (await ffmpeg_agent(ffmpeg_request.task, path, output_folder,
                                 ffmpeg_request.previous, ffmpeg_request.feedback))[0]
    print("result", result.variables)

    return {
        "output_files": [str(p.relative_to(public_path)) for p in output_folder.iterdir()],
        "final_command": result.variables['ACTION_INPUT'],
    }
