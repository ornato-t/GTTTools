export const config = {
  runtime: 'experimental-edge',
};

export default (req: Request) => {
  const code = parseInt((req.url.match(/\d{1,}/gm) as string[])[0]);

  return new Response(`Hello, from ${code} I'm now an Edge Function!`);

}
