import sys
import os

# Add parent directory to path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.database import SessionLocal, engine
from app.models.module import Module
from app.models.task import Task
from sqlalchemy.orm import Session


def seed_modules(db: Session):
    """Seed the modules table"""
    print("🌱 Seeding modules...")
    
    modules_data = [
        {
            "slug": "money",
            "name": "Money Foundation",
            "description": "Set up your financial life properly",
            "icon": "💰",
            "color": "#10B981",
            "order_index": 1
        },
        {
            "slug": "housing",
            "name": "Housing",
            "description": "Find, apply for, and move into your first place",
            "icon": "🏠",
            "color": "#3B82F6",
            "order_index": 2
        },
        {
            "slug": "taxes",
            "name": "Taxes",
            "description": "File your first tax return without freaking out",
            "icon": "📋",
            "color": "#8B5CF6",
            "order_index": 3
        }
    ]
    
    for module_data in modules_data:
        # Check if module already exists
        existing = db.query(Module).filter(Module.slug == module_data["slug"]).first()
        if not existing:
            module = Module(**module_data)
            db.add(module)
            print(f"  ✅ Added module: {module_data['name']}")
        else:
            print(f"  ⏭️  Module already exists: {module_data['name']}")
    
    db.commit()
    print("✅ Modules seeding complete!\n")


