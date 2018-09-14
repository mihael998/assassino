"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const partita_1 = require("./partita");
var Stato;
(function (Stato) {
    Stato[Stato["Attesa"] = 0] = "Attesa";
    Stato[Stato["Esecuzione"] = 1] = "Esecuzione";
})(Stato = exports.Stato || (exports.Stato = {}));
class Sessione {
    constructor(numGiocatori, infermiera, durata = 5) {
        this.stato = Stato.Attesa;
        this.partecipanti = new Array();
        this.partite = new Array();
        this.id = Math.random().toString(36).substr(2, 9);
        this.numGiocatori = numGiocatori;
        this.infermiera = infermiera;
        this.durataPartita = durata;
        this.partita = null;
    }
    getGiocatori() {
        let giocatori = new Array();
        this.partecipanti.forEach((value) => {
            giocatori.push(value.nickname);
        });
        return giocatori;
    }
    creaPartita() {
        this.partita = new partita_1.Partita(Math.random().toString(36).substr(2, 9), this.partecipanti, this.durataPartita, this.numGiocatori, this.infermiera);
        this.stato = Stato.Esecuzione;
    }
}
exports.Sessione = Sessione;
