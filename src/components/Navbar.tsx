import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import _ from "lodash";
import Image from "next/image";

interface Props {
  readonly activeHref: string;
  readonly appendItems?: {
    label: string;
    href: string;
    isActive: () => boolean;
  }[];
}

export default function Navbar({ activeHref, appendItems }: Props) {
  const [items, setItems] = useState(
    [
      {
        label: "Explorer",
        href: "/",
        isActive: () => activeHref == "/",
      },
      {
        label: "Tops",
        href: "/tops",
        isActive: () => activeHref == "/tops",
      },
      // {
      //   label: "Routers",
      //   href: "/routers",
      //   isActive: () => activeHref == "/routers",
      // },
    ].concat(appendItems || []),
  );

  return (
    <nav className="w-full drop-shadow-xs z-50 fixed bg-white h-12 border-b border-b-gray-300">
      <div className="mx-auto h-full container flex flex-row">
        <div className="flex space-x-3 select-none justify-center text-sm font-semibold items-center border-b-transparent h-full w-fit px-4 border-b-2">
          <div className="flex justify-center items-center">
            <Image
              className="select-none hidden lg:block"
              alt="icon"
              height="35"
              src={require("../../public/icon-horizontal.png")}
            />
            <Image
              className="select-none lg:hidden block"
              alt="icon"
              height="26"
              src={require("../../public/icon.png")}
            />
          </div>
        </div>

        {items.map((item) => (
          <Link key={item.href} shallow href={item.href}>
            <div
              className={`flex cursor-pointer justify-center text-sm font-semibold items-center h-full w-fit px-4 border-b-2 ${item.isActive() ? "border-b-lime-500" : "border-b-transparent"}`}
            >
              {item.label}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
