import { BangumiEntity } from "../type";
import { DB } from "./db";

export const bangumiDB = new DB<BangumiEntity>('bangumi', 'bangumi_list', 'name');