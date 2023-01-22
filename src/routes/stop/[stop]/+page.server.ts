import type { stopDB } from '$lib/stopDB';
import type { PageServerLoad } from './$types';
import type { Collection, Document } from "mongodb";

export const load: PageServerLoad = async ({ params, locals }) => {
    const { stops }: { stops: Collection<stopDB> } = locals;
    const code = parseInt(params.stop);

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
    ];

    const res = stops.aggregate(aggr).toArray().then((arr: Document[]) => {
        return arr[0] as stopDB;
    }) as Promise<stopDB>;

    return {
        code,
        db: res
    };
}
