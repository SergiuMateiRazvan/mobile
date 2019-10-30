package app.app.ViewModels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import app.app.Model.Task
import app.app.Repository.TaskRespository
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
                mutableTasks.value = TaskRespository.loadAll()
                mutableLoading.value = false
            }catch (e: Exception) {
                mutableException.value = e
                mutableLoading.value = false
            }
        }
    }
}
