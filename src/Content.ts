import fs from "fs";
import http from "http";
import url from "url";

export default class Content {
    public content(req: http.IncomingMessage, res: http.ServerResponse): void {
        // favicon.ico kérés kiszolgálása:
        if (req.url === "/favicon.ico") {
            res.writeHead(200, { "Content-Type": "image/x-icon" });
            fs.createReadStream("favicon.ico").pipe(res);
            return;
        }
        // Weboldal inicializálása + head rész:
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write("<!DOCTYPE html>");
        res.write("<html lang='hu'>");
        res.write("<head>");
        res.write("<style>input, pre {font-family:monospace; font-size:1em; font-weight:bold;}</style>");
        res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");

        res.write("<title>LNKO</title>");
        res.write("</head>");
        res.write("<body><form><pre class='m-3'>");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const params = url.parse(req.url as string, true).query;

        // Kezd a kódolást innen -->
        res.write("Legnagyobb közös osztó(LNKO) meghatározása\n\n");

        res.write("Kivonásos módszerrel\n");

        let a: number = parseInt(params.a as string);
        // Ha nincs "kor" paraméter megadva, vagy nem lehet számra konvertálni értékét,
        // akkor a "korod" változóba NaN érték kerül, ilyenkor legyen 18 év az értéke:
        if (isNaN(a)) a = 1;
        res.write(`a= <input type='number' name='a' value=${a} style='max-width:100px;' onChange='this.form.submit();'>\n`);

        let b: number = parseInt(params.b as string);
        if (isNaN(b)) b = 1;
        res.write(`b= <input type='number' name='b' value=${b} style='max-width:100px;' onChange='this.form.submit();'>\n`);

        let segedA: number = a;
        let segedB: number = b;

        while (segedA != segedB) {
            if (segedA > segedB) {
                segedA = segedA - segedB;
            } else {
                segedB = segedB - segedA;
            }
        }
        res.write(`${a} és ${b} legnagyobb közös osztója ${segedA}\n`);

        res.write("Euklidesz módszerrel\n");
        segedA = a;
        segedB = b;

        let maradek: number;

        do {
            maradek = segedA % segedB;
            segedA = segedB;
            segedB = maradek;
        } while (maradek != 0);

        res.write(`${a} és ${b} legnagyobb közös osztója ${segedA}\n`);
        // <---- Fejezd be a kódolást

        res.write("</pre></form>");

        res.write("</body></html>");
        res.end();
    }
}
