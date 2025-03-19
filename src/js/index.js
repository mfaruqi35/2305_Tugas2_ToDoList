document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    const storedProgress = JSON.parse(localStorage.getItem("progress"));

    if (storedTasks) {
        tasks = storedTasks; // Load stored tasks
    }

    if (storedProgress) {
        completedTasks = storedProgress.completedTasks;
        totalTasks = storedProgress.totalTasks;
    } else {
        completedTasks = 0;
        totalTasks = 0;
    }

    updateTasksList();
    updateStats();
});

let tasks = [];
let completedTasks = 0;
let totalTasks = 0;

const emptyImage = document.getElementById("emptyImage");

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const saveProgress = () => {
    localStorage.setItem("progress", JSON.stringify({ completedTasks, totalTasks }));
};

const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = "";
        totalTasks += 1;
        updateTasksList();
        updateStats();
        saveTasks();
        saveProgress();
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    completedTasks = tasks.filter((task) => task.completed).length; 

    updateTasksList();
    updateStats();
    saveTasks();
    saveProgress();
};

const deleteTask = (index) => {
    if (tasks[index].completed) {
        completedTasks -= 1; 
    }
    tasks.splice(index, 1);
    totalTasks = tasks.length;

    updateTasksList();
    updateStats();
    saveTasks();
    saveProgress();
};

const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    taskInput.value = tasks[index].text;

    deleteTask(index);
};

const updateStats = () => {
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    const circle = document.querySelector(".progress-circle");
    if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference - (progress / 100) * circumference;
    }

    document.getElementById("numbers").innerText = `${completedTasks} / ${totalTasks}`;
};

const updateTasksList = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
        <div class="task-item">
            <div class="task ${task.completed ? "completed" : ""}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} onChange="toggleTaskComplete(${index})"/>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="./src/assets/edit.svg" alt="edit" onClick="editTask(${index})"/>
                <img src="./src/assets/trash.svg" alt="delete" onClick="deleteTask(${index})"/>
            </div>
        </div>
        `;

        taskList.append(listItem);
    });

    if (tasks.length === 0) {
        if (!document.getElementById("emptyImage")) {
            const emptyImage = document.createElement("img");
            emptyImage.id = "emptyImage";
            emptyImage.src = "./src/assets/emptytask.png";
            emptyImage.alt = "No tasks yet";
            emptyImage.style.width = "65%"; // Sesuaikan ukuran
            emptyImage.style.display = "block";
            emptyImage.style.margin = "1% auto";
            emptyImage.style.opacity = "0.25";
            taskList.append(emptyImage);
        }
    } else {
        // **Hapus gambar jika ada tugas**
        const emptyImage = document.getElementById("emptyImage");
        if (emptyImage) {
            emptyImage.remove();
        }
    }
};

document.getElementById("newTask").addEventListener("click", function (e) {
    e.preventDefault();
    addTask();
});
