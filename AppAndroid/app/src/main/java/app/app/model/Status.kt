package app.app.model

enum class Status(val status: String, val index: Int) {
    ToDo("To Do", 0),
    InProgress("In progress", 1),
    Done("Done",2)
}