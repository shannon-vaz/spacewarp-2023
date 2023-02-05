import { getDefaultWallets } from "@rainbow-me/rainbowkit"
import { Chain, configureChains, createClient } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import ethers from "ethers"
// import { filecoinHyperspace } from "wagmi/chains";

import networkJsonFile from "../../../network.json"

const supportedChains: Chain[] = Object.entries(networkJsonFile)
    .filter(([, chain]) => {
        if (process.env.NODE_ENV === "production") {
            return chain.env !== "localhost"
        } else {
            return true
        }
    })
    .sort(([, a], [, b]) => {
        return a.index - b.index
    })
    .map(([chainId, network]) => {
        console.log(chainId, network)
        return {
            id: Number(chainId),
            name: network.name,
            network: network.key,
            iconUrl: `/assets/chains/${network.icon}`,
            nativeCurrency: {
                decimals: 18,
                name: network.currency,
                symbol: network.currency,
            },
            rpcUrls: {
                default: network.rpc,
            },
            blockExplorers: {
                default: { name: network.explorer.name, url: network.explorer.url },
            },
            testnet: true,
        }
    })

console.log(supportedChains)

const { chains, provider } = configureChains(supportedChains, [publicProvider()])

console.log(chains)

export interface RainbowWeb3AuthConnectorProps {
    chains: Chain[]
}

const { connectors } = getDefaultWallets({
    appName: "ShinkaWallet",
    chains,
})

export { chains }

export const wagmiClient = createClient({
    connectors,
    provider,
})
