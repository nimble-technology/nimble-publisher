import { ethers } from "ethers";
import {
  BNB_ENDPOINT,
  USER_WALLET_PRIVATE_KEY,
  ARBITRUM_ENDPOINT,
  AVAX_ENDPOINT,
  ETHEREUM_ENDPOINT,
  OPTIMISM_ENDPOINT,
  POLYGON_ENDPOINT,
  BNB_CONTRACT,
  ARBITRUM_CONTRACT,
  AVAX_CONTRACT,
  ETHEREUM_CONTRACT,
  OPTIMISM_CONTRACT,
  POLYGON_CONTRACT,
} from "../../constants/constants";

export class UpdatePredictions {
  private network: string;
  private abi_str: string;

  constructor(network_: string, abi_str_: string) {
    this.network = network_;
    this.abi_str = abi_str_;
  }

  async updatePredictionFeeds(data: string[]) {
    if (data.length == 0) {
      console.log("data is tmpty");
      return;
    }
    let endPoints: string;
    let contractAddr: string;
    console.log(this.network);
    if (this.network === "Arbitrum") {
      endPoints = ARBITRUM_ENDPOINT;
      contractAddr = ARBITRUM_CONTRACT;
    } else if (this.network === "Avalanche") {
      endPoints = AVAX_ENDPOINT;
      contractAddr = AVAX_CONTRACT;
    } else if (this.network === "Binance") {
      endPoints = BNB_ENDPOINT;
      contractAddr = BNB_CONTRACT;
    } else if (this.network === "Ethereum") {
      endPoints = ETHEREUM_ENDPOINT;
      contractAddr = ETHEREUM_CONTRACT;
    } else if (this.network === "Optimism") {
      endPoints = OPTIMISM_ENDPOINT;
      contractAddr = OPTIMISM_CONTRACT;
    } else if (this.network === "Polygon") {
      endPoints = POLYGON_ENDPOINT;
      contractAddr = POLYGON_CONTRACT;
    } else {
      console.log("network does not support");
      return;
    }

    const providerLocal = new ethers.providers.JsonRpcProvider(endPoints);
    const privateKey = USER_WALLET_PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, providerLocal);

    // update
    const ContractAddress = contractAddr;
    const _Contract = new ethers.Contract(
      ContractAddress,
      JSON.parse(this.abi_str),
      wallet
    );

    await _Contract.updatePredictionFeeds(data);
    console.log("updatePredictionFeeds suc");
  }
}
