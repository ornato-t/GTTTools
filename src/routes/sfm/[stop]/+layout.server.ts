import type { stopDB } from '$lib/stopDB';
import type { LayoutServerLoad } from './$types';
import type { Collection } from "mongodb";
import { poll } from '$lib/poll/sfm';

//DB data is returned first, passed to the client load page. This never changes, so it shouldn't expire
export const load: LayoutServerLoad = async ({ params, locals, depends }) => {
    depends('stop')

    const { stops }: { stops: Collection<stopDB> } = locals;
    const trainCode = parseInt(params.stop);

    const res = stops.findOne({ trainCode }, { projection: { _id: 0 } }) as Promise<stopDB>;

    return {
        code: trainCode,
        db: res,
        api: { promise: poll(trainCode) },
    };
}
