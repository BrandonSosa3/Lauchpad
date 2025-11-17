from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.task import Task
from app.models.user_task_progress import UserTaskProgress
from app.schemas.progress import TaskToggleRequest, TaskToggleResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/{task_id}/toggle", response_model=TaskToggleResponse)
def toggle_task_completion(
    task_id: int,
    request: TaskToggleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle task completion status"""
    # Verify task exists
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Find or create progress record
    progress = db.query(UserTaskProgress).filter(
        UserTaskProgress.user_id == current_user.id,
        UserTaskProgress.task_id == task_id
    ).first()
    
    if not progress:
        # Create new progress record (mark as completed)
        progress = UserTaskProgress(
            user_id=current_user.id,
            task_id=task_id,
            completed=True,
            completed_at=datetime.utcnow(),
            notes=request.notes
        )
        db.add(progress)
    else:
        # Toggle existing record
        progress.completed = not progress.completed
        progress.completed_at = datetime.utcnow() if progress.completed else None
        if request.notes:
            progress.notes = request.notes
        progress.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(progress)
    
    return {
        "task_id": task_id,
        "completed": progress.completed,
        "completed_at": progress.completed_at.isoformat() if progress.completed_at else None,
        "notes": progress.notes
    }
