import { Stack, Text } from "@chakra-ui/react"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { Button, Modal, Steps } from "antd"

import { CredentialCard } from "@/components/CredentialCard"
import { Layout } from "@/components/Layout"
import { Unit } from "@/components/Unit"
import { useConnected } from "@/hooks/useConnected"
import generateProofQuery from "@/lib/zkp/generate-proof-query.js"
import { generateProof } from "@/api"
import { Credential } from "@/types/Credential"
import { getJSDocTypeParameterTags } from "typescript"
import { sleep } from "@/lib/utils"

const { Step } = Steps

const HolderPage: NextPage = () => {
    const { connected } = useConnected()
    const [credentials, setCredentials] = useState<Credential[]>([])
    const [showModal, setShowModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [modal, contextHolder] = Modal.useModal()
    const [modal2Open, setModal2Open] = useState(false)

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
            console.log("calculate zk proof...")
            const holder = connected.signerAddress;
            const proofQuery = generateProofQuery();
            const proof = await generateProof(holder, proofQuery);
            console.log(proof)
            await sleep(1500);
            setProof(proof)

            console.log(connected)
            console.log("Verify with verifier contract", connected.verifier.address)
            const result = await connected.verifier.verifyProof(proof.a, proof.b, proof.c, proof.public)
            await sleep(1500);
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
            return 2
        } else if (proof) {
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
                                                    <Step title="Generating Proof" description="Generating ZK proof to prove membership" />
                                                    <Step title="Submitting Proof" description="Submitting proof to on-chain verifier contract" />
                                                    <Step title="Proof Verified" description="ZK proof was verified on chain" />
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
