"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Comunicazione;
(function (Comunicazione) {
    let Tipo;
    (function (Tipo) {
        Tipo[Tipo["Richiesta"] = 0] = "Richiesta";
        Tipo[Tipo["Risposta"] = 1] = "Risposta";
    })(Tipo = Comunicazione.Tipo || (Comunicazione.Tipo = {}));
    let TipoFase;
    (function (TipoFase) {
        TipoFase[TipoFase["Preparazione"] = 0] = "Preparazione";
        TipoFase[TipoFase["Gioco"] = 1] = "Gioco";
    })(TipoFase = Comunicazione.TipoFase || (Comunicazione.TipoFase = {}));
    let TipoPreparazione;
    (function (TipoPreparazione) {
        TipoPreparazione[TipoPreparazione["CreaPartita"] = 0] = "CreaPartita";
        TipoPreparazione[TipoPreparazione["JoinPartita"] = 1] = "JoinPartita";
    })(TipoPreparazione = Comunicazione.TipoPreparazione || (Comunicazione.TipoPreparazione = {}));
    let TipoGioco;
    (function (TipoGioco) {
        TipoGioco[TipoGioco["PaesanoMorto"] = 0] = "PaesanoMorto";
        TipoGioco[TipoGioco["AssassinoScoperto"] = 1] = "AssassinoScoperto";
    })(TipoGioco = Comunicazione.TipoGioco || (Comunicazione.TipoGioco = {}));
    let Server;
    (function (Server) {
        let EsitoComunicazione;
        (function (EsitoComunicazione) {
            EsitoComunicazione[EsitoComunicazione["Positivo"] = 0] = "Positivo";
            EsitoComunicazione[EsitoComunicazione["Negativo"] = 1] = "Negativo";
        })(EsitoComunicazione = Server.EsitoComunicazione || (Server.EsitoComunicazione = {}));
        let Successo;
        (function (Successo) {
            Successo[Successo["Ok"] = 200] = "Ok";
            Successo[Successo["Created"] = 201] = "Created";
            Successo[Successo["Accepted"] = 202] = "Accepted";
        })(Successo = Server.Successo || (Server.Successo = {}));
        let Errore;
        (function (Errore) {
            Errore[Errore["BadRequest"] = 400] = "BadRequest";
            Errore[Errore["Unauthorized"] = 401] = "Unauthorized";
            Errore[Errore["Forbidden"] = 402] = "Forbidden";
            Errore[Errore["NotFound"] = 403] = "NotFound";
        })(Errore = Server.Errore || (Server.Errore = {}));
    })(Server = Comunicazione.Server || (Comunicazione.Server = {}));
    class Risposta {
        constructor(stato, contenuto, messaggio) {
            this.tipo = 1;
            this.valore = 200;
            this.valore = stato;
            if (messaggio != undefined)
                this.messaggio = messaggio;
            if (contenuto != undefined)
                this.contenuto = contenuto;
        }
        toJson() {
            return JSON.stringify(this);
        }
    }
    Comunicazione.Risposta = Risposta;
})(Comunicazione = exports.Comunicazione || (exports.Comunicazione = {}));
