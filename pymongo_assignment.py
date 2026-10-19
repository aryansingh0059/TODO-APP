"""
=====================================================================
 TODO-APP  ──  MongoDB / PyMongo Assignment Script
 Course   : NoSQL Databases
 Database : MongoDB Atlas  (todo-app)
 Author   : Aryan Singh
=====================================================================

This script demonstrates all 8 required assignment criteria:
  1. MongoDB connection via PyMongo
  2. Document structure (schema design)
  3. Validation rules
  4. CRUD operations
  5. Aggregation pipeline
  6. PyMongo implementation
  7. Query outputs
  8. Real-world project (Todo management app)
"""

import os
import re
import sys

# Fix Windows terminal encoding (must be first, before any print)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from datetime import datetime, timedelta, timezone

import pymongo
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, WriteError

# ─── ANSI colour helpers ──────────────────────────────────────────────────────
GREEN  = "\033[92m"
CYAN   = "\033[96m"
YELLOW = "\033[93m"
RED    = "\033[91m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

def section(title: str):
    bar = "=" * 60
    print(f"\n{BOLD}{CYAN}{bar}{RESET}")
    print(f"{BOLD}{CYAN}  {title}{RESET}")
    print(f"{BOLD}{CYAN}{bar}{RESET}")

def ok(msg: str):   print(f"{GREEN}  [OK]  {msg}{RESET}", flush=True)
def info(msg: str): print(f"{YELLOW}  -->  {msg}{RESET}", flush=True)
def err(msg: str):  print(f"{RED}  [ERR]  {msg}{RESET}", flush=True)


# =============================================================================
# 1. MONGODB DATABASE CONNECTION
# =============================================================================
section("1. MongoDB Database Connection")

MONGO_URI = os.environ.get("MONGO_URI", "YOUR_MONGODB_ATLAS_URI_HERE")

if MONGO_URI == "YOUR_MONGODB_ATLAS_URI_HERE":
    err("MONGO_URI is not set!")
    print(
        "\n  Set the environment variable before running:\n"
        "  Windows PowerShell:  $env:MONGO_URI = 'mongodb+srv://...'\n"
        "  Linux / macOS:       export MONGO_URI='mongodb+srv://...'\n"
    )
    sys.exit(1)

client = MongoClient(MONGO_URI)
db     = client["todo-app"]
users  = db["users"]
todos  = db["todos"]

client.admin.command("ping")
ok(f"Connected to MongoDB Atlas — database: '{db.name}'")
ok(f"Collections available: {db.list_collection_names()}")


# =============================================================================
# 2. DOCUMENT STRUCTURE
# =============================================================================
section("2. Document Structure")

print("""
  USERS collection — each document:
  {
    _id         : ObjectId (auto),
    name        : String  — display name,
    email       : String  — unique, lowercase,
    passwordHash: String  — bcrypt hash (never plain-text),
    createdAt   : Date,
    updatedAt   : Date
  }

  TODOS collection — each document:
  {
    _id        : ObjectId (auto),
    userId     : ObjectId — ref to users._id (creator),
    assignedTo : ObjectId — ref to users._id (assignee),
    title      : String   — required, max 200 chars,
    description: String   — optional, max 1000 chars,
    completed  : Boolean  — default false,
    priority   : String   — enum ["low", "medium", "high"],
    dueDate    : Date | null,
    createdAt  : Date,
    updatedAt  : Date
  }
""", flush=True)
ok("Document structures described above.")


# =============================================================================
# 3. VALIDATION RULES  (enforced in Python application layer)
# =============================================================================
section("3. Validation Rules")

VALID_PRIORITIES = ["low", "medium", "high"]

USER_SCHEMA = {
    "required": ["name", "email", "passwordHash"],
    "rules": {
        "name":         {"type": str,  "minLength": 2, "maxLength": 100},
        "email":        {"type": str,  "pattern": r"^\S+@\S+\.\S+$"},
        "passwordHash": {"type": str},
    },
}

TODO_SCHEMA = {
    "required": ["userId", "title", "completed", "priority"],
    "rules": {
        "userId":      {"type": ObjectId},
        "title":       {"type": str,  "minLength": 1, "maxLength": 200},
        "description": {"type": str,  "maxLength": 1000, "optional": True},
        "completed":   {"type": bool},
        "priority":    {"type": str,  "enum": VALID_PRIORITIES},
        "dueDate":     {"type": (datetime, type(None)), "optional": True},
    },
}

