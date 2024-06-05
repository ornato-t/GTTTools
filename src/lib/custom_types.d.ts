import type { RequestEvent } from '@sveltejs/kit';

export type Fetch_t = RequestEvent['fetch'];    //This is the fetch() function passed to load functions
