import { Case, If, Switch, Then } from "react-if";
import Image from "next/image";
import classNames from "classnames";
import Link from "next/link";
import _ from "lodash";
import Highlighter from "react-highlight-words";
import ShowMoreText from "react-show-more-text";
import decamelize from "decamelize";
import CompactAppCard from "@/components/CompactAppCard";
import React, { useEffect, useState } from "react";
import { AppDto } from "@/dto/AppDto";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Props {
  readonly index: number;
  readonly type?: "results" | "compact";
  readonly searchValue?: string;
  readonly highlight?: string[];
  readonly appDetails?: AppDto;
  readonly enabledSimilar?: boolean;
  readonly similarLang?: string;
  readonly similarCountry?: string;
}

export default function ListAppCard(props: Props) {
  const o: AppDto = props?.appDetails!!;

  const [similarApps, setSimilarApps] = useState<AppDto[] | undefined>(
    undefined,
  );

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (
      props.enabledSimilar &&
      entry?.isIntersecting &&
      similarApps === undefined
    ) {
      axios
        .post("/api/similar", {
          id: props.appDetails?.id,
          lang: props.similarLang,
          country: props.similarCountry,
        })
        .catch(console.log)
        .then((result) => {
          setSimilarApps(_.get(result, "data.body"));
        });
    }
  }, [props, similarApps, entry?.isIntersecting]);

  return (
    <div className="relative" tabIndex={props.index} ref={ref}>
      <div className="absolute top-4 right-4 flex flex-row gap-2">
        <button
          className="text-blue-400 bg-blue-50 border border-blue-100 p-2 rounded-lg"
          onClick={() => {
            toast.promise(
              axios.post("/api/watch", {
                appId: props.appDetails?.id,
                term: props.searchValue,
                country: props?.similarCountry,
                lang: props?.similarLang,
              }),
              {
                loading: "Let's start tracking...",
                success: "We have successfully started tracking!",
                error: "This application is already being monitored",
              },
            );
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path
              fillRule="evenodd"
              d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <Link href={`/app?appId=${props?.appDetails?.id}`}>
          <button className="text-blue-400 bg-gray-50 p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
            </svg>
          </button>
        </Link>
      </div>

      <If condition={props.index == 0}>
        <Then>
          <Image
            width={28}
            height={28}
            className="select-none hidden md:block"
            src={require("../../public/surprise-left.png")}
            alt={""}
          />
        </Then>
      </If>

      <div
        className={classNames("flex z-10 p-2 gap-3 lg:gap-4 flex-row w-full", {
          "bg-gray-50 rounded-2xl": props.index != 0 && props.index % 2,
          "bg-white pb-6 rounded-2xl": props.index == 0,
        })}
      >
        <Link
          target="_blank"
          href={String(_.get(o, "url"))}
          className="h-20 w-20 lg:w-24 lg:h-24 flex flex-col hover:scale-105 transition-all flex-grow-0 flex-nowrap flex-none hover:shadow-lg rounded-2xl shadow border border-gray-200 overflow-hidden"
        >
          <img
            src={_.get(o, "icon")}
            alt={_.get(o, "title")}
            className="w-full h-full block"
          />
        </Link>

        <div className="w-full flex-grow">
          <div className="flex gap-2 flex-row items-center justify-start">
            <span className="text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-md">
              #{props.index + 1}
            </span>
            <Highlighter
              searchWords={props.highlight || []}
              className="font-semibold text-md lg:text-lg"
              textToHighlight={String(_.get(o, "title"))}
            />
            <If condition={props?.type == "results"}>
              <Then>
                <p className="hidden lg:block font-mono text-gray-400 text-xs">
                  {_.get(o, "appId")}
                </p>
              </Then>
            </If>
          </div>

          <If condition={props?.type == "results"}>
            <Then>
              <div className="space-y-2 mt-3">
                <div className="flex flex-row text-gray-500 items-center gap-2 text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  {_.get(o, "genres", []).map((g: any) => (
                    <span key={g} className="bg-blue-50 px-2 py-0.5 rounded">
                      {g}
                    </span>
                  ))}
                </div>

                <div className="flex text-gray-500 gap-2 flex-row items-center text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Highlighter
                    searchWords={props.highlight || []}
                    textToHighlight={String(_.get(o, "developer"))}
                    autoEscape
                  />
                </div>

                <div className="flex text-gray-500 gap-2 flex-row items-center text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M8 16.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z" />
                    <path
                      fillRule="evenodd"
                      d="M4 4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4Zm4-1.5v.75c0 .414.336.75.75.75h2.5a.75.75 0 0 0 .75-.75V2.5h1A1.5 1.5 0 0 1 14.5 4v12a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 16V4A1.5 1.5 0 0 1 7 2.5h1Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span>
                    {_.size(_.get(o, "supportedDevices", undefined))} supported
                    devices
                  </span>
                </div>

                <If condition={_.get(o, "score", undefined)}>
                  <Then>
                    <div className="flex pb-4 text-gray-500 gap-0.5 flex-row items-center text-xs">
                      {_.range(1, _.round(_.get(o, "score", 1), 0) + 1).map(
                        (i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-amber-300"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ),
                      )}
                      {_.range(_.round(_.get(o, "score", 1), 0), 5).map((i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 text-gray-300"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}

                      <span className="mt-0.5 bg-amber-100 rounded-full px-2 py-0 text-amber-600 text-xs font-semibold">
                        {_.round(_.get(o, "score", 1), 1)}
                      </span>
                    </div>
                  </Then>
                </If>
              </div>
            </Then>
          </If>

          <ShowMoreText
            /* Default options */
            lines={2}
            more="Show more"
            less="Show less"
            className="w-full text-xs py-1 pr-4"
            anchorClass="text-blue-500 cursor-pointer"
            // onClick={this.executeOnClick}
            expanded={false}
            truncatedEndingComponent={"... "}
          >
            <Highlighter
              className="text-xs w-3/4 block"
              searchWords={props.highlight || []}
              textToHighlight={String(_.get(o, "description"))}
              autoEscape
            />
          </ShowMoreText>

          <If condition={props.type == "results"}>
            <Then>
              <div className="flex w-full gap-2 mt-2 flex-row">
                {_.take(o.screenshots, 6).map((screenshot) => (
                  <img
                    key={screenshot}
                    className="w-20 lg:w-32 lg:min-h-52 drop-shadow-sm object-contain bg-gray-50 rounded-lg border-gray-200 border"
                    src={screenshot || undefined}
                    alt={screenshot}
                  />
                ))}
              </div>

              <If
                condition={
                  props.enabledSimilar &&
                  !(_.isArray(similarApps) && _.isEmpty(similarApps))
                }
              >
                <Then>
                  <div className="bg-gray-100 px-3 py-2 rounded-lg w-full mt-2">
                    <h4 className="text-sm mb-2 text-gray-400">Similar apps</h4>

                    <div className="flex flex-row gap-4 flex-wrap">
                      <Switch>
                        <Case condition={similarApps === undefined}>
                          <div className="animate-pulse h-20 w-20 lg:w-24 lg:h-24 bg-gray-200 rounded-lg"></div>
                          <div className="animate-pulse h-20 w-20 lg:w-24 lg:h-24 bg-gray-200 rounded-lg"></div>
                          <div className="animate-pulse h-20 w-20 lg:w-24 lg:h-24 bg-gray-200 rounded-lg"></div>
                        </Case>

                        <Case condition={_.isArray(similarApps)}>
                          {similarApps?.map((app) => (
                            <div key={app.id} className="flex-shrink-0">
                              <CompactAppCard appDetails={app} />
                            </div>
                          ))}
                        </Case>
                      </Switch>
                    </div>
                  </div>
                </Then>
              </If>

              <div className="mt-3">
                <Link
                  className="text-blue-500 flex flex-row items-center gap-1 text-xs"
                  href={`https://appmagic.rocks/iphone/${decamelize(_.get(o, "title"), { separator: "-" })}/${_.get(o, "id")}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                    <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
                  </svg>
                  <span>Open in AppsMagic</span>
                </Link>
              </div>
            </Then>
          </If>
        </div>
      </div>
    </div>
  );
}
