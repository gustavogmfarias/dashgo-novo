import { useQuery, UseQueryOptions } from "react-query";
import { api } from "../api";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type GetUsersResponse = {
  totalCount: number;
  users: User[];
};

export async function getUsers(page: number): Promise<GetUsersResponse> {
  //separei pra poder usar em algum momento sem precisar se preocupar com o useQuery.
  const { data, headers } = await api.get("users", { params: { page } });
  const totalCount = Number(headers["x-total-count"]);

  const users = data.users.map((user: User) => {
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

  return { users, totalCount };
}

export function useUsers(page: number, options: UseQueryOptions) {
  return useQuery(["users", page], () => getUsers(page), {
    staleTime: 1000 * 60 * 10, //10 minutos
    ...options,
  }); //passa o nome dela como primeiro parametro, aqui fica salvo no cash, seria uma chave. O segundo parâmetro é o método.

  //   /// em relação ao getserversiderender, último cap do chakra:
  //   // a) boto que o useusers vai receber algumas opções, com essas opções, podemos fazer com que o query receba todas as opções que o usequery tem, dentre elas a própria inital data.
  //   // b) tipo a options com UseQueryOptions;
  //   // c) recebo as options embaixo com um spread a fim de receber todas as props, inclusive o intialdata que está dentro do options.
}
