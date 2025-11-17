from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ModuleBase(BaseModel):
    slug: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    order_index: int


class ModuleCreate(ModuleBase):
    pass


class ModuleResponse(ModuleBase):
    id: int
    created_at: datetime
    total_tasks: Optional[int] = 0
    completed_tasks: Optional[int] = 0
    progress_percentage: Optional[int] = 0

    class Config:
        from_attributes = True


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    estimated_time: Optional[int] = None
    difficulty: Optional[str] = None
    order_index: int
    guide_slug: Optional[str] = None


class TaskCreate(TaskBase):
    module_id: int


class TaskResponse(TaskBase):
    id: int
    module_id: int
    created_at: datetime
    completed: Optional[bool] = False
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ModuleDetailResponse(ModuleResponse):
    tasks: List[TaskResponse] = []

    class Config:
        from_attributes = True
