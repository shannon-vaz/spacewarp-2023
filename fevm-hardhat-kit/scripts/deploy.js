/**
 * Deploys a test set of contracts: PrivateSoulMinter, verifier
 */

const { ethers } = require("hardhat")

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

const main = async () => {
    console.log("Wallet Ethereum Address:", wallet.address)

    //deploy PrivateSoulMinter
    const PrivateSoulMinter = await ethers.getContractFactory("PrivateSoulMinter", wallet);
    console.log("Deploying PrivateSoulMinter...");
    const privateSoulMinter = await PrivateSoulMinter.deploy();
    await privateSoulMinter.deployed();
    console.log("PrivateSoulMinter deployed to:", privateSoulMinter.address);

    //deploy Verifier
    const Verifier = await ethers.getContractFactory("Verifier", wallet);
    console.log("Deploying Verifier...");
    const verifier = await Verifier.deploy();
    await verifier.deployed();
    console.log("Verifier deployed to:", verifier.address);
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    })