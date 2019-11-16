package app.app.auth.data.remote

import app.app.auth.data.TokenHolder
import app.app.auth.data.User
import app.app.core.Api
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST
import app.app.core.*
import java.lang.Exception

object RemoteAuthDataSource {
    interface AuthService {
        @Headers("Content-Type: application/json")
        @POST("/login")
        suspend fun login(@Body user: User): TokenHolder
    }
    private val authService: AuthService = Api.retrofit.create(AuthService::class.java)

    suspend fun login(user: User): Result<TokenHolder> {
        try {
            return Result.Success(authService.login(user))
        } catch(e: Exception) {
            return Result.Error(e)
        }
    }
}