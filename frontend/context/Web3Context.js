import React, { useState, createContext, useCallback } from "react";
import { toast } from "react-toastify";
import Web3 from "web3";
import BN from "bignumber.js";
import useWeb3Modal from "./hooks/useWeb3Modal";
import { LoadingOutlined } from "@ant-design/icons";

const scanMapping = {
  56: "https://bscscan.com",
};

const actionMapping = [
  "Transaction being processed",
  "Transaction Success",
  "Transaction Failed",
];

export const Web3Context = createContext({
  web3: null,
  chainId: null,
  networkId: null,
  blockNumber: null,
  account: null,
  connectWallet: async () => {},
  connectSoul: async () => {},
  getEthBalance: async () => {
    return "";
  },
  resetWallet: async () => {},
  estimateGas: async () => {},
  sendTx: async () => {},
  signMessage: async (val) => {
    return "";
  },
});

export const Web3ContextProvider = ({
  // chainId,
  // endpoint,
  children,
}) => {
  const web3Modal = useWeb3Modal();
  const [web3, setWeb3] = useState("");
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [networkId, setnetworkId] = useState("");
  const [blockNumber, setBlockNumber] = useState("");

  const listenProvider = () => {
    window.ethereum.on("connect", (data) => {
      console.log("event connect", data);
    });
    window.ethereum.on("disconnect", (data) => {
      console.log("event disconnect", data);
    });
    window.ethereum.on("close", (data) => {
      console.log("close", data);
      resetWallet();
    });
    window.ethereum.on("accountsChanged", async (accounts) => {
      console.log("account changed", accounts);
      setAccount(accounts[0]);
    });
    window.ethereum.on("chainChanged", (chainId) => {
      setChainId(parseInt(chainId, 16));
    });
  };

  const connectWallet = useCallback(async () => {
    try {
      // const provider = await web3Modal.connect();

      // const provider = await detectEthereumProvider();
      const web3Raw = new Web3(window.ethereum);
      // const web3Raw = new Web3(provider);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWeb3(web3Raw);
      // get account, use this variable to detech if user is connected
      // const accounts = await web3Raw.eth.getAccounts();
      console.log("after get accounts", accounts[0]);
      setAccount(accounts[0]);

      // get network id
      setnetworkId(await web3Raw.eth.net.getId());

      const foo = await web3Raw.eth.getChainId();
      // get chain id
      setChainId(foo);

      // init block number
      setBlockNumber(await web3Raw.eth.getBlockNumber());

      console.log("blocknumber", await web3Raw.eth.getBlockNumber());

      if (window.ethereum) {
        listenProvider();
      }
    } catch (error) {
      // setWeb3(new Web3(endpoint));
      console.log(error);
    }
  }, [web3Modal]);

  const connectSoul = useCallback(async () => {
    try {
      if (window.soul.enable) {
        window.soul.enable();
      }

      const web3Raw = new Web3(window.soul);

      setWeb3(web3Raw);

      // get account, use this variable to detech if user is connected
      const accounts = await web3Raw.eth.getAccounts();
      setAccount(accounts[0]);

      // get network id
      setnetworkId(await web3Raw.eth.net.getId());

      // get chain id
      setChainId(await web3Raw.eth.getChainId());

      // init block number
      setBlockNumber(await web3Raw.eth.getBlockNumber());
    } catch (error) {
      // setWeb3(new Web3(endpoint));
      console.log(error);
    }
  }, []);

  const getEthBalance = async () => {
    const res = await web3.eth.getBalance(account);
    return new BN(res).shiftedBy(-18).toString();
  };

  const resetWallet = useCallback(async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    setAccount("");
    await web3Modal.clearCachedProvider();
  }, [web3Modal]);

  const estimateGas = async (func, value = 0) => {
    try {
      const gas = await func.estimateGas({
        from: account,
        value,
      });
      return Math.floor(gas * 1.2);
    } catch (error) {
      console.log("errr", error);
      const objStartIndex = error.message.indexOf("{");
      toast.error(error.message.slice(0, objStartIndex));
    }
  };

  const signMessage = async (message) => {
    return await web3.eth.personal.sign(message, account);
  };

  const goScan = (txnHash) => {
    window.open(`${scanMapping[chainId]}/tx/${txnHash}`);
  };

  /**
   *
   * @param {*} func , required
   * @param {*} actionType , required
   * @param {*} value , default 0
   * @returns
   */

  const sendTx = async (func, value = 0) => {
    const gasLimit = await estimateGas(func, value);
    if (!isNaN(gasLimit)) {
      return func
        .send({
          gas: gasLimit,
          from: account,
          value,
        })
        .on("transactionHash", (txnHash) => {
          toast.info(actionMapping[0], {
            toastId: txnHash,
            icon: <LoadingOutlined />,
            autoClose: false,
            onClick: () => goScan(txnHash),
          });
        })
        .on("receipt", async (receipt) => {
          console.log("receipt is", receipt);
          const txnHash = receipt?.transactionHash;
          toast.dismiss(txnHash);
          toast.success(actionMapping[1], {
            // toastId: txnHash,
            onClick: () => goScan(txnHash),
          });
        })
        .on("error", async (err, txn) => {
          const txnHash = txn?.transactionHash;
          await toast.dismiss(txnHash);

          if (err.code === 4001) {
            toast.error("User canceled action");
          } else {
            toast.error(actionMapping[2], {
              onClick: () => goScan(txnHash),
            });
          }
        });
    }
  };

  // take back this logic when we have soul option on web3modal
  // useEffect(() => {
  //   // trigger auto connect
  //   if (!web3Modal) {
  //     return;
  //   }
  //   connectWallet();
  // }, [web3Modal]);

  return (
    <Web3Context.Provider
      value={{
        web3,
        chainId,
        networkId,
        account,
        blockNumber,
        connectSoul,
        connectWallet,
        getEthBalance,
        resetWallet,
        estimateGas,
        sendTx,
        signMessage,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const Web3ContextConsumer = Web3Context.Consumer;
