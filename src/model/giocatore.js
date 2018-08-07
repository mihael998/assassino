"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ruolo;
(function (Ruolo) {
    Ruolo[Ruolo["Ispettore"] = 0] = "Ispettore";
    Ruolo[Ruolo["Assassino"] = 1] = "Assassino";
    Ruolo[Ruolo["Paesano"] = 2] = "Paesano";
})(Ruolo || (Ruolo = {}));
class Giocatore {
    constructor(ws, nickname) {
        this.ws = ws;
        this.nickname = nickname;
    }
}
exports.Giocatore = Giocatore;
