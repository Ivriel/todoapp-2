"use client";
import { FC, useState } from "react";
import { todoType } from "@/types/todoType";
import Todo from "./todo";
import AddTodo from "./AddTodo";
import {
  addTodo,
  deleteTodo,
  editTodo,
  toggleTodo,
} from "../actions/todoActions";

interface Props {
  todos: todoType[];
  // Karena kita menggunakan String ID (UUID/murni string), kita langsung mengirimkan string-nya saja.
  // Ini lebih aman dan konsisten karena semua ID di skema kita adalah string.
  userId: string;
}

const Todos: FC<Props> = ({ todos, userId }) => {
  // State to manage the list of todo items
  const [todoItems, setTodoItems] = useState<todoType[]>(todos);

  // Function to create a new todo item
  const createTodo = (title: string) => {
    const newId = crypto.randomUUID();
    // Menggunakan userId langsung karena sudah berupa string murni.
    addTodo(newId, title, userId);
    setTodoItems((prev) => [
      ...prev,
      {
        id: newId,
        title: title,
        createdAt: new Date(),
        done: false,
        userId: userId,
      },
    ]);
  };

  // Function to change the text of a todo item
  const changeTodoTitle = (id: string, title: string) => {
    setTodoItems((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title } : todo)),
    );
    editTodo(id, title);
  };

  // Function to toggle the "done" status of a todo item
  const toggleIsTodoDone = (id: string) => {
    setTodoItems((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
    toggleTodo(id);
  };

  // Function to delete a todo item
  const deleteTodoItem = (id: string) => {
    setTodoItems((prev) => prev.filter((todo) => todo.id !== id));
    deleteTodo(id);
  };

  // Rendering the Todo List component
  return (
    <main className="flex mx-auto max-w-xl w-full min-h-screen flex-col items-center p-16">
      <div className="text-5xl font-medium">To-do app</div>
      <div className="w-full flex flex-col mt-8 gap-2">
        {/* Mapping through todoItems and rendering Todo component for each */}
        {todoItems.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            changeTodoTitle={changeTodoTitle}
            toggleIsTodoDone={toggleIsTodoDone}
            deleteTodoItem={deleteTodoItem}
          />
        ))}
      </div>
      {/* Adding Todo component for creating new todos */}
      <AddTodo createTodo={createTodo} />
    </main>
  );
};

export default Todos;
