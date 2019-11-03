package app.app.task.data.local

import androidx.lifecycle.LiveData
import app.app.task.data.Task
import androidx.room.*

@Dao
interface TaskDao {
    @Query("SELECT * from tasks ORDER BY Title ASC")
    fun getAll(): LiveData<List<Task>>

    @Query("SELECT * FROM tasks WHERE ID=:id ")
    fun getById(id: String): LiveData<Task>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: Task)

    @Update(onConflict = OnConflictStrategy.REPLACE)
    suspend fun update(item: Task)

    @Query("DELETE FROM tasks")
    suspend fun deleteAll()
}