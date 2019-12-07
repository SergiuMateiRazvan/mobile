package app.app.task.data

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "tasks")
data class Task(
    @PrimaryKey @ColumnInfo(name = "ID") val ID: String,
    @ColumnInfo(name = "Title") var Title: String,
    @ColumnInfo(name = "Description") var Description: String,
    @ColumnInfo(name = "Deadline") var Deadline: Int,
    @ColumnInfo(name = "Status") var Status: String,
    @ColumnInfo(name = "Synched") var Synched: Boolean = false
){
    override fun toString(): String = "$Title $Description $Deadline $Status"
    companion object{
        fun getHeader() : String {
            return "Title           Description         Deadline  Status"
        }
    }


}