import sqlite3

def init_todo(database, task):
    conn = sqlite3.connect(database)
    conn.row_factory = sqlite3.Row
    conn.execute("CREATE TABLE IF NOT EXISTS PriorTODO (task TEXT NOT NULL, TODO TEXT NOT NULL, priority INTEGER NOT NULL, date DATETIME, due_date DATETIME)")
    return conn

def init_task(database):
    conn = sqlite3.connect(database)
    conn.row_factory = sqlite3.Row
    conn.execute("CREATE TABLE IF NOT EXISTS Tasks (taskID INTEGER UNIQUE, taskName TEXT NOT NULL, priority TEXT NOT NULL, project TEXT NOT NULL, assignedTo TEXT NOT NULL, startDate DATETIME NOT NULL, dueDate DATETIME NOT NULL, status TEXT NOT NULL)")
    return conn

def add_todo(database, task, todo, priority, dueDate):
    conn = init_todo(database, task)
    conn.execute("INSERT INTO PriorTODO (task, TODO, priority, date, due_date) VALUES (?, ?, ?, datetime('now'), ?)", (task, todo, priority, dueDate))
    conn.commit()
    conn.close()

def insert_task(database, task_id, task_name, task_priority, task_project, task_assigned_to, task_start_date, task_due_date, task_status):
    conn = init_task(database)
    conn.execute("INSERT INTO Tasks (taskID, taskName, priority, project, assignedTo, startDate, dueDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (task_id, task_name, task_priority, task_project, task_assigned_to, task_start_date, task_due_date, task_status))
    conn.commit()
    conn.close()

def get_todolist(database, task):
    conn = init_todo(database, task)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM PriorTODO WHERE task = ? ORDER BY priority DESC, due_date ASC", (task,))
    todolist = cursor.fetchall()
    conn.close()
    return todolist

def get_tasklist(database):
    conn = init_task(database)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Tasks")
    tasklist = cursor.fetchall()
    conn.close()
    return tasklist

def update_todo(database, task, old_todo, old_priority, old_due_date, updated_todo, updated_priority, updated_due_date):
    conn = init_todo(database, task)
    conn.execute("UPDATE PriorTODO SET TODO = ?, priority = ?, due_date = ? WHERE TODO = ? AND priority = ? AND due_date = ?", (updated_todo, updated_priority, updated_due_date, old_todo, old_priority, old_due_date))
    conn.commit()
    conn.close()

def delete_todo(database, todo, task):
    conn = init_todo(database, task)
    conn.execute("DELETE FROM PriorTODO WHERE TODO = ?", (todo,))
    conn.commit()
    conn.close()

def delete_task(database,task_id):
    conn = init_task(database)
    conn.execute("DELETE FROM Tasks WHERE taskID = ?", (task_id,))
    conn.commit()
    conn.close()


