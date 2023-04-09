import type { RequestHandler } from "@sveltejs/kit";

//Proxy an image (for HTTP pages and generally unsafe connections)
export const GET: RequestHandler = async ({ fetch, url }) => {
    const imgUrl = url.searchParams.get('url');

    if (imgUrl === null) return new Response(null, { status: 404 });

    const res = await fetch(imgUrl)
    const image = await res.blob()
    
    return new Response(image, { headers: { "Content-Type": "image/jpeg" } })
}
