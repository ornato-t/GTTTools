import type { vehicle } from '$lib/vehicle';
import type { routeDB } from '$lib/routeDB';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import fetch from '$lib/proxyRequest';

export const load = (async ({ params }) => {
    const code = params.route;
    return {
        code,
        api: getRoute(code),
        db: getDB(code)
    };
}) satisfies PageLoad;

async function getRoute(code: string) {
    const route = await fetch(`/proxy/route/${code}`);

    if (route.status !== 200) {
        const err = await route.json();
        throw error(err.status ?? 500, { message: err.message });
    }

    return route.json() as Promise<vehicle[]>;
}

async function getDB(code: string) {
    const route = await fetch(`/proxy/routeDB/${code}`);

    if (route.status !== 200) throw error(route.status, {
        message: "Couldn't fetch from routes database"
    });

    return route.json() as Promise<routeDB>;
}
