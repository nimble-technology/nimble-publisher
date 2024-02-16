import yargs from "yargs";
import { hideBin } from "yargs/helpers";
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
} from "../constants/constants";

import { UpdatePredictions } from "../src/cli/UpdatePredictions";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const argv = yargs(hideBin(process.argv))
  .option("network", {
    description:
      "Network to relay on(string). e.g: Arbitrum/Avalanche/Binance/Ethereum/Optimism/Polygon",
    type: "string",
    required: false,
    default: "Binance",
  })
  .option("data", {
    description:
      "data for the prediction service(array), must be encode. e.g: 0x0000000...",
    type: "array",
    required: true,
  })
  .help()
  .alias("help", "h")
  .parserConfiguration({
    "parse-numbers": false,
  })
  .parseSync();

const nimbleAbi = [
  {
    inputs: [
      {
        internalType: "uint16",
        name: "chainId_",
        type: "uint16",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "PredictionFeedNotFound",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "chainId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "sequenceNumber",
        type: "uint64",
      },
    ],
    name: "BatchPredictionFeedUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "entityAddress",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "entityType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "publishTime",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "tags",
        type: "string[]",
      },
      {
        indexed: false,
        internalType: "int64",
        name: "reputationScore",
        type: "int64",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "modelID",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "string",
        name: "modelName",
        type: "string",
      },
    ],
    name: "PredictionFeedUpdate",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "entityAddress",
        type: "string",
      },
    ],
    name: "getPredictionFeed",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "entityAddress",
            type: "string",
          },
          {
            internalType: "enum NimbleStructs.Entity",
            name: "entity",
            type: "uint8",
          },
          {
            components: [
              {
                internalType: "string[]",
                name: "tags",
                type: "string[]",
              },
              {
                internalType: "uint64",
                name: "publishTime",
                type: "uint64",
              },
              {
                internalType: "int64",
                name: "reputationScore",
                type: "int64",
              },
            ],
            internalType: "struct NimbleStructs.Prediction",
            name: "prediction",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint8",
                name: "modelID",
                type: "uint8",
              },
              {
                internalType: "string",
                name: "modelName",
                type: "string",
              },
            ],
            internalType: "struct NimbleStructs.Model",
            name: "model",
            type: "tuple",
          },
        ],
        internalType: "struct NimbleStructs.PredictionFeed",
        name: "predictionFeed",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "updateData",
        type: "bytes[]",
      },
    ],
    name: "updatePredictionFeeds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const main = async () => {
  const updateCli = new UpdatePredictions(
    argv.network,
    JSON.stringify(nimbleAbi)
  );
  updateCli.updatePredictionFeeds(argv.data as string[]);
  console.log("update suc.");
};
main();
