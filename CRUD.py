import sqlite3

def init():
    conn = sqlite3.connect("priority_todo.db")
    conn.row_factory = sqlite3.Row
    conn.execute("CREATE TABLE IF NOT EXISTS PriorTODO (task TEXT NOT NULL, TODO TEXT NOT NULL, priority INTEGER NOT NULL, date DATETIME)")
    return conn

def add_todo(task, todo, priority):
    conn = init()
    conn.execute("INSERT INTO PriorTODO (task, TODO, priority, date) VALUES (?, ?, ?, datetime('now'))", (task, todo, priority))
    conn.commit()
    conn.close()

def get_todolist():
    conn = init()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM PriorTODO ORDER BY priority DESC")
    todolist = cursor.fetchall()
    conn.close()
    return todolist

def delete_todo(todo):
    conn = init()
    conn.execute("DELETE FROM PriorTODO WHERE TODO = ?", (todo,))
    conn.commit()
    conn.close()