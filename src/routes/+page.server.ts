import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const stopForm = formData.get('stop') ?? { toString: () => '' };
        const stop = stopForm.toString();

        if (stop.length === 0) return { failure: true };

        redirect(303, `/stop/${stop}`);
    },
} satisfies Actions;