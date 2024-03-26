import { FormEvent, useEffect, useState } from "react";
import axios, {Axios} from "axios";
import langs from "langs";
import _ from "lodash";
import SelectCountry from "@/components/SelectCountry";
import { setupCache } from 'axios-cache-interceptor';
import classNames from "classnames";

interface Props {
  readonly searchValue?: string;
  readonly country?: string;
  readonly lang?: string;

  readonly onChangeCountry?: (it: string|undefined) => void;
  readonly onChangeLang?: (it: string|undefined) => void;

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
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const axiosInstance = setupCache(axios.create({}))

  const [term, setTerm] = useState<undefined | string>(props.searchValue);
  const [lang, setLang] = useState<undefined | string>("en");
  const [country, setCountry] = useState<undefined | string>("US");
  const [userActuallySelectLang, setUserActuallySelectLang] = useState(false);

  const [inFocus, setInFocus] = useState(false)
  const [suggests, setSuggests] = useState<undefined|string[]>()

  useEffect(() => {
    axiosInstance
      .post("/api/suggests", {
        term: term,
        lang,
        country,
      }, {
        cancelToken: source.token
      })
      .then((i) => {
        setSuggests(_.get(i, "data.body", []).map((i: {term: string}) => i.term));
      })
      .catch((e) => {
        setSuggests(undefined);
      });

    return () => source.cancel('Operation canceled by the user.', {
      url: "/api/suggests"
    });
  }, [term]);

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
          setCountry={value => {
            setCountry(value)
            props?.onChangeCountry?.(value)
          }}
          userActuallySelectLang={userActuallySelectLang}
        />

        <select
          value={lang}
          onChange={(e) => {
            setLang(e.target.value);
            props?.onChangeLang?.(e.target.value)
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
        onFocus={() => setInFocus(true)}
        onBlur={() => setInFocus(false)}
        onSubmit={(e) => props.onSubmit(e, {term, lang, country})}
        className={classNames("flex border-2 items-center flex-row bg-gray-50 justify-between rounded-xl overflow-hidden px-1.5 py-1.5", {
          "border-gray-500": inFocus,
          "border-gray-200": !inFocus,
        })}
      >
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          type="text"
          onFocus={() => setInFocus(true)}
          onBlur={() => setInFocus(false)}
          className="ml-3 h-7 text-sm font-regular bg-transparent placeholder-gray-400 text-black min-w-16 w-full outline-none"
          placeholder="Search the same way you would search in an Apple Store"
        />

        <div className="lg:flex h-7 items-center justify-center hidden">
          <Selectors/>
        </div>

        <button
          type="submit"
          className={classNames(
            "ml-2 h-7 border flex-shrink-0 w-14 font-normal hover:bg-opacity-90 py-1 px-4 rounded-lg",
            {
              "bg-black text-white border-transparent fill-white": !_.isEmpty(term),
              "bg-gray-200 border-gray-300 text-black fill-black": _.isEmpty(term)
            }
          )}
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
      </form>

      <div className="lg:hidden py-2 px-4 block mt-4 bg-gray-50 rounded-lg">
        <Selectors/>
      </div>

      <div className="mt-2">
        <div className="flex text-gray-400 flex-row items-center gap-1.5">
          {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 fill-current">*/}
          {/*  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>*/}
          {/*  <path fillRule="evenodd"*/}
          {/*        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"*/}
          {/*        clipRule="evenodd"/>*/}
          {/*</svg>*/}

          {/*<div className="space-x-1 text-xs">*/}
          {/*  <span>10</span>*/}
          {/*  <span>views</span>*/}
          {/*</div>*/}
        </div>

      </div>

      <div className="grid grid-cols-6 gap-2 mt-3">
        {
          suggests?.map(suggest => (
            <div onClick={() => setTerm(suggest)} className="px-2 cursor-pointer hover:text-gray-900 text-xs py-1 rounded-md text-gray-500 bg-gray-50">
              {suggest}
            </div>
          ))
        }
      </div>
    </div>
  );
}
