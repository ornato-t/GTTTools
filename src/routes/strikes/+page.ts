import type { strike } from '$lib/strikes';
import type { Fetch_t } from '$lib/custom_types.js';
import { error } from '@sveltejs/kit';

//Fetch strike data from the ministry's RSS feed
export async function load({ fetch }) {
    return {
        api: { promise: proxy(fetch) }
    };
}

async function proxy(fetch: Fetch_t) {
    try {
        const res = await fetch('/api/strikes');
        return await res.json() as strike[];
    } catch (e) {
        throw error(503, "Can't access Ministry's strike data");
    }
}