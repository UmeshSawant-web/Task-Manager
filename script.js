const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const toggleTheme = document.getElementById("toggleTheme");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

document.addEventListener("DOMContentLoaded", loadTasks);

addTask.addEventListener("click", createTask);
taskInput.addEventListener("keyup", e => e.key === "Enter" && createTask());

searchInput.addEventListener("input", filterTasks);
filterStatus.addEventListener("change", filterTasks);

function createTask() {
    if (taskInput.value.trim() === "") return;
    addTaskToUI(taskInput.value.trim(), taskDate.value, false);
    saveToLocal();
    taskInput.value = "";
    taskDate.value = "";
}

function addTaskToUI(text, date = "", isDone = false) {
    const li = document.createElement("li");
    if (isDone) li.classList.add("done");

    li.innerHTML = `
      <span class="text">${text} ${date ? `<small>(📅 ${date})</small>` : ""}</span>
      <div class="btns">
        <button class="complete">✔</button>
        <button class="edit">✏</button>
        <button class="delete">🗑</button>
      </div>
    `;

    checkDueDate(li, date);
    taskList.appendChild(li);

    li.querySelector(".complete").onclick = () => {
        li.classList.toggle("done");
        saveToLocal();
    };

    li.querySelector(".delete").onclick = () => {
        li.remove();
        saveToLocal();
    };

    li.querySelector(".edit").onclick = () => {
        const newText = prompt("Edit task", text);
        if (newText && newText.trim() !== "") {
            li.querySelector(".text").innerHTML = `${newText.trim()} ${date ? `<small>(📅 ${date})</small>` : ""}`;
            saveToLocal();
        }
    };
}

function checkDueDate(li, date) {
    if (!date) return;
    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
        li.classList.add("overdue");
    }
}

function filterTasks() {
    const search = searchInput.value.toLowerCase();
    const status = filterStatus.value;

    document.querySelectorAll("#taskList li").forEach(li => {
        const text = li.querySelector(".text").textContent.toLowerCase();
        const isCompleted = li.classList.contains("done");

        let match = text.includes(search);
        if (status === "done" && !isCompleted) match = false;
        if (status === "pending" && isCompleted) match = false;

        li.style.display = match ? "flex" : "none";
    });
}

function saveToLocal() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        const fullText = li.querySelector(".text").innerHTML;
        const textOnly = fullText.split("<small>")[0].trim();
        const dateMatch = fullText.match(/\d{4}-\d{2}-\d{2}/);
        tasks.push({
            text: textOnly,
            date: dateMatch ? dateMatch[0] : "",
            done: li.classList.contains("done")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    saved.forEach(t => addTaskToUI(t.text, t.date, t.done));
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
}

toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});
