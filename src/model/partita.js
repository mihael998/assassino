"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Giocatore = __importStar(require("./giocatore"));
var StatoPartita;
(function (StatoPartita) {
    StatoPartita[StatoPartita["inCorso"] = 0] = "inCorso";
    StatoPartita[StatoPartita["finita"] = 1] = "finita";
})(StatoPartita = exports.StatoPartita || (exports.StatoPartita = {}));
;
class Partita {
    constructor(id, partecipanti, durata, giocatori, infermiera) {
        this.stato = StatoPartita.inCorso;
        this.giocatori = new Map();
        this._id = id;
        this.numGiocatori = giocatori;
        this.infermiera = infermiera;
        this.creaGiocatori(partecipanti);
    }
    get id() {
        return this._id;
    }
    creaGiocatori(partecipanti) {
        let paesani = this.numGiocatori - 2;
        let assassino, poliziotto;
        assassino = 1;
        poliziotto = 1;
        if (this.infermiera == true)
            paesani--;
        let lunghezza = this.numGiocatori;
        while (this.giocatori.size < lunghezza) {
            let index = Math.floor(Math.random() * ((partecipanti.length - 1) - 0 + 1) + 0);
            if (paesani > 0) {
                this.giocatori.set(partecipanti[index], new Giocatore.Paesano());
                paesani--;
                partecipanti.splice(index, 1);
                continue;
            }
            if (assassino > 0) {
                this.giocatori.set(partecipanti[index], new Giocatore.Assassino());
                assassino--;
                partecipanti.splice(index, 1);
                continue;
            }
            if (poliziotto > 0) {
                this.giocatori.set(partecipanti[index], new Giocatore.Ispettore());
                poliziotto--;
                partecipanti.splice(index, 1);
                continue;
            }
            if (this.infermiera) {
                this.giocatori.set(partecipanti[index], new Giocatore.Infermiera());
                partecipanti.splice(index, 1);
            }
        }
    }
}
exports.Partita = Partita;
