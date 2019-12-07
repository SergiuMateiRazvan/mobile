package app.app.task.data

import app.app.task.data.local.TaskDao
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.delay

val channel = Channel<TaskDao>()
suspend fun sendTaskDao(taskDao: TaskDao, time: Long) {
    while (true) {
        channel.send(taskDao)
        delay(time)

    }
}