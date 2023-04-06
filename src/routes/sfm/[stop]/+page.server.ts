import type { stopDB } from '$lib/stopDB';
import type { PageServerLoad } from './$types';
import type { Collection } from "mongodb";

//DB data is returned first, passed to the client load page. This never changes, so it shouldn't expire
export const load: PageServerLoad = async ({ params, locals, depends }) => {
    depends('stopDB')

    const { stops }: { stops: Collection<stopDB> } = locals;
    const trainCode = parseInt(params.stop);

    const res = stops.findOne({ trainCode }, { projection: { _id: 0 } }) as Promise<stopDB>;

    return {
        code: trainCode,
        db: res
    };
}
