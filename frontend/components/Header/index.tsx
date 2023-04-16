import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Feature", href: "#Feature", current: true },
  { name: "Investor", href: "#Investor", current: false },
];

const classNames = (...classes: any) => classes.filter(Boolean).join(" ");

const Button = ({ text, className }: any) => {
  return (
    <button className={`button-purple text-2xl ${className}`}>
      <span className="circle1"></span>
      <span className="circle2"></span>
      <span className="circle3"></span>
      <span className="circle4"></span>
      <span className="circle5"></span>
      <span className="text">{text}</span>
    </button>
  );
};

export default function Header() {
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-white md:bg-transparent">
          {({ open }) => (
            <>
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 md:h-24 items-center justify-between md:justify-start md:flex-row-reverse">
                  {/* <div className='hidden md:block'>
                    <div className='ml-4 flex items-center md:ml-6'>
                      <Button text='Join Waitlist'  className='font-light text-xl' />
                    </div>
                  </div> */}
                  <div className="flex items-center ">
                    <div className="flex-shrink-0 md:hidden">
                      <img
                        className="h-8 w-8"
                        src="/img/logo1.svg"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="flex items-center text-2xl font-light">
                        {navigation.map((i) => (
                          <a
                            className="ml-14 hover:text-[#fff] border-[#BE7DFF] hover:bg-[#BE7DFF] text-[#BE7DFF] rounded-2xl px-5 py-1 transition-all border-solid border-2"
                            key={i.name}
                            href={i.href}
                          >
                            {i.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-[#BE7DFF] p-2 text-[#fff]  hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-[#BE7DFF] text-white"
                          : "text-black hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-xl font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
