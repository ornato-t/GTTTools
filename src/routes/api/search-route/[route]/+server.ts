import type { routeDB } from "$lib/routeDB";
import type { RequestHandler } from "@sveltejs/kit";

const STOP_NUM = 10;

//Fetch all info regarding departing vehicles from a stop (by name, description or code)
export const GET: RequestHandler = async ({ params, locals }) => {
    const { routes } = locals;
    const route = params.route as string;
    const aggr = [{
        $search: {
            index: 'autocomplete_routes',
            compound: {
                should: [
                    { autocomplete: { query: route, path: 'code.displayed', score: { boost: { value: 3 } } } },
                    { autocomplete: { query: route, path: 'name' } },
                    { autocomplete: { query: route, path: 'type.plain' } },
                    { text: { query: route, path: 'type.plain' } },
                    { text: { query: route, path: 'code.displayed', score: { boost: { value: 5 } } } },
                    { range: { path: 'codeInt', gte: Number.parseInt(route), lte: Number.parseInt(route) } },
                    { text: { query: 'GTT Servizio Urbano', path: 'provider' } }
                ]
            }
        }
    }, {
        $project: { _id: 0 }
    }, {
        $limit: STOP_NUM
    }];

    const res = await routes.aggregate(aggr).toArray() as routeDB[];

    return new Response(JSON.stringify(res));
}
