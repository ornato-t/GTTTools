import { MongoClient, ObjectId } from "mongodb"
import { MONGODB_URI } from "$env/static/private";
import type { routeDB } from "$lib/routeDB";
import type { RequestHandler } from "@sveltejs/kit";

const client = new MongoClient(MONGODB_URI as string);

interface routeDBAPI {
    _id: ObjectId,
    code: string,
    name: string,
    type: string,
    provider: string
}

export const GET: RequestHandler = async ({ params }) => {
    return new Response(JSON.stringify(await pollDB(params.route as string)));
}

//Fetch all info regarding departing vehicles from a stop (by number)
export async function pollDB(code: string) {
    await client.connect();
    const db = client.db('GTTTools').collection('routes');

    const route = await db.findOne({ code: code }, { projection: { _id: 0, provider: 0 } }) as routeDBAPI as routeDB;

    return route;
}