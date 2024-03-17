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

const Request = object({
  appId: number(),
  term: string(),
  country: string(),
  lang: string(),
});

type ResponseData = {
  message: string;
  body?: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  if (!is(req.body, Request)) {
    return res
      .status(400)
      .send({ message: validate(req.body, Request).join(", ") });
  }

  const document = {
    appId: req.body.appId,
    term: req.body.term,
    country: req.body.country,
    lang: req.body.lang,
  };

  $mongoClient
    .db("extend")
    .collection("watch")
    .countDocuments(document)
    .then((count) => {
      if (count == 0) {
        $mongoClient
          .db("extend")
          .collection("watch")
          .insertOne(document)
          .then(() => {
            return res.status(201).send({
              message:
                "This app has been successfully added to the list of monitored apps",
            });
          })
          .catch((e) => {
            return res.status(500).send({ message: String(e) });
          });
      } else {
        return res
          .status(409)
          .send({ message: "This application is already being tracked" });
      }
    });
}
