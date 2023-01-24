export default async function pfetch(url: string){
    const prod = true;

    const base = prod ? "https://tools.gtt.cx" : "http://localhost:5173";

    return fetch(base + url)
}