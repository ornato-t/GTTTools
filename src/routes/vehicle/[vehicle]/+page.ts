import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    const code = params.vehicle;
    return {
        code,
    };
}) satisfies PageLoad;