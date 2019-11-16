package app.app.auth.data

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "token")
data class TokenHolder(@PrimaryKey @ColumnInfo(name="token") val token: String)