def validate_document(doc: dict, schema: dict) -> list:
    """Validate a document against a schema. Returns list of error strings."""
    errors = []

    for field in schema["required"]:
        if field not in doc or doc[field] is None:
            errors.append(f"'{field}' is required")

    for field, constraints in schema["rules"].items():
        if field not in doc:
            if not constraints.get("optional"):
                errors.append(f"'{field}' is missing")
            continue

        value = doc[field]
        expected_type = constraints["type"]

        if not isinstance(value, expected_type):
            type_name = (
                expected_type.__name__
                if not isinstance(expected_type, tuple)
                else " or ".join(t.__name__ for t in expected_type)
            )
            errors.append(f"'{field}' must be {type_name}, got {type(value).__name__}")
            continue

        if isinstance(value, str):
            if "minLength" in constraints and len(value) < constraints["minLength"]:
                errors.append(f"'{field}' must be at least {constraints['minLength']} characters")
            if "maxLength" in constraints and len(value) > constraints["maxLength"]:
                errors.append(f"'{field}' must be at most {constraints['maxLength']} characters")
            if "pattern" in constraints and not re.match(constraints["pattern"], value):
                errors.append(f"'{field}' has an invalid format (email pattern mismatch)")
            if "enum" in constraints and value not in constraints["enum"]:
                errors.append(f"'{field}' must be one of {constraints['enum']}, got '{value}'")

    return errors


ok("Validation schemas defined for 'users' and 'todos' collections.")
ok("Rules enforced: required fields, data types, string lengths, regex pattern, enum values.")

print("""
  USER validation rules:
    name         --> required | string | 2-100 chars
    email        --> required | string | valid email regex pattern
    passwordHash --> required | string

  TODO validation rules:
    userId      --> required | ObjectId
    title       --> required | string  | 1-200 chars
    description --> optional | string  | max 1000 chars
    completed   --> required | boolean
    priority    --> required | string  | enum [low, medium, high]
    dueDate     --> optional | datetime or null
""", flush=True)

info("Test 1 — Valid user document (should PASS):")
errs = validate_document(
    {"name": "Test User", "email": "test@example.com", "passwordHash": "$2a$10$hash"},
    USER_SCHEMA,
)
ok("Valid user passed all rules.") if not errs else err(f"Unexpected: {errs}")

info("Test 2 — Todo with invalid priority 'urgent' (should FAIL):")
errs = validate_document(
    {"userId": ObjectId(), "title": "Bad", "completed": False, "priority": "urgent"},
    TODO_SCHEMA,
)
ok(f"Correctly rejected --> {errs[0]}") if errs else err("Validation did NOT catch bad priority.")

info("Test 3 — User missing 'email' field (should FAIL):")
errs = validate_document({"name": "No Email", "passwordHash": "$2a$10$hash"}, USER_SCHEMA)
ok(f"Correctly rejected --> {errs[0]}") if errs else err("Validation did NOT catch missing email.")

info("Test 4 — User name 'A' (too short, min 2 chars) (should FAIL):")
errs = validate_document({"name": "A", "email": "a@b.com", "passwordHash": "$2a$10$hash"}, USER_SCHEMA)
ok(f"Correctly rejected --> {errs[0]}") if errs else err("Validation did NOT catch short name.")


# =============================================================================
# 4. CRUD OPERATIONS
# =============================================================================
section("4. CRUD Operations")

now      = datetime.now(timezone.utc)
tomorrow = now + timedelta(days=1)
next_wk  = now + timedelta(days=7)

# Ensure unique index on email
users.create_index("email", unique=True)
todos.create_index([("userId", pymongo.ASCENDING), ("createdAt", pymongo.DESCENDING)])

# ── CREATE ────────────────────────────────────────────────────────────────────
info("CREATE — Upserting sample users (Alice & Bob)...")

alice_result = users.find_one_and_update(
    {"email": "alice@example.com"},
    {"$setOnInsert": {
        "name": "Alice Johnson", "email": "alice@example.com",
        "passwordHash": "$2a$10$examplehashalice",
        "createdAt": now, "updatedAt": now,
    }},
    upsert=True,
    return_document=pymongo.ReturnDocument.AFTER,
)
bob_result = users.find_one_and_update(
    {"email": "bob@example.com"},
    {"$setOnInsert": {
        "name": "Bob Smith", "email": "bob@example.com",
        "passwordHash": "$2a$10$examplehashbob",
        "createdAt": now, "updatedAt": now,
    }},
    upsert=True,
    return_document=pymongo.ReturnDocument.AFTER,
)
alice_id = alice_result["_id"]
bob_id   = bob_result["_id"]
ok(f"User Alice  _id = {alice_id}")
ok(f"User Bob    _id = {bob_id}")

