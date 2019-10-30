package app.app.Model

data class Task(
    val ID: String,
    var Title: String,
    var Description: String,
    var Deadline: String,
    var Status: String
){
    override fun toString(): String = "$Title $Description $Deadline $Status"
    companion object{
        fun getHeader() : String {
            return "Title           Description         Deadline  Status"
        }
    }


}