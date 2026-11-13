// TASK DATA
// Load tasks saved in this browser. If there are none, use example tasks.
let tasks = JSON.parse(localStorage.getItem("repliconTasks"));

if (tasks === null) {
    tasks = [
        {
            id: 1,
            name: "Complete Website Design",
            project: "Website Development",
            employee: "John",
            startDate: "2026-11-11",
            dueDate: "2026-11-15",
            priority: "High",
            status: "In Progress",
            seconds: 0,
            timerStarted: null
        },
        {
            id: 2,
            name: "Prepare Project Report",
            project: "Management",
            employee: "Alex",
            startDate: "2026-11-11",
            dueDate: "2026-11-18",
            priority: "Medium",
            status: "Pending",
            seconds: 0,
            timerStarted: null
        },
        {
            id: 3,
            name: "Test Website Features",
            project: "Website Development",
            employee: "David",
            startDate: "2026-11-11",
            dueDate: "2026-11-20",
            priority: "Low",
            status: "Completed",
            seconds: 0,
            timerStarted: null
        }
    ];

    // Save the example tasks so they remain after refreshing the page.
    localStorage.setItem("repliconTasks", JSON.stringify(tasks));
}

// This variable remembers which task is being edited. Null means a new task.
let editTaskId = null;


// Save the complete task array in the browser's local storage.
function saveTasks() {
    // Keep a local copy in the browser.
    localStorage.setItem("repliconTasks", JSON.stringify(tasks));


}


// Open the task form. If an ID is provided, fill it with that task's details.
function openModal(id = null) {
    editTaskId = id;
    document.getElementById("taskModal").style.display = "flex";
    document.getElementById("taskModal").setAttribute("aria-hidden", "false");

    
    if (editTaskId !== null) {
        // Find the selected task in the array.
        let task = tasks.find(function(item) {
            return item.id === id;
        });

        // Put the selected task's current values into the form.
        document.getElementById("modalTitle").innerText = "Edit Task";
        document.getElementById("taskName").value = task.name;
        document.getElementById("project").value = task.project;
        document.getElementById("employee").value = task.employee;
        document.getElementById("startDate").value = task.startDate;
        document.getElementById("dueDate").value = task.dueDate;
        document.getElementById("priority").value = task.priority;
        document.getElementById("status").value = task.status;
    } else {
        // Clear the form when the user is creating a new task.
        document.getElementById("modalTitle").innerText = "Create New Task";

        document.querySelectorAll(".modal-content input").forEach(function(input) {
            input.value = "";
        });

        document.getElementById("priority").value = "Medium";
        document.getElementById("status").value = "Pending";
    }

}


// Hide the task form without changing the task list.
function closeModal() {
    document.getElementById("taskModal").style.display = "none";
    document.getElementById("taskModal").setAttribute("aria-hidden", "true");
}


// Read the form and either add a new task or update the task being edited.
function saveTask() {
    let name = document.getElementById("taskName").value.trim();
    let project = document.getElementById("project").value.trim();
    let employee = document.getElementById("employee").value.trim();
    let startDate = document.getElementById("startDate").value;
    let dueDate = document.getElementById("dueDate").value;
    let priority = document.getElementById("priority").value;
    let status = document.getElementById("status").value;

    // Check that the required fields have been completed.
    if (name === "" || project === "" || employee === "" ||
        startDate === "" || dueDate === "") {
        alert("Please fill in all required fields.");
        return;
    }

    // Do not allow a due date that comes before the start date.
    if (dueDate < startDate) {
        alert("Due date cannot be before the start date.");
        return;
    }

    // Collect the form values in one task object.
    let taskDetails = {
        name: name,
        project: project,
        employee: employee,
        startDate: startDate,
        dueDate: dueDate,
        priority: priority,
        status: status
    };

    if (editTaskId !== null) {
        // Update the existing task while keeping its time-tracking information.
        let task = tasks.find(function(item) {
            return item.id === editTaskId;
        });

        Object.assign(task, taskDetails);
    } else {
        // Give a new task a unique ID and initialise its timer.
        taskDetails.id = Date.now();
        taskDetails.seconds = 0;
        taskDetails.timerStarted = null;
        tasks.push(taskDetails);
    }

    // Save changes, close the form, and redraw the task table.
    saveTasks();
    closeModal();
    showTasks();
}


// Remove a task after the user confirms the action.
function deleteTask(id) {
    let answer = confirm("Are you sure you want to delete this task?");

    if (answer) {
        tasks = tasks.filter(function(item) {
            return item.id !== id;
        });

        saveTasks();
        showTasks();
    }
}


