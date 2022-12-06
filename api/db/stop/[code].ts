export const config = {
  runtime: 'experimental-edge',
};

export default (req) =>
  new Response(`Hello, from ${req.query} I'm now an Edge Function!`);
