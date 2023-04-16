import { dev } from "$app/environment";

export default async function pfetch(url: string){
    //Vercel dev environment
    // return fetch("https://gtt-tools-ornato-t.vercel.app" + url)

    //Localhost
    const base = dev ? "http://localhost:5173" : "https://tools.gtt.cx";

    return fetch(base + url)
}