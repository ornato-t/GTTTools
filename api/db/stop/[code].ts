import { runServer, EdgeRuntime } from 'edge-runtime'

const runtime = new EdgeRuntime()
const server = await runServer({ runtime })

console.log(`Listening at ${server.url}`)

export default function handler(request, response) {
    const { code } = request.query;
    return response.end(`Hello, stop number:${code}!`);
  }
  