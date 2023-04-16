import type { NextPage } from "next";
import useWeb3Context from "@/context/hooks/useWeb3Context";
import config, { eip1271MagicValue } from "@/config";
import AppHeader from "@/components/AppHeader";
import usePactFactory from "../contract/usePactFactory";
import { DatePicker } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");
  const [address, setAddress] = useState([""]);
  const [rawEndDate, setRawEndDate] = useState();
  const [historyList, setHistoryList] = useState([{ foo: "bar" }]);
  const [activeTab, setActiveTab] = useState(0);
  const [endDate, setEndDate] = useState("");
  const { account, connectWallet }: any = useWeb3Context();
  const pactFactory = usePactFactory();

  const doCreate = async () => {
    console.log("aaa", terms, amount, endDate, address);
  };

  const onAddressChange = (index: number, value: string) => {
    setAddress((prev: any) => {
      prev[index] = value;
      return [...prev];
    });
  };

  const addAddress = () => {
    setAddress((prev: string[]) => {
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

  const dateChange = (val: any) => {
    setRawEndDate(val);
    const timestamp = val.unix();
    setEndDate(timestamp);
    // setEndDate(val.unix())
  };

  useEffect(() => {
    if (!account) {
      return;
    }
  }, [account]);

  const getHistoryList = async () => {
    const res = await pactFactory.getAllPacts();
    console.log("rrr", res);
  };

  useEffect(() => {
    if (activeTab === 1 && account) {
      console.log("aaa", account);
      getHistoryList();
    }
  }, [activeTab, account]);

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
                      <h1 className="text-xl mb-2 font-medium">Amount</h1>
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          placeholder="Amount"
                          className="input input-bordered"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />

                        <DatePicker
                          value={rawEndDate}
                          showTime
                          style={{ height: "48px" }}
                          onChange={(val: any) => dateChange(val)}
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
                    <div className="card w-96 bg-base-100 shadow-xl">
                      <div className="card-body">
                        <h2 className="card-title">Card title!</h2>
                        <p>If a dog chews shoes whose shoes does he choose?</p>
                      </div>
                    </div>
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
