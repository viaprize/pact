import useWeb3Context from "@/context/hooks/useWeb3Context";
import PactFactoryAbi from "./abi/PactFactory.json";
import usePactContract from "./usePactContract";
import AbiCoder from "web3-eth-abi";
import config from "@/config";

export default function usePactFactory() {
  const { web3, account, sendTx } = useWeb3Context();
  const { resolved, resolvable, balance } = usePactContract();
  // const pactFactoryContract = new web3.eth.Contract(
  //   PactFactoryAbi, config.contracts.pactFactory
  // );

  return {
    async getAllPacts() {
      const logs = await web3.eth.getPastLogs({
        address: config.contracts.pactFactory,
        topics: [config.eventSignatures.create]
      });

      const pactAddresses = logs.map((eventLog) => {
        return AbiCoder.decodeParameter("address", eventLog.data);
      });

      const pacts = [];

      for (const address of pactAddresses) {
        pacts.push({
          resolved: await resolved(address),
          resolvable: await resolvable(address),
          balance: await balance(address),
          address: address
        });
      }

      return pacts;
    },

    async createPact() {
      //add create logic
      return;
    }
  };
}