def seed_tasks(db: Session):
    """Seed the tasks table"""
    print("🌱 Seeding tasks...")
    
    # Get module IDs
    money_module = db.query(Module).filter(Module.slug == "money").first()
    housing_module = db.query(Module).filter(Module.slug == "housing").first()
    taxes_module = db.query(Module).filter(Module.slug == "taxes").first()
    
    if not all([money_module, housing_module, taxes_module]):
        print("❌ Error: Modules must be seeded first!")
        return
    
    # Money Foundation Tasks (15)
    money_tasks = [
        {"title": "Open checking account", "description": "Choose and open your first checking account", "estimated_time": 15, "difficulty": "easy", "order_index": 1, "guide_slug": "choosing-first-bank"},
        {"title": "Open high-yield savings account", "description": "Set up savings account with competitive interest rate", "estimated_time": 15, "difficulty": "easy", "order_index": 2, "guide_slug": "choosing-first-bank"},
        {"title": "Set up direct deposit", "description": "Configure automatic paycheck deposits", "estimated_time": 10, "difficulty": "easy", "order_index": 3, "guide_slug": "direct-deposit-setup"},
        {"title": "Build $1,000 emergency fund", "description": "Save your first emergency fund milestone", "estimated_time": None, "difficulty": "medium", "order_index": 4, "guide_slug": "emergency-fund-guide"},
        {"title": "Apply for first credit card", "description": "Get a beginner-friendly credit card to build credit", "estimated_time": 20, "difficulty": "medium", "order_index": 5, "guide_slug": "credit-cards-explained"},
        {"title": "Set up credit card autopay", "description": "Never miss a payment with automatic payments", "estimated_time": 10, "difficulty": "easy", "order_index": 6, "guide_slug": "credit-cards-explained"},
        {"title": "Check credit score", "description": "View your credit score for the first time", "estimated_time": 5, "difficulty": "easy", "order_index": 7, "guide_slug": "credit-score-decoded"},
        {"title": "Sign up for credit monitoring", "description": "Get free alerts for changes to your credit", "estimated_time": 10, "difficulty": "easy", "order_index": 8, "guide_slug": "credit-score-decoded"},
        {"title": "Link bank accounts", "description": "Connect checking and savings for easy transfers", "estimated_time": 5, "difficulty": "easy", "order_index": 9, "guide_slug": None},
        {"title": "Set up savings auto-transfer", "description": "Automate saving money each month", "estimated_time": 10, "difficulty": "easy", "order_index": 10, "guide_slug": "emergency-fund-guide"},
        {"title": "Review account fees", "description": "Make sure you're not paying unnecessary fees", "estimated_time": 15, "difficulty": "easy", "order_index": 11, "guide_slug": "choosing-first-bank"},
        {"title": "Enable fraud alerts", "description": "Get notified of suspicious activity", "estimated_time": 5, "difficulty": "easy", "order_index": 12, "guide_slug": None},
        {"title": "Download banking apps", "description": "Install mobile apps for easy access", "estimated_time": 5, "difficulty": "easy", "order_index": 13, "guide_slug": None},
        {"title": "Set spending budget", "description": "Create your first monthly budget", "estimated_time": 30, "difficulty": "medium", "order_index": 14, "guide_slug": None},
        {"title": "Track spending for 1 month", "description": "Monitor where your money goes", "estimated_time": None, "difficulty": "medium", "order_index": 15, "guide_slug": None},
    ]
    
    # Housing Tasks (18)
    housing_tasks = [
        {"title": "Calculate affordable rent", "description": "Determine how much rent you can afford (30% rule)", "estimated_time": 10, "difficulty": "easy", "order_index": 1, "guide_slug": "affordable-rent-calculator"},
        {"title": "Research neighborhoods", "description": "Find safe, convenient areas within budget", "estimated_time": 60, "difficulty": "medium", "order_index": 2, "guide_slug": None},
        {"title": "Save security deposit", "description": "Save first month + security deposit", "estimated_time": None, "difficulty": "hard", "order_index": 3, "guide_slug": None},
        {"title": "Check credit score", "description": "Verify your credit before applying", "estimated_time": 5, "difficulty": "easy", "order_index": 4, "guide_slug": None},
        {"title": "Gather rental documents", "description": "Collect pay stubs, references, ID", "estimated_time": 30, "difficulty": "medium", "order_index": 5, "guide_slug": None},
        {"title": "Tour apartments", "description": "Visit properties and evaluate them", "estimated_time": None, "difficulty": "medium", "order_index": 6, "guide_slug": "apartment-tour-red-flags"},
        {"title": "Read lease carefully", "description": "Understand all terms before signing", "estimated_time": 45, "difficulty": "hard", "order_index": 7, "guide_slug": "understanding-your-lease"},
        {"title": "Negotiate rent", "description": "Ask for lower rent or concessions", "estimated_time": 20, "difficulty": "medium", "order_index": 8, "guide_slug": "affordable-rent-calculator"},
        {"title": "Document move-in condition", "description": "Take photos/videos of apartment condition", "estimated_time": 30, "difficulty": "easy", "order_index": 9, "guide_slug": "security-deposit-guide"},
        {"title": "Sign lease", "description": "Review and sign rental agreement", "estimated_time": 30, "difficulty": "hard", "order_index": 10, "guide_slug": "understanding-your-lease"},
        {"title": "Pay first month + deposit", "description": "Submit required payments", "estimated_time": 15, "difficulty": "easy", "order_index": 11, "guide_slug": None},
        {"title": "Get renters insurance", "description": "Protect your belongings ($10-20/month)", "estimated_time": 20, "difficulty": "easy", "order_index": 12, "guide_slug": "renters-insurance-guide"},
        {"title": "Set up electricity", "description": "Transfer or start electric service", "estimated_time": 15, "difficulty": "easy", "order_index": 13, "guide_slug": None},
        {"title": "Set up internet", "description": "Choose and install internet service", "estimated_time": 30, "difficulty": "medium", "order_index": 14, "guide_slug": None},
        {"title": "Set up gas (if applicable)", "description": "Start gas service if needed", "estimated_time": 15, "difficulty": "easy", "order_index": 15, "guide_slug": None},
        {"title": "Forward mail", "description": "Update address with USPS", "estimated_time": 10, "difficulty": "easy", "order_index": 16, "guide_slug": None},
        {"title": "Update address everywhere", "description": "Bank, employer, DMV, voter registration", "estimated_time": 45, "difficulty": "medium", "order_index": 17, "guide_slug": None},
        {"title": "Meet neighbors", "description": "Introduce yourself to neighbors", "estimated_time": None, "difficulty": "easy", "order_index": 18, "guide_slug": None},
    ]
    
    # Taxes Tasks (12)
    taxes_tasks = [
        {"title": "Determine if you need to file", "description": "Check income thresholds for filing requirement", "estimated_time": 10, "difficulty": "easy", "order_index": 1, "guide_slug": "do-i-need-to-file"},
        {"title": "Gather W-2 forms", "description": "Collect W-2 from employer (arrives by Jan 31)", "estimated_time": 5, "difficulty": "easy", "order_index": 2, "guide_slug": "w2-vs-1099"},
        {"title": "Gather 1099 forms (if applicable)", "description": "Collect 1099s if you freelanced/contracted", "estimated_time": 10, "difficulty": "easy", "order_index": 3, "guide_slug": "w2-vs-1099"},
        {"title": "Choose tax software", "description": "Pick between TurboTax, FreeTaxUSA, H&R Block", "estimated_time": 20, "difficulty": "medium", "order_index": 4, "guide_slug": "tax-software-comparison"},
        {"title": "Create tax software account", "description": "Sign up for chosen tax platform", "estimated_time": 10, "difficulty": "easy", "order_index": 5, "guide_slug": None},
        {"title": "Enter income information", "description": "Input W-2/1099 data into software", "estimated_time": 30, "difficulty": "medium", "order_index": 6, "guide_slug": None},
        {"title": "Claim deductions", "description": "Add student loan interest, standard deduction", "estimated_time": 20, "difficulty": "medium", "order_index": 7, "guide_slug": "deductions-young-adults"},
        {"title": "Review tax summary", "description": "Check calculations and refund/owed amount", "estimated_time": 15, "difficulty": "medium", "order_index": 8, "guide_slug": None},
        {"title": "File federal taxes", "description": "Submit federal tax return (deadline: April 15)", "estimated_time": 20, "difficulty": "hard", "order_index": 9, "guide_slug": None},
        {"title": "File state taxes (if required)", "description": "Submit state return if applicable", "estimated_time": 20, "difficulty": "medium", "order_index": 10, "guide_slug": None},
        {"title": "Set up payment plan (if owed)", "description": "Arrange to pay taxes if you owe", "estimated_time": 30, "difficulty": "hard", "order_index": 11, "guide_slug": "cant-pay-taxes"},
        {"title": "Track refund status", "description": "Monitor IRS refund processing", "estimated_time": 5, "difficulty": "easy", "order_index": 12, "guide_slug": None},
    ]
    
    # Add all tasks
    task_count = 0
    
    for task_data in money_tasks:
        existing = db.query(Task).filter(
            Task.module_id == money_module.id,
            Task.title == task_data["title"]
        ).first()
        if not existing:
            task = Task(module_id=money_module.id, **task_data)
            db.add(task)
            task_count += 1
    
    for task_data in housing_tasks:
        existing = db.query(Task).filter(
            Task.module_id == housing_module.id,
            Task.title == task_data["title"]
        ).first()
        if not existing:
            task = Task(module_id=housing_module.id, **task_data)
            db.add(task)
            task_count += 1
    
    for task_data in taxes_tasks:
        existing = db.query(Task).filter(
            Task.module_id == taxes_module.id,
            Task.title == task_data["title"]
        ).first()
        if not existing:
            task = Task(module_id=taxes_module.id, **task_data)
            db.add(task)
            task_count += 1
    
    db.commit()
    print(f"  ✅ Added {task_count} tasks")
    print("✅ Tasks seeding complete!\n")


def main():
    print("\n" + "="*50)
    print("🚀 LAUNCHPAD DATABASE SEEDING")
    print("="*50 + "\n")
    
    db = SessionLocal()
    
    try:
        seed_modules(db)
        seed_tasks(db)
        
        print("="*50)
        print("✅ ALL SEEDING COMPLETE!")
        print("="*50 + "\n")
        
        # Print summary
        module_count = db.query(Module).count()
        task_count = db.query(Task).count()
        
        print(f"📊 Database Summary:")
        print(f"   Modules: {module_count}")
        print(f"   Tasks: {task_count}")
        print()
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
