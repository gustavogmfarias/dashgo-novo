import { createServer, Factory, Model } from "miragejs";
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

      this.get("/users");
      this.post("/users");

      this.namespace = "";
      this.passthrough();
    },
  });

  return server;
}
