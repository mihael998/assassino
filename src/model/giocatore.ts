import ws = require('ws');
enum Ruolo { Ispettore, Assassino, Paesano }
export class Giocatore {
    nickname: String;
    ws: ws;
    ruolo: Ruolo | undefined;
    constructor(ws: ws, nickname: String) {
        this.ws = ws;
        this.nickname = nickname;
    }
}