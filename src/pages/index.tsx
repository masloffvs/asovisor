import RootLayout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useTurbopack } from "next/dist/client/components/react-dev-overlay/internal/helpers/use-websocket";
import axios from "axios";
import ErrorSection from "@/components/ErrorSection";
import SearchForm from "@/components/SearchForm";
import { Else, If, Then } from "react-if";
import { NextSeo } from "next-seo";
import _ from "lodash";
import Highlighter from "react-highlight-words";
import SearchResults from "@/components/SearchResults";
import LoaderIndicator from "@/components/LoaderIndicator";
//@ts-ignore
import useHashParam from "use-hash-param";
import SearchEngine, { CompletedSearchEngine } from "@/components/SearchEngine";
import CompactAppCard from "@/components/CompactAppCard";
import { AppDto } from "@/dto/AppDto";
import FirebaseAnalytic, {
  firebaseApplication,
  remoteConfig,
} from "@/components/FirebaseAnalytic";
import { fetchAndActivate, getValue } from "firebase/remote-config";
import Image from "next/image";
import AdBanner from "@/components/AdBanner";

export default function Index() {
  const [splitMode, setSplitMode] = useState(false);

  const [searchValue, setSearchValue] = useState<undefined | string>();
  const [lang, setLang] = useState<string | undefined>("en");
  const [country, setCountry] = useState<string | undefined>("US");

  const [hashSearch, setHashSearch] = useHashParam<undefined | string>(
    "search",
  );
  const [hashLang, setHashLang] = useHashParam<undefined | string>("lang");
  const [hashCountry, setHashCountry] = useHashParam<undefined | string>(
    "country",
  );

  const [topResults, setTopResults] = useState<AppDto[] | undefined>();

  useEffect(() => {
    if (!_.isEmpty(hashSearch)) {
      setSearchValue(hashSearch);
    }

    if (!_.isEmpty(hashCountry)) {
      setCountry(hashCountry);
    }

    if (!_.isEmpty(hashLang)) {
      setLang(hashLang);
    }
  }, [hashSearch, hashCountry, hashLang]);

  useEffect(() => {
    axios
      .post("/api/list", {
        term: "",
        lang: "en",
        country: country,
        category: 0,
      })
      .then((i) => {
        setTopResults(_.get(i, "data.body", undefined));
      })
      .catch(console.error);
  }, [country]);

  return (
    <RootLayout>
      <NextSeo
        title={searchValue ? `ASOVizor | ${searchValue}` : "ASOVizor"}
        description="Your assistant in ASO market analysis"
      />

      <FirebaseAnalytic pageName="Index">
        <Navbar activeHref="/" />

        <If condition={splitMode}>
          <Then>
            <div className="flex flex-row w-full py-16 lg:py-24 justify-center gap-8">
              <div style={{ width: 512 }}>
                <CompletedSearchEngine typeResults="compact" />
              </div>
              <div style={{ width: 512 }}>
                <CompletedSearchEngine typeResults="compact" />
              </div>
            </div>
          </Then>

          <Else>
            <div className="lg:container py-16 lg:py-24 w-full px-3 lg:px-0 lg:w-2/3 lg:mx-auto">
              <SearchEngine
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                lang={lang}
                setLang={setLang}
                country={country}
                setCountry={setCountry}
              />

              <If condition={_.isEmpty(searchValue)}>
                <Then>
                  <div className="space-y-8">
                    <div className="hidden md:block">
                      <h4 className="text-sm mb-2 text-gray-400">
                        Applications in TOP10
                      </h4>

                      <If condition={topResults != undefined}>
                        <Then>
                          <div className="w-full overflow-x-auto h-48 flex justify-center bg-gray-50 rounded-xl">
                            <div className="flex flex-shrink-0 py-4 px-4 justify-around lg:justify-between flex-row gap-4 w-full flex-wrap lg:flex-nowrap">
                              {_.take(topResults, 8)?.map((appDetails) => (
                                <CompactAppCard
                                  key={appDetails.id}
                                  appDetails={appDetails}
                                />
                              ))}
                            </div>
                          </div>
                        </Then>
                        <Else>
                          <div className="h-48 animate-pulse bg-gray-50 rounded-xl" />
                        </Else>
                      </If>
                    </div>

                    <div>
                      <h4 className="text-sm mb-2 text-gray-400">
                        Advertising
                      </h4>
                      <AdBanner />
                    </div>

                    <div className="hidden lg:block">
                      <h4 className="text-sm mb-2 text-gray-400">Tools</h4>

                      <div
                        onClick={() => setSplitMode(true)}
                        className="cursor-pointer flex hover:scale-105 shadow-lg shadow-amber-50 transition-all bg-amber-50 flex-row items-center justify-between px-4 py-3 border border-amber-200 rounded-xl"
                      >
                        <div>
                          <h4 className="text-md font-semibold">
                            Split screen
                          </h4>
                          <p className="text-xs font-normal">
                            ASOVizor can search in two directions at once, just
                            switch to 2-window mode to get started!
                          </p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Then>
              </If>
            </div>
          </Else>
        </If>
      </FirebaseAnalytic>
    </RootLayout>
  );
}
