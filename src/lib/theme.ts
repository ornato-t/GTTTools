import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

export const LIGHT = 'customLight';
export const DARK = 'night';

// Define the themes
const themes = {
    light: LIGHT,
    dark: DARK
};

// Function to get the theme from local storage or set a default theme
function getInitialTheme(): string {
    if (!browser) return '';    //If no theme is specified the default browser setting is followed

    const stored = localStorage.getItem('theme');

    //If a theme is saved switch to it
    if (stored !== null) return stored;

    //If the user prefers dark mode swap to dark (only if nothing is saved)
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return themes.dark;

    //Default to light theme
    return themes.light;
}

// Create the store
export const theme: Writable<string> = writable(getInitialTheme(), () => {
    const unsubscribe: () => void = theme.subscribe((value: string) => {
        if (browser) localStorage.setItem('theme', value);
    });

    return unsubscribe;
});

// Function to toggle the theme
export function toggleTheme(): void {
    theme.update((theme: string) => {
        return theme === themes.light ? themes.dark : themes.light;
    });
}
