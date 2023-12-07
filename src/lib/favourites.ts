import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

// Function to get the list of favourites from local storage
function getInitialFavouriteList(): Set<number> {
    if (!browser) return new Set();    //Return no favourites  during SSR

    const stored = localStorage.getItem('favourites');
    if (!stored) return new Set();
    
    return new Set(...JSON.parse(stored));
}

// Create the store
export const favourites: Writable<Set<number>> = writable(getInitialFavouriteList(), () => {
    const unsubscribe: () => void = favourites.subscribe((value: Set<number>) => {
        if (browser) localStorage.setItem('favourites', JSON.stringify([...value]));
    });

    return unsubscribe;
});

// Function to toggle the theme
export function addFavourite(newFavourite: number): void {
    favourites.update((favourites: Set<number>) => {
        favourites.add(newFavourite);
        return favourites;
    });
}

// Function to toggle the theme
export function removeFavourite(newFavourite: number): void {
    favourites.update((favourites: Set<number>) => {
        favourites.delete(newFavourite);
        return favourites;
    });
}
