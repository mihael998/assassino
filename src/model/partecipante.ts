import ws = require('ws');
export class Partecipante {
    pronto: boolean = false;
    nickname: String = "";
    ws: ws;
    constructor(ws: ws) {
        this.ws = ws;
    }
}