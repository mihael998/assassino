import { Partita } from "./partita";
import { Partecipante } from "./partecipante";
import ws = require('ws');
export enum Stato { Attesa, Esecuzione }
export class Sessione {
    durataPartita: number;
    numGiocatori: number;
    personaggi: Array<{ name: string, quantity: number }>;
    id: string;
    stato: Stato = Stato.Attesa;
    partita: Partita | null;
    partite: Array<Partita>;
    private _partecipanti: Partecipante[] = new Array<Partecipante>();
    get partecipanti() {
        return this._partecipanti;
    }
    set partecipanti(partecipanti) {
        this._partecipanti = partecipanti;
    }
    constructor(numGiocatori: number, personaggi, durata = 5) {
        this.partite = new Array();
        this.id = Math.random().toString(36).substr(2, 9);
        this.numGiocatori = numGiocatori;
        this.personaggi = personaggi;
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
        this.partita = new Partita(Math.random().toString(36).substr(2, 9), this.partecipanti, this.durataPartita, this.numGiocatori, this.personaggi);
        this.stato = Stato.Esecuzione;
    }
    getGiocatore(ws: ws) {

    }
    addPartecipante(partecipante: Partecipante) {
        if (this.partecipanti.length < this.numGiocatori) {
            this.partecipanti.push(partecipante);

        } else {
            throw new Error("Numero massimo partecipanti raggiunto");
        }
    }
}