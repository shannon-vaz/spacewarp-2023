import { Button, Stack, Text } from "@chakra-ui/react"
import { NextPage } from "next"
import { useEffect, useState } from "react"

import { CredentialCard } from "@/components/CredentialCard"
import { Layout } from "@/components/Layout"
import { Unit } from "@/components/Unit"
import { useConnected } from "@/hooks/useConnected"
import { getFileBuffer } from "@/lib/utils"
import { getClaim } from "@/lib/zkp/claim"
import generateProof from "@/lib/zkp/generate-proof"
import { getSignature } from "@/lib/zkp/sig"
import { Credential } from "@/types/Credential"

const HolderPage: NextPage = () => {
    const { connected } = useConnected()
    const [credentials, setCredentials] = useState<Credential[]>([])

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!connected) {
            setCredentials([])
            return
        }
        connected.privateSoulMinter.souls(connected.signerAddress).then((tokenId) => {
            if (tokenId.gt(0)) {
                // this should check metadata and private data
                // hardcode for temp
                setCredentials([
                    {
                        issuer: connected.signerAddress,
                        credentialType: "Age Verification",
                        operator: ">=",
                        value: "18",
                    },
                ])
            } else {
                setCredentials([])
            }
        })
    }, [connected])

    const calculateProofAndVerify = async () => {
        try {
            if (!connected) {
                throw new Error("not connected")
            }
            setIsLoading(true)

            // this is hard codeded for this hackathon, this should be stored safe place
            const claim = getClaim()
            console.log("Claim", claim)

            const signature = getSignature()
            console.log("signature", signature)

            console.log("calculate zk proof...")

            const wasmBuff = await getFileBuffer(`${window.location.origin}/zkp/circuit.wasm`)
            const zkeyBuff = await getFileBuffer(`${window.location.origin}/zkp/circuit_final.zkey`)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const proof = (await generateProof(claim, signature, wasmBuff, zkeyBuff)) as any
            console.log(...proof)
            const [a, b, c, pubInput] = proof
            console.log(connected)
            console.log("Verify with verifier contract", connected.verifier.address)
            const result = await connected.verifier.verifyProof(a, b, c, pubInput)
            console.log("Your identity is verified on-chain with ZKP!!", result)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Layout>
            <Unit header={"zkSBT Holder App"}>
                <Stack spacing="4">
                    <Stack>
                        <Stack spacing="1">
                            <Text fontSize="xs" fontWeight={"bold"}>
                                Sample zkSBT
                            </Text>
                            <Text fontSize="x-small" color="accent">
                                * This is mock data for better demo
                            </Text>
                        </Stack>
                        <CredentialCard
                            issuer={"0x29893eEFF38C5D5A1B2F693e2d918e618CCFfdD8"}
                            credentialType="Blockchain Week Taipei Attendee"
                            operator={"="}
                            value={"True"}
                        />
                    </Stack>
                    {credentials.length > 0 && (
                        <Stack>
                            <Stack spacing="1">
                                <Text fontSize="xs" fontWeight={"bold"}>
                                    zkSBT in Wallet
                                </Text>
                                <Text fontSize="x-small" color="accent">
                                    * Only one credential is allowed per wallet for easy demo
                                </Text>
                            </Stack>
                            <Stack>
                                {credentials.map((credential, i) => {
                                    return (
                                        <Stack key={i}>
                                            <CredentialCard
                                                issuer={credential.issuer}
                                                credentialType={credential.credentialType}
                                                operator={credential.operator}
                                                value={credential.value}
                                            />
                                            <Button
                                                isLoading={isLoading}
                                                onClick={calculateProofAndVerify}
                                            >
                                                Calculate Proof and Verify
                                            </Button>
                                        </Stack>
                                    )
                                })}
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            </Unit>
        </Layout>
    )
}

export default HolderPage
