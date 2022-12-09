import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (() => {
    throw redirect(307, '/stop/25');
}) satisfies LayoutServerLoad;
