import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

export function Profile() {
  return (
    <Flex align="Center">
      <Box mr="4" textAlign="right">
        <Text>Gustavo</Text>
        <Text color="gray.300" fontSize="small">
          gustavogmfarias@gmail.com
        </Text>
      </Box>
      <Avatar
        size="md"
        name="Gustavo Goulart"
        src="http://localhost:5000/avatar/1dd74b8d752bd4b43498a45c956ce0c8-perfil.jpg"
      />
    </Flex>
  );
}
