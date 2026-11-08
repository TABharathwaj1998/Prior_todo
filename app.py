from flask import Flask, render_template,request
import sqlite3

app = Flask(__name__,template_folder="template",static_folder="CSS")

task = "Banking App"
todolist_values = []

def init():
    conn = sqlite3.connect("priority_todo.db")
    conn.row_factory = sqlite3.Row
    conn.execute("CREATE TABLE IF NOT EXISTS PriorTODO (task TEXT NOT NULL, TODO TEXT NOT NULL, priority INTEGER NOT NULL, date DATETIME)")
    return conn

@app.route("/", methods=["GET", "POST"])
def home():    
    return render_template("todo.html", Task = task)

@app.route("/add_todo", methods=["POST"])
def add_todo():
    todo = request.form.get("taskinput")
    todolist_values.append(todo)
    priority = request.form.get("priorityinput")

    #if todo and priority:
    conn = init()
    conn.execute("INSERT INTO PriorTODO (task, TODO, priority, date) VALUES (?, ?, ?, datetime('now'))", (task, todo, priority))
    conn.commit()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM PriorTODO")
    todolist = cursor.fetchall()
    conn.close()

    return render_template("todo.html", TodoList = todolist, Task = task)

@app.route("/completed_todo", methods=["POST"])
def completed_todo():
    for todolist in range(len(todolist_values)):
        todo_to_delete = request.form.get(todolist_values[todolist])
        todo_to_delete = str(todo_to_delete)
        if todo_to_delete == "Completed":
            conn = init()
            conn.execute("DELETE FROM PriorTODO WHERE TODO = ?", (todolist_values[todolist],))
            conn.commit()
            print(todolist_values[todolist], " is removed from the list") 
            todolist_values.pop(todolist)
            print("so the current list is ", todolist_values)
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM PriorTODO")
            todolist = cursor.fetchall()
            conn.close()
            return render_template("todo.html", TodoList = todolist, Task = task)
    
if __name__ == "__main__":
    app.run(debug=True)