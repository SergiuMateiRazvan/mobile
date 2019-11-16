const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
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
    if (client.readyState === WebSocket.OPEN) {
      console.log("Broadcast ", JSON.stringify(data))
      client.send(JSON.stringify(data));
    }
  });
};

srv.post("/login", (req, res) => {
  const conn = getConnection();

  const queryString = "SELECT * FROM users WHERE Email=?";

  conn.query(queryString, [req.body.username], (err, rows, _) => {
    if (err) {
      console.log("Failed to login");
      res.sendStatus(500);
      res.end();
      return;
    }
    if (rows[0].Parola === req.body.password) {
      const token = jwt.sign({ _id: rows.Id, email: rows.Email }, "mysecret");
      res
        .header("Authorization", token)
        .status(200)
        .json({ token: token });
    } else {
      res.status(404);
      res.send("Invalid credentials");
    }
  });
});


srv.get("/tasks", verifyToken, (req, res) => {
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

srv.get("/tasks/search", verifyToken, (req,res) => {
  const conn = getConnection();
  console.log(req.query);
  const queryString = "SELECT * FROM tasks WHERE Title LIKE ? LIMIT ?";
  conn.query(queryString, [req.query.title+"%", parseInt(req.query.size)], (err, rows, _) => {
    if (err) {
      throw new Error(err);
    }
    res.json(rows);
    conn.destroy();
  });
});

srv.get("/tasks/:id", verifyToken, (req, res) => {
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

srv.post("/tasks/task", verifyToken, (req, res) => {
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
      res.json(task);
      broadcast({event: 'created', task});
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

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).send("Access Denied");
    req.userData = jwt.verify(token, "mysecret");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
}
