import type { NextPage } from "next";
import useWeb3Context from "@/context/hooks/useWeb3Context";
import config, { eip1271MagicValue } from "@/config";
import AppHeader from "@/components/AppHeader";
import { toast } from "react-toastify";
import sigUtil, { TypedDataUtils } from "@metamask/eth-sig-util";
import useWalletContract from "../contract/useWalletContract";
import useErc20Contract from "../contract/useErc20Contract";
import { useEffect, useState } from "react";

const spenderAddress = "0x11EeAD9FA8B7Bce9F883add2b5254d0d46764F9b";

const Home: NextPage = () => {
  const erc20Contract = useErc20Contract();
  const walletContract = useWalletContract();
  const [wethBalance, setWethBalance] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [allowance, setAllowance] = useState("");
  const { account, connectWallet, getEthBalance, web3 }: any = useWeb3Context();

  const getWethBalance = async () => {
    const res = await erc20Contract.balanceOf(config.contracts.weth);
    setWethBalance(res);
  };

  const doApprove = async () => {
    await erc20Contract.approve(config.contracts.weth, spenderAddress);
  };

  const doSendRaw = async () => {
    // @ts-ignore
    const res = await window?.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: "0xA43A022A6283b1d5CD602f3834C611074af85124",
          to: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
          data: "0x095ea7b3000000000000000000000000794a61358d6845594f94dc1db02a252b5b4814ad0000000000000000000000000000000000000000000000000000000000000064",
          value: "0x00",
          gasPrice: "0x06dac2c0",
        },
        {
          from: "0xA43A022A6283b1d5CD602f3834C611074af85124",
          to: "0x794a61358d6845594f94dc1db02a252b5b4814ad",
          data: "0x617ba037000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc80000000000000000000000000000000000000000000000000000000000000064000000000000000000000000a43a022a6283b1d5cd602f3834c611074af851240000000000000000000000000000000000000000000000000000000000000000",
          value: "0x00",
          gasPrice: "0x06dac2c0",
        },
      ],
    });

    console.log("send raw", res);
  };

  const doTransfer = async () => {
    await erc20Contract.transfer(
      config.contracts.weth,
      toAddress,
      transferAmount
    );
    getBalance();
    getWethBalance();
  };

  const getAllowance = async () => {
    const res = await erc20Contract.allowance(
      config.contracts.weth,
      spenderAddress
    );
    setAllowance(res);
  };

  const getBalance = async () => {
    setEthBalance(await getEthBalance());
  };

  useEffect(() => {
    if (!account) {
      return;
    }
    // setToAddress(account);

    getBalance();
    // test this later
    getWethBalance();
    getAllowance();
  }, [account]);

  return (
    <div>
      <div className="pb-32">
        <AppHeader />
        <div className="flex flex-col items-center justify-center h-full">
          {account ? (
            <>
              {/* <a className="btn mb-4">Connected</a> */}
              <div className="flex flex-col gap-4 mb-4">
                <div className="mb-1">
                  <h1 className="text-xl mb-1 font-medium">Terms</h1>
                  <textarea className="textarea w-full" placeholder="Terms" />
                </div>

                <div className="mb-4">
                  <h1 className="text-xl mb-2 font-medium"></h1>
                  <a className="btn" onClick={doApprove}>
                    Approve
                  </a>
                </div>
                <div className="mb-4">
                  <h1 className="text-xl mb-2 font-medium">Transfer WETH</h1>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      placeholder="To"
                      className="input input-bordered"
                      value={toAddress}
                      onChange={(e) => setToAddress(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Amount"
                      className="input input-bordered"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />

                    <a className="btn" onClick={doTransfer}>
                      Transfer
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <a className="btn mb-4 px-6 py-3" onClick={() => connectWallet()}>
                Connect Wallet
              </a>
            </>
          )}

          {account && (
            <div className="text-center">
              <div>
                Connected, your wallet address is{" "}
                <span className="text-blueDeep">{account}</span>
              </div>
              <div>
                Balance: <span className="text-blueDeep">{ethBalance}</span>{" "}
                ETH, <span className="text-blueDeep">{wethBalance}</span> WETH
              </div>
              <div>
                Allowance for {spenderAddress.slice(0, 4)}...
                {spenderAddress.slice(-4)}: {allowance} WETH
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
