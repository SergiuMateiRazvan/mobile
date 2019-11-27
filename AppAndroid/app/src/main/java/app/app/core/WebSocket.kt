package app.app.core

import android.util.Log
import app.app.task.data.Task
import app.app.task.data.local.TaskDao
import com.google.gson.Gson
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.async
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener

class WebSocket(private val taskDao: TaskDao) : WebSocketListener() {

    private var gson = Gson()
    @Override
    override fun onOpen(webSocket: WebSocket, response: Response) {
        Log.i("WebSocket", "Websocket opened")
    }

    @Override
    override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
        Log.i("WebSocket", "Websocket openned")
    }

    @Override
    override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
        Log.e("WebSocket", "ConnectionError")
    }

    @Override
    override fun onMessage(webSocket: WebSocket, text: String) {
        Log.i("WebSocket", "Received message: ${text}")
        var task: TaskResponse = gson.fromJson(text, TaskResponse::class.java)
        GlobalScope.async {
            addTask(task.task)
        }
    }

    suspend fun addTask(task: Task) {
        taskDao.deleteByTitle(task.Title)
        task.Synched = true
        taskDao.insert(task)
    }
}

data class TaskResponse(val event: String, val task: Task) {
}
