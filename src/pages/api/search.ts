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
import {AppDto} from "@/dto/AppDto";

const memoized = require('app-store-scraper').memoized({ maxAge: 1000 * 60 });

const Request = object({
  term: nonempty(string()),
  lang: nonempty(string()),
  country: nonempty(string()),
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

  const startIndex = parseInt(String(req.query.start || '1'))
  const endIndex = parseInt(String(req.query.end || '2'))

  const pages: Promise<AppDto[]>[] = _.range(startIndex, endIndex).map(pageIndex => memoized.search({...req.body, page: pageIndex}))

  Promise.allSettled(pages).then(promises => {
    const results = promises
      .flatMap(i => {
        if (i.status == 'fulfilled') {
          return i.value
        }

        return null
      })
      .filter(i => !_.isEmpty(i))

    res.status(200).json({ body: results, message: "Done!" })
  }).catch(e => res.status(500).json({ message: String(e) }))

  // (memoized.search(req.body) as Promise<any>)
  //   .catch((e) => res.status(500).json({ message: String(e) }))
  //   .then((results) =>
  //     res.status(200).json({ body: results, message: "Done!" }),
  //   );
}
