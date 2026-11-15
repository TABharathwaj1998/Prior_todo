                                              Ontario Tech University
                                       Foundations of Software Engineering
                       Design and Development of a Priority-Based To-Do List Web Application
This is the task management project that focuses on prioritizing the list-of-things-to-do (or) TODOLIST to achieve a task or a deliverable
Team Members: Bharathwaj T A, M.Eng Mechatronics
              Yagnesh Patel, M.Eng Mechatronics
              Subh Patel, M.Eng Software Engg

A web application for task management for a single user using Python Flask, HTML/CSS, and SQLite3. Users can create and manage tasks on a dashboard, open the to-do list of each task to create and manage to-do items, set a priority score and a due date for a task and edit or complete to-do items. When priorities are the same, they are listed by due date (largest first).

## Requirements

Before starting, install at Chrome, Edge, or Firefox:
    - Python3 (recent supported version) and pip
    - **git** (to clone the repository (optional if you downloaded the ZIP))
    
## Installation

1. Check out the code from the website at the above link ```bash git clone https://github.com/TABharathwaj1998/Prior_todo.git
                                                                 cd Prior_todo```
If you've downloaded the repository as a ZIP file, then unzip it and open a terminal in the project folder you've extracted that file to, rather.

Create virtual environment for todo: python3 -m venv todo
Activate virtualenv within virtualenv: todo/scripts/activate (Windows) or source .venv/bin/activate (Mac)
To install the packages, run pip install -r requirements.txt
code . => To open Visual Studio Code

## Running the Application

In this project you will be using two Flask applications: one for the main task dashboard (`dashboard.py`) and the other for the prioritized list of to-do's (`todo.py`). Make sure both are running at the same time, each in their own terminal, so that the Open links on the dashboard can connect to the to-do list.

python dashboard.py (**http://127.0.0.1:5000/**) at Terminal 1 and python todo.py (http://127.0.0.1:5001/) at Terminal 2

## Troubleshooting

| Issue | Suggested fix |
| --- | --- |
    - Activate .venv and execute the command: pip install -r requirements.txt.
    - No requirements.txt file found: Check that you are in the project root directory.
    - Open is not working in Dashboard, but `todo.py` is running in another terminal - check that it is listening on port **5001**.
    - End the previous process that is using that port. The to-do app's port is linked to in the dashboard, so if the port number changes, you will need to change the link too.
    - Verify the working directory, database file paths and project SQLite database schema.
    - To create a virtual environment, use the following commands: `python` on Windows, or `python3` on macOS/Linux. Once the virtual environment has been created, use the activated virtual environment's `python`.
