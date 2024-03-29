import type { stopDB } from '$lib/stopDB';
import type { LayoutServerLoad } from './$types';
import type { Collection } from "mongodb";
import { pollStop } from '$lib/poll/stop';
import { error } from '@sveltejs/kit';

//DB data is returned first, passed to the client load page. This never changes, so it shouldn't expire
export const load: LayoutServerLoad = async ({ params, locals, depends }) => {
    depends('stop')

    const { stops }: { stops: Collection<stopDB> } = locals;
    const code = parseInt(params.stop);

    const res = stops.findOne({ code }, { projection: { _id: 0 } }) as Promise<stopDB>;

    return {
        code,
        db: res,
        api: { promise: getStop(code) }
    };
}

//Wraps pollStop and adds error checks
async function getStop(code: number) {
    try {
        return await pollStop(code);
    } catch (e) {
        if (e === 'noInfo') {
            throw error(404, { message: 'No information available' });
        } else {
            throw error(500, { message: 'GTT API is offline' });
        }
    }
}
