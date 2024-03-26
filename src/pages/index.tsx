import RootLayout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Else, If, Then } from "react-if";
import { NextSeo } from "next-seo";
import _ from "lodash";
import UrlAssembler from "url-assembler";
//@ts-ignore
import useHashParam from "use-hash-param";
import SearchEngine, { CompletedSearchEngine } from "@/components/SearchEngine";
import CompactAppCard from "@/components/CompactAppCard";
import { AppDto } from "@/dto/AppDto";
import FirebaseAnalytic, {analytics} from "@/components/FirebaseAnalytic";
import AdBanner from "@/components/AdBanner";
import {logEvent} from "firebase/analytics";
import camelcase from "camelcase";
import SearchForm from "@/components/SearchForm";
import {useRouter} from "next/router";
import Link from "next/link";

export default function Index() {
  const router = useRouter()

  const [splitMode, setSplitMode] = useState(false);

  const [searchValue, setSearchValue] = useState<undefined | string>();
  const [lang, setLang] = useState<string | undefined>("en");
  const [country, setCountry] = useState<string | undefined>("US");

  const [topResults, setTopResults] = useState<AppDto[][] | undefined>();

  useEffect(() => {
    setTopResults([])

    Promise.all(
      [
        // Business
        axios.post("/api/list", {
          term: "",
          lang: lang,
          country: country,
          category: 6000,
        }),

        // Games
        axios.post("/api/list", {
          term: "",
          lang: lang,
          country: country,
          category: 6014,
        }),

        // Fitness
        axios.post("/api/list", {
          term: "",
          lang: lang,
          country: country,
          category: 6013,
        }),

        // Casino
        axios.post("/api/list", {
          term: "",
          lang: lang,
          country: country,
          category: 7006,
        })
      ]
    ).then(i => {
      setTopResults(i.map(col => col.data.body))
    })
  }, [country, lang]);

  return (
    <RootLayout>
      <NextSeo
        title={searchValue ? `ASOVizor | ${searchValue}` : "ASOVizor"}
        description="Your assistant in ASO market analysis"
        canonical="https://www.asovizor.com/"
        openGraph={{
          type: 'website',
          locale: 'en_EN',
          url: 'https://www.asovizor.com/',
          siteName: 'ASOVizor',
        }}
        themeColor="#0076CD"
        robotsProps={{
          noarchive: true,
          notranslate: true,
        }}
      />

      <FirebaseAnalytic pageName="Index">
        <Navbar activeHref="/" />

        <div className="mx-auto flex justify-center py-20 container">
          <div className="w-full px-6 md:px-0 md:w-5/6">
            <SearchForm
              lang={lang}
              country={country}
              searchValue={searchValue}
              onChangeCountry={setCountry}
              onChangeLang={setLang}
              onSubmit={(e, data) => {
                e.preventDefault();

                const path = UrlAssembler("/results")
                  .query(data)
                  .toString()

                router.push(path, undefined, {shallow: true})
              }}
            />

            <div className="space-y-8 mt-12">
              <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {
                  topResults?.map(col => (
                      <div className="space-y-2">
                        <h3 className="font-bold text-sm">
                          {col[0]?.genre}
                        </h3>

                        {
                          col?.map((app) => (
                              <Link href={`/app?appId=${app.id}&lang=${lang}&country=${country}`} target="_blank"
                                    key={app.id}
                                    className="w-full h-8 flex flex-row space-x-2 items-center border border-gray-200 rounded-lg overflow-hidden px-0.5 py-0.5">
                                <img src={app.icon} className="w-6 h-6 rounded-md" alt=""/>
                                <span className="text-xs font-semibold text-gray-500">{app.title}</span>
                              </Link>
                          ))
                        }
                      </div>
                  ))
                }
              </div>

              <div>
                <h4 className="text-sm mb-2 text-gray-400">
                  Advertising
                </h4>
                <AdBanner/>
              </div>
            </div>
          </div>
        </div>
      </FirebaseAnalytic>
    </RootLayout>
  );
}
