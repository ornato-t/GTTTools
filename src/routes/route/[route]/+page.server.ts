import type { vehicle } from '$lib/vehicle';
import type { routeDB } from '$lib/routeDB';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Collection } from "mongodb";

export const load = (async ({ params, fetch, depends, locals }) => {
    const code = params.route;

    depends('vehicle');

    return {
        code,
        api: getRoute(code, fetch),
        db: getDB(code, locals)
    };
}) satisfies PageServerLoad;

async function getRoute(code: string, fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    let route: Response;

    try {   //Try to fetch from site first (faster)
        route = await fetch(`/api/route/${code}`, { signal: AbortSignal.timeout(1000) });   //Send timeout if request takes longer than a seconds
    } catch (e) {   //If it fails, resort to experimental API
        route = await fetch(`/api/route-experimental/${code}`);
    }

    if (route.status !== 200) {
        const err = await route.json();
        throw error(err.status ?? 500, { message: err.message });
    }

    return route.json() as Promise<vehicle[]>;
}

async function getDB(code: string, locals: App.Locals) {
    const { routes }: { routes: Collection<routeDB> } = locals;

    const route = routes.findOne({ code }, { projection: { _id: 0, provider: 0 } }) as Promise<routeDB>;

    return route;
}
