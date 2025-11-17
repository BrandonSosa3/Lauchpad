from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.module import Module
from app.models.task import Task
from app.models.user_task_progress import UserTaskProgress
from app.schemas.progress import ProgressOverview, ModuleProgress, RecommendedTask
from app.utils.auth import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("", response_model=ProgressOverview)
def get_user_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get overall progress and recommendations"""
    
    # Get total tasks across all modules
    total_tasks = db.query(Task).count()
    
    # Get completed tasks for user
    completed_tasks = db.query(UserTaskProgress).filter(
        UserTaskProgress.user_id == current_user.id,
        UserTaskProgress.completed == True
    ).count()
    
    # Calculate overall progress
    overall_progress = int((completed_tasks / total_tasks * 100)) if total_tasks > 0 else 0
    
    # Get progress per module
    modules = db.query(Module).order_by(Module.order_index).all()
    module_progress_list = []
    
    for module in modules:
        module_total = db.query(Task).filter(Task.module_id == module.id).count()
        
        module_completed = db.query(UserTaskProgress).join(Task).filter(
            Task.module_id == module.id,
            UserTaskProgress.user_id == current_user.id,
            UserTaskProgress.completed == True
        ).count()
        
        module_percentage = int((module_completed / module_total * 100)) if module_total > 0 else 0
        
        module_progress_list.append({
            "slug": module.slug,
            "name": module.name,
            "total_tasks": module_total,
            "completed_tasks": module_completed,
            "progress_percentage": module_percentage
        })
    
    # Get recommended next tasks (incomplete tasks, ordered by difficulty and time)
    # Get all incomplete task IDs for this user
    completed_task_ids = db.query(UserTaskProgress.task_id).filter(
        UserTaskProgress.user_id == current_user.id,
        UserTaskProgress.completed == True
    ).all()
    completed_task_ids = [id[0] for id in completed_task_ids]
    
    # Get incomplete tasks
    recommended_tasks_query = db.query(Task, Module.slug).join(Module).filter(
        Task.id.notin_(completed_task_ids) if completed_task_ids else True
    ).order_by(
        Task.difficulty.desc(),  # Easy tasks first (easy > medium > hard alphabetically reversed)
        Task.estimated_time.asc()  # Shorter tasks first
    ).limit(3)
    
    recommended_tasks = []
    for task, module_slug in recommended_tasks_query:
        recommended_tasks.append({
            "id": task.id,
            "title": task.title,
            "module": module_slug,
            "difficulty": task.difficulty,
            "estimated_time": task.estimated_time
        })
    
    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "progress_percentage": overall_progress,
        "modules": module_progress_list,
        "next_recommended_tasks": recommended_tasks
    }
