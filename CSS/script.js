let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    input.value = "";
    saveTasks();
    displayTasks();
}

function displayTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "pending")
            return !task.completed;

        if (currentFilter === "completed")
            return task.completed;

        return true;
    });

    if (filteredTasks.length === 0) {
        list.innerHTML = '<p class="empty">No tasks found!</p>';
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "actions";

        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.textContent = task.completed ? "↩" : "✓";
        completeBtn.title = "Complete / Undo";
        completeBtn.onclick = () => toggleTask(task.id);

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "✏️";
        editBtn.title = "Edit";
        editBtn.onclick = () => editTask(task.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑️";
        deleteBtn.title = "Delete";
        deleteBtn.onclick = () => deleteTask(task.id);

        actions.append(completeBtn, editBtn, deleteBtn);
        li.append(span, actions);

        list.appendChild(li);
    });

    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;

    document.getElementById("stats").textContent =
        `Total: ${tasks.length} | Pending: ${pending} | Completed: ${completed}`;
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? {...task, completed: !task.completed}
            : task
    );

    saveTasks();
    displayTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);

    const updatedText = prompt("Edit your task:", task.text);

    if (updatedText !== null && updatedText.trim() !== "") {
        task.text = updatedText.trim();
        saveTasks();
        displayTasks();
    }
}

function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        displayTasks();
    }
}

function filterTasks(filter, button) {
    currentFilter = filter;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");
    displayTasks();
}

document.getElementById("taskInput").addEventListener("keydown", e => {
    if (e.key === "Enter") {
        addTask();
    }
});

displayTasks();