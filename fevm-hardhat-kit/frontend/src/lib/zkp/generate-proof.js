/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */

// this is copied from
// https://github.com/enricobottazzi/ZK-SBT-FrontEnd/blob/7bb8611215d6965da5cd632d0389a4450d9d1f2d/utils/generate-proof.js

const snarkjs = require("snarkjs");
const wc = require("./witness_calculator.js");

export default async function generateProof(claim, signature, wasm_buff, zkey_buff) {
  const claimArr = claim.split(",");
  const sig = signature.split(",");

  console.log(claimArr);
  console.log(sig);

  const pubKeyX = "9582165609074695838007712438814613121302719752874385708394134542816240804696";
  const pubKeyY = "18271435592817415588213874506882839610978320325722319742324814767882756910515";
  const claimSchema = "180410020913331409885634153623124536270";
  const slotIndex = 2;
  const operator = 3;
  const value = [
    18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  const input = {
    claim: claimArr,
    sigR8x: sig[0],
    sigR8y: sig[1],
    sigS: sig[2],
    pubKeyX,
    pubKeyY,
    claimSchema,
    slotIndex,
    operator,
    value,
  };

  const witnessCalculator = await wc(wasm_buff);
  const wtns_buff = await witnessCalculator.calculateWTNSBin(input, 0);

  const { proof, publicSignals } = await snarkjs.groth16.prove(zkey_buff, wtns_buff);

  const solidityCallData = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);

  const argv = solidityCallData.replace(/["[\]\s]/g, "").split(",");

  const a = [argv[0], argv[1]];
  const b = [
    [argv[2], argv[3]],
    [argv[4], argv[5]],
  ];
  const c = [argv[6], argv[7]];
  const pubInput = [];

  for (let i = 8; i < argv.length; i++) {
    pubInput.push(argv[i]);
  }

  const solidityProof = [a, b, c, pubInput];

  return solidityProof;
}
