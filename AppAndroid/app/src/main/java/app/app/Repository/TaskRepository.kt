package app.app.Repository

import app.app.API.TaskApi
import app.app.API.TaskList
import app.app.Model.Task

object TaskRespository {
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

}
