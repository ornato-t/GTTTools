import type { vehicle } from '$lib/vehicle';
import type { routeDB } from '$lib/routeDB';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, fetch, depends }) => {
    const code = params.route;

    depends('vehicle')

    return {
        code,
        api: getRoute(code, fetch),
        db: getDB(code, fetch)
    };
}) satisfies PageLoad;

async function getRoute(code: string, fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    const route = await fetch(`/api/route/${code}`);

    if (route.status !== 200) {
        const err = await route.json();
        throw error(err.status ?? 500, { message: err.message });
    }

    return route.json() as Promise<vehicle[]>;
}

async function getDB(code: string, fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    const route = await fetch(`/api/routeDB/${code}`);

    if (route.status !== 200) throw error(route.status, {
        message: "Couldn't fetch from routes database"
    });

    return route.json() as Promise<routeDB>;
}
