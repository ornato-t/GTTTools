import { MongoClient } from "mongodb"
import { MONGODB_URI } from "$env/static/private";
import type { Handle, HandleServerError } from '@sveltejs/kit';

const client = new MongoClient(MONGODB_URI as string);
await client.connect();

export const handle: Handle = (async ({ event, resolve }) => {
    event.locals.stops = client.db('GTTTools').collection('stops');
    event.locals.routes = client.db('GTTTools').collection('routes');

    return resolve(event)
});


export const handleError = (({ error, event }) => {
    console.error(error);
    const route = event.route.id;

    switch (route) {
        case '/proxy/route/[route]':
            return {
                message: 'GTT API offline',
                status: 503
            };
        case '/proxy/stop/[stop]':
            return {
                message: 'GTT API offline',
                status: 503
            };
        default:
            return {
                message: 'Internal server error',
                status: 500
            };

    }

}) satisfies HandleServerError;