import React from "react";
import useWeb3Context from "@/context/hooks/useWeb3Context";
import { shortenAddress } from "@/context/tools";

export default function AppHeader() {
  const { account, connectWallet } = useWeb3Context();
  // temporary solution to skip ts check
  // const address = account || "";
  return (
    <header className="py-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="font-bold text-3xl">PACT</div>
        {account ? (
          <a className="btn px-3">{shortenAddress(account, 4)}</a>
        ) : (
          <a className="btn px-3" onClick={() => connectWallet()}>
            Connect Wallet
          </a>
        )}
      </div>
    </header>
  );
}
