package app.app.task.data

import android.content.Context
import android.util.Log
import androidx.work.Worker
import androidx.work.WorkerParameters
import app.app.task.data.remote.TaskApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class MyWorker(context: Context, workerParams: WorkerParameters) : Worker(context, workerParams){

    override fun doWork(): Result {
        Log.i("Worker2", "working")
        var idSure: String
        var titleSure: String
        var descriptionSure: String
        var statusSure: String
        val id = inputData.getString("id")
        val title = inputData.getString("title")
        val description = inputData.getString("description")
        val status = inputData.getString("status")
        val deadline = inputData.getInt("deadline", 0)
        if(id != null){
            idSure = id
        }else {
            idSure = ""
        }
        if(title != null){
            titleSure = title
        }else {
            titleSure = ""
        }
        if(description != null){
            descriptionSure = description
        }else {
            descriptionSure = ""
        }
        if(status != null){
            statusSure = status
        }else {
            statusSure = ""
        }
        Log.i("Worker2", "$id $title $description $deadline $statusSure")
        GlobalScope.launch{
            if(titleSure != "" && descriptionSure != "" && deadline > 0 && statusSure != "")
                TaskApi.service.create(Task(idSure, titleSure, descriptionSure,deadline,statusSure))
        }
        return Result.SUCCESS
    }

}