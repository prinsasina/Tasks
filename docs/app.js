let tasks = [];
let draggedTask = null;
let recentlyDelete = null;
let timeout = null;
const submitTask = document.querySelector('form');
const inputTask = document.getElementById('newTask');
const taskList = document.getElementById('taskList');
const themeButton = document.getElementById("theme");

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    loadTheme();
});

function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        currentTask();
    }
}

function loadTheme() {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
        document.documentElement.setAttribute("data-theme", storedTheme);
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }
}

themeButton.addEventListener('click', function() {
    changeTheme();
})

function changeTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme == "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    if (newTheme == "dark") {
        document.getElementById("theme").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>`
    } else {
         document.getElementById("theme").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>`
    }
    localStorage.setItem("theme", newTheme);
}

function currentTask() {
    taskList.innerHTML = "";
    for (let i=0; i<tasks.length; i++) {
        const task = createTask(tasks[i],i);
        task.setAttribute("data-index", i);
        taskList.append(task);
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
        <button class="drag-handle">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z"/>
            </svg>
        </button>
    `;

    const dragHandle = taskLi.querySelector(".drag-handle");
    dragHandle.addEventListener("mousedown", () => {
        taskLi.draggable = true;
    });
    dragHandle.addEventListener("mouseup", () => {
        taskLi.draggable = false;
    });

    taskLi.addEventListener("dragstart", function(e) {
        draggedTask = taskLi;
        setTimeout(taskLi.classList.add("dragging"), 0);
        e.dataTransfer.setData("text/plain", index);
    })
    taskLi.addEventListener("dragend", function() {
        taskLi.classList.remove("dragging");
    })

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
    recentlyDelete = {task: tasks[index], index: index};
    tasks.splice(index, 1);
    saveTasks();
    currentTask();
    showNotification();
}

const notification = document.getElementById("notification");
const closeButton = document.getElementById("close-button");

function showNotification() {
    notification.classList.add("show");

    timeout = setTimeout(function() {
        notification.classList.remove("show");
        recentlyDelete = null;
    }, 5000);
}

document.getElementById("undo-button").addEventListener("click", function() {
    if (recentlyDelete){
        tasks.splice(recentlyDelete.index, 0, recentlyDelete.task);
        saveTasks();
        currentTask();
        notification.classList.remove("show");
        clearTimeout(timeout);
        recentlyDelete = null;
    }
})

closeButton.addEventListener("click", function() {
    notification.classList.remove("show");
    clearTimeout(timeout);
    recentlyDelete = null;
});

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

taskList.addEventListener("dragover", function(e) {
    e.preventDefault();
    const selected = document.querySelector(".dragging");
    const notthistask = [...taskList.querySelectorAll(".task:not(.dragging")];
    const nexttask = notthistask.find(task => {
        return e.clientY <= task.offsetTop + task.offsetHeight/2;
    });
    if (nexttask) {
        taskList.insertBefore(selected, nexttask);
    } else {
        taskList.appendChild(selected);
    }
});

taskList.addEventListener("drop", function(e) {
    e.preventDefault();
    const items = [...taskList.children];
    const newIndex = items.indexOf(draggedTask);
    const oldIndex = parseInt(draggedTask.dataset.index);
    if (oldIndex!=newIndex) {
        const [movedTask] = tasks.splice(oldIndex, 1);
        tasks.splice(newIndex, 0, movedTask);
        saveTasks();
        currentTask();
    }

    draggedTask = null;
});

closeButton.addEventListener("click", function() {
    notification.classList.remove("show");
})

