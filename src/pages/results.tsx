import RootLayout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NextSeo } from "next-seo";
import _ from "lodash";
import SearchResults from "@/components/SearchResults";
import FirebaseAnalytic, {analytics} from "@/components/FirebaseAnalytic";
import {useRouter} from "next/router";
import {logEvent} from "firebase/analytics";
import camelcase from "camelcase";
import {AppDto} from "@/dto/AppDto";
import Lottie from "lottie-react";
import AnimationSearch from '../animation/AnimationSearch.json'
import UrlAssembler from "url-assembler";
import SearchForm from "@/components/SearchForm";

export default function Results() {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const router = useRouter()

  const [results, setResults] = useState<undefined | AppDto[]>(undefined);

  useEffect(() => {
    axios
      .post("/api/search", {
        lang: router.query.lang?.toString()?.toLowerCase(),
        country: router.query.country?.toString()?.toUpperCase(),
        term: router.query.term?.toString()
      }, {
        cancelToken: source.token
      })
      .then((i) => {
        if (process.env.NODE_ENV != 'development') {
          logEvent(analytics, "search", {
            value: camelcase(router.query.term?.toString() || "None"),
          });
        }

        setResults(_.get(i, "data.body", undefined));
      })
      .catch((e) => {
        console.log(e)
      });

    return () => source.cancel('Operation canceled by the user.', {
      url: "/api/search"
    });
  }, [router.query]);

  return (
    <RootLayout>
      <FirebaseAnalytic pageName="Results">
        <NextSeo
          title={router.query.term ? `ASOVizor - results for '${router.query.term}'` : "ASOVizor"}
          description={`Found ${results?.length || 0} results for query '${router.query.term}'. VKontakte application is in the top`}
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

        <Navbar activeHref="/" />

        <div className="container mx-auto space-y-8 py-20">
          <SearchForm
              lang={router.query.lang?.toString()?.toLowerCase()}
              country={router.query.country?.toString()?.toUpperCase()}
              searchValue={router.query.term?.toString()}
              onSubmit={(e, data) => {
                e.preventDefault();

                setResults(undefined)

                const path = UrlAssembler("/results")
                    .query(data)
                    .toString()

                router.push(path, undefined, {shallow: true})
              }}
          />

          {
            results ?
              <SearchResults
                searchValue={router.query.term?.toString()}
                lang={router.query.lang?.toString()?.toLowerCase()}
                country={router.query.country?.toString()?.toUpperCase()}
                type="results"
                highlight={router.query.term?.toString()?.split(" ")}
                results={results}
              /> :
              <div className="flex flex-col w-full justify-center items-center">
                <Lottie className="w-64" animationData={AnimationSearch} loop={true}/>
                <h6 className="text-black font-bold text-md">We search</h6>
                <p className="text-gray-400 text-xs w-64 text-center">
                  The search is underway.<br/>
                  This usually happens quickly, but can take a while
                </p>
              </div>
          }
        </div>
      </FirebaseAnalytic>
    </RootLayout>
  );
}
