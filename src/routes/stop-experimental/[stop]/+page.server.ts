import type { stop } from '$lib/stop';
import type { stopDB } from '$lib/stopDB';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Collection } from "mongodb";

export const load = (async ({ params, fetch, depends, locals }) => {
    const code = params.stop;

    depends('stop');

    return {
        code,
        api: getStop(code, fetch),
        db: getDB(code, locals)
    };
}) satisfies PageServerLoad;

async function getStop(code: string, fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    let stop: Response;

    try {   //Try to fetch from the experimental API first (faster)
        stop = await fetch(`/api/stop-experimental/${code}`, { signal: AbortSignal.timeout(3000) });   //Send timeout if request takes longer than 3 seconds
    } catch (e) {   //If it fails, resort to the site
        stop = await fetch(`/api/stop/${code}`);
    }

    if (stop.status !== 200) {
        const err = await stop.json();
        throw error(err.status ?? 500, { message: err.message });
    }

    return stop.json() as Promise<stop[]>;
}

async function getDB(code: string, locals: App.Locals) {
    const { stops }: { stops: Collection<stopDB> } = locals;

    const stop = stops.findOne({ code: Number.parseInt(code) }, { projection: { _id: 0 } }) as Promise<stopDB>;

    return stop;
}
