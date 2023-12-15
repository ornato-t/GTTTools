import { poll } from '$lib/poll/strikes';
import { error } from '@sveltejs/kit';

//Fetch strike data from the ministry's RSS feed
export async function load() {
    return {
        api: { promise: proxy() },   //Nested promise leverages the streaming API. It's awaited on the client side
    };
}

async function proxy() {
    try {
        return await poll();
    } catch (e) {
        error(503, "Can't access Ministry's strike data");
    }
}