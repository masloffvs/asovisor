import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { ReactNode, useEffect } from "react";
import { initializeAppCheck } from "@firebase/app-check";
import { getPerformance } from "firebase/performance";
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
  RemoteConfig,
} from "firebase/remote-config"; // @ts-ignore
import camelcase from "camelcase";

const firebaseConfig = {
  apiKey: "AIzaSyDwoh-Rv9r0ERBHHcrGbWxxUfttUbpQK40",
  authDomain: "asovizor.firebaseapp.com",
  projectId: "asovizor",
  storageBucket: "asovizor.appspot.com",
  messagingSenderId: "763228720300",
  appId: "1:763228720300:web:fc8578808f6d25f096e309",
  measurementId: "G-CK8V9JVKVV",
};

interface Props {
  readonly pageName: string;
  readonly children: ReactNode;
}

export let firebaseApplication: FirebaseApp;
export let remoteConfig: RemoteConfig;

export default function FirebaseAnalytic(props: Props) {
  useEffect(() => {
    firebaseApplication = initializeApp(firebaseConfig);
    remoteConfig = getRemoteConfig(firebaseApplication);

    const analytics = getAnalytics(firebaseApplication);
    const perf = getPerformance(firebaseApplication);

    remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

    logEvent(analytics, "page_view", {
      name: camelcase(props.pageName),
    });
  }, []);

  return <>{props.children}</>;
}
