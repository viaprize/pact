import type { NextPage } from "next";
import useWeb3Context from "@/context/hooks/useWeb3Context";
import config, { eip1271MagicValue } from "@/config";
import AppHeader from "@/components/AppHeader";
import cn from "classnames";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState([""]);
  const [historyList, setHistoryList] = useState([{ foo: "bar" }]);
  const [activeTab, setActiveTab] = useState(0);
  const [endDate, setEndDate] = useState("");
  const { account, connectWallet }: any = useWeb3Context();

  const doCreate = async () => {};

  const onAddressChange = (index: number, value: string) => {
    setAddress((prev: any) => {
      prev[index] = value;
      return [...prev];
    });
  };

  const addAddress = () => {
    setAddress((prev) => {
      return [...prev, ""];
    });
  };

  const removeAddress = (index: number) => {
    console.log("remove index", index);
    setAddress((prev) => {
      const arr = JSON.parse(JSON.stringify(prev));
      arr.splice(index, 1);
      return [...arr];
    });
  };

  useEffect(() => {
    if (!account) {
      return;
    }
  }, [account]);

  return (
    <div>
      <div className="pb-32">
        <AppHeader />
        <div className="flex flex-col items-center justify-center h-full">
          {account ? (
            <>
              <div className="tabs tabs-boxed mb-6">
                <a
                  className={cn(
                    "tab tab-lifted tab-lg",
                    activeTab === 0 && "tab-active"
                  )}
                  onClick={() => setActiveTab(0)}
                >
                  Create
                </a>
                <a
                  className={cn(
                    "tab tab-lifted tab-lg",
                    activeTab === 1 && "tab-active"
                  )}
                  onClick={() => setActiveTab(1)}
                >
                  Preview
                </a>
              </div>

              {activeTab === 0 && (
                <>
                  <div className="flex flex-col gap-4 mb-4">
                    <div className="mb-1">
                      <h1 className="text-xl mb-1 font-medium">Terms</h1>
                      <textarea
                        className="textarea w-full"
                        placeholder="Terms"
                      />
                    </div>

                    <div className="mb-4">
                      <h1 className="text-xl mb-2 font-medium">
                        Amount and date
                      </h1>
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          placeholder="Amount"
                          className="input input-bordered"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Date"
                          className="input input-bordered"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <h1 className="text-xl mb-2 font-medium">Address</h1>

                      <div className="flex items-center gap-4 flex-col">
                        {address.map((item, index) => (
                          <div className="flex w-full gap-2" key={index}>
                            <input
                              type="text"
                              placeholder="Address"
                              className="input input-bordered w-full"
                              value={item}
                              onChange={(e) =>
                                onAddressChange(index, e.target.value)
                              }
                            />
                            {address.length > 1 && (
                              <button
                                className="btn"
                                onClick={() => removeAddress(index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button className="btn mt-4" onClick={addAddress}>
                        Add more
                      </button>
                    </div>

                    <div className="mb-4">
                      <h1 className="text-xl mb-2 font-medium"></h1>
                      <a className="btn w-full" onClick={doCreate}>
                        Create
                      </a>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 1 && (
                <>
                  {historyList.map((item, index) => (
                    <div key={index}>{item.foo}</div>
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              <a className="btn mb-4 px-6 py-3" onClick={() => connectWallet()}>
                Connect Wallet
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
