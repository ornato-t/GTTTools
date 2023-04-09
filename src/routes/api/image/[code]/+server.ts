import type { RequestHandler } from "@sveltejs/kit";

//Proxy an image (for HTTP pages and generally unsafe connections)
export const GET: RequestHandler = async ({ params, fetch }) => {
    const url = params.url;

    if (url === undefined) return new Response(null, { status: 404 });

    const res = await fetch(url)
    const image = await res.blob()
    
    return new Response(image, { headers: { "Content-Type": "image/jpeg" } })
}
