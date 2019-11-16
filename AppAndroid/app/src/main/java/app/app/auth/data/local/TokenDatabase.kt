package app.app.auth.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import app.app.auth.data.TokenHolder
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(entities = [TokenHolder::class], version=1)
abstract class TokenDatabase : RoomDatabase(){

    abstract fun tokenDao(): TokenDao

    companion object {
        @Volatile
        private var INSTANCE: TokenDatabase? = null

        fun getDatabase(context: Context): TokenDatabase {
            val inst = INSTANCE
            if (inst != null) {
                return inst
            }
            val instance =
                Room.databaseBuilder(
                    context.applicationContext,
                    TokenDatabase::class.java,
                    "tokens"
                )
                    //.addCallback(WordDatabaseCallback(scope))
                    .allowMainThreadQueries()
                    .build()
            INSTANCE = instance
            return instance
        }

//        private class WordDatabaseCallback(private val scope: CoroutineScope) :
//            RoomDatabase.Callback() {
//
//            override fun onOpen(db: SupportSQLiteDatabase) {
//                super.onOpen(db)
//                INSTANCE?.let { database ->
//                    thilaunch (Dispatchers.IO) {
//                        database.tokenDao().delete()
//                    }
//                }
//            }
//        }
    }

}

