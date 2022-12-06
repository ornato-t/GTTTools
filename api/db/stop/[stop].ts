import { MongoClient } from "mongodb"

export const config = {
  runtime: 'experimental-edge',
};

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async (req: Request) => {
  await client.connect();
  const db = client.db('GTTTools').collection('stops')
  const code = parseInt((req.url.match(/\d{1,}/gm) as string[])[0]);
  const res = await db.findOne({ code: code });

  return new Response(JSON.stringify({ code: code, cunt: true, query: res }));
}