# Clean up any previous script-created todos so re-runs are idempotent
todos.delete_many({"userId": {"$in": [alice_id, bob_id]}, "_script": True})

info("CREATE — Inserting 5 fresh sample todos...")
sample_todos = [
    {
        "userId": alice_id, "assignedTo": alice_id, "_script": True,
        "title": "Prepare project report",
        "description": "Write the final report for the NoSQL assignment",
        "completed": False, "priority": "high",
        "dueDate": tomorrow, "createdAt": now, "updatedAt": now,
    },
    {
        "userId": alice_id, "assignedTo": bob_id, "_script": True,
        "title": "Review pull requests",
        "description": "Go through all open PRs on GitHub",
        "completed": False, "priority": "medium",
        "dueDate": next_wk, "createdAt": now, "updatedAt": now,
    },
    {
        "userId": alice_id, "assignedTo": alice_id, "_script": True,
        "title": "Write unit tests",
        "description": "Cover authentication and todo CRUD routes",
        "completed": False, "priority": "high",
        "dueDate": tomorrow, "createdAt": now, "updatedAt": now,
    },
    {
        "userId": bob_id, "assignedTo": bob_id, "_script": True,
        "title": "Update README documentation",
        "description": "Add MongoDB setup instructions",
        "completed": False, "priority": "low",
        "dueDate": None, "createdAt": now, "updatedAt": now,
    },
    {
        "userId": bob_id, "assignedTo": alice_id, "_script": True,
        "title": "Fix login bug",
        "description": "Token expiry not handled properly on the client",
        "completed": False, "priority": "high",
        "dueDate": tomorrow, "createdAt": now, "updatedAt": now,
    },
]
result = todos.insert_many(sample_todos)
inserted_todo_id = result.inserted_ids[0]   # "Prepare project report"
ok(f"Inserted {len(result.inserted_ids)} todos.")

# ── READ ──────────────────────────────────────────────────────────────────────
print()
info("READ — Fetch all todos assigned to Alice:")
alice_todos = list(todos.find({"assignedTo": alice_id, "_script": True}))
for t in alice_todos:
    status = "Done" if t["completed"] else "Pending"
    print(f"    [{t['priority'].upper()}] {t['title']}  ({status})", flush=True)
ok(f"Total todos assigned to Alice: {len(alice_todos)}")

info("READ — Fetch one todo by _id:")
single = todos.find_one({"_id": inserted_todo_id})
print(f"    Title : {single['title']}")
print(f"    Due   : {single.get('dueDate')}")
print(f"    Status: {'Done' if single['completed'] else 'Pending'}", flush=True)

info("READ — Fetch all HIGH-priority, incomplete todos:")
urgent = list(todos.find({"priority": "high", "completed": False, "_script": True}))
for t in urgent:
    print(f"    - {t['title']}", flush=True)
ok(f"Found {len(urgent)} urgent pending todos.")

# ── UPDATE ────────────────────────────────────────────────────────────────────
print()
info("UPDATE — Mark 'Write unit tests' as completed (update_one):")
todos.update_one(
    {"userId": alice_id, "title": "Write unit tests", "_script": True},
    {"$set": {"completed": True, "updatedAt": datetime.now(timezone.utc)}},
)
updated = todos.find_one({"userId": alice_id, "title": "Write unit tests", "_script": True})
ok(f"'Write unit tests' completed = {updated['completed']}")

info("UPDATE — Bump Bob's 'low' priority todos to 'medium' (update_many):")
res = todos.update_many(
    {"userId": bob_id, "priority": "low", "_script": True},
    {"$set": {"priority": "medium", "updatedAt": datetime.now(timezone.utc)}},
)
ok(f"Matched {res.matched_count} doc(s), modified {res.modified_count}.")

# ── DELETE ────────────────────────────────────────────────────────────────────
print()
info("DELETE — Remove all completed todos for Alice (delete_many):")
del_result = todos.delete_many({"userId": alice_id, "completed": True, "_script": True})
ok(f"Deleted {del_result.deleted_count} completed todo(s) for Alice.")


# =============================================================================
# 5. AGGREGATION PIPELINE
# =============================================================================
section("5. Aggregation Pipeline")

# Pipeline A: Todo count grouped by priority
info("Pipeline A — Todo count by priority  ($group + $sort + $project):")
for doc in todos.aggregate([
    {"$match": {"_script": True}},
    {"$group": {"_id": "$priority", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}},
    {"$project": {"priority": "$_id", "count": 1, "_id": 0}},
]):
    print(f"    {doc['priority']:<8} : {doc['count']} todos", flush=True)

