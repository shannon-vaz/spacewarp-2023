require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
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
