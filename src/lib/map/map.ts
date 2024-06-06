import { isDarkTheme } from '$lib/stores/theme';
import type { Map } from 'leaflet';
type LeafletTypeBase = typeof import('leaflet');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeafletType = LeafletTypeBase & { default: any };

//NOTE: I can't put this in a .env. If you scrape it, please don't do anything bad with this. The API is free, make your own account
const THUNDERSTORM_API_KEY = '2fb67f9012444a348a5b2abdb3e02643';

export function placeTiles(L: LeafletType, map: Map) {
    const { url, config } = getTiles();

    L.tileLayer(url, config).addTo(map);

    return L;
}

function getTiles(): Tiles {
    const light = {
        name: 'CartoDB Voyager',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        config: {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20,
            minZoom: 10
        }
    };
    const dark1 = {
        name: 'CartoDB DarkMatter',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        config: {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20,
            minZoom: 10
        }
    };

    const dark2 = {
        name: 'Stadia AlidadeSmoothDark',
        url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
        config: {
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            maxZoom: 20,
            minZoom: 10,
        }
    };

    const dark3 = {
        name: 'Thunderforest SpinalMap',
        url: 'https://{s}.tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey={apikey}',
        config: {
            attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abc',
            maxZoom: 20,
            minZoom: 10,
            apikey: THUNDERSTORM_API_KEY,
        }
    };

    return isDarkTheme() ? dark2 : light;
}

interface Tiles {
    name: string,
    url: string,
    config: {
        attribution: string,
        subdomains: string,
        maxZoom: number,
        minZoom: number
    }
}
