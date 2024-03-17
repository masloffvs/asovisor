// @ts-ignore
import store from "app-store-scraper";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  is,
  validate,
  nonempty,
  empty,
  object,
  number,
  string,
  array,
  StructError,
} from "superstruct";
import { $mongoClient } from "../../kit/MongoKit";

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
    .collection("appMetric")
    .find({
      appId: parseInt(String(req.query.appId)),
    })
    .toArray()
    .then((appRecords) => {
      return res.status(200).send({
        message: "Records found!",
        body: appRecords,
      });
    });
}
