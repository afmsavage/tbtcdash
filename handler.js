'use strict';

const ethers = require('ethers');

const BondedECDSAKeepFactory = require("./abis/BondedECDSAKeepFactory.json")
const BondedECDSAKeep = require("./abis/BondedECDSAKeep.json")
const TBTCSystem = require("./abis/TBTCSystem.json")
const TBTCDepositToken = require("./abis/TBTCDepositToken.json");
const DepositLog = require("./abis/DepositLog.json");
const Deposit = require("./abis/Deposit.json");

const states = require('./states.js')
const testAddr = '0x0CF6F3D138236fbc7B831a976942bF8D3907C550'
const infura = '8461f7340a2a42d2b670eba6bcbd5e9f'
let tdtArray = []
module.exports.findTdts = async (event,wallet) => {
  try {
    const ip = new ethers.providers.InfuraProvider('homestead', infura);
    const opAddr = testAddr.toLowerCase();

    //const keepFactory = new ethers.Contract(TBTCSystem.networks["1"].address, BondedECDSAKeepFactory.abi, ip);
    const ecdsaKFContract = new ethers.Contract(BondedECDSAKeepFactory.networks["1"].address, BondedECDSAKeepFactory.abi, ip);
    const tbtcSysContract = new ethers.Contract(TBTCSystem.networks["1"].address, TBTCSystem.abi, ip);
    const tdtContract = new ethers.Contract(TBTCDepositToken.networks["1"].address, TBTCDepositToken.abi, ip);
    const depositLogContract = new ethers.Contract(TBTCSystem.networks["1"].address, DepositLog.abi, ip);

    const keeps = await ecdsaKFContract.queryFilter(ecdsaKFContract.filters.BondedECDSAKeepCreated());
    const targetKeeps = keeps.filter(ev => { return ev.args[1].filter(ms => { return ms.toLowerCase() === opAddr}).length > 0 }).map(ev => { return ev.args[0]; });

    for (let addr of targetKeeps) {
            const k = new ethers.Contract(addr, BondedECDSAKeep.abi, ip);
            const tdt = await depositLogContract.queryFilter(depositLogContract.filters.Created(null, addr));
            if (tdt.length < 1) { continue; }
            const d = new ethers.Contract(tdt[0].args[0], Deposit.abi, ip);
            const depositState = states[await d.currentState()];
            //const keepActive = (await k.isActive()) ? "active" : "inactive";
            //const depositActive = (await d.inActive()) ? "active" : "inactive";

            tdtArray.push(`keep ${addr} manages TDT ${d.address} (${ethers.utils.formatEther(await d.lotSizeTbtc())} tBTC) with state: ${depositState}`);
    }
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
      },
      body: JSON.stringify(tdtArray)
    };
    console.log(tdtArray);
    return response;
} catch(err) {
    console.error(`Could not authorize: ${err.message}`)
    process.exit(1)
}
}