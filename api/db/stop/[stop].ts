import { MongoClient } from "mongodb"

export const config = {
  runtime: 'experimental-edge',
};

const client = new MongoClient(process.env.MONGODB_URI as string);
await client.connect();
const db = client.db('GTTTools').collection('stops')

export default async (req: Request) => {
  const code = parseInt((req.url.match(/\d{1,}/gm) as string[])[0]);
  const res = await db.findOne({ code: code });

  return new Response(JSON.stringify({ code: code, cunt: true, query: res }));
}
