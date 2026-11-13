from flask import Flask, render_template, request
import CRUD

app = Flask(__name__, template_folder = "template", static_folder = "CSS")

database = "task.db"
task_id_list = []

@app.route("/")
def dashboard():
    tasklist = CRUD.get_tasklist(database)
    return render_template("dashboard.html", tasklist = tasklist)

@app.route("/add_tasks", methods=["GET", "POST"])
def add_tasks():
    if request.method == "POST":
        global task_id_list
        task_id = request.form.get("taskID")
        task_id_list.append(task_id)
        task_name = request.form.get("taskName")
        task_priority = request.form.get("priority")
        task_project = request.form.get("project")
        task_assigned_to = request.form.get("employee")
        task_start_date = request.form.get("startDate")
        task_due_date = request.form.get("dueDate")
        task_status = request.form.get("status")

        print("Task Name: ", task_name, "Priority: ", task_priority, "Project: ", task_project, "Assigned To: ", task_assigned_to, "Start Date: ", task_start_date, "Due Date: ", task_due_date, "Status: ", task_status)

        CRUD.insert_task(database, task_id, task_name, task_priority, task_project, task_assigned_to, task_start_date, task_due_date, task_status)

    tasklist = CRUD.get_tasklist(database)
    return render_template("dashboard.html", tasklist = tasklist)

@app.route("/delete_tasks", methods=["POST","GET"])
def delete_tasks():
    global task_id_list
    if request.method == "POST":
        for id in range(len(task_id_list)):
            task_id = request.form.get(task_id_list[id])
            task_id = str(task_id)
            print(task_id)
            if task_id == "DELETE":
                CRUD.delete_task(database,task_id_list[id])
                break
    tasklist = CRUD.get_tasklist(database)
    return render_template("dashboard.html", tasklist = tasklist)
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)