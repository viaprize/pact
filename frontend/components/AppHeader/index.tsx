import React from "react";
import useWeb3Context from "@/context/hooks/useWeb3Context";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

export default function AppHeader() {
  const { account } = useWeb3Context();
  // temporary solution to skip ts check
  const address = account || "";
  return (
    <header className="py-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="font-bold text-3xl">PACT</div>
        {account && (
          <div className="flex items-center gap-2">
            <Jazzicon diameter={32} seed={jsNumberForAddress(account)} />
            <div className="text-sm">
              {address.slice(0, 4)}...{address.slice(-4)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
