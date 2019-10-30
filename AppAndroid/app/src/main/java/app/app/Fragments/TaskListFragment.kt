package app.app.Fragments
import android.util.Log
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import androidx.navigation.fragment.findNavController
import app.app.Model.Task
import app.app.R
import app.app.ViewModels.TaskListAdapter
import app.app.ViewModels.TaskListViewModel
import kotlinx.android.synthetic.main.task_list_fragment.*


class TaskListFragment : Fragment() {
    private lateinit var taskListAdapter: TaskListAdapter
    private lateinit var taskListModel: TaskListViewModel


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.task_list_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        setUpTaskList()
        fab.setOnClickListener {
            findNavController().navigate(R.id.task_edit_fragment)
        }
        header.text = Task.getHeader()
    }

    private fun setUpTaskList(){
        taskListAdapter = TaskListAdapter(this)
        task_list.adapter = taskListAdapter
        taskListModel = ViewModelProviders.of(this).get(TaskListViewModel::class.java)
        taskListModel.tasks.observe(this, Observer { tasks ->
            taskListAdapter.tasks = tasks
        })
        taskListModel.loading.observe(this, Observer {loading ->
            progress.visibility = if (loading) View.VISIBLE else View.GONE
        })
        taskListModel.loadingError.observe(this, Observer { exception->
            if(exception != null){
                val message = "Loading exception ${exception.message}"
                val parentActivity = activity?.parent
                if(parentActivity != null){
                    Toast.makeText(parentActivity, message, Toast.LENGTH_SHORT).show()
                }
            }
        })
        taskListModel.loadTasks()
    }

}
