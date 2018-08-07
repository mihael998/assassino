import { Giocatore } from './giocatore';
export enum StatoPartita { inAttesa, inCorso, finita };
export class Partita {
    stato: StatoPartita = StatoPartita.inAttesa;
    private _id: String;
    durata: number = 5;
    numGiocatori: number = 5;
    giocatori: Giocatore[] = new Array<Giocatore>();

    constructor(id: String, durata: number, giocatori: number) {
        this._id = id;
        this.numGiocatori = giocatori;
        this.durata = durata;
    }
    get id() {
        return this._id;
    }
}