import {
    Box,
    Container,
    Flex,
    HStack,
    Icon,
    Image,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useRouter } from "next/router"
import { AiOutlineMenu } from "react-icons/ai"
import { FaGithub } from "react-icons/fa"

import { Head } from "@/components/Head"
import { routes } from "@/config/routes"

import configJsonFile from "../../../config.json"

export interface LayoutProps {
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter()

    return (
        <Flex
            minHeight={"100vh"}
            direction={"column"}
            bgGradient="linear(to-b, purple.100, purple.100)"
        >
            <Head />
            <Container as="section" maxW="8xl">
                <Box as="nav" py="4">
                    <HStack justify="space-between" alignItems={"center"} h="12">
                        <Link href="/">
                            <Image
                                src={"/assets/zkfication.png"}
                                alt="logo"
                                h="8"
                                rounded={configJsonFile.style.radius}
                            />
                        </Link>
                        <HStack spacing="4">
                            <ConnectButton
                                accountStatus={"address"}
                                showBalance={false}
                                chainStatus={"icon"}
                            />
                            <Menu>
                                <MenuButton aria-label="Options">
                                    <AiOutlineMenu />
                                </MenuButton>
                                <MenuList mt="2">
                                    {routes.map(({ path, name }) => {
                                        return (
                                            <MenuItem
                                                key={path}
                                                fontWeight={"medium"}
                                                fontSize={"sm"}
                                                onClick={() => {
                                                    router.push(path)
                                                }}
                                            >
                                                {name}
                                            </MenuItem>
                                        )
                                    })}
                                </MenuList>
                            </Menu>
                        </HStack>
                    </HStack>
                </Box>
            </Container>
            <Container maxW="lg" flex={1}>
                {children}
            </Container>
            <Container maxW="8xl">
                <Box as="nav" py="4">
                    <HStack justify={"right"}>
                        <HStack spacing={"4"}>
                            <Link href={configJsonFile.url.github} target={"_blank"}>
                                <Icon
                                    as={FaGithub}
                                    aria-label="github"
                                    color={configJsonFile.style.color.black.text.secondary}
                                    w={6}
                                    h={6}
                                />
                            </Link>
                        </HStack>
                    </HStack>
                </Box>
            </Container>
        </Flex>
    )
}
