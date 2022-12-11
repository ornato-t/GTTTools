import { MongoClient } from "mongodb"
import { MONGODB_URI } from "$env/static/private";
import type { PageServerLoad } from './$types';
import type { stopDB } from "$lib/stopDB";

const client = new MongoClient(MONGODB_URI as string);
const STOP_NUM = 20

export const load: PageServerLoad = async ({ params }) => {
    const [lat, lon, acc] = params.coords.split(';');

    return {
        stops: getDB(lat, lon),
        accuracy: acc
    };
}

async function getDB(lat: string, lon: string) {
    await client.connect();
    const db = client.db('GTTTools').collection('stops');
    const query = { coordinates: { $nearSphere: { $geometry: { type: 'point', coordinates: [parseFloat(lat), parseFloat(lon)] } } } }
    const projection = { _id: 0, coordinates: 0, city: 0 }

    const cursor = db.find(query).limit(STOP_NUM).project(projection).toArray() as Promise<stopDB[]>;

    return cursor;
}
