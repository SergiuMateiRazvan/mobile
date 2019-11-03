package app.app.task.tasks

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.RecyclerView
import app.app.task.task.TaskEditFragment
import app.app.task.data.Task
import app.app.R
import kotlinx.android.synthetic.main.task_view.view.*

class TaskListAdapter(
    private val fragment: Fragment
): RecyclerView.Adapter<TaskListAdapter.ViewHolder>(){

    var tasks = emptyList<Task>()
        set(value) {
            field = value
            notifyDataSetChanged()
        }

    private var onTaskClick: View.OnClickListener

    init {
        onTaskClick = View.OnClickListener { view ->
            val task = view.tag as Task
            fragment.findNavController().navigate(R.id.task_edit_fragment, Bundle().apply {
                putString(TaskEditFragment.TASK_ID, task.ID)
            })
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.task_view, parent, false)
        return ViewHolder(view)
    }

    override fun getItemCount(): Int = tasks.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val task = tasks[position]
        holder.title.text = task.Title
        holder.description.text = task.Description
        holder.deadline.text = task.Deadline.toString()
        holder.status.text = task.Status
        holder.itemView.tag = task
        holder.itemView.setOnClickListener(onTaskClick)
    }

    inner class ViewHolder(view: View): RecyclerView.ViewHolder(view){
        val title: TextView = view.title
        val description: TextView = view.description
        val status: TextView = view.status
        val deadline: TextView = view.deadline
    }

}
