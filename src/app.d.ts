import * as L from 'leaflet';
import * as LP from 'leaflet-polylineoffset';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {stops, routes, trips}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

declare module 'leaflet-polylineoffset';

declare module 'leaflet' {
    interface PolylineOptions {
        offset?: number
    }
}