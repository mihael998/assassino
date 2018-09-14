"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Comunicazione;
(function (Comunicazione) {
    let Client;
    (function (Client) {
        let TipoComunicazione;
        (function (TipoComunicazione) {
            TipoComunicazione[TipoComunicazione["CreaSessione"] = 0] = "CreaSessione";
            TipoComunicazione[TipoComunicazione["JoinSessione"] = 1] = "JoinSessione";
            TipoComunicazione[TipoComunicazione["ScegliNickname"] = 2] = "ScegliNickname";
            TipoComunicazione[TipoComunicazione["StatoPronto"] = 3] = "StatoPronto";
            TipoComunicazione[TipoComunicazione["CittadinoMorto"] = 4] = "CittadinoMorto";
            TipoComunicazione[TipoComunicazione["CittadinoGuarito"] = 5] = "CittadinoGuarito";
            TipoComunicazione[TipoComunicazione["PoliziottoArresta"] = 6] = "PoliziottoArresta";
        })(TipoComunicazione = Client.TipoComunicazione || (Client.TipoComunicazione = {}));
    })(Client = Comunicazione.Client || (Comunicazione.Client = {}));
    let Server;
    (function (Server) {
        let Tipo;
        (function (Tipo) {
            Tipo[Tipo["Comunicazione"] = 0] = "Comunicazione";
            Tipo[Tipo["Risposta"] = 1] = "Risposta";
        })(Tipo = Server.Tipo || (Server.Tipo = {}));
        let Risposta;
        (function (Risposta) {
            let Stato;
            (function (Stato) {
                let Successo;
                (function (Successo) {
                    Successo[Successo["Ok"] = 200] = "Ok";
                    Successo[Successo["Created"] = 201] = "Created";
                    Successo[Successo["Accepted"] = 202] = "Accepted";
                })(Successo = Stato.Successo || (Stato.Successo = {}));
                let Errore;
                (function (Errore) {
                    Errore[Errore["BadRequest"] = 400] = "BadRequest";
                    Errore[Errore["Unauthorized"] = 401] = "Unauthorized";
                    Errore[Errore["Forbidden"] = 402] = "Forbidden";
                    Errore[Errore["NotFound"] = 403] = "NotFound";
                })(Errore = Stato.Errore || (Stato.Errore = {}));
            })(Stato = Risposta.Stato || (Risposta.Stato = {}));
            class Messaggio {
                constructor(stato, messaggio, contenuto) {
                    this.tipo = Server.Tipo.Risposta;
                    this.stato = stato;
                    if (messaggio != undefined)
                        this.messaggio = messaggio;
                    if (contenuto != undefined)
                        this.contenuto = contenuto;
                }
                toJson() {
                    return JSON.stringify(this);
                }
            }
            Risposta.Messaggio = Messaggio;
        })(Risposta = Server.Risposta || (Server.Risposta = {}));
        class Messaggio {
            constructor(tipoComunicazione, contenuto) {
                this.tipo = Tipo.Comunicazione;
                this.tipoComunicazione = tipoComunicazione;
                this.contenuto = contenuto;
            }
            toJson() {
                return JSON.stringify(this);
            }
        }
        Server.Messaggio = Messaggio;
        let TipoComunicazione;
        (function (TipoComunicazione) {
            TipoComunicazione[TipoComunicazione["SessioneJoinata"] = 0] = "SessioneJoinata";
            TipoComunicazione[TipoComunicazione["GiocatorePronto"] = 1] = "GiocatorePronto";
            TipoComunicazione[TipoComunicazione["GiocatoreMorto"] = 2] = "GiocatoreMorto";
            TipoComunicazione[TipoComunicazione["GiocatoreGuarito"] = 3] = "GiocatoreGuarito";
            TipoComunicazione[TipoComunicazione["PartitaIniziata"] = 4] = "PartitaIniziata";
            TipoComunicazione[TipoComunicazione["PartitaTerminata"] = 5] = "PartitaTerminata";
            TipoComunicazione[TipoComunicazione["SessioneTerminata"] = 6] = "SessioneTerminata";
        })(TipoComunicazione = Server.TipoComunicazione || (Server.TipoComunicazione = {}));
    })(Server = Comunicazione.Server || (Comunicazione.Server = {}));
})(Comunicazione = exports.Comunicazione || (exports.Comunicazione = {}));
