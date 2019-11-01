package app.app.api

import app.app.model.Task
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

data class TaskList(val tasks: List<Task>){}

object TaskApi {
    private const val URL = "http://172.30.117.156:3000/"

    interface Service {
        @GET("/tasks")
        suspend fun find() : List<Task>

        @GET("/tasks/{id}")
        suspend fun read(@Path("id") taskID: String) : Task

        @Headers("Content-Type: application/json")
        @POST("/tasks/task")
        suspend fun create(@Body item: Task): Task
    }

    private val client: OkHttpClient = OkHttpClient.Builder().build()

    private var gson = GsonBuilder()
        .setLenient()
        .create()

    private val retrofit = Retrofit.Builder()
        .baseUrl(URL)
        .addConverterFactory(GsonConverterFactory.create(gson))
        .client(client)
        .build()

    val service: Service = retrofit.create(Service::class.java)
}