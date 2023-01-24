export default async function pfetch(url: string){
    const prod = false;

    const base = prod ? "https://tools.gtt.cx" : "http://localhost:5173";

    return fetch(base + url)
}