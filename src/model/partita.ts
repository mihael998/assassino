import { Partecipante } from './partecipante';
import * as Giocatore from './giocatore';
export enum StatoPartita { inCorso, finita };
export class Partita {
    stato: StatoPartita = StatoPartita.inCorso;
    private _id: String;
    numGiocatori: number;
    personaggi: Array<{ name: string, quantity: number }>;
    giocatori: Map<Partecipante, { name: string, quantity: number }> = new Map<Partecipante, { name: string, quantity: number }>();

    constructor(id: String, partecipanti: Array<Partecipante>, durata: number, giocatori: number, personaggi: Array<{ name: string, quantity: number }>) {
        this._id = id;
        this.numGiocatori = giocatori;
        this.personaggi = personaggi;
        this.creaGiocatori(partecipanti);
    }
    get id() {
        return this._id;
    }
    creaGiocatori(partecipanti: Array<Partecipante>) {
        let numPersonaggi: number = 0;
        this.personaggi.forEach(pers => {
            for (let i = 0; i < pers.quantity; i++) {
                let index = Math.floor(Math.random() * ((partecipanti.length - 1) - 0 + 1) + 0);
                this.giocatori.set(partecipanti[index], { name: pers.name, quantity: pers.quantity });
                partecipanti.splice(index, 1);
            }
        });

    }
} 