import useWeb3Context from "@/context/hooks/useWeb3Context";
import PactFactoryAbi from "./abi/PactFactory.json";
import usePactContract from "./usePactContract";
import AbiCoder from "web3-eth-abi";
import config from "@/config";

export default function usePactFactory() {
  const { web3, account, sendTx } = useWeb3Context();
  const { resolved, resolvable, balance } = usePactContract();

  return {
    async getAllPacts() {
      const logs = await web3.eth.getPastLogs({
        fromBlock: 8106597,
        address: config.contracts.pactFactory,
        topics: [config.eventSignatures.create]
      });

      if(!logs || !logs.length) {
        return []; 
      } 

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

    async createPact(
      commitment,
      duration, 
      sum, 
      leads 
    ) {
      const pactFactoryContract = new web3.eth.Contract(
        PactFactoryAbi, config.contracts.pactFactory
      );
    
      pactFactoryContract.method.create(commitment, duration,  web3.utils.toWei(sum, "mwei"), leads)

      const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
      const func = tokenContract.methods.transfer(
        toAddress,
        web3.utils.toWei(amount, "mwei")
      );
      return await sendTx(func);
      return;
    }
  };
}
