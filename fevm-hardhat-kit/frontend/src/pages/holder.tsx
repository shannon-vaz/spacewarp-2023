import { Stack, Text } from "@chakra-ui/react"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { Button, Modal, Steps } from "antd"

import { CredentialCard } from "@/components/CredentialCard"
import { Layout } from "@/components/Layout"
import { Unit } from "@/components/Unit"
import { useConnected } from "@/hooks/useConnected"
import { getFileBuffer } from "@/lib/utils"
import { getClaim } from "@/lib/zkp/claim"
import generateProof from "@/lib/zkp/generate-proof"
import { getSignature } from "@/lib/zkp/sig"
import { Credential } from "@/types/Credential"
import { getJSDocTypeParameterTags } from "typescript"

const { Step } = Steps

const HolderPage: NextPage = () => {
    const { connected } = useConnected()
    const [credentials, setCredentials] = useState<Credential[]>([])
    const [showModal, setShowModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [modal, contextHolder] = Modal.useModal()
    const [modal2Open, setModal2Open] = useState(false)

    const [claim, setClaim] = useState("")
    const [signature, setSignature] = useState("")
    const [result, setResult] = useState()
    const [proof, setProof] = useState()
    const [verified, setVerified] = useState(false)

    useEffect(() => {
        if (!connected) {
            setCredentials([])
            return
        }
        connected.privateSoulMinter.souls(connected.signerAddress).then((tokenId) => {
            if (tokenId.gt(0)) {
                setCredentials([
                    {
                        issuer: connected.signerAddress,
                        credentialType: "Member of SP Organization",
                        operator: "=",
                        value: "True",
                    },
                ])
            } else {
                setCredentials([])
            }
        })
    }, [connected])

    const calculateProofAndVerify = async () => {
        setModal2Open(true)
        try {
            if (!connected) {
                throw new Error("not connected")
            }
            setIsLoading(true)

            const claim = getClaim()
            setClaim(claim)
            console.log("Claim", claim)

            const signature = getSignature()
            setSignature(signature)
            console.log("signature", signature)

            console.log("calculate zk proof...")

            const wasmBuff = await getFileBuffer(`${window.location.origin}/zkp/circuit.wasm`)
            const zkeyBuff = await getFileBuffer(`${window.location.origin}/zkp/circuit_final.zkey`)

            const proof = (await generateProof(claim, signature, wasmBuff, zkeyBuff)) as any
            console.log(...proof)
            setProof(proof)
            const [a, b, c, pubInput] = proof
            console.log(connected)
            console.log("Verify with verifier contract", connected.verifier.address)
            const result = await connected.verifier.verifyProof(a, b, c, pubInput)
            setResult(result)
            setVerified(true)
            console.log("Your identity is verified on-chain with ZKP!!", result)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const getStep = () => {
        if (result) {
            return 3
        } else if (proof) {
            return 2
        } else if (signature) {
            return 1
        }
        return 0
    }

    return (
        <Layout>
            <br />
            <Unit header={"Claim Holder"}>
                <Stack spacing="4">
                    {credentials.length > 0 && (
                        <Stack>
                            <Stack spacing="1"></Stack>
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

                                            <br />
                                            <Button
                                                type="primary"
                                                onClick={calculateProofAndVerify}
                                            >
                                                {!result && "Calculate Proof and Verify"}
                                                {result && "Proof is Verified"}
                                            </Button>
                                            <Modal
                                                title="Calculating and Verifying Proof"
                                                centered
                                                open={modal2Open}
                                                onOk={() => setModal2Open(false)}
                                                onCancel={() => setModal2Open(false)}
                                                width="5000"
                                                footer={null}
                                            >
                                                <Steps current={getStep()}>
                                                    <Step title="Obtaining Claim" description="" />
                                                    <Step
                                                        title="Obtaining Signature"
                                                        description=""
                                                    />
                                                    <Step title="Generating Proof" description="" />

                                                    <Step title="Proof Verified" description="" />
                                                </Steps>
                                            </Modal>
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
