import type { vehicle } from '$lib/vehicle';
import type { routeDB } from '$lib/routeDB';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const code = params.route;
    return {
        code,
        api: getRoute(code),
        db: getDB(code)
    };
}

async function getRoute(code: string) {
    const route = await fetch(`https://tools.gtt.cx/proxy/route/${code}`);
    // const route = await fetch(`http://localhost:5173/proxy/route/${code}`);
    
    return route.json() as Promise<vehicle[]>;
}

async function getDB(code: string) {
    const route = await fetch(`https://tools.gtt.cx/proxy/routeDB/${code}`);
    // const route = await fetch(`http://localhost:5173/proxy/routeDB/${code}`);
    
    return route.json() as Promise<routeDB>;
}
