from flask import Flask, render_template, request
import CRUD

app = Flask(__name__,template_folder="template",static_folder="CSS")

database = "priority_todo.db"
task = "Banking App"
todolist_values = []
priority_values = []
due_date_values = []
todolist = 0
details = {}
dueDate = 0


@app.route("/", methods=["GET", "POST"])
def home():
    global todolist, task, details, dueDate
    task = request.args.get("task")
    task = str(task)
    details = {
        "assigned": request.args.get("assigned", ""),
        "status": request.args.get("status", ""),
        "priority": request.args.get("priority", ""),
        "due": request.args.get("due", ""),
    }
    todolist = CRUD.get_todolist(database, task)
    return render_template("todo.html", TodoList = todolist, Task = task, details=details)    

@app.route("/add_todo", methods=["POST"])
def add_todo():
    global todolist, task, details, dueDate
    todo = request.form.get("taskinput")
    todolist_values.append(todo)
    priority = request.form.get("priorityinput")
    priority_values.append(priority)
    dueDate = request.form.get("dueDate")
    due_date_values.append(dueDate)

    #if todo and priority:
    CRUD.add_todo(database, task, todo, priority, dueDate)
    todolist = CRUD.get_todolist(database, task)

    return render_template("todo.html", TodoList = todolist, Task = task, details = details)


@app.route("/update_todo", methods=["POST"])
def update_todo():
    global todolist, task, details, dueDate
    for todolist in range(len(todolist_values)):
        prior_todo = request.form.get("Edit")
        old_todo = str(prior_todo.split(" ")[0].strip())
        todo_from_list = str(todolist_values[todolist].strip())
        old_priority = int(prior_todo.split(" ")[1].strip())
        priority_from_list = int(priority_values[todolist].strip())
        old_due_date = str(prior_todo.split(" ")[2].strip())
        due_date_from_list = str(due_date_values[todolist].strip())
        updated_todo = request.form.get(todolist_values[todolist])
        updated_priority = request.form.get(priority_values[todolist])
        updated_due_date = str(request.form.get(due_date_values[todolist]))

        if old_todo == todo_from_list or old_priority == priority_from_list or old_due_date == due_date_from_list:
            print("old_todo is ", old_todo, ", old_priority is ", old_priority, "and old due date is ", old_due_date)
            print("updated_todo is ", updated_todo, ", updated_priority is ", updated_priority, "and updated due date is ", updated_due_date)
            print("task")
            CRUD.update_todo(database, task, old_todo, old_priority, old_due_date, updated_todo, updated_priority, updated_due_date)
            todolist_values[todolist] = updated_todo
            priority_values[todolist] = updated_priority
            break
    todolist = CRUD.get_todolist(database, task)
    return render_template("todo.html", TodoList=todolist, Task=task, details = details)
    

@app.route("/completed_todo", methods=["POST"])
def completed_todo():
    global todolist, task, details, dueDate
    print(task)
    for todolist in range(len(todolist_values)):
        todo_to_delete = request.form.get(todolist_values[todolist])
        todo_to_delete = str(todo_to_delete)
        if todo_to_delete == "Completed":
            CRUD.delete_todo(database, todolist_values[todolist], task)
            print(todolist_values[todolist], " is removed from the list") 
            todolist_values.pop(todolist)
            print("so the current list is ", todolist_values)
            todolist = CRUD.get_todolist(database, task)
            break
    return render_template("todo.html", TodoList = todolist, Task = task,  details = details)
    
if __name__ == "__main__":
    app.run(debug=True, port=5001)