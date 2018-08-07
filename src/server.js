"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const ws = require("ws");
const partita_1 = require("./model/partita");
const comunicazione_1 = require("./model/comunicazione");
const giocatore_1 = require("./model/giocatore");
class Server {
    constructor() {
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.port = process.env.PORT || Server.PORT;
        this.ws = new ws.Server({ server: this.httpServer });
        this.listen();
    }
    static creaPartita(durata, numGiocatori) {
        let uid = Math.random().toString(36).substr(2, 9);
        let partita = new partita_1.Partita(uid, durata, numGiocatori);
        this.partite.set(uid, partita);
        return partita;
    }
    static addGiocatore(ws, nick, partitaId) {
        if (Server.partite.has(partitaId.toString())) {
            let partita = Server.partite.get(partitaId.toString());
            if (partita.giocatori.length < partita.numGiocatori) {
                partita.giocatori.push(new giocatore_1.Giocatore(ws, nick.toString()));
                if (partita.giocatori.length == partita.numGiocatori) {
                    partita.stato = partita_1.StatoPartita.inCorso;
                }
                console.log("Partita joinata");
                return partita;
            }
            else {
                return false;
            }
        }
        else {
            console.log("Partita non esistente");
            return false;
        }
    }
    listen() {
        this.httpServer.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        let classe = this;
        this.ws.on('connection', (ws, request) => {
            ws.on("message", (data) => {
                let mex = JSON.parse(data.toString());
                switch (mex.tipoComunicazione) {
                    case comunicazione_1.Comunicazione.TipoFase.Preparazione:
                        let nickname;
                        nickname = mex.contenuto.nickname;
                        switch (mex.valoreComunicazione) {
                            case comunicazione_1.Comunicazione.TipoPreparazione.CreaPartita:
                                let durata = mex.contenuto.durata;
                                let numGiocatori = mex.contenuto.numGiocatori;
                                let partitaCreata = Server.creaPartita(durata, numGiocatori);
                                if (nickname == undefined)
                                    nickname = "Player " + (partitaCreata.giocatori.length + 1);
                                partitaCreata.giocatori.push(new giocatore_1.Giocatore(ws, nickname.toString()));
                                console.log("Partita creata!");
                                let risposta = new comunicazione_1.Comunicazione.Risposta(comunicazione_1.Comunicazione.Server.Successo.Created, { nickname: nickname, idPartita: partitaCreata.id }, "Partita Creata!");
                                //let risposta = Server.creaRispostaCreate(nick.toString(), partitaCreata.id.toString());
                                ws.send(risposta.toJson());
                                break;
                            case comunicazione_1.Comunicazione.TipoPreparazione.JoinPartita:
                                let id = mex.contenuto.idPartita;
                                if (Server.partite.has(id.toString())) {
                                    let partita = Server.partite.get(id.toString());
                                    if (partita.giocatori.length < partita.numGiocatori) {
                                        if (nickname == undefined)
                                            nickname = "Player " + (partita.giocatori.length + 1);
                                        partita.giocatori.push(new giocatore_1.Giocatore(ws, nickname.toString()));
                                        if (partita.giocatori.length == partita.numGiocatori) {
                                            partita.stato = partita_1.StatoPartita.inCorso;
                                        }
                                        console.log("Partita joinata");
                                        let risposta = new comunicazione_1.Comunicazione.Risposta(comunicazione_1.Comunicazione.Server.Successo.Ok, { nickname: nickname }, "Partita joinata");
                                        partita.giocatori.forEach((value) => {
                                            value.ws.send(risposta.toJson());
                                        });
                                    }
                                    else {
                                        console.log("Partita al completo");
                                        let risposta = new comunicazione_1.Comunicazione.Risposta(comunicazione_1.Comunicazione.Server.Errore.Forbidden, undefined, "Partita al completo");
                                        ws.send(risposta.toJson());
                                    }
                                }
                                else {
                                    console.log("Partita non esistente");
                                    let risposta = new comunicazione_1.Comunicazione.Risposta(comunicazione_1.Comunicazione.Server.Errore.NotFound, undefined, "Partita non esistente");
                                    ws.send(risposta.toJson());
                                }
                                break;
                        }
                        break;
                    case comunicazione_1.Comunicazione.TipoFase.Gioco:
                        switch (mex.valoreComunicazione) {
                            case comunicazione_1.Comunicazione.TipoGioco.AssassinoScoperto:
                                break;
                            case comunicazione_1.Comunicazione.TipoGioco.PaesanoMorto:
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
Server.partite = new Map();
exports.Server = Server;
