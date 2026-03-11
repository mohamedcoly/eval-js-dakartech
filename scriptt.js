const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const errorDiv = document.getElementById('error-message');
const tasksList = document.getElementById('tasks-list');
const counterSpan = document.getElementById('counter');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = [];
let currentFilter = 'all';

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function displayTasks() {
    tasksList.innerHTML = '';

    let tasksToShow = [];
    
    if (currentFilter === 'all') {
        tasksToShow = tasks;
    } else if (currentFilter === 'pending') {
        tasksToShow = tasks.filter(function(task) {
            return task.completed === false;
        });
    } else if (currentFilter === 'completed') {
        tasksToShow = tasks.filter(function(task) {
            return task.completed === true;
        });
    }

    if (tasksToShow.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Aucune tâche à afficher';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '2rem';
        emptyMessage.style.color = '#999';
        tasksList.appendChild(emptyMessage);
        updateCounter();
        return;
    }

    for (let i = 0; i < tasksToShow.length; i++) {
        const task = tasksToShow[i];
        
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-card';
        
        if (task.completed) {
            taskDiv.classList.add('completed');
        }

        const taskText = document.createElement('span');
        taskText.textContent = task.text;

        const buttonsDiv = document.createElement('div');

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        
        if (task.completed) {
            completeBtn.textContent = 'Annuler';
        } else {
            completeBtn.textContent = 'Terminé';
        }
        
        completeBtn.dataset.id = task.id;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.dataset.id = task.id;

        completeBtn.addEventListener('click', toggleTask);
        deleteBtn.addEventListener('click', deleteTask);

        buttonsDiv.appendChild(completeBtn);
        buttonsDiv.appendChild(deleteBtn);
        taskDiv.appendChild(taskText);
        taskDiv.appendChild(buttonsDiv);
        tasksList.appendChild(taskDiv);
    }

    updateCounter();
}

function updateCounter() {
    let count = 0;
    
    for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].completed) {
            count++;
        }
    }
    
    if (count === 0) {
        counterSpan.textContent = '0 tâche en cours';
    } else if (count === 1) {
        counterSpan.textContent = '1 tâche en cours';
    } else {
        counterSpan.textContent = count + ' tâches en cours';
    }
}

function addTask(event) {
    event.preventDefault();

    const taskText = input.value.trim();

    if (taskText === '') {
        errorDiv.textContent = 'Veuillez entrer une tâche';
        return;
    }

    errorDiv.textContent = '';

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    input.value = '';
    saveTasks();
    displayTasks();
}

function toggleTask(event) {
    const taskId = Number(event.currentTarget.dataset.id);

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            tasks[i].completed = !tasks[i].completed;
            break;
        }
    }

    saveTasks();
    displayTasks();
}

function deleteTask(event) {
    const taskId = Number(event.currentTarget.dataset.id);

    const newTasks = [];
    
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== taskId) {
            newTasks.push(tasks[i]);
        }
    }
    
    tasks = newTasks;

    saveTasks();
    displayTasks();
}

function setFilter(event) {
    const clickedButton = event.currentTarget;
    const filterValue = clickedButton.dataset.filter;
    
    currentFilter = filterValue;
    
    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].classList.remove('active');
    }
    
    clickedButton.classList.add('active');
    
    displayTasks();
}

function init() {
    loadTasks();
    
    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener('click', setFilter);
    }
    
    form.addEventListener('submit', addTask);
    
    displayTasks();
}

init();