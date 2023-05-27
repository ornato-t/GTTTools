import { encodeRoute, type vehicle } from '$lib/vehicle';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch, depends, data }) => {
    depends('vehicle');

    return {
        code: data.code,
        api: getRoute(data.code, fetch),
        db: data.db,
        routes: data.routes
    };
});

async function getRoute(code: string, fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    const route = await fetch(`/api/route/${encodeRoute(code)}`);
    
    if (route.status !== 200) {
        const err = await route.json();
        throw error(err.status ?? 500, { message: err.message });
    }

    return route.json() as Promise<vehicle[]>;
}
