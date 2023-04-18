import React, { useEffect } from "react";
import { shortenAddress } from "@/context/tools";
import Contribute from "../Contribute";
import axios from "../../lib/axios";
import config from "@/config";

export default function HistoryItem({ address, item, onContributed }: any) {
  const getDetail = async () => {
    const res = await axios.get("/pact", {
      params: {
        address,
      },
    });

    console.log("111111", res);
  };

//   useEffect(() => {

//     if (!address) {
//       return;
//     }
//     getDetail();
//   }, [address]);
  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body break-words">
        <a href={`${config.scanUrl}/address/${address}`} rel="noreferrer" target="_blank">
          <h2 className="card-title font-mono mb-1 break-words">{address}</h2>
        </a>
        <div>Balance: {item.balance} ETH</div>
      <div>Resolvable: {item.resolvable ? "Yes" : "No"}</div>
      <div>Resolved: {item.resolved ? "Yes" : "No"}</div>
        <div>
          <Contribute address={address} onContributed={onContributed} />
        </div>
      </div>
    </div>
  );
}
