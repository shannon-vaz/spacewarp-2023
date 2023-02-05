import { Button, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import { Layout } from "@/components/Layout";
import { routes } from "@/config/routes";

import configJsonFile from "../../config.json";

const IssuePage: NextPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <Stack px="4" py="4" spacing="6">
        <Image src="/assets/icon.png" maxW={"xs"} mx="auto" alt="hero" />
        <Stack spacing={"0"}>
          <Text fontSize={"4xl"} textAlign={"center"} fontWeight={"bold"} color={configJsonFile.style.color.accent}>
            zkSBT
          </Text>
          <Text fontSize={"md"} textAlign={"center"} fontWeight={"bold"} color={configJsonFile.style.color.accent}>
            Privacy Preserved Onchain Identity
          </Text>
        </Stack>
        <HStack>
          {routes.map(({ path, name }) => {
            return (
              <Button
                key={path}
                w="full"
                onClick={() => {
                  router.push(path);
                }}
              >
                {name} App
              </Button>
            );
          })}
        </HStack>
      </Stack>
    </Layout>
  );
};

export default IssuePage;
