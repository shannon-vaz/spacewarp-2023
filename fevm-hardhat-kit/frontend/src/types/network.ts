import networkJsonFile from "../../network.json"
import { valueOf } from "./helper/valueOf"

export type ChainId = keyof typeof networkJsonFile
export type NetworkConfig = valueOf<typeof networkJsonFile>

export const isChainId = (chainId: string): chainId is ChainId => {
    return Object.keys(networkJsonFile).includes(chainId)
}
