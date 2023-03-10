//import { Button, FormControl, FormLabel, Input, Stack, Text } from "@chakra-ui/react"
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from "@chakra-ui/react"
import { ethers } from "ethers"
import { NextPage } from "next"
import { useEffect, useState } from "react"

import { Layout } from "@/components/Layout"
import { Unit } from "@/components/Unit"
import { useConnected } from "@/hooks/useConnected"
import { useErrorHandler } from "@/hooks/useErrorHandler"
import { sleep } from "@/lib/utils"
import { generateClaim } from "@/api"

const CreatePage: NextPage = () => {
    const { connected } = useConnected()

    const [credentialType] = useState("SP Organisation Membership claim")
    const [valueType] = useState("Number")
    const [operator] = useState("Greater than Equal")

    const [value, setValue] = useState<string>("18")
    const [mintToAddress, setMintToAddress] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [alreadyMinted, setAlreadyMinted] = useState(false)

    const { handle } = useErrorHandler()

    useEffect(() => {
        if (!connected) {
            setMintToAddress("")
            return
        }
        console.log(connected)
        setMintToAddress(connected.signerAddress)
        connected.privateSoulMinter.souls(connected.signerAddress).then((tokenId: any) => {
            setAlreadyMinted(tokenId.gt(0))
        })
    }, [connected])

    return (
        <Layout>
            <br />
            <br />
            <br />
            <br />
            <Unit header={"Claim Issuer App"}>
                <br />
                <Stack>
                    <Stack spacing="6">
                        <Stack>
                            <FormControl>
                                <FormLabel>Credential Type</FormLabel>
                                <Input value={credentialType} disabled fontSize="sm" />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Mint To</FormLabel>
                                <Input
                                    value={mintToAddress}
                                    fontSize={"xs"}
                                    onChange={(e) => setMintToAddress(e.target.value)}
                                />
                            </FormControl>
                        </Stack>
                        <Button
                            isLoading={isLoading}
                            disabled={!connected || !mintToAddress || alreadyMinted}
                            onClick={async () => {
                                try {
                                    if (!connected) {
                                        throw new Error("not connected")
                                    }
                                    setIsLoading(true)
                                    const parsedValue = Number(value)

                                    console.log("input value...")
                                    console.log("credentialType", credentialType)
                                    console.log("valueType", valueType)
                                    console.log("operator", operator)
                                    console.log("value", parsedValue)

                                    await sleep(1000)

                                    const nftMetadataURI =
                                        "https://bafybeih5bmem6o324vucawr6dzoccofnvkp43elklbzplaau6jr3os63au.ipfs.nftstorage.link/metadata.txt"
                                    console.log(
                                        "NFT metadata with public info is stored in IPFS",
                                        nftMetadataURI
                                    )

                                    await sleep(3000)
                                    console.log("claim and signature data to be stored off-chain")
                                    const claim = await generateClaim(mintToAddress)
                                    console.log("claim", claim)
                                    const signature = [claim.sigR8x, claim.sigR8y, claim.sigS]
                                    console.log("signature", signature)
                                    await sleep(1000)

                                    const claimHash = ethers.utils.solidityKeccak256(
                                        ["uint", "uint", "uint"],
                                        signature
                                    )
                                    console.log(
                                        "hash of signature to be stored on-chain with SBT",
                                        claimHash
                                    )

                                    await sleep(1000)

                                    console.log("now requesting to mint SBTs")
                                    const tx = await connected.privateSoulMinter.mint(
                                        mintToAddress,
                                        nftMetadataURI,
                                        claimHash
                                    )
                                    console.log(tx.hash)
                                } catch (e) {
                                    handle(e)
                                } finally {
                                    setIsLoading(false)
                                }
                            }}
                        >
                            {!connected && "Connect Wallet"}
                            {connected && !alreadyMinted && "Mint"}
                            {connected && alreadyMinted && "Already Minted"}
                        </Button>
                    </Stack>
                </Stack>
            </Unit>
        </Layout>
    )
}

export default CreatePage
