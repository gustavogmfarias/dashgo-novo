import { createServer, Factory, Model, Response } from "miragejs";
import { faker } from "@faker-js/faker";

type User = {
  name: string;
  email: string;
  created_at: string;
};

export function makeServer() {
  const server = createServer({
    models: {
      user: Model.extend<Partial<User>>({}),
    },

    factories: {
      user: Factory.extend({
        // é o gerador , a fábrica de dados a partir de um model la de cima.
        name(i: number) {
          return `User ${i + 1}`; //retorna a palavra User + o "i" + 1
        },
        email() {
          return faker.internet.email().toLowerCase(); //gera um email falso
        },
        createdAt() {
          return faker.date.recent(10); //gera uma data falsa, recente, de  10 dias a partir da data atual
        },
      }),
    },

    seeds(server) {
      server.createList("user", 200); //cria 200 usuários do factory user
    },

    routes() {
      this.namespace = "api";
      this.timing = 750;

      this.get("/users", function (schema, request) {
        //estende a funcionalidade com uma função, recebendo o schema e request.
        const { page = 1, per_page = 10 } = request.queryParams; //page é qual pagina está e perPage a quantidade por página. Coloquei o padrão de page 1 e 10 per page.

        const total = schema.all("user").length; //.all é um metodo proprio do schema. Quero saber quantos tem dentro do total.

        const pageStart = (Number(page) - 1) * Number(per_page); //é para calcular em qual registro começa a pagina. b) tem que converter par number porque as querys são strigs. c) Tira 1 porque se você está na pagina 1 por exemplo, vocÊ tem que começar do registro 0, a pagina que você está você pega os registros "anteriores", d) Multiplica com o perpage para saber onde começar. Ou seja, se está na pagina um, o primeiro dado é o 0. Se está na pagina 2, 2-1 = 1 * 10, você vai ocmeçar a pegar os dados da página 10.

        const pageEnd = pageStart + Number(per_page); // O último dado da página vai ser sempre o começo, por exemplo, se você escolhou page 2 com 10 por pagina, os dados vão começar no "10" e serão exibidos até 10+ perpage, que no caso é 10. Ou seja, exibirá da posição 10 a posição 20

        const users = this.serialize(schema.all("user")).users.slice(
          pageStart,
          pageEnd
        ); //o schema.all ele não retorna o array de usuários, ele retorna um objeto que tem o array "users". b) o slice corta entre o pagestart e o page end.

        //c) Sobre a serialização, é o que permite ao mirage controlar os dados.

        return new Response(200, { "x-total-count": String(total) }, { users }); // a) Poderia retornar direto os usuários, mas a documentação do mirage e como terá headers, é preciso retorna de forma diferente, usando esse response. É um padrão que metadados se retorne via headers, no caso, x-total-count é um header padrão da comunidade, mas pode usar o nome que quiser, o primeiro é o status e o último é o body users. b) Esse response é importado do mirage.
      });
      this.post("/users");

      this.namespace = "";
      this.passthrough();
    },
  });

  return server;
}
