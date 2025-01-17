import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function App() {
  const BASEE_URL = "https://new-todo-usingbackend.vercel.app";

  const [todos, setTodos] = useState([]);

  const getTodo = async () => {
    try {
      const res = await axios(`${BASEE_URL}/api/v1/todos`);
      const todosFromServer = res?.data?.data;
      setTodos(todosFromServer);
    } catch (err) {
      err.response?.data?.message || "unknown error";
    }
  };
  useEffect(() => {
    getTodo();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();

    const todoValue = event.target.children[0].value;

    try {
      await axios.post(`${BASEE_URL}/api/v1/todo`, {
        todo: todoValue,
      });
      getTodo();
      event.target.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Faild to add todo");
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const res = await axios.delete(`${BASEE_URL}/api/v1/todo/${todoId}`);
      console.log("response", res);

      toast.success(res?.message || "Todo deleted successfully");

      getTodo();
    } catch (err) {}
  };

  const editTodo = async (event, todoId) => {
    event.preventDefault();

    const todoValue = event.target.children[0].value;

    try {
      await axios.patch(`${BASEE_URL}/api/v1/todo/${todoId}`, {
        todoContent: todoValue,
      });
      
      toast.success("Todo edited successfully");
      getTodo();
      event.target.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Faild to edit todo");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-indigo-600 text-center mb-6">
          Todo App
        </h1>

        {/* Input Section */}
        <form onSubmit={addTodo} className="mb-6 flex flex-col gap-3">
          <input
            type="text"
            required
            placeholder="Enter your task"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
          />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
            Add Task
          </button>
        </form>
        {!todos?.length && (
          <p className="text-center text-gray-500">
            No todos available. Add tasks!
          </p>
        )}
        {/* Todo List */}
        <ul className="mt-6 space-y-4">
          {todos?.map((todo, index) => (
            <li
              key={todo._id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition-all duration-200"
            >
              {!todo.isEditing ? (
                <span className="text-gray-700">{todo.todoContent}</span>
              ) : (
                <form
                  onSubmit={(e) => editTodo(e, todo.id)}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    defaultValue={todo.todoContent}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Save
                  </button>
                </form>
              )}
              <div className="space-x-3">
                {!todo.isEditing ? (
                  <button
                    onClick={() => {
                      const newTodos = todos.map((todo, i) => {
                        if (i === index) {
                          todo.isEditing = true;
                        } else {
                          todo.isEditing = false;
                        }
                        return todo;
                      });
                      setTodos([...newTodos]);
                    }}
                    className="text-indigo-600 hover:text-indigo-700 focus:outline-none"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        const newTodos = todos.map((todo) => {
                          todo.isEditing = false;
                          return todo;
                        });
                        setTodos([...newTodos]);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {!todo.isEditing ? (
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-600 hover:text-red-700 focus:outline-none"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
