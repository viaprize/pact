import useWeb3Context from "@/context/hooks/useWeb3Context";
import PactABI from "./abi/Pact.json";
import config from "@/config";
import Eth from "web3-eth";
import Web3 from "web3";

export default function usePactContract() {
  const { web3, account } = useWeb3Context();
  const eth = new Eth(new Web3.providers.HttpProvider(
    config.provider,
    {
      reconnect: {
        auto: true
      }
    }
  ));

  return {
    async resolved(pactAddress) {
      const pactContract = new eth.Contract(PactABI, pactAddress);

      return await pactContract.methods
        .resolved()
        .call({ from: account });
    },

    async resolvable(pactAddress) {
      const pactContract = new eth.Contract(PactABI, pactAddress);
      return await pactContract.methods
        .resolvable()
        .call({ from: account });
    },

    async balance(pactAddress) {
      const balance = await eth.getBalance(pactAddress);

      return web3.utils.fromWei(balance, 'ether');
    }
  };
}
