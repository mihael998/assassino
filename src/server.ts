import express = require('express');
import http = require('http');
import ws = require('ws');
import { Partita, StatoPartita } from "./model/partita";
import { Comunicazione } from "./model/comunicazione";
import { Partecipante } from './model/partecipante';
import { Sessione, Stato } from './model/sessione'

export class Server {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private httpServer: http.Server;
    private ws: ws.Server;
    private port: string | number;
    private static sessioni: Map<string, Sessione> = new Map();
    constructor() {
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.port = process.env.PORT || Server.PORT;
        this.ws = new ws.Server({ server: this.httpServer });
        this.listen();
    }

    private listen(): void {
        this.httpServer.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        let classe = this;

        this.ws.on('connection', (ws, request) => {
            ws.on("message", (data) => {
                let messaggio, sessione: Sessione;
                let mex: Comunicazione.Client.Messaggio = JSON.parse(data.toString());
                switch (mex.tipoComunicazione) {
                    case Comunicazione.Client.TipoComunicazione.CreaSessione:
                        sessione = new Sessione(mex.contenuto.numGiocatori as number, mex.contenuto.infermiera as boolean);
                        sessione.partecipanti.push(new Partecipante(ws));
                        Server.sessioni.set(sessione.id, sessione);
                        messaggio = new Comunicazione.Server.Risposta.Messaggio(Comunicazione.Server.Risposta.Stato.Successo.Created, "Sessione creata", { idSessione: sessione.id });
                        ws.send(messaggio.toJson());
                        break;
                    case Comunicazione.Client.TipoComunicazione.JoinSessione:
                        sessione = (Server.sessioni.get(mex.contenuto.idSessione as string) as Sessione);
                        sessione.partecipanti.push(new Partecipante(ws));
                        ws.send(new Comunicazione.Server.Risposta.Messaggio(Comunicazione.Server.Risposta.Stato.Successo.Accepted, "Giocatore joinato", { jwt: sessione.id }).toJson());
                        break;
                    case Comunicazione.Client.TipoComunicazione.ScegliNickname:
                        sessione = (Server.sessioni.get(mex.jwt as string) as Sessione);
                        sessione.partecipanti.forEach((value, index) => {
                            if (value.ws == ws)
                                value.nickname = mex.contenuto.nickname as string;
                        });
                        messaggio = new Comunicazione.Server.Risposta.Messaggio(Comunicazione.Server.Risposta.Stato.Successo.Accepted, "Nickname aggiunto", { nickname: mex.contenuto.nickname as string });
                        ws.send(messaggio.toJson());
                        if (sessione.partecipanti.length > 1) {
                            sessione.partecipanti.forEach((value) => {
                                if (value.ws != ws)
                                    value.ws.send(new Comunicazione.Server.Messaggio(Comunicazione.Server.TipoComunicazione.SessioneJoinata, { nickname: mex.contenuto.nickname as string }).toJson());
                            })
                        }
                        break;
                    case Comunicazione.Client.TipoComunicazione.StatoPronto:
                        sessione = (Server.sessioni.get(mex.jwt as string) as Sessione);
                        let nickname: String;
                        sessione.partecipanti.forEach((value, index) => {
                            if (value.ws == ws) {
                                value.pronto = true;
                                nickname = value.nickname;
                            }
                        });
                        ws.send(new Comunicazione.Server.Risposta.Messaggio(Comunicazione.Server.Risposta.Stato.Successo.Accepted, "Stato pronto").toJson());
                        if (sessione.partecipanti.length == sessione.numGiocatori && sessione.partecipanti.every((value): boolean => { return value.pronto; })) {
                            sessione.stato = Stato.Esecuzione;
                            sessione.creaPartita();
                            sessione.partecipanti.forEach((value) => {
                                value.ws.send(new Comunicazione.Server.Messaggio(Comunicazione.Server.TipoComunicazione.PartitaIniziata, { durata: sessione.durataPartita, giocatori: sessione.getGiocatori() }).toJson());

                            })
                        }
                        else {
                            sessione.partecipanti.forEach((value) => {
                                if (value.ws != ws)
                                    value.ws.send(new Comunicazione.Server.Messaggio(Comunicazione.Server.TipoComunicazione.GiocatorePronto, { nickname: nickname.toString() }).toJson());
                            })
                        }

                        break;
                    case Comunicazione.Client.TipoComunicazione.CittadinoMorto:
                        break;
                    case Comunicazione.Client.TipoComunicazione.CittadinoGuarito:
                        break;
                    case Comunicazione.Client.TipoComunicazione.PoliziottoArresta:
                        break;
                }
                console.log("Partite: ");
                Server.sessioni.forEach((value, key) => {
                    console.log(key + " ");
                    console.log("   Partecipanti<" + value.partecipanti.length + ">: ");
                    value.partecipanti.forEach((value) => {
                        console.log("   " + value.nickname + " | " + ws);
                    })

                });

            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}