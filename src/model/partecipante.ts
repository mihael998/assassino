import ws = require('ws');
import { Sessione } from './sessione';
export class Partecipante {
    pronto: boolean = false;
    nickname: String = "";
    ws: ws;
    constructor(ws: ws) {
        this.ws = ws;
    }
    sendBroadcastMessage(message, sessione: Sessione) {
        sessione.partecipanti.forEach(partecipante => {
            if (partecipante.ws != this.ws) {
                partecipante.ws.send(message);
            }
        });
    }
}