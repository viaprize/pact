import React, { useEffect, useState } from "react";
import Contribute from "../Contribute";
import config from "@/config";

export default function HistoryItem({ address, item, onContributed }: any) {
  const [detail, setDetail] = useState<any>({});
  const getDetail = async () => {};

  useEffect(() => {
    if (!address) {
      return;
    }
    getDetail();
  }, [address]);
  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body break-words">
        <div className="card-title break-words">{item.name}</div>
        <div className="mt-1">Terms: {item.terms}</div>
        <div className="mt-1">Balance: {item.balance} ETH</div>
        <a
          href={`${config.scanUrl}/address/${item.address}`}
          rel="noreferrer"
          className="font-mono mt-1 underline"
          target="_blank"
        >
          <h2>{item.address}</h2>
        </a>
        {/* <div>Resolvable: {item.resolvable ? "Yes" : "No"}</div>
        <div>Resolved: {item.resolved ? "Yes" : "No"}</div> */}
        <div>
          <Contribute address={item.address} onContributed={onContributed} />
        </div>
      </div>
    </div>
  );
}
