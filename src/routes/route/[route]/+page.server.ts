import type { routeDB } from '$lib/routeDB';
import type { PageServerLoad } from './$types';
import type { Collection } from "mongodb";

export const load = (async ({ params, locals, depends }) => {
    const code = params.route;

    depends('vehicleDB');

    return {
        code,
        db: getDB(code, locals)
    };
}) satisfies PageServerLoad;

async function getDB(code: string, locals: App.Locals) {
    const { routes }: { routes: Collection<routeDB> } = locals;

    const route = routes.findOne({ code }, { projection: { _id: 0, provider: 0 } }) as Promise<routeDB>;

    return route;
}
