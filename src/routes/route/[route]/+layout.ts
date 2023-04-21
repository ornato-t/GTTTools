import type { vehicle } from '$lib/vehicle';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch, depends, data }) => {
    depends('vehicle');

    return {
        code: data.code,
        api: getRoute(data.code, fetch),
        db: data.db
    };
});

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
