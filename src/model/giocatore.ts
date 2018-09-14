import { Partecipante } from "./partecipante";

export enum Ruolo { Ispettore, Assassino, Paesano, Infermiera }
export abstract class Giocatore {
    ruolo: Ruolo;
    constructor(ruolo: Ruolo) {
        this.ruolo = ruolo;
    }
}
export class Ispettore extends Giocatore {

    constructor() {
        super(Ruolo.Ispettore);
    }
}
export class Assassino extends Giocatore {
    constructor() {
        super(Ruolo.Assassino);
    }
}
export class Paesano extends Giocatore {
    constructor() {
        super(Ruolo.Paesano);
    }
}
export class Infermiera extends Giocatore {
    constructor() {
        super(Ruolo.Infermiera);
    }
}