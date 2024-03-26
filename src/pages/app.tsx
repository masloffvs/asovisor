import RootLayout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NextSeo } from "next-seo";
import FirebaseAnalytic from "@/components/FirebaseAnalytic";
import { useRouter } from "next/router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppSnapshotDto } from "@/dto/AppSnapshotDto";
import _ from "lodash";
import moment from "moment";
import { getName } from "country-list";
import MessageWithLogo from "@/components/MessageWithLogo";
import { Else, If, Then } from "react-if";
import LoaderIndicator from "@/components/LoaderIndicator";
import { Line as Progress } from 'rc-progress';
import Lottie from "lottie-react";
import AnimationList from '../animation/AnimationList.json'
import AnimationSearch from "@/animation/AnimationSearch.json";
import {AppDto} from "@/dto/AppDto";
import {className} from "postcss-selector-parser";
import classNames from "classnames";

export default function App() {
  const router = useRouter();

  const [appInfo, setAppInfo] = useState<AppDto|undefined>()

  const [isFetching, setIsFetching] = useState(true);
  const [appSnapshots, setAppSnapshots] = useState<
    AppSnapshotDto[] | undefined
  >();
  const [documentTitle, setDocumentTitle] = useState("ASOVizor | App overview");
  const [chartPositions, setChartPositions] = useState<any[][] | undefined>();

  const [aiSummary, setAiSummary] = useState<any|undefined>()

  const [selectedSnapshot, setSelectedSnapshot] = useState<AppDto|undefined>()

  useEffect(() => {
    if (_.isEmpty(router.query.appId)) {
      return
    }

    const appInfoParams = {
      appId: parseInt(String(router.query.appId || "")),
      lang: router.query.lang?.toString()?.toLowerCase(),
      country: router.query.country?.toString()?.toUpperCase(),
    }

    const axiosParams = {
      params: appInfoParams,
    }

    Promise.all([
      axios.get("/api/app", axiosParams),
      axios.get("/api/ai/appInfo", axiosParams),
      axios.get("/api/watcherInfo", axiosParams)
    ]).then(collectionResults => {
      setAppInfo(collectionResults[0]?.data?.body)
      setSelectedSnapshot(collectionResults[0]?.data?.body)

      if (!_.isEmpty(collectionResults[1]?.data.body)) {
        setAiSummary(collectionResults[1]?.data.body)
      }

      if (_.isArray(collectionResults[2]?.data.body) && !_.isEmpty(collectionResults[2]?.data.body)) {
        setAppSnapshots(collectionResults[2]?.data.body);

        const chartData = collectionResults[2]?.data.body?.flatMap((i: any) => {
          return i.storyOfPositions.map((position: any) => ({
            name: i.term,
            country: i.country,
            index: position.index,
            at: position.snapAt,
          }));
        });

        setChartPositions(_.values(_.groupBy(chartData, "name")));
      }
    })
      .finally(() => setIsFetching(false));




  }, [router.query.appId]);

  return (
    <RootLayout>
      <FirebaseAnalytic pageName="AppOverview">
        <NextSeo
            title={`AsoVizor | ${selectedSnapshot?.title} at Apple Store`}
            description="Your assistant in ASO market analysis"
        />

        <Navbar activeHref="/app"/>

        <If condition={isFetching}>
          <Then>
            <div className="flex py-20 flex-col w-full justify-center items-center">
              <Lottie className="w-64" animationData={AnimationList} loop={true}/>
              <h6 className="text-black font-bold text-md">
                Preparing the first report
              </h6>
              <p className="text-gray-400 text-xs w-64 text-center">
                No reports have yet been prepared for the <span className="bold">...</span> application. <br/>
                <span className="italic">We need a little more time</span>
              </p>
            </div>
          </Then>

          <Else>
            <div className="container mx-auto space-y-2 py-20">
              <div className="w-full flex gap-4 flex-row">
                <img src={selectedSnapshot?.icon}
                     className="w-32 h-32 flex-shrink-0 rounded-3xl border-gray-100 bg-gray-50 border overflow-hidden"
                     alt=""/>
                <div>
                  <div className="flex flex-row items-center">
                    <h1 className="text-black text-xl font-semibold">{selectedSnapshot?.title}</h1>
                    <span className='ml-2 text-center text-xs px-1.5 py-1 font-semibold rounded-md bg-amber-200'>
                      {selectedSnapshot?.contentRating}
                    </span>
                  </div>

                  <span className="text-gray-400 text-md font-regular">{selectedSnapshot?.developer}</span>

                  <div className="flex mt-1.5 pb-4 text-gray-500 gap-0.5 flex-row items-center text-xs">
                    {_.range(1, _.round(_.get(selectedSnapshot, "score", 1), 0) + 1).map(
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

                    {_.range(_.round(_.get(selectedSnapshot, "score", 1), 0), 5).map((i) => (
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
                      {_.round(_.get(selectedSnapshot, "score", 1), 1)}
                    </span>

                    <span className='ml-2'>
                      ({Intl.NumberFormat('en').format(selectedSnapshot?.reviews || 0)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-6 gap-6">
                <div className="md:col-span-4">
                  <div className="flex divide-gray-100 divide-x w-full overflow-x-auto mt-2 flex-row">
                    <div className="flex w-fit flex-shrink-0 pr-4 gap-2 mt-2 flex-row">
                      {_.take(selectedSnapshot?.screenshots, 3).map((screenshot) => (
                          <img
                              key={screenshot}
                              className="w-24 lg:w-44 lg:min-h-52 object-contain bg-gray-50 rounded-lg border border-gray-100"
                              src={screenshot || undefined}
                              alt={screenshot}
                          />
                      ))}
                    </div>

                    <div className="flex w-fit flex-shrink-0 pl-4 gap-2 mt-2 flex-row">
                      {_.drop(selectedSnapshot?.screenshots, 3).map((screenshot) => (
                          <img
                              key={screenshot}
                              className="w-24 lg:w-44 lg:min-h-52 object-contain bg-gray-50 rounded-lg border border-gray-100"
                              src={screenshot || undefined}
                              alt={screenshot}
                          />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs mt-4 text-gray-700 hyphens-manual break-words whitespace-pre-line">
                    {selectedSnapshot?.description}
                  </p>

                  <h3 className="font-bold mt-6 text-sm">
                    Release info
                  </h3>

                  <div className="mt-2 flex gap-2 flex-row items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                      <path
                          d="M7.25 10.25a.75.75 0 0 0 1.5 0V4.56l2.22 2.22a.75.75 0 1 0 1.06-1.06l-3.5-3.5a.75.75 0 0 0-1.06 0l-3.5 3.5a.75.75 0 0 0 1.06 1.06l2.22-2.22v5.69Z"/>
                      <path
                          d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z"/>
                    </svg>

                    <div>
                      <p className="text-xs italic text-gray-600 hyphens-manual break-words whitespace-pre-line">{selectedSnapshot?.releaseNotes}</p>
                      <p className="text-xs mt-2 text-gray-600">First release date: {moment(selectedSnapshot?.released).format("DD.MM.YYYY")} ({moment(selectedSnapshot?.released).fromNow()})</p>
                    </div>
                  </div>

                  <h3 className="font-bold mt-6 text-sm">
                    Positions history
                  </h3>

                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {chartPositions?.map((data) => (
                      <div>
                        <div
                          className="pt-4"
                          style={{
                            width: "100%",
                            height: 200,
                          }}
                        >
                          <ResponsiveContainer>
                            <AreaChart syncId="chartIndex" data={data}>
                              <Tooltip
                                  content={(i) => (
                                      <div
                                          className="w-36 border border-gray-300 rounded-lg drop-shadow-sm bg-white z-50 ">
                                        <p className="text-xs text-balance px-2 py-1">
                                          In search at {_.get(_.get(data, i.label), "index")}
                                        </p>

                                        <p className="text-xs text-balance px-2 py-1">
                                          {moment(
                                              _.get(_.get(data, i.label), "at"),
                                          ).format("DD.MM.YYYY")}
                                          {/*{(new Date(_.get(data, i.label))).toLocaleString()}*/}
                                        </p>
                                      </div>
                                  )}
                              />
                              <Area
                                  connectNulls
                                  fillOpacity={0.3}
                                  fill="black"
                                  strokeWidth={0.5}
                                  dataKey="index"
                                  stroke="black"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Dynamics of position changes for request “
                          <span className="font-semibold">
                          {_.first(data)?.name}
                        </span>
                          ” in country “{getName(_.first(data)?.country)}”
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-bold text-sm">
                    AI Summary
                  </h3>

                  <div className="gap-1 mt-2 w-full flex flex-row flex-wrap">
                    {
                      _.get(aiSummary, 'keywordClassification', undefined)?.map((tag: any) => (
                          <div
                              className="text-xs space-x-1 flex flex-row items-center px-2 py-0.5 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                 className="w-3 h-3">
                              <path fillRule="evenodd"
                                    d="M4.5 2A2.5 2.5 0 0 0 2 4.5v2.879a2.5 2.5 0 0 0 .732 1.767l4.5 4.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-4.5-4.5A2.5 2.5 0 0 0 7.38 2H4.5ZM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                    clipRule="evenodd"/>
                            </svg>
                            <span>
                            {tag}
                          </span>
                          </div>
                      ))
                    }
                  </div>

                  <div className="space-y-2 mt-4 w-full">
                    {
                      _.take(_.get(aiSummary, 'emotionClassification', []), 5)?.map((emotion: any) => (
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">
                            {emotion.label}
                          </p>

                          <Progress
                            percent={emotion.score * 100}
                            strokeWidth={1}
                            trailColor={'#dfe6e9'}
                            trailWidth={1}
                            strokeColor="black"/>
                        </div>
                      ))
                    }
                  </div>

                  <h3 className="font-bold mt-6 text-sm">
                    Snapshots
                  </h3>

                  <div className="mt-2">
                    {appSnapshots?.flatMap((i) => (
                      <div>
                        <span className="text-xs text-gray-500">{getName(i.country)}</span>
                        <div className="space-y-2">
                          {
                            _.takeRight(i.statesAsoPages, 6).flatMap(state => (
                                <div onClick={() => {
                                  setSelectedSnapshot(state.details)
                                }} className={
                                  classNames("w-full border-2 flex flex-row justify-between border-transparent cursor-pointer bg-gray-50 rounded-lg px-2.5 py-2", {
                                    "border-2 border-gray-700": selectedSnapshot == state.details
                                  })
                                }>
                                  <div className="flex flex-row space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                         className="w-4 h-4">
                                      <path d="M9.5 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                                      <path
                                          fillRule="evenodd"
                                          d="M2.5 5A1.5 1.5 0 0 0 1 6.5v5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 13.5 5h-.879a1.5 1.5 0 0 1-1.06-.44l-1.122-1.12A1.5 1.5 0 0 0 9.38 3H6.62a1.5 1.5 0 0 0-1.06.44L4.439 4.56A1.5 1.5 0 0 1 3.38 5H2.5ZM11 8.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                          clipRule="evenodd"/>
                                    </svg>

                                    <span className="text-xs text-black">{i.term}</span>
                                  </div>

                                  <span className="text-xs text-gray-500">{moment(state.snapAt).fromNow()}</span>
                                </div>
                            ))
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Else>
        </If>
      </FirebaseAnalytic>
    </RootLayout>
  );
}
