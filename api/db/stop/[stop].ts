export const config = {
  runtime: 'experimental-edge',
};

export default (req: Request) => {
  const code = req.url.match(/\d{1,4}/gm);

  return new Response(`Hello, from ${code} I'm now an Edge Function!`);

}
