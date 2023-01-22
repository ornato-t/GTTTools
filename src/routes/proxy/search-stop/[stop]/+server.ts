import type { stopDB } from "$lib/stopDB";
import type { RequestHandler } from "@sveltejs/kit";
import type { Collection } from "mongodb";

const STOP_NUM = 20;

//Fetch all info regarding departing vehicles from a stop (by name, description or code)
export const GET: RequestHandler = async ({ params, locals }) => {
    const { stops }: { stops: Collection<stopDB> } = locals;

    const stop = params.stop as string;
    const code = parseInt(stop);

    const aggr = [
        {
            $search: {
                index: 'autocomplete_stops', compound: {
                    should: [
                        { autocomplete: { query: stop, path: 'description' } },
                        { autocomplete: { query: stop, path: 'name' } },
                        { range: { path: 'code', gte: code, lte: code, score: { boost: { value: 100 } } } }
                    ]
                }
            }
        },
        { $project: { _id: 0, coordinates: 0 } },
        { $addFields: { name: { $toUpper: "$name" }, description: { $toUpper: "$description" }, city: { $toUpper: "$city" } } },
        { $limit: STOP_NUM }
    ];

    const res = await stops.aggregate(aggr).toArray() as stopDB[];

    return new Response(JSON.stringify(res));
}
