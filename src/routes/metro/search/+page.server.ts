import type { stopDB } from '$lib/stopDB';
import type { PageServerLoad } from './$types';
import type { Collection } from "mongodb";

//Return all metro stops on the first load
export const load: PageServerLoad = async ({ locals }) => {
    const { stops }: { stops: Collection<stopDB> } = locals;

    const res = stops.find<stopDB>({ metro: true }, { projection: { _id: 0 } }).sort({name: 1}).toArray();

    return {
        db: await res
    };
}
