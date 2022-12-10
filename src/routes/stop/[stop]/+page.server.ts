import { MongoClient } from "mongodb"
import { MONGODB_URI } from "$env/static/private";
import type { stopDB } from '$lib/stopDB';
import type { PageServerLoad } from './$types';

const client = new MongoClient(MONGODB_URI as string);

export const load: PageServerLoad = async ({ params }) => {
    const code = parseInt(params.stop);
    return {
        code,
        db: getDB(code)
    };
}

async function getDB(code: number) {
    await client.connect();
    const db = client.db('GTTTools').collection('stops');

    const aggr = [
        { '$match': { 'code': code } },
        { '$addFields': { 'coords': '$coordinates' } },
        { '$project': { '_id': 0, 'coordinates': 0 } },
        {
            '$addFields': {
                'coordinates.lat': { '$arrayElemAt': ['$coords', 1] },
                'coordinates.lon': { '$arrayElemAt': ['$coords', 0] }
            }
        },
        { '$project': { 'coords': 0 } },
    ]

    const stops = (await db.aggregate(aggr).toArray())[0] as stopDB
    
    return stops;
}

