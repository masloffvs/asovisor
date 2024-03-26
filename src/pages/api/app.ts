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


  (store.app({
    id: parseInt(String(req.query.appId)),
    lang: req.query.lang,
    country: req.query.country,
  }) as Promise<any>)
    .catch((e) => res.status(500).json({ message: String(e) }))
    .then((results) =>
      res.status(200).json({ body: results, message: "Done!" }),
    );
}
