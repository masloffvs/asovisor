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
  readonly results?: AppDto[];
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
    </div>
  );
}
