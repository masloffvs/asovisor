import Image from "next/image";
import React, { useEffect, useState } from "react";
import { fetchAndActivate, getValue } from "firebase/remote-config";
import {
  firebaseApplication,
  remoteConfig,
} from "@/components/FirebaseAnalytic";
import { Else, If, Then } from "react-if";

export default function AdBanner() {
  const [adImageUri, setAdImageUri] = useState<undefined | string>(undefined);

  useEffect(() => {
    fetchAndActivate(remoteConfig)
      .then(() => {
        setAdImageUri(getValue(remoteConfig, "ad_image").asString());
      })
      .catch(console.error);
  }, [firebaseApplication]);

  return (
    <div className="rounded-lg overflow-hidden">
      <If condition={adImageUri != undefined}>
        <Then>
          <img className="w-full object-cover h-fit" src={adImageUri} alt="" />
        </Then>
        <Else>
          <div className="h-32 animate-pulse bg-gray-50 rounded-xl" />
        </Else>
      </If>
    </div>
  );
}
