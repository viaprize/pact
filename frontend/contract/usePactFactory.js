import useWeb3Context from "@/context/hooks/useWeb3Context";
import usePactContract from "./usePactContract";
import config from "@/config/op-goerli.js";
import PactABI from "./abi/Pact.json";
import AbiCoder from "web3-eth-abi";

export default function useErc20Contract() {
  const { web3, account } = useWeb3Context();
  const { resolved, resolvable, balance } = usePactContract();

  return {
    async getAllPacts() {
      const logs = await web3.eth.getPastLogs({
        address: config.contracts.pactFactory, 
        topics: [config.eventSignatures.create]
      });

      const pactAddresses = logs.map((eventLog) => {
        return AbiCoder.decodeParameter("address", eventLog.data);
      });
    
      return pactAddresses.map((address) => {
        return {
          resolved: await resolved(address),
          resolvable: await resolvable(address),
          balance: await balance(address), 
          address: address
        }
      });
    }
  };
}
