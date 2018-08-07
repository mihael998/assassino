"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatoPartita;
(function (StatoPartita) {
    StatoPartita[StatoPartita["inAttesa"] = 0] = "inAttesa";
    StatoPartita[StatoPartita["inCorso"] = 1] = "inCorso";
    StatoPartita[StatoPartita["finita"] = 2] = "finita";
})(StatoPartita = exports.StatoPartita || (exports.StatoPartita = {}));
;
class Partita {
    constructor(id, durata, giocatori) {
        this.stato = StatoPartita.inAttesa;
        this.durata = 5;
        this.numGiocatori = 5;
        this.giocatori = new Array();
        this._id = id;
        this.numGiocatori = giocatori;
        this.durata = durata;
    }
    get id() {
        return this._id;
    }
}
exports.Partita = Partita;
