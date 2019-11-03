package app.app.task.data

import androidx.lifecycle.LiveData
import app.app.task.data.remote.TaskApi
import app.app.core.*
import app.app.task.data.local.TaskDao

class TaskRepository(private val taskDao: TaskDao) {

    val tasks = taskDao.getAll()

    suspend fun refresh(): Result<Boolean> {
        try {
            val tasks = TaskApi.service.find()
            for (task in tasks) {
                taskDao.insert(task)
            }
            return Result.Success(true)
        } catch(e: Exception) {
            return Result.Error(e)
        }
    }

    fun getById(taskId: String): LiveData<Task> {
        return taskDao.getById(taskId)
    }


    suspend fun save(task: Task): Result<Task> {
        try {
            val createdTask = TaskApi.service.create(task)
            taskDao.insert(createdTask)
            return Result.Success(createdTask)
        } catch(e: Exception) {
            return Result.Error(e)
        }
    }

    suspend fun update(task: Task): Result<Task> {
        try {
            val updatedTask = TaskApi.service.create(task)
            taskDao.update(updatedTask)
            return Result.Success(updatedTask)
        } catch(e: Exception) {
            return Result.Error(e)
        }
    }

//    suspend fun loadAll(): Result<List<Task>> {
//        if(cachedTasks != null){
//            return Result.Success(cachedTasks as List<Task>)
//        }
//        try {
//            cachedTasks = mutableListOf()
//            val tasks = TaskApi.service.find()
//            cachedTasks?.addAll(tasks)
//            return Result.Success(cachedTasks as List<Task>)
//        }catch(e: Exception) {
//            return Result.Error(e)
//        }
//    }

//    suspend fun load(taskID: String): Result<Task> {
//        val task = cachedTasks?.find { it.ID == taskID }
//        if (task != null) {
//            return Result.Success(task)
//        }
//        try {
//            return Result.Success(TaskApi.service.read(taskID))
//        }catch(e: Exception){
//            return Result.Error(e)
//        }
//    }

//    suspend fun save(task: Task): Result<Task> {
//        try {
//            val createdTask = TaskApi.service.create(task)
//            val index = cachedTasks?.indexOfFirst { it.ID == task.ID }
//            if (index != null && index != -1) {
//                cachedTasks?.set(index, createdTask)
//            } else {
//                cachedTasks?.add(createdTask)
//            }
//            return Result.Success(createdTask)
//        }catch(e: Exception){
//            return Result.Error(e)
//        }
//
//    }
}
