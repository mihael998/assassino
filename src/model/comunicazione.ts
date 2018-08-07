export namespace Comunicazione {
    export enum Tipo {
        Richiesta,
        Risposta
    }
    export enum TipoFase {
        Preparazione,
        Gioco
    }
    export enum TipoPreparazione {
        CreaPartita,
        JoinPartita
    }
    export enum TipoGioco {
        PaesanoMorto,
        AssassinoScoperto

    }
    interface Contenuto {
        nickname?: string;
    }
    export interface ContenutoCrea extends Contenuto {
        durata: number;
        numGiocatori: number;
    }
    export interface ContenutoJoin extends Contenuto {
        idPartita: String;
    }

    export namespace Server {
        export enum EsitoComunicazione {
            Positivo,
            Negativo
        }
        export enum Successo {
            Ok = 200,
            Created,
            Accepted
        }
        export enum Errore {
            BadRequest = 400,
            Unauthorized,
            Forbidden,
            NotFound
        }
        export interface Messaggio {
            tipoComunicazione: number;
            valoreComunicazione: number;
            contenuto: ContenutoCrea | ContenutoJoin | any;
            esito: EsitoComunicazione;
        }
        export interface ContenutoCrea extends Contenuto {
            idPartita: String;
        }
        export interface ContenutoJoin extends Contenuto {
        }
    }
    export interface Messaggio {
        tipoComunicazione: TipoFase;
        valoreComunicazione: TipoPreparazione | TipoGioco;
        contenuto: Contenuto;
    }
    export class Risposta {
        tipo: Tipo = 1;
        valore: Server.Successo | Server.Errore = 200;
        messaggio?: string;
        contenuto?: Contenuto;
        constructor(stato: Server.Errore | Server.Successo, contenuto?: Contenuto, messaggio?: string) {
            this.valore = stato;
            if (messaggio != undefined)
                this.messaggio = messaggio;
            if (contenuto != undefined)
                this.contenuto = contenuto;
        }
        toJson(): string {
            return JSON.stringify(this);
        }
    }


}