# Pipeline B: Completion rate per user
print()
info("Pipeline B — Completion rate per user  ($group + $lookup + $project):")
for doc in todos.aggregate([
    {"$match": {"_script": True}},
    {"$group": {
        "_id": "$userId",
        "total":     {"$sum": 1},
        "completed": {"$sum": {"$cond": ["$completed", 1, 0]}},
    }},
    {"$lookup": {"from": "users", "localField": "_id", "foreignField": "_id", "as": "user"}},
    {"$unwind": "$user"},
    {"$project": {
        "userName":      "$user.name",
        "total":         1,
        "completed":     1,
        "pending":       {"$subtract": ["$total", "$completed"]},
        "completionPct": {"$round": [{"$multiply": [{"$divide": ["$completed", "$total"]}, 100]}, 1]},
    }},
    {"$sort": {"completionPct": -1}},
]):
    print(
        f"    {doc['userName']:<20} | total={doc['total']}  "
        f"done={doc['completed']}  pending={doc['pending']}  "
        f"rate={doc['completionPct']}%", flush=True
    )

# Pipeline C: Upcoming deadlines
print()
info("Pipeline C — Todos due within next 7 days  ($match + $sort + $project):")
upcoming = list(todos.aggregate([
    {"$match": {"_script": True, "dueDate": {"$gte": now, "$lte": next_wk}, "completed": False}},
    {"$sort": {"dueDate": 1}},
    {"$project": {"title": 1, "priority": 1, "dueDate": 1, "_id": 0}},
]))
if upcoming:
    for doc in upcoming:
        print(f"    [{doc['priority'].upper()}] {doc['title']}  — due {doc['dueDate'].strftime('%Y-%m-%d')}", flush=True)
else:
    print("    (No upcoming todos found)", flush=True)

# Pipeline D: Average todos per user
print()
info("Pipeline D — Average todos per user  ($group + $avg + $sum):")
for doc in todos.aggregate([
    {"$match": {"_script": True}},
    {"$group": {"_id": "$userId", "count": {"$sum": 1}}},
    {"$group": {"_id": None, "avgTodosPerUser": {"$avg": "$count"}}},
    {"$project": {"_id": 0, "avgTodosPerUser": {"$round": ["$avgTodosPerUser", 2]}}},
]):
    print(f"    Average todos per user: {doc['avgTodosPerUser']}", flush=True)


# =============================================================================
# 6. PyMongo IMPLEMENTATION SUMMARY
# =============================================================================
section("6. PyMongo Implementation Summary")
print("""
  Library  : pymongo  (pip install "pymongo[srv]")
  Client   : MongoClient(MONGO_URI)
  Database : client["todo-app"]

  Key methods used:
    insert_one / insert_many        <-- Create documents
    find_one / find                 <-- Read / query documents
    find_one_and_update             <-- Upsert (insert or update)
    update_one / update_many        <-- Modify existing documents
    delete_one / delete_many        <-- Remove documents
    aggregate([stages])             <-- Aggregation pipeline
    create_index(...)               <-- Index management
    validate_document(doc, schema)  <-- Application-layer validation
""", flush=True)
ok("All operations performed exclusively via PyMongo.")


# =============================================================================
# 7. QUERY OUTPUT SUMMARY
# =============================================================================
section("7. Query Output Summary")

total_users = users.count_documents({})
total_todos = todos.count_documents({})
done_todos  = todos.count_documents({"completed": True})
pend_todos  = todos.count_documents({"completed": False})
high_todos  = todos.count_documents({"priority": "high"})

print(f"""
  +----------------------------------+
  |  DATABASE SUMMARY                |
  +----------------------------------+
  |  Total users         : {total_users:<5}        |
  |  Total todos         : {total_todos:<5}        |
  |  Completed todos     : {done_todos:<5}        |
  |  Pending todos       : {pend_todos:<5}        |
  |  High-priority todos : {high_todos:<5}        |
  +----------------------------------+
""", flush=True)
ok("All query outputs displayed above.")


# =============================================================================
# 8. INDIVIDUAL, WORKING PROJECT
# =============================================================================
section("8. Individual, Working Project")
print("""
  Project : Full-Stack Todo Management Application
  Stack   : React (Vite) + Node.js (Express) + MongoDB Atlas

  Real-world features:
    - JWT-based authentication (register / login / logout)
    - Per-user todo management with priority levels & due dates
    - Task assignment to other users in the workspace
    - Aggregation insights: completion rates, upcoming deadlines

  This PyMongo script connects to the same MongoDB Atlas cluster
  that powers the live Node.js API server, demonstrating a real,
  running application with actual production data.
""", flush=True)

client.close()
ok("MongoDB connection closed. Script complete!")
