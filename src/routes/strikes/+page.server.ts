import { poll } from '$lib/poll/strikes';
import { error } from '@sveltejs/kit';

//Fetch strike data from the ministry's RSS feed
export async function load() {
    return {
        api: proxy(),
    };
}

async function proxy() {
    try {
        return await poll();
    } catch (e) {
        error(503, "Can't access Ministry's strike data");
    }
}