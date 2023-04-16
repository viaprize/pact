import React, { useState } from "react";
import useWeb3Context from "@/context/hooks/useWeb3Context";

export default function Contribute({ address, onContributed }: any) {
  const { web3, account }: any = useWeb3Context();
  const [amount, setAmount] = useState("");
  const doContribute = async () => {
    const res = await web3.eth.sendTransaction({
      to: address,
      from: account,
      value: web3.utils.toWei(amount, "ether"),
      data: "0x",
    });
    onContributed();
  };
  return (
    <div className="flex gap-2 flex-wrap">
      <input
        type="text"
        placeholder="Amount"
        className="input input-bordered"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button className="btn" onClick={() => doContribute()}>
        Contribute
      </button>
    </div>
  );
}
