package app.app.viewModels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import app.app.model.Task
import app.app.repository.TaskRepository
import kotlinx.coroutines.launch

class TaskListViewModel : ViewModel() {
    private val mutableTasks = MutableLiveData<List<Task>>().apply {value = emptyList()}
    private val mutableLoading = MutableLiveData<Boolean>().apply { value = false}
    private val mutableException = MutableLiveData<Exception>().apply { value = null }

    val tasks: LiveData<List<Task>> = mutableTasks;
    val loading: LiveData<Boolean> = mutableLoading;
    val loadingError: LiveData<Exception> = mutableException;


    fun loadTasks() {
        viewModelScope.launch {
            mutableLoading.value = true
            mutableException.value = null
            try{
                mutableTasks.value = TaskRepository.loadAll()
                mutableLoading.value = false
            }catch (e: Exception) {
                mutableException.value = e
                mutableLoading.value = false
            }
        }
    }
}
