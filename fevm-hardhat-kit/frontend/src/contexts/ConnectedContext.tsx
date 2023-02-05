import { ethers } from "ethers"
import { createContext, useEffect, useState } from "react"
import { ChainDoesNotSupportMulticallError, useAccount, useNetwork, useSigner } from "wagmi"

import privateSoulMinterAbi from "../ethereum/PrivateSoulMinter.json"
import verifierAbi from "../ethereum/PrivateSoulMinter.json"
import networkJsonFile from "../../network.json"
import { ChainId, isChainId, NetworkConfig } from "../types/network"

const PRIVATESOULMINTER = {
    address: "0x2a810409872AfC346F9B5b26571Fd6eC42EA4849",
    abi: privateSoulMinterAbi.abi,
}

const VERIFIER = {
    address: "0xb9bEECD1A582768711dE1EE7B0A1d582D9d72a6C",
    abi: verifierAbi.abi,
}

export interface ConnectedContextValue {
    chainId: ChainId
    provider: ethers.providers.Provider
    signer: ethers.Signer
    signerAddress: string
    networkConfig: NetworkConfig
    verifier: ethers.Contract
    privateSoulMinter: ethers.Contract
}

export interface ConnectedContext {
    connected?: ConnectedContextValue
}

export const defaultConnectedContextValue = {}

export const ConnectedContext = createContext<ConnectedContext>(defaultConnectedContextValue)

export interface ConnectedContextProviderProps {
    children: React.ReactNode
}

export const ConnectedContextProvider: React.FC<ConnectedContextProviderProps> = ({ children }) => {
    const { chain } = useNetwork()
    const { data: signer } = useSigner()
    const { address } = useAccount()
    const [connected, setConnected] = useState<ConnectedContextValue>()
    useEffect(() => {
        async function setup() {
            console.log(chain, signer, address)
            if (!chain || !signer || !signer.provider || !address) {
                console.log("true")
                setConnected(undefined)
                return
            }
            const chainId = String(chain.id)
            if (!isChainId(chainId)) {
                return
            }

            console.log(signer)
            const provider = signer.provider
            console.log(provider)
            const networkConfig = networkJsonFile[chainId]
            const signerAddress = address
            console.log(signerAddress)

            const privateSoulMinter = new ethers.Contract(
                PRIVATESOULMINTER.address,
                PRIVATESOULMINTER.abi,
                provider
            )
            console.log(privateSoulMinter)
            const verifier = new ethers.Contract(VERIFIER.address, VERIFIER.abi, provider)

            setConnected({
                chainId,
                provider,
                signer,
                signerAddress,
                networkConfig,
                privateSoulMinter,
                verifier,
            })
        }
        setup()
    }, [chain, signer, address])
    return <ConnectedContext.Provider value={{ connected }}>{children}</ConnectedContext.Provider>
}
