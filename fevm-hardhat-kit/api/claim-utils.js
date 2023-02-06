const fs = require("fs")
const fsPromises = require("fs/promises")
const { spawnSync } = require("child_process")
const ethers = require("ethers");

const { generateSolidityProof } = require("./iden3/solidity-proof-generator.js")
const ISSUER_BIN_PATH = "./bin/issuer"
const GENERATED_CLAIMS_PATH = "./generated-claims"

async function generateClaim(holder) {
    console.log("generating claim for holder", holder)
    if (claimExists(holder)) {
        console.log("claim already exists, getting existing claim");
        const signedClaim = await getClaim(holder)
        return signedClaim
    }
    const issuer = spawnSync(ISSUER_BIN_PATH)
    const signedClaim = issuer.stdout.toString()
    await saveClaim(signedClaim, holder)
    return JSON.parse(signedClaim)
}

async function getClaim(holder) {
    console.log("fetching claim for holder", holder)
    if (!claimExists(holder)) {
      throw Error("claim does not exist for holder", holder);
    }
    const claim = await fsPromises.readFile(claimPathForHolder(holder), "utf-8")
    return JSON.parse(claim);
}

async function generateProof(holder, query) {
  const claim = await getClaim(holder);
  const input = {
    ...claim,
    ...query
  }
  const proof = await generateSolidityProof(input);
  return proof;
}

function isValidHolder(holder) {
  return ethers.isAddress(holder);
}

function claimExists(holder) {
  return fs.existsSync(claimPathForHolder(holder))
}

async function saveClaim(claim, holder) {
    await fsPromises.writeFile(claimPathForHolder(holder), claim, "utf-8")
    console.log("claim saved for holder", holder)
}

function claimPathForHolder(holder) {
    return `${GENERATED_CLAIMS_PATH}/${holder}-sp-org-member.json`
}


module.exports = {
  generateClaim,
  getClaim,
  generateProof,
  isValidHolder
}