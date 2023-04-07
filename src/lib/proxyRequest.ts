export default async function pfetch(url: string){
    const prod = true;

    //Vercel dev environment
    // const base = prod ? "https://tools.gtt.cx" : "https://gtt-tools-ornato-t.vercel.app";

    //Localhost
    const base = prod ? "https://tools.gtt.cx" : "http://localhost:5173";

    return fetch(base + url)
}