"use client";
import { useQuery } from "@tanstack/react-query";
import Todo from "@/modals/todo";

interface User {
  id: number;
  name: string;
}

export default function Home() {
  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/todos").then((response) =>
        response.json()
      ),
    select: (todos) =>
      todos.map((todo) => ({ id: todo.id, title: todo.title })),
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/users").then((response) =>
        response.json()
      ),
    select: (users) => users.map((user) => ({ id: user.id, name: user.name })),
  });

  if (isLoading)
    return (
      <main className="mt-4 flex min-h-screen flex-col justify-center text-5xl items-center">
        Data is loading...
      </main>
    );

  if (isError)
    return (
      <main className="mt-4 flex min-h-screen flex-col justify-center text-5xl items-center">
        <h1 className="text-red-500">Something went wrong.</h1>
      </main>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl text-blue-500 mb-7">Todos from an API.</h1>
      <ul className="flex flex-col gap-2">
        {todos?.slice(0, 5).map((todo: Todo) => (
          <li key={todo.id as React.Key} className="text-gray-200 capitalize">
            {String(todo.id)}. {todo.title}
          </li>
        ))}
      </ul>
      <h1 className="text-3xl text-blue-500 mt-10 mb-7">Users from an API.</h1>
      <ul className="flex flex-col gap-2">
        {users?.slice(0, 5).map((user: User) => (
          <li key={user.id} className="text-orange-500">
            {user.id}. {user.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
