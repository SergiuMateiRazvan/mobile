package app.app.viewModels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import app.app.model.Task
import app.app.repository.TaskRepository
import kotlinx.coroutines.launch

class TaskEditViewModel : ViewModel() {
    private val mutableTask = MutableLiveData<Task>().apply { value = Task("","","",0,"") }
    private val mutableFetching = MutableLiveData<Boolean>().apply { value = false }
    private val mutableCompleted = MutableLiveData<Boolean>().apply { value = false }
    private val mutableException = MutableLiveData<Exception>().apply { value = null }

    val task: LiveData<Task> = mutableTask
    val fetching: LiveData<Boolean> = mutableFetching
    val fetchingError: LiveData<Exception> = mutableException
    val completed: LiveData<Boolean> = mutableCompleted

    fun loadItem(itemId: String) {
        viewModelScope.launch {
            mutableFetching.value = true
            mutableException.value = null
            try {
                mutableTask.value = TaskRepository.load(itemId)
                mutableFetching.value = false
            } catch (e: Exception) {
                mutableException.value = e
                mutableFetching.value = false
            }
        }
    }

    fun saveOrUpdateItem(task: Task) {
        viewModelScope.launch {

            mutableFetching.value = true
            mutableException.value = null
            try {
                mutableTask.value = TaskRepository.save(task)
                mutableCompleted.value = true
                mutableFetching.value = false
            } catch (e: Exception) {
                mutableException.value = e
                mutableFetching.value = false
            }
        }
    }
}
