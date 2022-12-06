import { MongoClient } from "mongodb"

interface stopDB {
  code: number,
  name: string,
  description: string,
  // city: string,
  coordinates: coordinates
}

interface coordinates {
  lat: number,
  lon: number
}

const client = new MongoClient(process.env.MONGODB_URI as string);

export default async function handler(request: Request, response: any) {  //Can't use type Response, it breaks the return value
  await client.connect();
  const db = client.db('GTTTools').collection('stops')
  const code = parseInt((request.url.match(/\d{1,}/gm) as string[])[0]);
  const res = await db.findOne({ code: code }, { projection: { _id: 0, code: 0, city: 0 } }) as any;

  response.status(200).json({
    data: {
      name: res.name,
      description: res.description,
      coordinates: {
        lat: res.coordinates[1],
        lon: res.coordinates[0],
      }
    }
  });
}
