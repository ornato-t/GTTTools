import type { stopDB } from "$lib/stopDB";
import type { RequestHandler } from "@sveltejs/kit";

//Fetch all info about a list of stops
export const GET: RequestHandler = async ({ params, locals }) => {
    const { stops } = locals;

    const codes = params.stops ?? '';
    const stopCodes = codes.split(',').map(el => Number.parseInt(el));

    const aggr = [
        { $match: { code: { $in: stopCodes }, metro: { $ne: true }, train: { $ne: true } } },
        {
            $addFields: {
                name: { $toUpper: "$name" }, description: { $toUpper: "$description" },
                city: { $toUpper: "$city" }, weight: { $indexOfArray: [stopCodes, "$code"] }    //Add a weight equivalent to the index in the original array
            },
        },
        { $sort: { weight: 1 } },    //Sort the array by position in the original array
        { $project: { _id: 0, coordinates: 0, weight: 0 } },
    ];

    const res = await stops.aggregate(aggr).toArray() as stopDB[];

    return new Response(JSON.stringify(res));
}
