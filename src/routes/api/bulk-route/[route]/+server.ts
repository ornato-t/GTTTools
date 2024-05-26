import type { routeDB } from "$lib/routeDB";
import type { RequestHandler } from "@sveltejs/kit";

//Fetch all info about a list of routes
export const GET: RequestHandler = async ({ params, locals }) => {
    const { routes } = locals;

    const codes = params.route ?? '';
    const routeCodes = codes.split(',');
    
    const aggr = [
        { $match: { "code.internal": { $in: routeCodes } } },
        { $addFields: { weight: { $indexOfArray: [routeCodes, "$code"] } } },
        { $sort: { weight: 1 } },
        { $project: { _id: 0 } },
    ];

    const res = await routes.aggregate(aggr).toArray() as routeDB[];

    return new Response(JSON.stringify(res));
}
