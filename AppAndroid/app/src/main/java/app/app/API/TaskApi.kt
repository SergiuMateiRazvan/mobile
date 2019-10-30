package app.app.API

import app.app.Model.Task
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Headers
import retrofit2.http.POST

data class TaskList(val tasks: List<Task>){}

object TaskApi {
    private const val URL = "http://192.168.0.100:3000/"

    interface Service {
        @GET("/tasks")
        suspend fun find() : List<Task>

        @Headers("Content-Type: application/json")
        @POST("/tasks")
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