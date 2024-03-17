// @ts-ignore
import store from "app-store-scraper";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  is,
  validate,
  nonempty,
  object,
  number,
  string,
  array,
  StructError,
} from "superstruct";
import _ from "lodash";

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

  res.status(200).json({ message: "OK", body: _.toPairs(store.category) });
}
