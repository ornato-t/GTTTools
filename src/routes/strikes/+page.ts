import type { strike } from '$lib/strikes';
import fetch from '$lib/proxyRequest';
import { error } from '@sveltejs/kit';

//Fetch strike data from the ministry's RSS feed
export async function load() {
    return {
        api: { promise: proxy() },   //Nested promise leverages the streaming API. It's awaited on the client side
    };
}

async function proxy() {
    try {
        const res = await fetch('/api/strikes');
        return await res.json() as strike[];
    } catch (e) {
        throw error(503, "Can't access Ministry's strike data");
    }
}