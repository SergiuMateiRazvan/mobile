package app.app.auth.data.local

import androidx.lifecycle.LiveData
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import app.app.auth.data.TokenHolder

@Dao
interface TokenDao {
    @Query("SELECT * FROM token")
    fun get(): List<TokenHolder>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(token: TokenHolder)

    @Query("DELETE FROM token")
    fun delete()

    @Query("SELECT COUNT(*) FROM token")
    fun count(): Int

}