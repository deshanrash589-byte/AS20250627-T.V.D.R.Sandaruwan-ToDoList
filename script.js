// Select DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const emptyState = document.getElementById('emptyState');
const errorMsg = document.getElementById('errorMsg');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// State management
let tasks = [];
let currentFilter = 'all';

// Event Listeners
addTaskBtn.addEventListener('click', addNewTask);
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addNewTask();
    }
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter');
        renderTasks();
    });
});

// Function to add a new task
function addNewTask() {
    const taskText = taskInput.value.trim();

    // Task 6: Validate user input (prevent empty tasks or spaces only)
    if (taskText === '') {
        errorMsg.textContent = 'Please enter a valid task (cannot be empty or spaces only).';
        errorMsg.style.display = 'block';
        return;
    }

    errorMsg.style.display = 'none';

    // Create new task object
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    
    renderTasks();
}

// Function to toggle task completion status
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    renderTasks();
}

// Function to delete a single task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

// Function to clear all completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
}

// Function to update the remaining task counter
function updateCounter() {
    const activeTasksCount = tasks.filter(task => !task.completed).length;
    taskCounter.textContent = `${activeTasksCount} remaining`;
}

// Function to render tasks based on current filter
function renderTasks() {
    taskList.innerHTML = '';

    // Filter tasks based on selected tab (All, Active, Completed)
    let filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all'
    });

    // Show or hide empty state message
    if (tasks.length === 0 || filteredTasks.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    // Generate HTML for each task
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center py-2 px-3 border rounded mb-2';

        li.innerHTML = `
            <div class="form-check d-flex align-items-center gap-2 m-0">
                <input class="form-check-input mt-0" type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
                <span class="${task.completed ? 'completed-task' : ''}">${escapeHtml(task.text)}</span>
            </div>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
    });

    updateCounter();
}

// Security helper to prevent HTML injection in tasks
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}