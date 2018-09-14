"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ruolo;
(function (Ruolo) {
    Ruolo[Ruolo["Ispettore"] = 0] = "Ispettore";
    Ruolo[Ruolo["Assassino"] = 1] = "Assassino";
    Ruolo[Ruolo["Paesano"] = 2] = "Paesano";
    Ruolo[Ruolo["Infermiera"] = 3] = "Infermiera";
})(Ruolo = exports.Ruolo || (exports.Ruolo = {}));
class Giocatore {
    constructor(ruolo) {
        this.ruolo = ruolo;
    }
}
exports.Giocatore = Giocatore;
class Ispettore extends Giocatore {
    constructor() {
        super(Ruolo.Ispettore);
    }
}
exports.Ispettore = Ispettore;
class Assassino extends Giocatore {
    constructor() {
        super(Ruolo.Assassino);
    }
}
exports.Assassino = Assassino;
class Paesano extends Giocatore {
    constructor() {
        super(Ruolo.Assassino);
    }
}
exports.Paesano = Paesano;
class Infermiera extends Giocatore {
    constructor() {
        super(Ruolo.Assassino);
    }
}
exports.Infermiera = Infermiera;
