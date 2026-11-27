const STORAGE_KEY = "tt_tasks_v1"

export function getTasks(){

    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []

}

export function saveTasks(tasks){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function addTask(title){

    const cleanTitle = title.trim()
    if(!cleanTitle) return getTasks()

    const newTask = {
        id: crypto.randomUUID() ? crypto.randomUUID() : String(Date.now()),
        title: cleanTitle,
        totalSeconds: 0,
        isRunning: false,
        activeStartTime: null
    }

    const tasks = [newTask, ...getTasks()]
    saveTasks(tasks)

    return tasks

}

export function formatTime(seconds){

    const safe = Math.max(0, Math.floor(seconds))
    const h = String(Math.floor(safe / 3600)).padStart(2,"0")
    const m = String(Math.floor((safe % 3600) / 60)).padStart(2,"0")
    const s = String(safe % 60).padStart(2,"0")

    return `${h}:${m}:${s}`;
}

export function getCurrentTaskSeconds(task, now = Date.now()){

    if(!task.isRunning || !task.activeStartTime){
        return task.totalSeconds || 0
    }

    const elapsed = Math.max(0, Math.floor((now - task.activeStartTime) / 1000))
    return (task.totalSeconds || 0) + elapsed
}


export function startTimer(taskId){
    
    console.log("eee");
    

    const now = Date.now()
    const tasks = getTasks().map((task) => {

        // Task na koji smo kliknuli start
        if(task.id === taskId){
            return {
                ...task,
                isRunning: true,
                activeStartTime: now
            }
        }

        // Task koji je vec bio pokrenut
        if(task.isRunning && task.activeStartTime){
            const elapsed = Math.max(0, Math.floor((now - task.activeStartTime) / 1000))
            return {
                ...task,
                totalSeconds: (task.totalSeconds || 0) + elapsed,
                isRunning: false,
                activeStartTime: null
            }
        }
        return task
    })

    saveTasks(tasks)
    return tasks

}

export function stopTimer(taskId){
    const now = Date.now()
    const tasks = getTasks().map((task) => {
        if(task.id !== taskId || !task.isRunning || !task.activeStartTime){
            return task
        }

        const elapsed = Math.max(0, Math.floor((now - task.activeStartTime) / 1000))
        return {
            ...task,
            totalSeconds: (task.totalSeconds || 0) + elapsed,
            isRunning: false,
            activeStartTime: null
        }
    })

    saveTasks(tasks)
    return tasks
}




export function deleteTask(taskId){

    const tasks = getTasks().filter((task) => task.id !== taskId)
    
    saveTasks(tasks)
    return tasks    
}












