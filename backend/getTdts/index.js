
const ethers = require('ethers');
const BondedECDSAKeepFactory = require("@keep-network/keep-ecdsa/artifacts/BondedECDSAKeepFactory.json")
const BondedECDSAKeep = require("@keep-network/keep-ecdsa/artifacts/BondedECDSAKeep.json")
const TBTCSystem = require("@keep-network/tbtc/artifacts/TBTCSystem.json")
const TBTCDepositToken = require("@keep-network/tbtc/artifacts/TBTCDepositToken.json");
const DepositLog = require("@keep-network/tbtc/artifacts/DepositLog.json");
const Deposit = require("@keep-network/tbtc/artifacts/Deposit.json");

const states = require('./states.js')
const infura = '8461f7340a2a42d2b670eba6bcbd5e9f'

module.exports = async function (context, req) {
    try {
        const provider = new ethers.providers.InfuraProvider('homestead', infura);
        const opAddr = req.query.wallet.toLowerCase();

        //const keepFactory = new ethers.Contract(TBTCSystem.networks["1"].address, BondedECDSAKeepFactory.abi, provider);
        const ecdsaKFContract = new ethers.Contract(BondedECDSAKeepFactory.networks["1"].address, BondedECDSAKeepFactory.abi, provider);
        const tbtcSysContract = new ethers.Contract(TBTCSystem.networks["1"].address, TBTCSystem.abi, provider);
        const tdtContract = new ethers.Contract(TBTCDepositToken.networks["1"].address, TBTCDepositToken.abi, provider);
        const depositLogContract = new ethers.Contract(TBTCSystem.networks["1"].address, DepositLog.abi, provider);

        const keeps = await ecdsaKFContract.queryFilter(ecdsaKFContract.filters.BondedECDSAKeepCreated());
        const targetKeeps = keeps.filter(ev => { return ev.args[1].filter(ms => { return ms.toLowerCase() === opAddr }).length > 0 }).map(ev => { return ev.args[0]; });
        const tdtArray = [];
        for (let addr of targetKeeps) {
            const k = new ethers.Contract(addr, BondedECDSAKeep.abi, provider);
            const tdt = await depositLogContract.queryFilter(depositLogContract.filters.Created(null, addr));
            if (tdt.length < 1) { continue; }
            const d = new ethers.Contract(tdt[0].args[0], Deposit.abi, provider);
            const depositState = states[await d.currentState()];
            //const keepActive = (await k.isActive()) ? "active" : "inactive";
            //const depositActive = (await d.inActive()) ? "active" : "inactive";

            tdtArray.push(`keep ${addr} manages TDT ${d.address} (${ethers.utils.formatEther(await d.lotSizeTbtc())} tBTC) with state: ${depositState}
            `);
        }
        context.res = {
            body: tdtArray
        }

    } catch (err) {
        console.error(`Could not authorize: ${err.message}`)
    }
}


// try {
//     const provider = new ethers.providers.InfuraProvider('homestead', infura);
//     const opAddr = req.query.wallet.toLowerCase();

//     //const keepFactory = new ethers.Contract(TBTCSystem.networks["1"].address, BondedECDSAKeepFactory.abi, provider);
//     const ecdsaKFContract = new ethers.Contract(BondedECDSAKeepFactory.networks["1"].address, BondedECDSAKeepFactory.abi, provider);
//     const tbtcSysContract = new ethers.Contract(TBTCSystem.networks["1"].address, TBTCSystem.abi, provider);
//     const tdtContract = new ethers.Contract(TBTCDepositToken.networks["1"].address, TBTCDepositToken.abi, provider);
//     const depositLogContract = new ethers.Contract(TBTCSystem.networks["1"].address, DepositLog.abi, provider);

//     const keeps = await ecdsaKFContract.queryFilter(ecdsaKFContract.filters.BondedECDSAKeepCreated());
//     const targetKeeps = keeps.filter(ev => { return ev.args[1].filter(ms => { return ms.toLowerCase() === opAddr }).length > 0 }).map(ev => { return ev.args[0]; });
//     const tdtArray = [];
//     for (let addr of targetKeeps) {
//         const k = new ethers.Contract(addr, BondedECDSAKeep.abi, provider);
//         const tdt = await depositLogContract.queryFilter(depositLogContract.filters.Created(null, addr));
//         if (tdt.length < 1) { continue; }
//         const d = new ethers.Contract(tdt[0].args[0], Deposit.abi, provider);
//         const depositState = states[await d.currentState()];
//         //const keepActive = (await k.isActive()) ? "active" : "inactive";
//         //const depositActive = (await d.inActive()) ? "active" : "inactive";

//         tdtArray.push(`keep ${addr} manages TDT ${d.address} (${ethers.utils.formatEther(await d.lotSizeTbtc())} tBTC) with state: ${depositState}`);
//     }
//     context.res = {
//         body: tdtArray
//     }

// } catch (err) {
//     console.error(`Could not authorize: ${err.message}`)
// }
