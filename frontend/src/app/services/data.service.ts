import { Injectable } from "@angular/core";
import { ethers } from "ethers";

const BondedECDSAKeepFactory = require("@keep-network/keep-ecdsa/artifacts/BondedECDSAKeepFactory.json");
const TBTCSystem = require("@keep-network/tbtc/artifacts/TBTCSystem.json");

@Injectable({
  providedIn: "root",
})
export class DataService {

  public async getWeight(): Promise<number | null> {
    try {
      const ip = new ethers.providers.InfuraProvider(
        "homestead",
        process.env.INFURA_API
      );

      const ecdsaKFContract = new ethers.Contract(
        BondedECDSAKeepFactory.networks["1"].address,
        BondedECDSAKeepFactory.abi,
        ip
      );
      const tbtcSysContract = new ethers.Contract(
        TBTCSystem.networks["1"].address,
        TBTCSystem.abi,
        ip
      );

      const weight = await ecdsaKFContract.getSortitionPoolWeight(
        tbtcSysContract.address
      );
      console.log(`pool weight ${weight}`);
      return weight;
    } catch (err) {
      console.error(`Could not authorize: ${err.message}`);
      return null;
    }
  }
}
