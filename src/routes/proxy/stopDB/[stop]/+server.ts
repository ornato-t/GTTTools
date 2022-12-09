import { MongoClient, ObjectId } from "mongodb"
import { MONGODB_URI } from "$env/static/private";
import type { stopDB } from "$lib/stopDB";
import type { RequestHandler } from "@sveltejs/kit";

const client = new MongoClient(MONGODB_URI as string);

interface stopDBAPI {
    _id: ObjectId,
    code: number,
    name: string,
    description: string,
    city: string,
    coordinates: number[]
}

export const GET: RequestHandler = async ({ params }) => {
    return new Response(JSON.stringify(await pollDB(params.stop as string)));
}

//Fetch all info regarding departing vehicles from a stop (by number)
export async function pollDB(stop: string) {
    await client.connect();
    const db = client.db('GTTTools').collection('stops');

    const code = parseInt(stop);

    const stops = await db.findOne({ code: code }, { projection: { _id: 0, code: 0, city: 0 } }) as stopDBAPI;
    const result: stopDB = {
        code: code,
        name: stops.name,
        description: stops.description,
        coordinates: {
            lat: stops.coordinates[1],
            lon: stops.coordinates[0],
        }
    }

    return result;
}