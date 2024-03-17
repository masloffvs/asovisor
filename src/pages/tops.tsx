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
import camelCase from "camelcase";
import humanizeString from "humanize-string";
import SelectCountry from "@/components/SelectCountry";
import langs from "langs";
import FirebaseAnalytic from "@/components/FirebaseAnalytic";

export default function Tops() {
  const [errorString, setErrorString] = useState<undefined | string>();
  const [results, setResults] = useState<undefined | null | any[]>(undefined);
  const [searchValue, setSearchValue] = useState<undefined | string>();

  const [categories, setCategories] = useState<undefined | [string, string]>();
  const [category, setCategory] = useState<string | undefined>("0");
  const [country, setCountry] = useState<string | undefined>("usa");

  useEffect(() => {
    axios.get("/api/categories").then((i) => {
      setCategories(_.get(i, "data.body", undefined));
    });
  }, []);

  useEffect(() => {
    setResults(undefined);
    setErrorString(undefined);

    if (category != null) {
      axios
        .post("/api/list", {
          term: "",
          lang: "en",
          country: country,
          category: parseInt(category),
        })
        .then((i) => {
          setResults(_.get(i, "data.body", undefined));
        })
        .catch((e) => {
          setResults(null);
          if (e.response) {
            setErrorString(String(e.response.data.message));
          } else {
            setErrorString(String(e));
          }
        });
    }
  }, [category, country]);

  return (
    <RootLayout>
      <FirebaseAnalytic pageName="TopsApps">
        <NextSeo
          title="ASOVizor | Tops"
          description="Your assistant in ASO market analysis"
        />

        <Navbar activeHref="/tops" />

        <div className="lg:container py-16 w-full px-4 lg:w-2/3 lg:mx-auto">
          <If condition={errorString}>
            <Then>
              <ErrorSection text={String(errorString)} />
            </Then>
          </If>

          <section className="flex flex-row gap-4">
            <div className="bg-gray-100 text-gray-500 text-sm rounded-lg px-2.5 py-1">
              <SelectCountry
                className="outline-none bg-gray-100 w-24"
                country={country}
                setCountry={setCountry}
              />
            </div>

            <div className="bg-gray-100 text-gray-500 text-sm rounded-lg px-2.5 py-1">
              <select
                className="outline-none bg-gray-100 w-24"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories?.map((i) => (
                  <option value={i[1]}>{humanizeString(i[0])}</option>
                ))}
              </select>
            </div>
            <div>...</div>
            <div>...</div>
          </section>

          <If condition={results === undefined}>
            <Then>
              <LoaderIndicator />
            </Then>
            <Else>
              <div className="py-8">
                <SearchResults
                  type="compact"
                  highlight={searchValue?.split(" ")}
                  results={results || []}
                  country={country}
                  lang={"en"}
                />
              </div>
            </Else>
          </If>
        </div>
      </FirebaseAnalytic>
    </RootLayout>
  );
}
