from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.task import Task
from app.models.user_task_progress import UserTaskProgress
from app.utils.auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])

class TaskCompletionRequest(BaseModel):
    completed: bool

@router.patch("/{task_id}/completion")
async def update_task_completion(
    task_id: int,
    request: TaskCompletionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify task exists
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Get or create user progress
    progress = db.query(UserTaskProgress).filter(
        UserTaskProgress.user_id == current_user.id,
        UserTaskProgress.task_id == task_id
    ).first()
    
    if not progress:
        progress = UserTaskProgress(
            user_id=current_user.id,
            task_id=task_id,
            completed=request.completed,
            completed_at=datetime.utcnow() if request.completed else None
        )
        db.add(progress)
    else:
        progress.completed = request.completed
        progress.completed_at = datetime.utcnow() if request.completed else None
    
    db.commit()
    db.refresh(progress)
    
    return {
        "task_id": task_id,
        "completed": progress.completed,
        "completed_at": progress.completed_at.isoformat() if progress.completed_at else None
    }
