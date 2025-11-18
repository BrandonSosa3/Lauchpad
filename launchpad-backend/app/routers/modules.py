from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.module import Module
from app.models.task import Task
from app.models.user_task_progress import UserTaskProgress
from app.utils.auth import get_current_user

router = APIRouter(prefix="/modules", tags=["Modules"])

@router.get("")
async def get_all_modules(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    modules = db.query(Module).all()
    
    result = []
    for module in modules:
        # Get all tasks for this module
        tasks = db.query(Task).filter(Task.module_id == module.id).all()
        
        # Get completed tasks for this user
        completed_tasks = db.query(UserTaskProgress).filter(
            UserTaskProgress.user_id == current_user.id,
            UserTaskProgress.task_id.in_([t.id for t in tasks]),
            UserTaskProgress.completed == True
        ).count()
        
        total_tasks = len(tasks)
        progress_percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        result.append({
            "id": module.id,
            "name": module.name,
            "slug": module.slug,
            "description": module.description,
            "icon": module.icon,
            "color": module.color,
            "order": module.order_index,  # FIXED: use order_index
            "completed_tasks": completed_tasks,
            "total_tasks": total_tasks,
            "progress_percentage": round(progress_percentage, 1)
        })
    
    return sorted(result, key=lambda x: x["order"])

@router.get("/{slug}")
async def get_module_detail(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get module
    module = db.query(Module).filter(Module.slug == slug).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Get all tasks for this module
    tasks = db.query(Task).filter(Task.module_id == module.id).order_by(Task.order_index).all()  # FIXED: use order_index
    
    # Get user's progress for these tasks
    user_progress = db.query(UserTaskProgress).filter(
        UserTaskProgress.user_id == current_user.id,
        UserTaskProgress.task_id.in_([t.id for t in tasks])
    ).all()
    
    # Create a map of task_id -> progress
    progress_map = {p.task_id: p for p in user_progress}
    
    # Build task list with completion status
    task_list = []
    for task in tasks:
        progress = progress_map.get(task.id)
        task_list.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "order": task.order_index,  # FIXED: use order_index
            "completed": progress.completed if progress else False,
            "completed_at": progress.completed_at.isoformat() if progress and progress.completed_at else None
        })
    
    # Calculate progress
    completed_count = sum(1 for t in task_list if t["completed"])
    total_count = len(task_list)
    progress_percentage = (completed_count / total_count * 100) if total_count > 0 else 0
    
    return {
        "id": module.id,
        "name": module.name,
        "slug": module.slug,
        "description": module.description,
        "icon": module.icon,
        "color": module.color,
        "tasks": task_list,
        "completed_tasks": completed_count,
        "total_tasks": total_count,
        "progress_percentage": round(progress_percentage, 1)
    }
