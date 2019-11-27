package app.app.task.data.local

import androidx.lifecycle.LiveData
import app.app.task.data.Task
import androidx.room.*
import java.io.Serializable

@Dao
interface TaskDao : Serializable{
    @Query("SELECT * from tasks ORDER BY Title ASC")
    fun getAll(): LiveData<List<Task>>

    @Query("SELECT * FROM tasks WHERE ID=:id ")
    fun getById(id: String): LiveData<Task>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(task: Task)

    @Update(onConflict = OnConflictStrategy.REPLACE)
    suspend fun update(task: Task)

    @Query("DELETE FROM tasks")
    suspend fun deleteAll()

    @Query("DELETE FROM tasks WHERE Title=:title")
    suspend fun deleteByTitle(title: String)
}