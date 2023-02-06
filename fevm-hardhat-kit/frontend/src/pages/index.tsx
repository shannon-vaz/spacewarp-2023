//import { Button, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react"
import { Button, Flex, Heading, Image, Stack, Text, useBreakpointValue } from "@chakra-ui/react"
import { NextPage } from "next"
import { useRouter } from "next/router"

import { Layout } from "@/components/Layout"
import { routes } from "@/config/routes"

import configJsonFile from "../../config.json"

const IssuePage: NextPage = () => {
    const router = useRouter()

    return (
        <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
            <Flex p={8} flex={1} align={"center"} justify={"center"}>
                <Stack spacing={6} w={"full"} maxW={"lg"}>
                    <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                        <Text
                            as={"span"}
                            position={"relative"}
                            _after={{
                                content: "''",
                                width: "full",
                                height: useBreakpointValue({ base: "20%", md: "30%" }),
                                position: "absolute",
                                bottom: 1,
                                left: 0,
                                bg: "blue.400",
                                zIndex: -1,
                            }}
                        >
                            Freelance
                        </Text>
                        <br />{" "}
                        <Text color={"blue.400"} as={"span"}>
                            Design Projects
                        </Text>{" "}
                    </Heading>
                    <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
                        The project board is an exclusive resource for contract work. It's perfect
                        for freelancers, agencies, and moonlighters.
                    </Text>
                    <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                        {routes.map(({ path, name }) => {
                            return (
                                <Button
                                    key={path}
                                    w="full"
                                    onClick={() => {
                                        router.push(path)
                                    }}
                                    rounded={"full"}
                                    bg={"blue.400"}
                                    color={"white"}
                                    _hover={{
                                        bg: "blue.500",
                                    }}
                                >
                                    {name}
                                </Button>
                            )
                        })}
                    </Stack>
                </Stack>
            </Flex>
            <Flex flex={1}>
                <Image
                    src="/assets/zkfication.png"
                    maxW={"small"}
                    maxH={"xl"}
                    //objectFit={"cover"}
                    mx="auto"
                    alt="hero"
                    marginY={"auto"}
                />
            </Flex>
        </Stack>
    )
}

export default IssuePage
