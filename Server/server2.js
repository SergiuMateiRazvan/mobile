const express = require("express");
const srv = express();
const morgan = require("morgan");
const mysql = require("mysql");
var cors = require('cors');

srv.use(morgan("combined"));
srv.use(express.json());
srv.use(cors())

srv.get("/tasks", (req, res) => {
    const conn = getConnection();

    conn.query("SELECT * FROM tasks", (err, rows, _) => {
        if (err) {
            console.log("Failed to get tasks");
            res.sendStatus(500);
            res.end();
            return;
        }
        res.json(rows);
        conn.destroy();
    });
});

srv.get("/tasks/search", (req, res) => {
    const conn = getConnection();
    console.log(req.query);
    const queryString = "SELECT * FROM tasks WHERE Title LIKE ? LIMIT ?";
    conn.query(queryString, [req.query.title + "%", parseInt(req.query.size)], (err, rows, _) => {
        if (err) {
            throw new Error(err);
        }
        res.json(rows);
        conn.destroy();
    });
});


srv.delete("/tasks/task/:id", (req,res) => {
	const conn = getConnection();
	const queryString = "DELETE FROM tasks WHERE ID=?";
    	conn.query(queryString, [req.params.id], (err, _, __) => {
        	if (err) {
            		throw new Error(err);
        	}
		res.send({success: "success"});
        	conn.destroy();
    });

});

srv.get("/tasks/:id", (req, res) => {
    const conn = getConnection();
    const queryString = "SELECT * FROM tasks WHERE ID=?";
    conn.query(queryString, [req.params.id], (err, rows, _) => {
        if (err) {
            throw new Error(err);
        }
        res.json(rows);
        conn.destroy();
    });
});

srv.post("/tasks/task", (req, res) => {
    const task = req.body;
    console.log(task);
    del(task);
    const queryString =
        "INSERT INTO tasks(Title, Description, Deadline, Status) VALUES (?,?,?,?)";
    const conn = getConnection();
    conn.query(
        queryString,
        [task.Title, task.Description, task.Deadline, task.Status],
        (err, rows, __) => {
            if (err) {
                throw new Error(err);
            }
            task.ID = rows.insertId;
            res.json(task);
            conn.destroy();
        }
    );
});


srv.listen(3000, () => {
    console.log("Listening");
});

function getConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        pass: "",
        database: "mobile"
    });
}

function del(task) {
    const conn = getConnection();

    const queryString = "DELETE FROM tasks WHERE ID=?";
    conn.query(queryString, [task.ID], (err, _, __) => {
        if (err) {
            throw new Error(err);
        }
        conn.destroy();
    });
}

