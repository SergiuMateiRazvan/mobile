package app.app.core

import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object Api {
    const val IP_ADDRESS = "192.168.0.101:3000"
    private const val URL = "http://${IP_ADDRESS}/"

    val tokenInterceptor = TokenInterceptor()

    private val client: OkHttpClient = OkHttpClient.Builder().apply{
        this.addInterceptor(tokenInterceptor)
    }.build()

    private var gson = GsonBuilder()
        .setLenient()
        .create()

    val retrofit = Retrofit.Builder()
        .baseUrl(URL)
        .addConverterFactory(GsonConverterFactory.create(gson))
        .client(client)
        .build()
}