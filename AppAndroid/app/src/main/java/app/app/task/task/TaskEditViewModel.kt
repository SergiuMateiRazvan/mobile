package app.app.task.task

import android.app.Application
import androidx.lifecycle.*
import app.app.task.data.Task
import app.app.task.data.TaskRepository
import kotlinx.coroutines.launch
import app.app.core.*
import app.app.task.data.local.TaskDao
import app.app.task.data.local.TasksDatabase

class TaskEditViewModel(application: Application) : AndroidViewModel(application) {
    private val mutableFetching = MutableLiveData<Boolean>().apply { value = false }
    private val mutableCompleted = MutableLiveData<Boolean>().apply { value = false }
    private val mutableException = MutableLiveData<Exception>().apply { value = null }

    val fetching: LiveData<Boolean> = mutableFetching
    val fetchingError: LiveData<Exception> = mutableException
    val completed: LiveData<Boolean> = mutableCompleted

    val taskRepo: TaskRepository

    init {
        val taskDao = TasksDatabase.getDatabase(application, viewModelScope).taskDao()
        taskRepo = TaskRepository(taskDao)
    }

    fun getItemById(itemId: String): LiveData<Task> {
        return taskRepo.getById(itemId)
    }


    fun saveOrUpdateItem(task: Task) {
        viewModelScope.launch {
//            val task = mutableTask.value?: return@launch
            mutableFetching.value = true
            mutableException.value = null
            when(val result: Result<Task> = taskRepo.save(task)) {
                is Result.Success -> {
                }
                is Result.Error -> {
                    mutableException.value = result.exception
                }
            }
            mutableCompleted.value = true
            mutableFetching.value = false
        }
    }
}