// Calculate the total number of seconds tracked for a task.
function getTaskTime(task) {
    let seconds = task.seconds || 0;

    // Add the time since the timer was started, if it is still running.
    if (task.timerStarted) {
        seconds += Math.floor((Date.now() - task.timerStarted) / 1000);
    }

    return seconds;
}


// Display seconds as hours and minutes.
function showTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);

    return hours + "h " + minutes + "m";
}


// Start or stop the timer for one task.
function toggleTimer(id) {
    let task = tasks.find(function(item) {
        return item.id === id;
    });

    if (task.timerStarted) {
        // Store the elapsed time and clear the running start time.
        task.seconds = getTaskTime(task);
        task.timerStarted = null;
    } else {
        // Record the time when the timer starts.
        task.timerStarted = Date.now();
    }

    saveTasks();
    showTasks();
}


// Build the task table using the current search text and filter selections.

function showTasks() {
    let table = document.getElementById("taskTable");
    let search = document.getElementById("search").value.toLowerCase();
    let statusFilter = document.getElementById("filter").value;
    let priorityFilter = document.getElementById("priorityFilter").value;

    // Remove the "no tasks" message from a previous run.
    let oldMessage = document.getElementById("emptyRow");
    if (oldMessage) oldMessage.remove();

    // Only real task rows (the empty-message row has a single cell).
    let rows = Array.from(table.querySelectorAll("tr")).filter(function(row) {
        return row.cells.length > 1;
    });

    let counts = { pending: 0, progress: 0, completed: 0 };
    let visibleCount = 0;

    rows.forEach(function(row) {
        // Columns: 0 ID, 1 Name, 2 Project, 3 Assigned To, 4 Due, 5 Priority, 6 Status
        let priorityCell = row.cells[5];
        let statusCell = row.cells[6];

        // Remember the original text so re-running this function is safe.
        if (!priorityCell.dataset.value) priorityCell.dataset.value = priorityCell.innerText.trim();
        if (!statusCell.dataset.value) statusCell.dataset.value = statusCell.innerText.trim();

        let priority = priorityCell.dataset.value;
        let status = statusCell.dataset.value;

        // Coloured priority label.
        priorityCell.innerHTML = "";
        let priorityText = document.createElement("span");
        priorityText.className = "priority-" + priority.toLowerCase();
        priorityText.innerText = priority;
        priorityCell.appendChild(priorityText);

        // Coloured status badge + running totals.
        statusCell.innerHTML = "";
        let badge = document.createElement("span");
        if (status === "Pending") {
            badge.className = "badge pending";
            counts.pending++;
        } else if (status === "In Progress") {
            badge.className = "badge progress";
            counts.progress++;
        } else {
            badge.className = "badge completed";
            counts.completed++;
        }
        badge.innerText = status;
        statusCell.appendChild(badge);

        // Search by task name, project, or assigned employee.
        let searchMatch =
            row.cells[1].innerText.toLowerCase().includes(search) ||
            row.cells[2].innerText.toLowerCase().includes(search) ||
            row.cells[3].innerText.toLowerCase().includes(search);

        let statusMatch = statusFilter === "All" || status === statusFilter;
        let priorityMatch = priorityFilter === "All" || priority === priorityFilter;

        if (searchMatch && statusMatch && priorityMatch) {
            row.style.display = "";
            visibleCount++;
        } else {
            row.style.display = "none";
        }
    });

    // Friendly message when nothing matches (or the database is empty).
    if (visibleCount === 0) {
        let row = document.createElement("tr");
        row.id = "emptyRow";
        let cell = document.createElement("td");
        cell.colSpan = 9;
        cell.className = "empty-message";
        cell.innerText = rows.length === 0
            ? "No tasks yet. Click + Add New Task to create one."
            : "No tasks found. Try changing your search or filters.";
        row.appendChild(cell);
        table.appendChild(row);
    }

    // Summary cards.
    document.getElementById("total").innerText = rows.length;
    document.getElementById("pending").innerText = counts.pending;
    document.getElementById("progress").innerText = counts.progress;
    document.getElementById("completed").innerText = counts.completed;
}

// Run once the page has loaded so the cards and badges appear.
showTasks();


// Refresh the displayed timer once per second while any timer is running.
setInterval(function() {
    let timerIsRunning = tasks.some(function(task) {
        return task.timerStarted !== null;
    });

    if (timerIsRunning) {
        showTasks();
    }
}, 1000);


// Display saved tasks as soon as the page has loaded.
showTasks();
