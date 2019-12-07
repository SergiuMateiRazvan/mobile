package app.app.task.data

import androidx.lifecycle.LiveData
import androidx.work.*
import app.app.task.data.remote.TaskApi
import app.app.core.*
import app.app.task.data.local.TaskDao
import okhttp3.OkHttpClient
import okhttp3.Request
import kotlin.coroutines.coroutineContext


class TaskRepository(private val taskDao: TaskDao) {

    val tasks = taskDao.getAll()
    private val request = Request.Builder().url("ws://${Api.IP_ADDRESS}/tasks").build()

    var webSocket = OkHttpClient().newWebSocket(request, WebSocket(taskDao))

    suspend fun refresh(): Result<Boolean> {
        try {
            val tasks = TaskApi.service.find()
            for (task in tasks) {
                task.Synched = true
                taskDao.insert(task)
            }
            return Result.Success(true)
        } catch (e: Exception) {
            return Result.Error(e)
        }
    }

    fun getById(taskId: String): LiveData<Task> {
        return taskDao.getById(taskId)
    }


    suspend fun save(task: Task): Result<Task> {
        try {

            if(taskDao.getById(task.ID).value!=null){
                return this.update(task)
            }else {
                taskDao.insert(task)
                return Result.Success(task)
            }
        } catch (e: Exception) {
            return Result.Error(e)
        }
    }

    suspend fun update(task: Task): Result<Task> {
        try {
            taskDao.update(task)
            return Result.Success(task)
        } catch (e: Exception) {
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
