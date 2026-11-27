import { addTask, deleteTask, formatTime, getCurrentTaskSeconds, getTasks, startTimer, stopTimer } from "./storage.js";


const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const container = document.getElementById("tasks-container");


function render() {

    const tasks = getTasks()
    const now = Date.now()

    if (tasks.length === 0) {
        container.innerHTML = `
            <p class="text-center text-sm text-slate-400 bg-white border border-dashed border-slate-200 rounded-xl p-6">
                Još uvek nema zadataka. Unesi prvi zadatak iznad!
            </p>
            `;
        return;
    }


    container.innerHTML = tasks.map((task) => {

        const seconds = getCurrentTaskSeconds(task, now)

        return `

            <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-slate-900">${task.title}</h2>
                    <p data-time-id="${task.id}" class="font-mono text-lg text-teal-600 font-bold">
                        ${formatTime(seconds)}
                    </p>
                </div>

                <div class="flex items-center gap-2">
                    <button data-action="delete" data-id="${task.id}" class="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold cursor-pointer">
                        Delete
                    </button>

                    ${task.isRunning
                    ? `<button data-action="stop" data-id="${task.id}" class="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold cursor-pointer">
                            Stop
                        </button>`
                    : `<button data-action="start" data-id="${task.id}" class="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold cursor-pointer">
                            Start
                        </button>`
                }
                </div>
            </div>
        
        `

    })
        .join("")

}


form.addEventListener("submit", (e) => {
    e.preventDefault()

    addTask(input.value)
    input.value = ""
    input.focus()
    render()
})


setInterval(() => {
    const tasks = getTasks()
    const now = Date.now()

    tasks.forEach((task) => {
        const timeEl = container.querySelector(`[data-time-id="${task.id}"]`)
        if (timeEl) {
            timeEl.textContent = formatTime(getCurrentTaskSeconds(task, now))
        }
    })
}, 1000);

container.addEventListener("click", (e) => {

    const btn = e.target.closest("button[data-action]")
    if (!btn) return

    const { action, id } = btn.dataset
    if (action === "start") {
        startTimer(id)
    } else if (action === "stop") {
        stopTimer(id)
    } else if(action === "delete"){
        deleteTask(id)
    }

    

    render()
})









render()




























