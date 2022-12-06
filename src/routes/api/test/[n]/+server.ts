import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
    return new Response(`Hello, from ${params.n} I'm now a Static Function!`);
}