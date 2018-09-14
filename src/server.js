"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const ws = require("ws");
const comunicazione_1 = require("./model/comunicazione");
const partecipante_1 = require("./model/partecipante");
const sessione_1 = require("./model/sessione");
class Server {
    constructor() {
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.port = process.env.PORT || Server.PORT;
        this.ws = new ws.Server({ server: this.httpServer });
        this.listen();
    }
    listen() {
        this.httpServer.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        let classe = this;
        this.ws.on('connection', (ws, request) => {
            ws.on("message", (data) => {
                let messaggio, sessione;
                let mex = JSON.parse(data.toString());
                switch (mex.tipoComunicazione) {
                    case comunicazione_1.Comunicazione.Client.TipoComunicazione.CreaSessione:
                        sessione = new sessione_1.Sessione(mex.contenuto.numGiocatori, mex.contenuto.infermiera);
                        sessione.partecipanti.push(new partecipante_1.Partecipante(ws));
                        Server.sessioni.set(sessione.id, sessione);
                        messaggio = new comunicazione_1.Comunicazione.Server.Risposta.Messaggio(comunicazione_1.Comunicazione.Server.Risposta.Stato.Successo.Created, "Sessione creata", { idSessione: sessione.id });
                        ws.send(messaggio.toJson());
                        break;
                    case comunicazione_1.Comunicazione.Client.TipoComunicazione.JoinSessione:
                        sessione = Server.sessioni.get(mex.contenuto.idSessione);
                        sessione.partecipanti.push(new partecipante_1.Partecipante(ws));
                        ws.send(new comunicazione_1.Comunicazione.Server.Risposta.Messaggio(comunicazione_1.Comunicazione.Server.Risposta.Stato.Successo.Accepted, "Giocatore joinato", { jwt: sessione.id }).toJson());
                        break;
                    case comunicazione_1.Comunicazione.Client.TipoComunicazione.ScegliNickname:
                        sessione = Server.sessioni.get(mex.jwt);
                        sessione.partecipanti.forEach((value, index) => {
                            if (value.ws == ws)
                                value.nickname = mex.contenuto.nickname;
                        });
                        messaggio = new comunicazione_1.Comunicazione.Server.Risposta.Messaggio(comunicazione_1.Comunicazione.Server.Risposta.Stato.Successo.Accepted, "Nickname aggiunto", { nickname: mex.contenuto.nickname });
                        ws.send(messaggio.toJson());
                        if (sessione.partecipanti.length > 1) {
                            sessione.partecipanti.forEach((value) => {
                                if (value.ws != ws)
                                    value.ws.send(new comunicazione_1.Comunicazione.Server.Messaggio(comunicazione_1.Comunicazione.Server.TipoComunicazione.SessioneJoinata, { nickname: mex.contenuto.nickname }).toJson());
                            });
                        }
                        break;
                    case comunicazione_1.Comunicazione.Client.TipoComunicazione.StatoPronto:
                        sessione = Server.sessioni.get(mex.jwt);
                        let nickname;
                        sessione.partecipanti.forEach((value, index) => {
                            if (value.ws == ws) {
                                value.pronto = true;
                                nickname = value.nickname;
                            }
                        });
                        ws.send(new comunicazione_1.Comunicazione.Server.Risposta.Messaggio(comunicazione_1.Comunicazione.Server.Risposta.Stato.Successo.Accepted, "Stato pronto").toJson());
                        if (sessione.partecipanti.length == sessione.numGiocatori && sessione.partecipanti.every((value) => { return value.pronto; })) {
                            sessione.stato = sessione_1.Stato.Esecuzione;
                            sessione.creaPartita();
                            sessione.partecipanti.forEach((value) => {
                                value.ws.send(new comunicazione_1.Comunicazione.Server.Messaggio(comunicazione_1.Comunicazione.Server.TipoComunicazione.PartitaIniziata, { durata: sessione.durataPartita, giocatori: sessione.getGiocatori() }).toJson());
                            });
                        }
                        else {
                            sessione.partecipanti.forEach((value) => {
                                if (value.ws != ws)
                                    value.ws.send(new comunicazione_1.Comunicazione.Server.Messaggio(comunicazione_1.Comunicazione.Server.TipoComunicazione.GiocatorePronto, { nickname: nickname.toString() }).toJson());
                            });
                        }
                        break;
                    case comunicazione_1.Comunicazione.Client.TipoComunicazione.CittadinoMorto:
                        break;
                    case comunicazione_1.Comunicazione.Client.TipoComunicazione.CittadinoGuarito:
                        break;
                    case comunicazione_1.Comunicazione.Client.TipoComunicazione.PoliziottoArresta:
                        break;
                }
                console.log("Partite: ");
                Server.sessioni.forEach((value, key) => {
                    console.log(key + " ");
                    console.log("   Partecipanti<" + value.partecipanti.length + ">: ");
                    value.partecipanti.forEach((value) => {
                        console.log("   " + value.nickname + " | " + ws);
                    });
                });
            });
        });
    }
    getApp() {
        return this.app;
    }
}
Server.PORT = 8080;
Server.sessioni = new Map();
exports.Server = Server;
