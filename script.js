// script.js

document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('add-task-btn').addEventListener('click', addTask);

function addTask() {
    let taskInput = document.getElementById('task-input');
    let taskPriority = document.getElementById('task-priority').value;
    let taskValue = taskInput.value.trim();

    if (taskValue === '') {
        alert('Please enter a task.');
        return;
    }

    addTaskToDOM(taskValue, taskPriority);
    storeTaskInLocalStorage(taskValue, taskPriority);

    // Clear the input field
    taskInput.value = '';
}

function addTaskToDOM(taskValue, taskPriority, completed = false) {
    let taskList;

    // Select the correct task list based on priority
    if (taskPriority === 'High') {
        taskList = document.getElementById('high-priority-list');
    } else if (taskPriority === 'Medium') {
        taskList = document.getElementById('medium-priority-list');
    } else {
        taskList = document.getElementById('low-priority-list');
    }

    // Create list item
    let li = document.createElement('li');
    if (completed) li.classList.add('completed');

    li.innerHTML = `
        <span>${taskValue}</span>
        <button class="delete-btn">Delete</button>
    `;

    // Mark task as complete on click
    li.addEventListener('click', function () {
        li.classList.toggle('completed');
        updateTaskStatusInLocalStorage(taskValue);
    });

    // Delete task
    li.querySelector('.delete-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        taskList.removeChild(li);
        removeTaskFromLocalStorage(taskValue);
    });

    // Add to list
    taskList.appendChild(li);
}

// Store task in local storage with priority
function storeTaskInLocalStorage(taskValue, taskPriority) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ task: taskValue, priority: taskPriority, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(taskItem => {
        addTaskToDOM(taskItem.task, taskItem.priority, taskItem.completed);
    });
}

// Update task status in local storage (complete/incomplete)
function updateTaskStatusInLocalStorage(taskValue) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks.forEach(taskItem => {
        if (taskItem.task === taskValue) {
            taskItem.completed = !taskItem.completed;
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove task from local storage
function removeTaskFromLocalStorage(taskValue) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks = tasks.filter(taskItem => taskItem.task !== taskValue);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}
