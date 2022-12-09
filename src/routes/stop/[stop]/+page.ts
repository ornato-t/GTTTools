// import type { stop } from '$lib/stop';
import type { stopDB } from '$lib/stopDB';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const code = parseInt(params.stop);
    return {
        code,
        // api: getStop(code),
        db: getDB(code)
    };
}

//This is being lazily rendered on client side for better performance (quicker interactivity), it takes 1000+ ms to load
// async function getStop(stop: number) {
//     const station = await fetch(`https://tools.gtt.cx/proxy/stop/${stop}`);
//     // const station = await fetch(`http://localhost:5173/proxy/stop/${stop}`);
    
//     return station.json() as Promise<stop[]>;
// }

async function getDB(stop: number) {
    const station = await fetch(`https://tools.gtt.cx/proxy/stopDB/${stop}`);
    // const station = await fetch(`http://localhost:5173/proxy/stopDB/${stop}`);

    return station.json() as Promise<stopDB>;
}