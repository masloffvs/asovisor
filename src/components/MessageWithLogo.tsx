import React, { useEffect, useState } from "react";
import _ from "lodash";
import Image from "next/image";

interface Props {
  readonly title?: string;
  readonly text?: string;
}

export default function MessageWithLogo(props: Props) {
  return (
    <div className="flex flex-col justify-center items-center py-32">
      <Image
        width={180}
        src={require("../../public/icon-horizontal.png")}
        alt=""
      />

      <div className="mt-8">
        <p className="text-lg font-bold text-center text-black">
          {props.title}
        </p>

        <p className="text-sm max-w-96 text-gray-400 text-center">
          {props.text}
        </p>
      </div>
    </div>
  );
}
