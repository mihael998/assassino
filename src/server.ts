import express = require('express');
import http = require('http');
import ws = require('ws');
import { Partita, StatoPartita } from "./model/partita";
import { Comunicazione } from "./model/comunicazione";
import { Giocatore } from './model/giocatore';

export class Server {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private httpServer: http.Server;
    private ws: ws.Server;
    private port: string | number;
    private static partite: Map<string, Partita> = new Map();
    constructor() {
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.port = process.env.PORT || Server.PORT;
        this.ws = new ws.Server({ server: this.httpServer });
        this.listen();
    }

    private static creaPartita(durata: number, numGiocatori: number): Partita {
        let uid = Math.random().toString(36).substr(2, 9);
        let partita = new Partita(uid, durata, numGiocatori);
        this.partite.set(uid, partita);
        return partita;
    }
    private static addGiocatore(ws: ws, nick: String, partitaId: String): Partita | boolean {
        if (Server.partite.has(partitaId.toString())) {
            let partita = (Server.partite.get(partitaId.toString()) as Partita);
            if (partita.giocatori.length < partita.numGiocatori) {
                partita.giocatori.push(new Giocatore(ws, nick.toString()));
                if (partita.giocatori.length == partita.numGiocatori) {
                    partita.stato = StatoPartita.inCorso;
                }
                console.log("Partita joinata");
                return partita;
            } else {
                return false;
            }

        } else {
            console.log("Partita non esistente");
            return false;
        }
    }

    private listen(): void {
        this.httpServer.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        let classe = this;

        this.ws.on('connection', (ws, request) => {
            ws.on("message", (data) => {
                let mex: Comunicazione.Messaggio = JSON.parse(data.toString());
                switch (mex.tipoComunicazione) {
                    case Comunicazione.TipoFase.Preparazione:
                        let nickname;
                        nickname = mex.contenuto.nickname;
                        switch (mex.valoreComunicazione) {
                            case Comunicazione.TipoPreparazione.CreaPartita:
                                let durata = (mex.contenuto as Comunicazione.ContenutoCrea).durata;
                                let numGiocatori = (mex.contenuto as Comunicazione.ContenutoCrea).numGiocatori;
                                let partitaCreata: Partita = Server.creaPartita(durata, numGiocatori);
                                if (nickname == undefined)
                                    nickname = "Player " + (partitaCreata.giocatori.length + 1);
                                partitaCreata.giocatori.push(new Giocatore(ws, nickname.toString()));
                                console.log("Partita creata!");
                                let risposta = new Comunicazione.Risposta(Comunicazione.Server.Successo.Created, <Comunicazione.Server.ContenutoCrea>{ nickname: nickname, idPartita: partitaCreata.id }, "Partita Creata!");
                                //let risposta = Server.creaRispostaCreate(nick.toString(), partitaCreata.id.toString());
                                ws.send(risposta.toJson());
                                break;
                            case Comunicazione.TipoPreparazione.JoinPartita:
                                let id: String = (mex.contenuto as Comunicazione.ContenutoJoin).idPartita;
                                if (Server.partite.has(id.toString())) {
                                    let partita = (Server.partite.get(id.toString()) as Partita);
                                    if (partita.giocatori.length < partita.numGiocatori) {
                                        if (nickname == undefined)
                                            nickname = "Player " + (partita.giocatori.length + 1);
                                        partita.giocatori.push(new Giocatore(ws, nickname.toString()));
                                        if (partita.giocatori.length == partita.numGiocatori) {
                                            partita.stato = StatoPartita.inCorso;
                                        }
                                        console.log("Partita joinata");
                                        let risposta = new Comunicazione.Risposta(Comunicazione.Server.Successo.Ok, <Comunicazione.Server.ContenutoJoin>{ nickname: nickname }, "Partita joinata");
                                        partita.giocatori.forEach((value) => {
                                            value.ws.send(risposta.toJson());
                                        })
                                    } else {
                                        console.log("Partita al completo");
                                        let risposta = new Comunicazione.Risposta(Comunicazione.Server.Errore.Forbidden, undefined, "Partita al completo");
                                        ws.send(risposta.toJson())
                                    }

                                } else {
                                    console.log("Partita non esistente");
                                    let risposta = new Comunicazione.Risposta(Comunicazione.Server.Errore.NotFound, undefined, "Partita non esistente");
                                    ws.send(risposta.toJson())
                                }

                                break;
                        }
                        break;
                    case Comunicazione.TipoFase.Gioco:
                        switch (mex.valoreComunicazione) {
                            case Comunicazione.TipoGioco.AssassinoScoperto:
                                break;
                            case Comunicazione.TipoGioco.PaesanoMorto:
                                break;
                        }
                        break;
                }
                console.log("Partite: ");
                Server.partite.forEach((value, key) => {
                    console.log(key + " " + value);
                    console.log("   Giocatori<" + value.giocatori.length + ">: ");
                    value.giocatori.forEach((value) => {
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