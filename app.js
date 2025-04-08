let tasks = [];
const submitTask = document.querySelector('form');
const inputTask = document.getElementById('newTask');
const taskList = document.getElementById('taskList');

document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        currentTask();
    }
}

function currentTask() {
    taskList.innerHTML = "";
    for (let i=0; i<tasks.length; i++) {
        taskList.append(createTask(tasks[i],i));
    }
    updateContentStyles();
}

function addTask() {
    const textTask = inputTask.value.trim();
    if (textTask) {
        tasks.push({text: textTask, checked:false});
        inputTask.value = '';
        saveTasks();
        currentTask();
    }
}

submitTask.addEventListener('submit', function (e) {
    e.preventDefault();
    addTask();
});

function createTask(task, index) {
    const taskLi = document.createElement("li");
    const taskID = "task" + index;
    taskLi.className = "task";
    taskLi.innerHTML = `
        <input type="checkbox" id="${taskID}" ${task.checked ? 'checked' : ''}>
        <label for="${taskID}" class="checking-button">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
        </label>
        <label for="${taskID}" class="task-text">${task.text}</label>
        <button class="deleteTask">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>
    `;

    const checkbox = taskLi.querySelector("input[type='checkbox']");
    checkbox.addEventListener('change', function() {
        task.checked = checkbox.checked;
        saveTasks();
        currentTask(); 
    });

    const deleteButton = taskLi.querySelector(".deleteTask");
    deleteButton.addEventListener("click", function() {
        deleteTask(index);
    });

    return taskLi;
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    currentTask();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateContentStyles() {
    if (tasks.length>0) {
        content.classList.add('with-tasks');
    } else {
        content.classList.remove('with-tasks');
    }
}