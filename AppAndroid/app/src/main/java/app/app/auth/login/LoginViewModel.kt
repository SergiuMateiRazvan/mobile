package app.app.auth.login

import android.app.Application
import android.util.Patterns
import androidx.lifecycle.*
import app.app.R
import app.app.auth.data.AuthRepository
import app.app.auth.data.TokenHolder
import app.app.auth.data.local.TokenDatabase
import kotlinx.coroutines.launch
import app.app.core.*

class LoginViewModel(application: Application) : AndroidViewModel(application) {
    private val mutableLoginFormState = MutableLiveData<LoginFormState>()
    val loginFormState: LiveData<LoginFormState> = mutableLoginFormState

    private val mutableLoginResult = MutableLiveData<Result<TokenHolder>>()
    val loginResult: LiveData<Result<TokenHolder>> = mutableLoginResult

    val authRepo: AuthRepository

    init{
        val tokenDao = TokenDatabase.getDatabase(application).tokenDao()
        authRepo = AuthRepository(tokenDao)
    }

    fun login(username: String, password: String) {
        viewModelScope.launch{
            mutableLoginResult.value = authRepo.login(username, password)
        }
    }

    fun loginDataChanged(username: String, password: String) {
        if (!isUserNameValid(username)) {
            mutableLoginFormState.value = LoginFormState(usernameError = R.string.invalid_username)
        } else if (!isPasswordValid(password)) {
            mutableLoginFormState.value = LoginFormState(passwordError = R.string.invalid_password)
        } else {
            mutableLoginFormState.value = LoginFormState(isDataValid = true)
        }
    }
    private fun isUserNameValid(username: String): Boolean {
        return if (username.contains('@')) {
            Patterns.EMAIL_ADDRESS.matcher(username).matches()
        } else {
            username.isNotBlank()
        }
    }

    private fun isPasswordValid(password: String): Boolean {
        return password.isNotEmpty()
    }


}
