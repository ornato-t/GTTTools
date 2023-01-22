import type { routeDB } from "$lib/routeDB";
import type { RequestHandler } from "@sveltejs/kit";
import type { Collection } from "mongodb";

//Fetch all info regarding departing vehicles from a stop (by number)
export const GET: RequestHandler = async ({ params, locals }) => {
    const { routes }: { routes: Collection<routeDB> } = locals;

    const route = await routes.findOne({ code: params.route }, { projection: { _id: 0, provider: 0 } }) as routeDB;

    return new Response(JSON.stringify(route));
}
