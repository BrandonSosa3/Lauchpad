from pydantic import BaseModel
from typing import Optional, List


class TaskToggleRequest(BaseModel):
    notes: Optional[str] = None


class TaskToggleResponse(BaseModel):
    task_id: int
    completed: bool
    completed_at: Optional[str] = None
    notes: Optional[str] = None


class ModuleProgress(BaseModel):
    slug: str
    name: str
    total_tasks: int
    completed_tasks: int
    progress_percentage: int


class RecommendedTask(BaseModel):
    id: int
    title: str
    module: str
    difficulty: Optional[str] = None
    estimated_time: Optional[int] = None


class ProgressOverview(BaseModel):
    total_tasks: int
    completed_tasks: int
    progress_percentage: int
    modules: List[ModuleProgress]
    next_recommended_tasks: List[RecommendedTask]
