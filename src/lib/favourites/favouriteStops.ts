import { browser } from '$app/environment';
import { writable } from 'svelte/store';

// Function to get the list of favourites from local storage
function getInitialFavouriteList(): Set<number> {
    if (!browser) return new Set();    //Return no favourites  during SSR

    const stored = localStorage.getItem('favouriteStop');
    if (!stored) return new Set();

    return new Set(JSON.parse(stored));
}

// Create the store
function createFavourites() {
    const { subscribe, set, update } = writable(getInitialFavouriteList());

    return {
        subscribe,
        set,
        update,
        add: (item: number) => update(favs => {
            if (!browser) return favs;

            favs.add(item);
            localStorage.setItem('favouriteStop', JSON.stringify([...favs]));
            return favs;
        }),
        delete: (item: number) => update(favs => {
            if (!browser) return favs;

            favs.delete(item);
            localStorage.setItem('favouriteStop', JSON.stringify([...favs]));
            return favs;
        })
    };
}

export const favourites = createFavourites();
