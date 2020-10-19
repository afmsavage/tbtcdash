const ethers = require('ethers');
const KeepBonding = require("@keep-network/keep-ecdsa/artifacts/KeepBonding.json")
const infura = '8461f7340a2a42d2b670eba6bcbd5e9f'

module.exports = async function (context, req) {
    try {
        const provider = new ethers.providers.InfuraProvider('homestead', infura);
        let addr;
        try {
            addr = ethers.utils.getAddress(req.query.wallet)
        } catch (err) {
            console.error(`No address supplied: ${err}`)
        }
        const keepBondingContract = new ethers.Contract(KeepBonding.networks["1"].address, KeepBonding.abi, provider);
        const available = await keepBondingContract.unbondedValue(addr)
        context.res = {
            body: `ETH available for bonding: ${ethers.utils.formatEther(available)}`
        }
    } catch (err) {
        console.error(`Could not authorize: ${err.message}`)
    }
}
