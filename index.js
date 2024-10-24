import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2)); // Agregada una mejor presentación
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to my first API with Node js!");
});

// Nueva ruta para obtener todos los usuarios
app.get("/users", (req, res) => {
  const data = readData();
  res.json(data.users);
});

// Ruta para obtener un usuario por ID
app.get("/users/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const user = data.users.find((user) => user.id === id);
  res.json(user);
});

// Ruta para agregar un nuevo usuario
app.post("/users", (req, res) => {
  const data = readData();
  const body = req.body;
  const newUser = {
    id: data.users.length + 1,
    ...body,
  };
  data.users.push(newUser);
  writeData(data);
  res.json(newUser);
});

// Ruta para actualizar un usuario por ID
app.put("/users/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const userIndex = data.users.findIndex((user) => user.id === id);
  data.users[userIndex] = {
    ...data.users[userIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: "User updated successfully" });
});

// Ruta para eliminar un usuario por ID
app.delete("/users/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const userIndex = data.users.findIndex((user) => user.id === id);
  data.users.splice(userIndex, 1);
  writeData(data);
  res.json({ message: "User deleted successfully" });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
