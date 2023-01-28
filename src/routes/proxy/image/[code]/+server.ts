import type { RequestHandler } from "@sveltejs/kit";

//Proxy an image (for HTTP pages and generally unsafe connections)
export const GET: RequestHandler = async ({ params, fetch }) => {
    const res = await fetch(getUrl(params.code))
    const image = await res.blob()
    return new Response(image, { headers: { "Content-Type": "image/jpeg" } })
}

function getUrl(codeStr: string | undefined){
    if (codeStr === undefined) return "";
    const code = Number.parseInt(codeStr);

    switch(code){
        default: return "https://media3.giphy.com/media/ES4Vcv8zWfIt2/giphy.gif";
    }
}
