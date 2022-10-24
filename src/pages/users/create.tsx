import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { api } from "../../services/api";

type CreateUserFormData = {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
};

const createUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  email: yup
    .string()
    .required("E-mail é obrigatório")
    .email("Coloque um e-mail válido"),
  password: yup
    .string()
    .required("Senha é obrigatório")
    .min(6, "A senha precisa ter no mínimo 6 caracteres"),
  passwordConfirmation: yup
    .string()
    .oneOf([null, yup.ref("password")], "As senhas precisam ser iguais"),
});

export default function CreateUser() {
  const createUser = useMutation(async (user: CreateUserFormData) => {
    const response = await api.post("users", {
      user: {
        ...user,
        created_at: new Date(),
      },
    });

    return response.data.user;
  });
  // Sobre o UseMutation:
  // a) aqui não crio uma chave com no usequery, aqui eu passo direto qual função eu quero usar.
  // b) coloco os dados do usuário, no caso, com já tem "pronto", vindo da função "handleCreateUser", eu recebo os dados na função, tipo com o CreateUserFormData,
  //e dentro do objeto user do corpo da função, eu envio todos os dados "...user"
  // c) como no mirage tem um campo chamado created_at e não quero configurar  omirage todo,
  // e essa informação n vem do campo form, eu coloco ela no ...user.
  // d) coloco created_at com underline porque o serializer vai fazer a conversão automática para createdAt. No front enviamos com underline e no back usamos com camelCase(CreatedAt), eo mirage age automaticamente
  // e) envio a data atual.
  // f) retorno o usário cadastro, mas geralmente não precisa quadno é inserção

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });
  const { errors } = formState;

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (
    values
  ) => {
    await createUser.mutateAsync(values);
  };

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Criar usuário
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="name"
                type="text"
                label="Nome completo"
                error={errors.name}
                {...register("name")}
              />
              <Input
                name="email"
                type="email"
                label="E-mail"
                error={errors.email}
                {...register("email")}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="password"
                type="password"
                label="Senha"
                error={errors.password}
                {...register("password")}
              />
              <Input
                name="passwordConfirmation"
                type="password"
                label="Confirmação da senha"
                error={errors.passwordConfirmation}
                {...register("passwordConfirmation")}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify={["center", "flex-end"]}>
            <Stack spacing="4" direction={["column", "row"]}>
              <Link href="/users" passHref>
                <Button as="a" colorScheme="whiteAlpha">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                colorScheme="pink"
                isLoading={formState.isSubmitting}
              >
                Salvar
              </Button>
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
