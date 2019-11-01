package app.app.repository

import app.app.api.TaskApi
import app.app.model.Task

object TaskRepository {
    private var cachedTasks: MutableList<Task>? = null

    suspend fun loadAll(): List<Task> {
        if(cachedTasks != null){
            return cachedTasks as List<Task>
        }
        cachedTasks = mutableListOf()
        val tasks = TaskApi.service.find()
        cachedTasks?.addAll(tasks)
        return cachedTasks as List<Task>
    }

    suspend fun load(taskID: String): Task {
        val task = cachedTasks?.find { it.ID == taskID }
        if (task != null) {
            return task
        }
        return TaskApi.service.read(taskID)
    }

    suspend fun save(task: Task): Task {
        val createdTask= TaskApi.service.create(task)
        val index = cachedTasks?.indexOfFirst { it.ID == task.ID }
        if (index != null && index != -1) {
            cachedTasks?.set(index, createdTask)
        }else{
            cachedTasks?.add(createdTask)
        }
        return createdTask
    }
}
