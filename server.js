import express from "express";
const app = express();
const port = process.env.PORT || 5000;
import cors from "cors";
import "./database.js";
import { Todo } from "./models/index.js";

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://newtodo-usingbackend.surge.sh"],
    allowedHeaders: ["Content-Type"],
  })
);
//yaha sare todos store honge
app.get("/api/v1/todos", async (req, res) => {
  const todos = await Todo.find();
  const message = !todos.length ? "todos empty" : "here your todos";

  res.send({ data: todos, message: message });
});

//yaha ek todo milega
app.post("/api/v1/todo", async (req, res) => {
  const obj = {
    todoContent: req.body.todo,
    ip: req.ip,
  };
  // const createdTodo = await Todo.create(obj);
  console.log("resp", obj);

  res.send({ message: "Todo added successfully", data: obj });
});

//yaha ek todo update hoga
app.patch("/api/v1/todo/:id", (req, res) => {
  const id = req.params.id; //id of todo to be updated

  let isFound = false; //flag to check if todo is found or not
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      //specific todo here..!
      todos[i].todoContent = req.body.todoContent;
      isFound = true;
      break;
    }
  }

  if (isFound) {
    res.status(201).send({
      data: { todoContent: req.body.todoContent, id: id },
      message: "todo updated successfully!",
    });
  } else {
    res.status(200).send({ data: null, message: "todo not found" });
  }
});

//yaha ek todo delete hoga

app.delete("/api/v1/todo/:id", (req, res) => {
  const id = req.params.id;

  let isFound = false;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      //specific todo here.. have to delete it now from todos

      todos.splice(i, 1); //delete 1 element from index i

      isFound = true;
      break;
    }
  }

  if (isFound) {
    res.status(201).send({
      message: "todo deleted successfully!",
    });
  } else {
    res.status(200).send({ data: null, message: "todo not found" });
  }
});

app.use((req, res) => {
  res.status(404).send("404: Page not found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
