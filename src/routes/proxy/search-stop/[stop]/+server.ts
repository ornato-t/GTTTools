import type { stopDB } from "$lib/stopDB";
import type { RequestHandler } from "@sveltejs/kit";

const STOP_NUM = 20;

//Fetch all info regarding departing vehicles from a stop (by name, description or code)
export const GET: RequestHandler = async ({ params, locals }) => {
    const { stops } = locals;
    const stop = params.stop as string;
    let aggr = [];  //Aggregation pipeline

    if (!Number.isNaN(stop)) {   //If search key is numeric add code lookup
        const code = parseInt(stop)
        aggr = [
            {
                $search: {
                    index: 'autocomplete_stops',
                    compound: {
                        should: [
                            { autocomplete: { query: stop, path: 'description' } },
                            { autocomplete: { query: stop, path: 'name' } },
                            { range: { path: 'code', gte: code, lte: code, score: { boost: { value: 100 } } } }
                        ]
                    }
                }
            },
            { $project: { _id: 0, city: 0, coordinates: 0 } },
            { $limit: STOP_NUM }
        ]
    } else {    //If search key is NOT numeric only look at name and descr 
        aggr = [
            {
                $search: {
                    index: 'autocomplete_stops',
                    compound: {
                        should: [
                            { autocomplete: { query: stop, path: 'description' } },
                            { autocomplete: { query: stop, path: 'name' } }
                        ]
                    }
                }
            },
            { $project: { _id: 0, city: 0, coordinates: 0 } },
            { $limit: STOP_NUM }
        ]
    }

    const res = await stops.aggregate(aggr).toArray() as stopDB[];

    return new Response(JSON.stringify(res));
}
