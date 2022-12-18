import type { stopDB } from "$lib/stopDB";
import type { RequestHandler } from "@sveltejs/kit";

const STOP_NUM = 20;

//Fetch all info regarding departing vehicles from a stop (by name, description or code)
export const GET: RequestHandler = async ({ params, locals }) => {
    const { stops } = locals;
    const stop = params.stop as string;
    const skeleton = [
        {},
        { $project: { _id: 0, coordinates: 0 } },
        { $addFields: { name: { $toUpper: "$name" }, description: { $toUpper: "$description" }, city: { $toUpper: "$city" } } },
        { $limit: STOP_NUM }
    ];
    let aggr = new Array<object>;

    if (!Number.isNaN(stop)) {   //If search key is numeric add code lookup
        const code = parseInt(stop)
        const search = {
            $search: {
                index: 'autocomplete_stops', compound: {
                    should: [
                        { autocomplete: { query: stop, path: 'description' } },
                        { autocomplete: { query: stop, path: 'name' } },
                        { range: { path: 'code', gte: code, lte: code, score: { boost: { value: 100 } } } }
                    ]
                }
            }
        }

        aggr = skeleton.map((stage, i) => {
            if (i === 0) return search;
            else return stage;
        });
    } else {    //If search key is NOT numeric only look at name and descr 
        const search = {
            $search: {
                index: 'autocomplete_stops', compound: {
                    should: [
                        { autocomplete: { query: stop, path: 'description' } },
                        { autocomplete: { query: stop, path: 'name' } }
                    ]
                }
            }
        }

        aggr = skeleton.map((stage, i) => {
            if (i === 0) return search;
            else return stage;
        });
    }

    const res = await stops.aggregate(aggr).toArray() as stopDB[];

    return new Response(JSON.stringify(res));
}
