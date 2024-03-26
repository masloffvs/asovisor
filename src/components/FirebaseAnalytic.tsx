import { FirebaseApp, initializeApp } from "firebase/app";
import {Analytics, getAnalytics, logEvent} from "firebase/analytics";
import { ReactNode, useEffect } from "react";
import {FirebasePerformance, getPerformance} from "firebase/performance";
import {
  getRemoteConfig,
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
export let analytics: Analytics
export let perf: FirebasePerformance

export default function FirebaseAnalytic(props: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV != 'development') {
      firebaseApplication = initializeApp(firebaseConfig);
      remoteConfig = getRemoteConfig(firebaseApplication);

      analytics = getAnalytics(firebaseApplication);
      perf = getPerformance(firebaseApplication);

      remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

      logEvent(analytics, "page_view", {
        name: camelcase(props.pageName),
      });
    }
  }, []);

  return <>{props.children}</>;
}
