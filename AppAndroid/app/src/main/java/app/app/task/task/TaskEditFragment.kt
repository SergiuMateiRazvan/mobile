package app.app.task.task

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import app.app.task.data.Status
import app.app.task.data.Task
import app.app.R
import kotlinx.android.synthetic.main.task_edit_fragment.*
import java.lang.Integer.parseInt

class TaskEditFragment : Fragment() {

    companion object {
        const val TASK_ID = "ID"
    }

    private lateinit var viewModel: TaskEditViewModel
    private var taskID: String = ""
    private var task: Task? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            Log.w("d",it.toString())
            if (it.containsKey(TASK_ID)) {
                taskID = it.getString(TASK_ID).toString()
            }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.task_edit_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        setupViewModel()
        fab.setOnClickListener {
//            Log.v(TAG, "save item")
            viewModel.saveOrUpdateItem(
                Task(
                    taskID,
                    task_title.text.toString(),
                    task_description.text.toString(),
                    parseInt(task_deadline.text.toString()),
                    task_status.selectedItem.toString()
                )
            )
        }
    }

    private fun setupViewModel() {
        viewModel = ViewModelProviders.of(this).get(TaskEditViewModel::class.java)
        viewModel.fetching.observe(this, Observer { fetching ->
//            Log.v(TAG, "update fetching")
            progress.visibility = if (fetching) View.VISIBLE else View.GONE
        })
        viewModel.fetchingError.observe(this, Observer { exception ->
            if (exception != null) {
//                Log.v(TAG, "update fetching error")
                val message = "Fetching exception ${exception.message}"
                val parentActivity = activity?.parent
                if (parentActivity != null) {
                    Toast.makeText(parentActivity, message, Toast.LENGTH_SHORT).show()
                }
            }
        })
        viewModel.completed.observe(this, Observer { completed ->
            if (completed) {
//                Log.v(TAG, "completed, navigate back")
                findNavController().navigateUp()
            }
        })
        val id = taskID
        if(id != "")
            viewModel.getItemById(taskID).observe(this, Observer {
                if(it != null){
                    task = it
                    taskID = it.ID
                    task_title.setText(it.Title)
                    task_description.setText(it.Description)
                    task_deadline.setText(it.Deadline.toString())
                    task_status.setSelection(Status.valueOf(it.Status.replace(" ", "")).index)
                }
            })
    }

}
