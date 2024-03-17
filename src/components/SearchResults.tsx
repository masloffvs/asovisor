import _ from "lodash";
import Highlighter from "react-highlight-words";
import React from "react";
import ShowMoreText from "react-show-more-text";
import { className } from "postcss-selector-parser";
import classNames from "classnames";
import { If, Then } from "react-if";
import Link from "next/link";
import decamelize from "decamelize";
import Image from "next/image";
import CompactAppCard from "@/components/CompactAppCard";
import ListAppCard from "@/components/ListAppCard";
import { AppDto } from "@/dto/AppDto";

interface Props {
  readonly type: "results" | "compact";
  readonly results: any[];
  readonly searchValue?: string;
  readonly highlight?: string[];

  readonly lang: string | undefined;
  readonly country: string | undefined;
}

export default function SearchResults(props: Props) {
  return (
    <div
      className={classNames("overflow-x-hidden", {
        "space-y-12": props.type == "results",
        "space-y-4": props.type == "compact",
      })}
    >
      {props.results?.map((appDetails: AppDto, index) => (
        <ListAppCard
          enabledSimilar={index <= 4}
          searchValue={props.searchValue}
          similarLang={props.lang}
          similarCountry={props.country}
          index={index}
          type={props.type}
          highlight={props.highlight}
          appDetails={appDetails}
        />
      ))}

      <div className="w-full flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 animate-bounce"
        >
          <path
            fillRule="evenodd"
            d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 10.25a.75.75 0 0 0 1.5 0V6.56l1.22 1.22a.75.75 0 1 0 1.06-1.06l-2.5-2.5a.75.75 0 0 0-1.06 0l-2.5 2.5a.75.75 0 0 0 1.06 1.06l1.22-1.22v4.69Z"
            clipRule="evenodd"
          />
        </svg>

        <p className="text-xs text-gray-500 text-center max-w-96 mt-2">
          <b>Congratulations</b>, you've reached the very end of the page! The
          rest of the issue was stolen by aliens. As soon as they return search
          results, we will definitely add them to the page. But for now it's
          like that
        </p>
      </div>
    </div>
  );
}
