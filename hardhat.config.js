require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.6",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.RINKEBY_PRIVATE_KEY]
    },
    hardhat: {
      chainId: 1337
    }
  }
};
