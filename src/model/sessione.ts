import { Partita } from "./partita";
import { Partecipante } from "./partecipante";
import ws = require('ws');
export enum Stato { Attesa, Esecuzione }
export class Sessione {
    durataPartita: number;
    numGiocatori: number;
    infermiera: boolean;
    id: string;
    stato: Stato = Stato.Attesa;
    partita: Partita | null;
    partite: Array<Partita>;
    partecipanti: Partecipante[] = new Array<Partecipante>();
    constructor(numGiocatori: number, infermiera: boolean, durata = 5) {
        this.partite = new Array();
        this.id = Math.random().toString(36).substr(2, 9);
        this.numGiocatori = numGiocatori;
        this.infermiera = infermiera;
        this.durataPartita = durata;
        this.partita = null;
    }
    getGiocatori(): Array<String> {
        let giocatori: Array<String> = new Array();
        this.partecipanti.forEach((value) => {
            giocatori.push(value.nickname);
        })
        return giocatori;
    }
    creaPartita() {
        this.partita = new Partita(Math.random().toString(36).substr(2, 9), this.partecipanti, this.durataPartita, this.numGiocatori, this.infermiera);
        this.stato = Stato.Esecuzione;
    }
    getGiocatore(ws: ws) {

    }
}