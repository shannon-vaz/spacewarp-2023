// Utils massively borrowed from https://github.com/vplasencia/zkSudoku/blob/5cec0250a23778c873012db06dfa360fef3045d1/contracts/test/utils/utils.js#L3

const snarkjs = require("snarkjs")
const fs = require("fs")
const path = require("path")

const wc = require("./witness_calculator.js")
const MODULE_PATH = path.dirname(__dirname)
const WASM_PATH = path.join(__dirname, "./circuit.wasm")
const ZKEY_PATH = path.join(__dirname, "./circuit_final.zkey")

const generateWitness = async (inputs) => {
    const buffer = fs.readFileSync(WASM_PATH)
    const witnessCalculator = await wc(buffer)
    const buff = await witnessCalculator.calculateWTNSBin(inputs, 0)
    return buff
}

const getZkeyBuff = async () => {
    const buffer = fs.readFileSync(ZKEY_PATH)
    return buffer
}

const generateSolidityProof = async (input) => {
    const wtns_buff = await generateWitness(input)
    const zkey_buff = await getZkeyBuff()
    const { proof, publicSignals } = await snarkjs.groth16.prove(zkey_buff, wtns_buff)

    let solidityCallData = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals)

    const argv = solidityCallData.replace(/["[\]\s]/g, "").split(",")

    const a = [argv[0], argv[1]]
    const b = [
        [argv[2], argv[3]],
        [argv[4], argv[5]],
    ]
    const c = [argv[6], argv[7]]
    const public = []

    for (let i = 8; i < argv.length; i++) {
        public.push(argv[i])
    }

    return { a, b, c, public }
}

module.exports = {
    generateSolidityProof,
}
