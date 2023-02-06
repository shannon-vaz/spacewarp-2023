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
    Text,
    textDecoration,
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
        <Flex minHeight={"100vh"} direction={"column"} bgColor="gray.100">
            <Head />
            <Container as="section" maxW="8xl">
                <Box as="nav" py="4" px="8">
                    <HStack justify="space-between" alignItems={"center"} h="12">
                        <Link href="/">
                            <HStack>
                                <Image
                                    src={"/assets/zkfication.png"}
                                    alt="logo"
                                    h="10"
                                    rounded={configJsonFile.style.radius}
                                />
                            </HStack>
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
            <Container maxW="2xl" flex={3} height="8xl">
                {children}
            </Container>
        </Flex>
    )
}
