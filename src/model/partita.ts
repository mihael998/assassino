import { Partecipante } from './partecipante';
import * as Giocatore from './giocatore';
export enum StatoPartita { inCorso, finita };
export class Partita {
    stato: StatoPartita = StatoPartita.inCorso;
    private _id: String;
    numGiocatori: number;
    infermiera: boolean;
    giocatori: Map<Partecipante, Giocatore.Giocatore> = new Map<Partecipante, Giocatore.Giocatore>();

    constructor(id: String, partecipanti: Array<Partecipante>, durata: number, giocatori: number, infermiera: boolean) {
        this._id = id;
        this.numGiocatori = giocatori;
        this.infermiera = infermiera;
        this.creaGiocatori(partecipanti);
    }
    get id() {
        return this._id;
    }
    creaGiocatori(partecipanti: Array<Partecipante>) {
        let paesani: number = this.numGiocatori - 2;
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