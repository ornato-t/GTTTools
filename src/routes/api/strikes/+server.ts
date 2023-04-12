import Parser from "rss-parser";
import { DateTime } from "luxon";
import type { RequestHandler } from "@sveltejs/kit";
import type { strike, strikesFeed, strikeInfoFeed } from "$lib/strikes";

const parser = new Parser();

export const GET: RequestHandler = async () => {
    const feed = await parser.parseURL('http://scioperi.mit.gov.it/mit2/public/scioperi/rss') as strikesFeed;   //Fetch strikes feed

    const out: Array<strike> = [];
    const regex = /([\w à]+): (.*)/;

    for (const strike of feed.items) {
        const parsed = strike.contentSnippet.split('\n').map(line => {
            const data = line.match(regex);     //Extract keys and values

            if (data === null) return '';

            return `"${data[1]}": "${data[2]}"`;    //Remap to JSON like syntax
        });

        const res = await JSON.parse('{' + parsed + '}') as strikeInfoFeed; //Add delimiters and parse as JSON

        if ((res.Regione.toLowerCase() === 'piemonte' || res.Regione.toLowerCase() === ' italia') && res.Settore !== 'Aereo') {
            out.push({
                mode: res.modalità,
                dateEnd: DateTime.fromFormat(res["Data fine"], 'dd/MM/y').toJSDate(),
                sector: res.Settore,
                scope: res.Rilevanza,
                unions: res.Sindacati,
                category: res["Categoria interessata"],
                dateSubmission: DateTime.fromFormat(res["Data proclamazione"], 'dd/MM/y').toJSDate(),
            });
        }
    }

    return new Response(JSON.stringify(out));
}
