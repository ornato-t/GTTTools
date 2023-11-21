import type { routeDB } from '$lib/routeDB';
import type { stopDB } from '$lib/stopDB';
import type { trip } from '$lib/trip';
import * as L from 'leaflet';
import * as LP from 'leaflet-polylineoffset';
import type { Collection } from 'mongodb';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	namespace App {
		interface Locals {
			stops: Collection<stopDB>,
			routes: Collection<routeDB>,
			trips: Collection<trip>,
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}

declare module 'leaflet-polylineoffset';

declare module 'leaflet' {
    interface PolylineOptions {
        offset?: number
    }
}