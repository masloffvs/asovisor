import SearchForm from "@/components/SearchForm";
import axios from "axios";
import _ from "lodash";
import { Else, If, Then } from "react-if";
import ErrorSection from "@/components/ErrorSection";
import LoaderIndicator from "@/components/LoaderIndicator";
import Highlighter from "react-highlight-words";
import SearchResults from "@/components/SearchResults";
import React, { useEffect, useState } from "react";

interface Props {
  readonly searchValue?: string;
  readonly setSearchValue?: (it: string | undefined) => void;

  readonly lang?: string;
  readonly setLang?: (it: string | undefined) => void;

  readonly country?: string;
  readonly setCountry?: (it: string | undefined) => void;

  readonly onSubmit?: (it: any | undefined) => void;
  readonly typeResults?: "results" | "compact";
}

export default function SearchEngine({
  lang,
  setLang,
  country,
  setCountry,
  searchValue,
  setSearchValue,
  onSubmit,
  typeResults,
}: Props) {
  const [errorString, setErrorString] = useState<undefined | string>();
  const [results, setResults] = useState<undefined | null | any[][]>(null);
  const [suggests, setSuggests] = useState<undefined | any[]>();

  return (
    <div>
      <SearchForm
        lang={lang}
        country={country}
        searchValue={searchValue}
        onSubmit={(e, data) => {
          e.preventDefault();

          if (onSubmit) {
            onSubmit(data);
          }

          if (setSearchValue) {
            setSearchValue(data.term);
          }
          //setHashSearch(data.term);

          setErrorString(undefined);
          setResults(undefined);
          setSuggests(undefined);

          if (setLang) {
            setLang(data.lang);
          }
          //setHashLang(data.lang);

          if (setCountry) {
            setCountry(data.country);
          }
          //setHashCountry(data.country);

          axios
            .post("/api/search", data)
            .then((i) => {
              setResults([_.get(i, "data.body", undefined)]);
            })
            .catch((e) => {
              setResults(null);
              if (e.response) {
                setErrorString(String(e.response.data.message));
              } else {
                setErrorString(String(e));
              }
            });

          axios
            .post("/api/suggests", data)
            .then((i) => {
              setSuggests([_.get(i, "data.body", undefined)]);
            })
            .catch((e) => {
              setSuggests(undefined);
            });
        }}
      />
      <If condition={errorString}>
        <Then>
          <ErrorSection text={String(errorString)} />
        </Then>
      </If>
      <If condition={results === undefined}>
        <Then>
          <LoaderIndicator />
        </Then>
        <Else>
          <If condition={!_.isEmpty(_.flatten(suggests))}>
            <Then>
              <div className="px-2 mt-3 py-2 rounded-xl text-sm bg-gray-50">
                <h4 className="text-sm px-2 mb-2 text-gray-400">Search tips</h4>
                {_.flatten(suggests)?.flatMap((i, index) => (
                  <div
                    key={_.get(i, "term")}
                    className="flex flex-row gap-2 cursor-pointer px-2 py-0.5 rounded-lg hover:bg-lime-100"
                    onClick={() => {
                      if (setSearchValue) {
                        setSearchValue(_.get(i, "term"));
                      }
                      //setHashSearch(_.get(i, 'term'));
                    }}
                  >
                    <span className="text-gray-400">#{index + 1}</span>
                    <Highlighter
                      className="text-gray-600"
                      highlightClassName="bg-transparent underline"
                      textToHighlight={_.get(i, "term")}
                      searchWords={searchValue?.split(" ") || []}
                    />
                  </div>
                ))}
              </div>
            </Then>
          </If>

          <div className="py-8 space-y-4">
            {results?.map((out) => (
              <SearchResults
                searchValue={searchValue}
                lang={lang}
                country={country}
                type={typeResults || "results"}
                highlight={searchValue?.split(" ")}
                results={out || undefined}
              />
            ))}
          </div>
        </Else>
      </If>
    </div>
  );
}

interface CompletedProps {
  readonly typeResults?: "results" | "compact";
}

export function CompletedSearchEngine(props: CompletedProps) {
  const [searchValue, setSearchValue] = useState<undefined | string>();
  const [lang, setLang] = useState<string | undefined>("en");
  const [country, setCountry] = useState<string | undefined>("US");

  return (
    <SearchEngine
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      lang={lang}
      setLang={setLang}
      country={country}
      setCountry={setCountry}
      typeResults={props.typeResults}
    />
  );
}
