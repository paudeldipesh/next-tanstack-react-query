"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Todo from "@/modals/todo";

const rootUrl = "http://localhost:8000/todos";

export default function Todos() {
  const queryClient = useQueryClient();

  const { isPending, isError, isSuccess, mutate } = useMutation({
    mutationFn: (newTodo: Todo) => {
      return axios.post(rootUrl, newTodo);
    },
    onMutate: () => console.log("A mutation is about to happen"),
    onError: (error) => console.log("Error", error.message),
    onSuccess: (data) => {
      console.log("Success", data);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { data: todos } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () => fetch(rootUrl).then((response) => response.json()),
  });

  return (
    <main className="mt-4 flex text-orange-400 min-h-screen flex-col justify-center items-center">
      {isPending ? (
        <div className="text-orange-400">Adding todo...</div>
      ) : (
        <div>
          {isError && <div className="text-orange-400">An error occurred</div>}
          {isSuccess && (
            <div className="text-orange-400 text-center">Todo added!</div>
          )}
        </div>
      )}
      <button
        onClick={() => {
          mutate({
            id: new Date().getTime(),
            title:
              "Dipesh Paudel is the richest person in the entire universe.",
          });
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Create Todo
      </button>
      <h1 className="text-3xl text-blue-500 mt-10 mb-7">
        Data from user Click.
      </h1>
      <ul className="flex flex-col gap-2">
        {todos?.slice(0, 5).map((todo: Todo) => {
          const { id, title } = todo;
          return (
            <li key={id} className="text-orange-500">
              {id} - {title}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
