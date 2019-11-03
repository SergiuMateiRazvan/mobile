package app.app.task.data.remote

import app.app.core.Api
import app.app.task.data.Task
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

data class TaskList(val tasks: List<Task>){}

object TaskApi {

    interface Service {
        @GET("/tasks")
        suspend fun find() : List<Task>

        @GET("/tasks/{id}")
        suspend fun read(@Path("id") taskID: String) : Task

        @Headers("Content-Type: application/json")
        @POST("/tasks/task")
        suspend fun create(@Body item: Task): Task
    }

    val service: Service = Api.retrofit.create(
        Service::class.java)
}