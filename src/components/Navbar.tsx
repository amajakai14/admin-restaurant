/* eslint-disable @typescript-eslint/no-misused-promises */
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";

export type TNavbar = {
  uri: string;
  text: string;
}[];

const Navbar: React.FC<{ linkList: TNavbar }> = ({
  linkList,
}: {
  linkList: TNavbar;
}) => {
  const { data: sessionData } = useSession();
  return (
    <>
      <HamburgerMenu linkList={linkList} />
      <nav className="hidden w-full bg-gray-800 md:block">
        <div className="mx-auto flex justify-between bg-violet-500 px-4 py-2">
          <div>some logo</div>
          <div className="flex ">
            <div>
              <ul className="flex items-center justify-center">
                {linkList.map((link) => (
                  <li key={link.text} className="px-4">
                    <Link
                      href={link.uri}
                      className="block w-full text-white hover:bg-violet-600"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}

                {sessionData && (
                  <button
                    className="block w-full text-white hover:bg-violet-600"
                    onClick={() => signOut()}
                  >
                    Log Out
                  </button>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

const HamburgerIcon: React.FC<{
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}> = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300`;
  return (
    <div className="flex w-full items-end justify-end">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="justify-top group flex h-12 w-12 flex-col items-center rounded border-black  align-middle"
      >
        <div
          className={`${genericHamburgerLine} ${
            isOpen
              ? "translate-y-3 rotate-45 opacity-50 group-hover:opacity-100"
              : "opacity-50 group-hover:opacity-100"
          }`}
        ></div>
        <div
          className={`${genericHamburgerLine} ${
            isOpen ? "opacity-0" : "opacity-50 group-hover:opacity-100"
          }`}
        ></div>
        <div
          className={`${genericHamburgerLine} ${
            isOpen
              ? "-translate-y-3 -rotate-45 opacity-50 group-hover:opacity-100"
              : "opacity-50 group-hover:opacity-100"
          }`}
        ></div>
      </button>
    </div>
  );
};

const HamburgerMenu: React.FC<{ linkList: TNavbar }> = ({
  linkList,
}: {
  linkList: TNavbar;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: sessionData } = useSession();

  return (
    <nav className="w-full bg-violet-500 px-4 pt-2 md:hidden">
      <div className="w-full">
        <HamburgerIcon isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div
        className={`fixed top-0 left-0 z-30 h-full w-64 transform overflow-auto bg-violet-300  transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0 " : "-translate-x-full"
        }`}
      >
        <ul className="flex flex-col pt-10 pl-4 duration-300">
          {linkList.map((link) => (
            <li key={link.text} className="py-2">
              <Link
                href={link.uri}
                className="block w-full text-black hover:bg-violet-600"
              >
                {link.text}
              </Link>
            </li>
          ))}
          {sessionData && (
            <button
              className="block h-10 w-full text-start text-black hover:bg-violet-600"
              onClick={() => signOut()}
            >
              Log Out
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
};
