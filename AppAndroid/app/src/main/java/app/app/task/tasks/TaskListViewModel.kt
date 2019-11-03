package app.app.task.tasks

import android.app.Application
import androidx.lifecycle.*
import app.app.task.data.Task
import app.app.task.data.TaskRepository
import kotlinx.coroutines.launch
import app.app.core.*
import app.app.task.data.local.TasksDatabase

class TaskListViewModel(application: Application) : AndroidViewModel(application) {
    private val mutableLoading = MutableLiveData<Boolean>().apply { value = false}
    private val mutableException = MutableLiveData<Exception>().apply { value = null }

    val tasks: LiveData<List<Task>>
    val loading: LiveData<Boolean> = mutableLoading
    val loadingError: LiveData<Exception> = mutableException

    val taskRepo: TaskRepository

    init {
        val taskDao = TasksDatabase.getDatabase(application, viewModelScope).taskDao()
        taskRepo = TaskRepository(taskDao)
        tasks = taskRepo.tasks
    }

    fun refresh() {
        viewModelScope.launch {
            mutableLoading.value = true
            mutableException.value = null
            when (val result = taskRepo.refresh()) {
                is Result.Success -> {
                }
                is Result.Error -> {
                    mutableException.value = result.exception
                }
            }
            mutableLoading.value = false
        }
    }
}
