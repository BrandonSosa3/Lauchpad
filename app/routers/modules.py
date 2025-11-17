from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.module import Module
from app.models.task import Task
from app.models.user_task_progress import UserTaskProgress
from app.schemas.module import ModuleResponse, ModuleDetailResponse, TaskResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/modules", tags=["Modules"])


@router.get("", response_model=List[ModuleResponse])
def get_all_modules(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all modules with user progress"""
    modules = db.query(Module).order_by(Module.order_index).all()
    
    result = []
    for module in modules:
        # Count total tasks in module
        total_tasks = db.query(Task).filter(Task.module_id == module.id).count()
        
        # Count completed tasks for this user
        completed_tasks = db.query(UserTaskProgress).join(Task).filter(
            Task.module_id == module.id,
            UserTaskProgress.user_id == current_user.id,
            UserTaskProgress.completed == True
        ).count()
        
        # Calculate progress percentage
        progress_percentage = int((completed_tasks / total_tasks * 100)) if total_tasks > 0 else 0
        
        module_dict = {
            "id": module.id,
            "slug": module.slug,
            "name": module.name,
            "description": module.description,
            "icon": module.icon,
            "color": module.color,
            "order_index": module.order_index,
            "created_at": module.created_at,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "progress_percentage": progress_percentage
        }
        result.append(module_dict)
    
    return result


@router.get("/{slug}", response_model=ModuleDetailResponse)
def get_module_by_slug(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get single module with all tasks and user progress"""
    module = db.query(Module).filter(Module.slug == slug).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    
    # Get all tasks for this module
    tasks = db.query(Task).filter(Task.module_id == module.id).order_by(Task.order_index).all()
    
    # Get user's progress for these tasks
    task_ids = [task.id for task in tasks]
    progress_records = db.query(UserTaskProgress).filter(
        UserTaskProgress.user_id == current_user.id,
        UserTaskProgress.task_id.in_(task_ids)
    ).all()
    
    # Create a map of task_id -> progress
    progress_map = {p.task_id: p for p in progress_records}
    
    # Build task responses with completion status
    tasks_response = []
    completed_count = 0
    for task in tasks:
        progress = progress_map.get(task.id)
        task_dict = {
            "id": task.id,
            "module_id": task.module_id,
            "title": task.title,
            "description": task.description,
            "estimated_time": task.estimated_time,
            "difficulty": task.difficulty,
            "order_index": task.order_index,
            "guide_slug": task.guide_slug,
            "created_at": task.created_at,
            "completed": progress.completed if progress else False,
            "completed_at": progress.completed_at if progress else None
        }
        tasks_response.append(task_dict)
        if progress and progress.completed:
            completed_count += 1
    
    # Calculate progress
    total_tasks = len(tasks)
    progress_percentage = int((completed_count / total_tasks * 100)) if total_tasks > 0 else 0
    
    return {
        "id": module.id,
        "slug": module.slug,
        "name": module.name,
        "description": module.description,
        "icon": module.icon,
        "color": module.color,
        "order_index": module.order_index,
        "created_at": module.created_at,
        "total_tasks": total_tasks,
        "completed_tasks": completed_count,
        "progress_percentage": progress_percentage,
        "tasks": tasks_response
    }
