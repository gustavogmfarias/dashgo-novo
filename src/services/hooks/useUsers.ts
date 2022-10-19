import { useQuery } from "react-query";
import { api } from "../api";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export async function getUsers(): Promise<User[]> {
  //separei pra poder usar em algum momento sem precisar se preocupar com o useQuery.
  const { data } = await api.get("users");

  const users = data.users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: new Date(user.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
  });

  return users;
}

export function useUsers() {
  return useQuery<User[]>(
    "users",
    getUsers,
    { staleTime: 1000 * 5 } //5 segundos
  ); //passa o nome dela como primeiro parametro, aqui fica salvo no cash, seria uma chave. O segundo parâmetro é o método.
}
