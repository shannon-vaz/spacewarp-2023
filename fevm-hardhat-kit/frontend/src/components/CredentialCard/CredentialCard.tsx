import { Box, HStack, Stack, Text } from "@chakra-ui/react";

import { Credential } from "@/types/Credential";

export type CredentialProps = Credential;

export const CredentialCard: React.FC<CredentialProps> = ({ issuer, credentialType, operator, value }) => {
  return (
    <Box bgGradient="linear(to-br, black, gray.600)" border={"2px"} borderColor={"gray.100"} rounded="2xl">
      <Stack p="4" mb="20">
        <Text fontSize="md" color={"white"}>
          {credentialType}
        </Text>
        <Text fontSize="x-small" color={"white"}>
          Issuer: {issuer}
        </Text>
      </Stack>
      <HStack p="4" alignItems="center" margin={"0"} spacing="1">
        <Text fontSize="x-small" color={"white"}>
          {operator}
        </Text>
        <Text fontSize="x-small" color={"white"}>
          {value}
        </Text>
      </HStack>
    </Box>
  );
};
