/**
 * Mint a soul bound token to holder
 */
const { ethers } = require("hardhat");
const input = require("./input.json");

const private_key = network.config.accounts[0];
const wallet = new ethers.Wallet(private_key, ethers.provider);

async function main() {
    const provider = ethers.provider;
    const priorityFee = await provider.send("eth_maxPriorityFeePerGas");
    let collector = wallet.address;

    const SOULMINTER_ADDR = "0xffa7CA1AEEEbBc30C874d32C7e22F052BbEa0429"; // To add

    // fetch signature data from input.json
    const { sigR8x, sigR8y, sigS } = input;

    let privateSoulMinter = await ethers.getContractFactory("PrivateSoulMinter", wallet)
        .then(f => f.attach(SOULMINTER_ADDR));
    let to = collector
    let metaURI = "https://bafybeibodo3cnumo76lzdf2dlatuoxtxahgowxuihwiqeyka7k2qt7eupy.ipfs.nftstorage.link/"
    let claimHashMetadata = ethers.utils.solidityKeccak256(["uint", "uint", "uint"], [sigR8x, sigR8y, sigS])
    let receipt = await privateSoulMinter.mint(to, metaURI, claimHashMetadata, {
        gasLimit: 1000000000,
        maxPriorityFeePerGas: priorityFee
    }).then(tx => tx.wait());

    let tokenId = receipt.events?.filter((x) => { return x.event == "Transfer" })[0].topics[3]
    console.log(`# Private SBT minted to ${to}, with TokenID: ${tokenId}`)
}

main().then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(-1);
    })
