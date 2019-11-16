package app.app.auth.data

import app.app.auth.data.local.TokenDao
import app.app.auth.data.remote.RemoteAuthDataSource
import app.app.core.*


class AuthRepository(private val tokenDao: TokenDao) {
    var user: User? = null
        private set

    val isLoggedIn: Boolean
        get() = tokenDao.count() != 0

    init {
        user = null
        if(isLoggedIn) {
            val data = tokenDao.get()
            Api.tokenInterceptor.token = data[0].token
        }
    }

    fun logout() {
        user = null
        Api.tokenInterceptor.token = null
        tokenDao.delete()
    }

    suspend fun login(username: String, password: String): Result<TokenHolder> {
        val user = User(username, password)
        val result = RemoteAuthDataSource.login(user)
        if(result is Result.Success<TokenHolder>){
            setLoggedInUser(user, result.data)
        }
        return result
    }

    private suspend fun setLoggedInUser(user: User, tokenHolder: TokenHolder) {
        this.user = user
        Api.tokenInterceptor.token = tokenHolder.token
        tokenDao.insert(tokenHolder)
    }
}

