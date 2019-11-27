package app.app.task.tasks
import android.os.Bundle
import android.view.*
import androidx.fragment.app.Fragment
import android.widget.Toast
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import androidx.navigation.fragment.findNavController
import app.app.task.data.Task
import app.app.R
import app.app.auth.data.AuthRepository
import app.app.auth.data.local.TokenDatabase
import kotlinx.android.synthetic.main.task_list_fragment.*


class TaskListFragment : Fragment() {
    private lateinit var taskListAdapter: TaskListAdapter
    private lateinit var taskListModel: TaskListViewModel

    private lateinit var authRepository: AuthRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setHasOptionsMenu(true)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.task_list_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        val tokenDao = TokenDatabase.getDatabase(activity!!.applicationContext).tokenDao()
        authRepository = AuthRepository(tokenDao)

        if (!authRepository.isLoggedIn) {
            findNavController().navigate(R.id.login_fragment)
            return
        }
        setUpTaskList()
        fab.setOnClickListener {
            findNavController().navigate(R.id.task_edit_fragment)
        }
        header.text = Task.getHeader()
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        super.onCreateOptionsMenu(menu, inflater)
        inflater.inflate(R.menu.logout, menu)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        val id = item.getItemId()
        if( id == R.id.logout){
            authRepository.logout()
            findNavController().navigate(R.id.task_list_fragment)
            return true
        }
        return super.onOptionsItemSelected(item)
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
        taskListModel.refresh()
    }

}
