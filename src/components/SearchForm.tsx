import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import langs from "langs";
import _ from "lodash";
import SelectCountry from "@/components/SelectCountry";
import { Else, If, Then } from "react-if";

interface Props {
  readonly searchValue?: string;
  readonly country?: string;
  readonly lang?: string;
  readonly onSubmit: (
    it: FormEvent<any>,
    formBody: { term?: string; lang?: string; country?: string },
  ) => void;
}

function getLanguages(filter: "trend" | "other") {
  const trendLanguages = ["en", "ru", "pt", "uk"];

  switch (filter) {
    case "other":
      return _.filter(langs.all(), (i) => {
        return !_.includes(trendLanguages, _.get(i, "1"));
      });

    case "trend":
      return _.filter(langs.all(), (i) => {
        return _.includes(trendLanguages, _.get(i, "1"));
      });

    default:
      return null;
  }
}

export default function SearchForm(props: Props) {
  const [term, setTerm] = useState<undefined | string>(props.searchValue);
  const [lang, setLang] = useState<undefined | string>("en");
  const [country, setCountry] = useState<undefined | string>("US");
  const [userActuallySelectLang, setUserActuallySelectLang] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setTerm(props.searchValue);
    setCountry(props.country);
    setLang(props.lang);
  }, [props.searchValue, props.lang, props.country]);

  function Selectors() {
    return (
      <div className="flex h-full gap-1.5 flex-row">
        <SelectCountry
          className="text-sm w-32 px-2 text-gray-500 outline-none bg-gray-50 rounded-lg"
          country={country}
          setLang={setLang}
          setCountry={setCountry}
          userActuallySelectLang={userActuallySelectLang}
        />

        <select
          value={lang}
          onChange={(e) => {
            setLang(e.target.value);
            setUserActuallySelectLang(true);
          }}
          className="text-sm w-24 bg-gray-50 rounded-lg text-gray-500 px-2 outline-none"
        >
          <option disabled value="----">
            Popular languages
          </option>

          {getLanguages("trend")!!.map((i: any) => (
            <option key={_.get(i, "1")} value={_.get(i, "1")}>
              {_.get(i, "name")}
            </option>
          ))}

          <option disabled value="----">
            Other languages
          </option>

          {getLanguages("other")!!.map((i: any) => (
            <option key={_.get(i, "1")} value={_.get(i, "1")}>
              {_.get(i, "name")}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form
        method="post"
        onSubmit={(e) => props.onSubmit(e, { term, lang, country })}
        className="flex items-center flex-row border-lime-500 border-2 justify-between rounded-xl overflow-hidden px-1 py-1"
      >
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          type="text"
          className="ml-3 h-7 placeholder-gray-400 text-black min-w-64 w-full outline-none font-normal"
          placeholder="Search like you search in App Store"
        />

        <div className="lg:flex h-7 items-center justify-center hidden">
          <Selectors />
        </div>

        <If condition={!_.isEmpty(term)}>
          <Then>
            <button
              type="submit"
              className="ml-2 text-sm h-7 w-14 text-black font-normal bg-gray-200 bg-opacity-55 hover:bg-opacity-100 transition-all py-1 px-4 rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Then>
        </If>
      </form>

      <div className="lg:hidden py-2 px-4 block mt-4 bg-gray-50 rounded-lg">
        <Selectors />
      </div>
    </div>
  );
}
