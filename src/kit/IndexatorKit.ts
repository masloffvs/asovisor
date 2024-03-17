import { $mongoClient } from "./MongoKit";
import { AppDto } from "../dto/AppDto";
import _ from "lodash";
import hash from "object-hash";
import { $loggerKit } from "./LoggerKit";

const store = require("app-store-scraper");

class IndexatorKit {
  indexEverything() {
    const out = $mongoClient
      .db("extend")
      .collection("watch")
      .find({})
      .toArray();

    const collectionMetric = $mongoClient.db("extend").collection("appMetric");

    out
      .then((results) => {
        results.map((result) => {
          if (result.term && result.country && result.lang) {
            store
              .search({
                term: result.term,
                country: result.country,
                lang: result.lang,
              })
              .then(async (applications: AppDto[]) => {
                for (const application of _.toPairs(applications)) {
                  const indexApp = Number(application[0]) + 1;
                  const appDetails = application[1];

                  if (appDetails.id == result.appId) {
                    const selector = {
                      appId: appDetails.id,
                      term: result.term,
                      country: result.country,
                      lang: result.lang,
                    };

                    const appCountInMetricDb =
                      await collectionMetric.countDocuments(selector);

                    if (appCountInMetricDb == 0) {
                      collectionMetric
                        .insertOne({
                          ...selector,

                          lastIndex: new Date(),

                          actualIndex: indexApp,
                          lastHashOfState: hash(appDetails),

                          storyOfPositions: [
                            {
                              snapAt: new Date(),
                              index: indexApp,
                            },
                          ],

                          statesAsoPages: [
                            {
                              snapAt: new Date(),
                              details: appDetails,
                            },
                          ],
                        })
                        .then((i) => {
                          $loggerKit
                            .getLogger()
                            .info(
                              `Inserted state for ${appDetails.id}. AppPos: ${indexApp}; ID: ${i.insertedId};`,
                            );
                        })
                        .catch((e) => {
                          $loggerKit
                            .getLogger()
                            .error(
                              `Dont inserted state for ${appDetails.id}. Error: ${JSON.stringify(e)}`,
                            );
                        });
                    } else {
                      const lastDocumentAppLine =
                        await collectionMetric.findOne(selector);

                      if (
                        lastDocumentAppLine?.lastHashOfState != hash(appDetails)
                      ) {
                        collectionMetric
                          .updateOne(selector, {
                            $set: {
                              lastIndex: new Date(),
                              actualIndex: indexApp,
                              lastHashOfState: hash(appDetails),
                            },

                            $addToSet: {
                              storyOfPositions: {
                                $each: [
                                  {
                                    snapAt: new Date(),
                                    index: indexApp,
                                  },
                                ],
                              },
                              statesAsoPages: {
                                $each: [
                                  {
                                    snapAt: new Date(),
                                    details: appDetails,
                                  },
                                ],
                              },
                            },
                          })
                          .then((i) => {
                            $loggerKit
                              .getLogger()
                              .info(
                                `Updated state for ${appDetails.id}. AppPos: ${indexApp}; ModCount: ${i.modifiedCount};`,
                              );
                          })
                          .catch((e) => {
                            $loggerKit
                              .getLogger()
                              .error(
                                `Dont updated state for ${appDetails.id}.`,
                              );
                            $loggerKit.getLogger().error(e);
                          });
                      } else {
                        collectionMetric
                          .updateOne(selector, {
                            $set: {
                              actualIndex: indexApp,
                              lastIndex: new Date(),
                            },

                            $addToSet: {
                              storyOfPositions: {
                                $each: [
                                  {
                                    snapAt: new Date(),
                                    index: indexApp,
                                  },
                                ],
                              },
                            },
                          })
                          .then((i) => {
                            $loggerKit
                              .getLogger()
                              .info(
                                `Updated only index positions for ${appDetails.id}. AppPos: ${indexApp}; ModCount: ${i.modifiedCount};`,
                              );
                          })
                          .catch((e) => {
                            $loggerKit
                              .getLogger()
                              .error(
                                `Dont updated only index positions for ${appDetails.id}.`,
                              );
                            $loggerKit.getLogger().error(e);
                          });
                      }
                    }

                    break;
                  }
                }
              })
              .catch((e: any) => {
                $loggerKit
                  .getLogger()
                  .error(`Dont fetch info about app by "${String(e)}"`);
              });
          }
        });
      })
      .catch($loggerKit.getLogger().error);
  }
}

export const $indexatorKit = new IndexatorKit();

export default IndexatorKit;
