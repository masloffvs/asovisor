import {string} from "superstruct";
import type {NextApiRequest, NextApiResponse} from "next";
import {$mongoClient} from "@/kit/MongoKit";
import _ from "lodash";
import {AppDto} from "@/dto/AppDto";

const memoized = require('app-store-scraper').memoized({ maxAge: 1000 * 60 });

async function query(data: any) {
  const response = await fetch(
      "https://api-inference.huggingface.co/models/transformer3/H2-keywordextractor",
      {
        headers: { Authorization: "Bearer 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" },
        method: "POST",
        body: JSON.stringify(data),
      }
  );
  const result = await response.json();
  return result;
}


type ResponseData = {
  message: string;
  body?: any;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "GET") {
    return res.status(405).send({ message: "Only GET requests allowed" });
  }

  $mongoClient
    .db("extend")
    .collection("appAiInfo")
    .findOne({
      appId: parseInt(String(req.query.appId)),
      lang: req.query.lang,
      country: req.query.country,
    })
    .then(async (appRecord) => {
      if (appRecord == null) {
        memoized.app({
          id: parseInt(String(req.query.appId)),
          lang: req.query.lang,
          country: req.query.country,
        }).then(async (appInfo: AppDto) => {
          const emotionClassificationResponse = await fetch(
              "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions",
              {
                headers: {Authorization: "Bearer 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"},
                method: "POST",
                body: JSON.stringify({
                  inputs: appInfo.description
                }),
              }
          );

          const keywordClassificationResponse = await fetch(
              "https://api-inference.huggingface.co/models/transformer3/H2-keywordextractor",
              {
                headers: {Authorization: "Bearer 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"},
                method: "POST",
                body: JSON.stringify({
                  inputs: appInfo.description
                }),
              }
          );

          const keywordsRaw = _.get(await keywordClassificationResponse.json(), "0.summary_text")
          const emotionClassification = _.first(await emotionClassificationResponse.json())

          const document = {
            emotionClassification: emotionClassification,
            keywordClassification: keywordsRaw?.split(",")?.map(_.trim)?.map(_.lowerCase)
          }

          await $mongoClient
            .db("extend")
            .collection("appAiInfo")
            .insertOne({
              appId: parseInt(String(req.query.appId)),
              ...document
            })

          return res.status(201).send({
            message: "Record created!",
            body: document,
          });
        })
            .catch((e: any) => {
              return res.status(500).send({
                message: String(e),
              });
            })
      } else {
        return res.status(200).send({
          message: "Record found!",
          body: appRecord,
        });
      }
    });
}