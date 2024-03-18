const memoized = require('app-store-scraper').memoized({ maxAge: 1000 * 60 });

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

const Request = object({
  term: string(),
  lang: string(),
  country: string(),
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

  (memoized.suggest(req.body) as Promise<any>)
    .catch((e) => res.status(500).json({ message: String(e) }))
    .then((results) =>
      res.status(200).json({ body: results, message: "Done!" }),
    );
}
