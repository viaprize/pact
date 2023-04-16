import useWeb3Context from "@/context/hooks/useWeb3Context";
import PactFactoryAbi from "./abi/PactFactory.json";
import usePactContract from "./usePactContract";
import AbiCoder from "web3-eth-abi";
import config from "@/config";
import Eth from "web3-eth";
import Web3 from "web3";

export default function usePactFactory() {
  const { web3, account, sendTx } = useWeb3Context();
  const { resolved, resolvable, balance } = usePactContract();

  const eth = new Eth(new Web3.providers.HttpProvider(
    config.provider,
    {
      reconnect: {
        auto: true
      }
    }
  ));

  return {
    async getAllPacts() {
      const logs = await eth.getPastLogs({
        fromBlock: 8106597,
        address: "0x642a7864cBe44ED24D408Cbc38117Cfd6E6D1a95",
        topics: ["0xe3758539c1bd6726422843471b2886c2d2cefd3b4aead6778386283e20a32a80"]
      });

      console.log(logs, config.contracts.pactFactory, config.eventSignatures.create);

      if (!logs || !logs.length) {
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

      const func = pactFactoryContract.methods.create(
        await pactFactoryContract.methods.commit(commitment).call({
          from: account
        }),
        duration,
        web3.utils.toWei(sum, "mwei"), 
        leads
      );
      return await sendTx(func);
    }
  };
}
