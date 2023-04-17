import type { NextPage } from "next";
import useWeb3Context from "@/context/hooks/useWeb3Context";
import AppHeader from "@/components/AppHeader";
import { shortenAddress } from "../context/tools";
import { LoadingOutlined } from "@ant-design/icons";
import usePactFactory from "../contract/usePactFactory";
import { DatePicker } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";
import Contribute from "@/components/Contribute";

const Home: NextPage = () => {
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState([""]);
  const [rawEndDate, setRawEndDate] = useState();
  const [historyList, setHistoryList] = useState([{ foo: "bar" }]);
  const [activeTab, setActiveTab] = useState(0);
  const [endDate, setEndDate] = useState("");
  const { account, connectWallet }: any = useWeb3Context();
  const pactFactory = usePactFactory();

  const doCreate = async () => {
    await pactFactory.createPact(terms, endDate, amount, address);
    // console.log("aaa", terms, amount, endDate, address);
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
  };

  useEffect(() => {
    if (!account) {
      return;
    }
  }, [account]);

  const getHistoryList = async (skipLoading = false) => {
    if (!skipLoading) {
      setLoading(true);
    }
    const res: any = await pactFactory.getAllPacts();
    setHistoryList(res);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 1 && account) {
      getHistoryList();
    }
  }, [activeTab, account]);

  return (
    <div>
      <div className="pb-32">
        <AppHeader />
        <div className="flex flex-col items-center justify-center h-full max-w-[90%] mx-auto">
          {account ? (
            <>
              <div className="tabs tabs-boxed mb-6">
                <a
                  className={cn(
                    "tab tab-boxed tab-lg",
                    activeTab === 0 && "tab-active"
                  )}
                  onClick={() => setActiveTab(0)}
                >
                  Create
                </a>
                <a
                  className={cn(
                    "tab tab-boxed tab-lg",
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
                <div className="max-w-[90%] mx-auto">
                  {loading ? (
                    <div className="text-4xl mt-8">
                      <LoadingOutlined />
                    </div>
                  ) : (
                    <>
                      {historyList.map((item: any, index) => (
                        <div
                          className="card bg-base-100 shadow-xl mb-4"
                          key={index}
                        >
                          <div className="card-body break-words">
                              <h2 className="card-title font-mono mb-1 break-words tooltip"  data-tip={item.address}>
                                {item.address &&
                                  shortenAddress(item.address, 8)}
                              </h2>

                            <div>Balance: {item.balance} ETH</div>
                            <div>
                              Resolvable: {item.resolvable ? "Yes" : "No"}
                            </div>
                            <div>Resolved: {item.resolved ? "Yes" : "No"}</div>
                            <div>
                              <Contribute
                                address={item.address}
                                onContributed={() => getHistoryList(true)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <a
                className="btn absolute top-0 bottom-0 m-auto px-6 py-3"
                onClick={() => connectWallet()}
              >
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
