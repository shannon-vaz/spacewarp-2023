const express = require("express")
const { isValidHolder, generateClaim, getClaim, generateProof } = require("./claim-utils")

const router = express.Router()

/**
 * Generates a claim for holder
 * Returns existing claim for holder if exists
 */
router.post("/generate-claim", async (req, res) => {
    const { to: holder } = req.body
    if (!holder) {
        return res.status(400).json({
            error: "Expecting property 'to' in request body representing holder",
        })
    }
    if (!isValidHolder(holder)) {
        return res.status(400).send({
            error: "Bad value for 'to'",
        })
    }
    const signedClaim = await generateClaim(holder)
    return res.status(200).json(signedClaim)
})

/**
 * Get existing claim for holder
 */
router.get("/claim/:holder", async (req, res) => {
    const { holder } = req.params
    if (!isValidHolder(holder)) {
        return res.status(400).send({
            error: "Bad value for holder",
        })
    }
    try {
        const claim = await getClaim(holder)
        return res.status(200).send(claim)
    } catch (error) {
        return res.status(400).send({
            error: error.toString(),
        })
    }
})

/**
 * Generates zk proof from claim based on verifier query
 */
router.post("/generate-proof/:holder", async (req, res) => {
    const { holder } = req.params
    if (!isValidHolder(holder)) {
        return res.status(400).send({
            error: "Bad value for holder",
        })
    }
    const proofQuery = req.body
    try {
        console.log(`generating proof for holder ${holder}`)
        console.log(`proof query = ${JSON.stringify(proofQuery, null, 2)}`)
        const proof = await generateProof(holder, proofQuery)
        console.log("proof generated")
        return res.status(200).send({
            proof,
        })
    } catch (error) {
        console.log("error while generating proof", error)
        return res.status(400).json({
            error: "Could not generate proof",
        })
    }
})

module.exports = router
