import { Ruolo } from "./giocatore";

export namespace Comunicazione {
    export interface Contenuto {
        numGiocatori?: number,
        infermiera?: boolean,
        durata?: number,
        idSessione?: string,
        nickname?: string,
        jwt?: string,
        ruolo?: Ruolo,
        giocatori?: Array<String>
    }
    export namespace Client {
        export interface Messaggio {
            tipoComunicazione: TipoComunicazione,
            contenuto: Contenuto,
            jwt?: string
        }

        export enum TipoComunicazione {
            CreaSessione,
            JoinSessione,
            ScegliNickname,
            StatoPronto,
            CittadinoMorto,
            CittadinoGuarito,
            PoliziottoArresta
        }

    }
    export namespace Server {
        export enum Tipo {
            Comunicazione,
            Risposta
        }
        export namespace Risposta {
            export namespace Stato {
                export enum Successo {
                    Ok = 200,
                    Created,
                    Accepted,

                }
                export enum Errore {
                    BadRequest = 400,
                    Unauthorized,
                    Forbidden,
                    NotFound

                }
            }
            export class Messaggio {
                tipo: Server.Tipo = Server.Tipo.Risposta;
                stato: Server.Risposta.Stato.Errore | Server.Risposta.Stato.Successo;
                messaggio?: string;
                contenuto?: Comunicazione.Contenuto;
                constructor(stato: Stato.Errore | Stato.Successo, messaggio?: string, contenuto?: Contenuto) {
                    this.stato = stato;
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
        export class Messaggio {
            tipo: Tipo = Tipo.Comunicazione;
            tipoComunicazione: TipoComunicazione;
            contenuto: Contenuto;
            constructor(tipoComunicazione: TipoComunicazione, contenuto: Contenuto) {
                this.tipoComunicazione = tipoComunicazione;
                this.contenuto = contenuto;
            }
            toJson() {
                return JSON.stringify(this);
            }
        }
        export enum TipoComunicazione {
            SessioneJoinata,
            GiocatorePronto,
            GiocatoreMorto,
            GiocatoreGuarito,
            PartitaIniziata,
            PartitaTerminata,
            SessioneTerminata
        }
    }
}