import RootLayout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NextSeo } from "next-seo";
import FirebaseAnalytic from "@/components/FirebaseAnalytic";
import { useRouter } from "next/router";
import {
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

export default function App() {
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(true);
  const [appSnapshots, setAppSnapshots] = useState<
    AppSnapshotDto[] | undefined
  >();
  const [documentTitle, setDocumentTitle] = useState("ASOVizor | App overview");
  const [chartPositions, setChartPositions] = useState<any[][] | undefined>();

  useEffect(() => {
    axios
      .get("/api/watcherInfo", {
        params: {
          appId: router.query.appId,
        },
      })
      .then((response) => {
        if (_.isArray(response.data.body) && !_.isEmpty(response.data.body)) {
          setAppSnapshots(response.data.body);

          const chartData = response.data.body?.flatMap((i: any) => {
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
          title={documentTitle}
          description="Your assistant in ASO market analysis"
        />

        <Navbar activeHref="/app" />

        <If condition={isFetching}>
          <Then>
            <LoaderIndicator text="Searching snapshots" />
          </Then>

          <Else>
            <If condition={appSnapshots != undefined}>
              <Then>
                <div className="py-16 w-full px-4 lg:px-8 space-y-10">
                  <div>
                    <div className="lg:w-1/2 mb-3">
                      <h3 className="font-bold text-lg">
                        ASO page change history
                      </h3>
                      <p className="text-gray-500 text-xs">
                        All changes to the ASO page that were noticed by
                        ASOVizor.
                      </p>
                    </div>

                    {appSnapshots?.map((i) => (
                      <div className="mt-4 block">
                        <h6 className="uppercase text-gray-500 text-xs font-semibold">
                          "{i.term}" in {getName(i.country)}
                        </h6>

                        <div className="grid grid-cols-3 mt-2">
                          {i.statesAsoPages.map((details) => (
                            <div className="border border-gray-300 bg-white drop-shadow-sm rounded-lg flex flex-row px-2 py-2 gap-2">
                              <img
                                src={details.details.icon}
                                alt=""
                                className="w-14 h-14 drop-shadow-sm rounded-lg border border-gray-300"
                              />
                              <div>
                                <h6 className="text-sm font-semibold">
                                  {details.details.title}
                                </h6>
                                <p className="line-clamp-3 text-xs text-gray-500">
                                  {details.details.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="lg:w-1/2 mb-3">
                      <h3 className="font-bold text-lg">
                        Positions in search results
                      </h3>
                      <p className="text-gray-500 text-xs">
                        Every day we monitor the positions in the search results
                        for this application in order to save and build its
                        graph. Whenever you click on an app's 'eye' icon, we
                        start tracking its rankings for your active search.
                      </p>
                    </div>

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {chartPositions?.map((data) => (
                        <div>
                          <div
                            className="bg-gray-50 bg-opacity-75 p-4 rounded-xl"
                            style={{
                              width: "100%",
                              height: 200,
                            }}
                          >
                            <ResponsiveContainer>
                              <LineChart syncId="chartIndex" data={data}>
                                {/*<XAxis dataKey="at"/>*/}
                                {/*<YAxis/>*/}
                                <Tooltip
                                  content={(i) => (
                                    <div className="w-36 border border-gray-300 rounded-lg drop-shadow-sm bg-white z-50 ">
                                      <p className="text-xs text-balance px-2 py-1">
                                        {moment(
                                          _.get(_.get(data, i.label), "at"),
                                        ).format("DD.MM.YYYY")}
                                        {/*{(new Date(_.get(data, i.label))).toLocaleString()}*/}
                                      </p>
                                    </div>
                                  )}
                                />
                                {/*<Legend />*/}
                                <CartesianGrid
                                  stroke="#eee"
                                  strokeDasharray="5 5"
                                />
                                <Line
                                  connectNulls
                                  type="linearClosed"
                                  strokeWidth={2}
                                  dataKey="index"
                                  stroke="#8884d8"
                                />
                              </LineChart>
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
                </div>
              </Then>

              <Else>
                <MessageWithLogo
                  title="Nothing found"
                  text="If you just became the first person to monitor this application, the snapshots are probably not ready yet. We scan apps every day at midnight, please try again later"
                />
              </Else>
            </If>
          </Else>
        </If>
      </FirebaseAnalytic>
    </RootLayout>
  );
}
