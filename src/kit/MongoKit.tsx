import { $configKit } from "../kit/ConfigKit";

import { MongoClient } from "mongodb";

// Connection URL
const url = $configKit.getProp("mongo.url");

export const $mongoClient = new MongoClient(url);
