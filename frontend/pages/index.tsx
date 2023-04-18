import type { NextPage } from "next";
import useWeb3Context from "@/context/hooks/useWeb3Context";
import AppHeader from "@/components/AppHeader";
import axios from "../lib/axios";
import { LoadingOutlined } from "@ant-design/icons";
import usePactFactory from "../contract/usePactFactory";
import { DatePicker } from "antd";
import cn from "classnames";
import { useEffect, useState } from "react";
import Contribute from "@/components/Contribute";
import HistoryItem from "@/components/HistoryItem";

const tabs = ["about", "create", "preview"];

const Home: NextPage = () => {
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");
  const [projectName, setProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState([""]);
  const [rawEndDate, setRawEndDate] = useState();
  const [historyList, setHistoryList] = useState([{ foo: "bar" }]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [endDate, setEndDate] = useState("");
  const { account, connectWallet }: any = useWeb3Context();
  const pactFactory = usePactFactory();

  const doCreate = async () => {
    setCreating(true);
    try {
      const res: any = await pactFactory.createPact(
        terms,
        endDate,
        amount,
        address
      );
      // await axios.post("/pact", {
      //   name: projectName,
      //   terms: terms,
      //   address: res.events.Create.returnValues[0],
      //   transactionHash: res.transactionHash,
      //   blockHash: res.blockHash,
      // });
    } catch (err) {
      setCreating(false);
    }
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
    if (activeTab === tabs[2] && account) {
      getHistoryList();
    }
  }, [activeTab, account]);

  return (
    <div>
      <div className="pb-32">
        <AppHeader />
        <div className="flex flex-col items-center justify-center h-full max-w-[90%] mx-auto">
          <div className="tabs tabs-boxed mb-6">
            {tabs.map((item: string) => (
              <a
                key={item}
                className={cn(
                  "tab tab-boxed tab-lg capitalize",
                  activeTab === item && "tab-active"
                )}
                onClick={() => setActiveTab(item)}
              >
                {item}
              </a>
            ))}
          </div>

          {activeTab === tabs[0] && (
            <div className="max-w-[90%] mx-auto text-xl  p-8 card bg-base-100 shadow-xl text-gray-700">
              <p className="font-bold">
                Pactsmith.com is a platform to deploy{" "}
                <a
                  target="_blank"
                  className="underline"
                  rel="noreferrer"
                  href="https://en.wikipedia.org/wiki/Assurance_contract"
                >
                  assurance contracts
                </a>
                .
              </p>
              <p>To create a pact:</p>
              <p>1. Name your pact</p>
              <p>2. Write the terms of your pact</p>
              <p>3. Set the target funding goal</p>
              <p>4. Determine a deadline</p>
              <p>5. Add the wallet addresses of admins</p>
              <p>
                If the target goal is met before the deadline, the funds will
                immediately transfer into a Gnosis wallet which admins control.
                Admins are responsible to enact the transactions defined in the
                terms. If the target goal is not met when the deadline is
                reached, then funds will automatically be refunded to
                contributors.
              </p>
            </div>
          )}

          {activeTab === tabs[1] && (
            <>
              <div className="flex flex-col gap-4 mb-4">
                <div className="mb-4">
                  <h1 className="text-xl mb-2 font-medium">Name</h1>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Name"
                      className="input input-bordered w-full"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <h1 className="text-xl mb-1 font-medium">Terms</h1>
                  <textarea
                    className="textarea w-full input-bordered"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="Terms"
                  />
                </div>

                <div className="mb-4 flex gap-3">
                  <div>
                    <h1 className="text-xl mb-2 font-medium">
                      Funding Goal (in ETH)
                    </h1>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        placeholder="Funding Goal"
                        className="input input-bordered"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl mb-2 font-medium">Deadline</h1>
                    <div className="flex items-center gap-4">
                      <DatePicker
                        value={rawEndDate}
                        showTime
                        style={{ height: "48px" }}
                        onChange={(val: any) => dateChange(val)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h1 className="text-xl mb-2 font-medium">Admin Addresses</h1>

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
                  {account ? (
                    <a
                      className={cn("btn w-full", creating && "loading")}
                      onClick={doCreate}
                    >
                      Create
                    </a>
                  ) : (
                    <a className={cn("btn w-full")} onClick={connectWallet}>
                      Connect Wallet
                    </a>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === tabs[2] && (
            <div className="max-w-[90%] mx-auto">
              {loading ? (
                <div className="text-4xl mt-8">
                  <LoadingOutlined />
                </div>
              ) : (
                <>
                  {historyList.map((item: any, index) => (
                    <HistoryItem
                      onContributed={() => getHistoryList(true)}
                      key={index}
                      item={item}
                      address={item.address}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
