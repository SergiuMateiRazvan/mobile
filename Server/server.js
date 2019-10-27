require("ws");
const express = require("express");
const srv = express();
const morgan = require("morgan");
const mysql = require("mysql");
const wss = require("express-ws")(srv);

srv.use(morgan("combined"));
srv.use(express.json());

srv.ws("/tasks", (ws, req) => {
  ws.on("message", msg => {
    console.log("Received message");
  });
  ws.on("connection", (ws, req) => {
    console.log("Connected");
  });
  console.log("connected");
});

const broadcast = data => {
  wss.getWss().clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};

srv.get("/tasks", (req, res) => {
  const conn = getConnection();

  conn.query("SELECT * FROM tasks", (err, rows, fields) => {
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

srv.post("/tasks/task", (req, res) => {
  const task = req.body;
  del(task);

  const queryString =
    "INSERT INTO tasks(Title, Description, Deadline, Status) VALUES (?,?,?,?)";
  const conn = getConnection();
  conn.query(
    queryString,
    [task.Title, task.Description, parseInt(task.Deadline), task.Status],
    (err, rows, __) => {
      if (err) {
        throw new Error(err);
      }
      task.ID = rows.insertId;
      res.end();
      broadcast(task);
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
