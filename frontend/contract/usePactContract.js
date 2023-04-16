import useWeb3Context from "@/context/hooks/useWeb3Context";
import PactABI from "./abi/Pact.json";

export default function useErc20Contract() {
  const { web3, account } = useWeb3Context();

  return {
    async resolved(tokenAddress) {
      const tokenContract = new web3.eth.Contract(PactABI, tokenAddress);

      return await tokenContract.methods
        .resolved()
        .call({ from: account });
    },

    async resolvable(tokenAddress) {
      const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
      return await tokenContract.methods
        .resolvable()
        .call({ from: account });
    },

    async balance(pactAddress) {
      const balance = await web3.eth.getBalance(pactAddress);

      return web3.utils.fromWei(balance, 'ether');
    }
  };
}
