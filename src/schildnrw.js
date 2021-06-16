'use strict';

const mdb = require('./mdb');

class SchildNRW extends mdb.Connection {
    constructor(filen){
        super(filen);

    }

    async get_current(year, term){
        return this.query('Select Schuljahr,  SchuljahrAbschnitt from EigeneSchule;');
    }

    async get_teachers(year, term){
        return this.query(`SELECT K_Lehrer.ID, K_Lehrer.Kuerzel, K_Lehrer.Vorname, K_Lehrer.Nachname, K_Lehrer.Email, K_Lehrer.EMailDienstlich
        FROM K_Lehrer
        WHERE (((K_Lehrer.Kuerzel) Is Not Null) AND ((K_Lehrer.Vorname) Is Not Null) AND ((K_Lehrer.Nachname) Is Not Null) AND ((K_Lehrer.Sichtbar)='+'));`); 
    }

    async get_students(year, term){
        return this.query(`SELECT Schueler.ID, Schueler.Vorname, Schueler.Name, Schueler.EMail, Schueler.SchulEmail, SchuelerLernabschnittsdaten.Klasse, SchuelerLernabschnittsdaten.ASDJahrgang, Schueler.Lehrer
        FROM (Schueler INNER JOIN SchuelerLernabschnittsdaten ON Schueler.ID = SchuelerLernabschnittsdaten.Schueler_ID)
        WHERE (((SchuelerLernabschnittsdaten.Jahr)= ${year}) AND ((SchuelerLernabschnittsdaten.Abschnitt)=${term}));`); 
    }

    
    async get_classes(year, term){
        return this.query(`SELECT DISTINCT SchuelerLernabschnittsdaten.Klasse, SchuelerLernabschnittsdaten.ASDJahrgang, SchuelerLernabschnittsdaten.KlassenLehrer, K_Lehrer.Kuerzel AS StvKlassenlehrer
        FROM SchuelerLernabschnittsdaten LEFT JOIN K_Lehrer ON SchuelerLernabschnittsdaten.StvKlassenlehrer_ID = K_Lehrer.ID
        WHERE ((Not (SchuelerLernabschnittsdaten.KlassenLehrer)="") AND ((SchuelerLernabschnittsdaten.Jahr)=${year}) AND ((SchuelerLernabschnittsdaten.Abschnitt)=${term}));
    `); 
    }

    async get_courses(year, term){
        return this.query(`SELECT DISTINCT SchuelerLernabschnittsdaten.Klasse, SchuelerLernabschnittsdaten.ASDJahrgang, EigeneSchule_Faecher.FachKrz, EigeneSchule_Faecher.Bezeichnung, SchuelerLeistungsdaten.Kursart, Kurse.KurzBez, SchuelerLernabschnittsdaten.Jahr, SchuelerLernabschnittsdaten.Abschnitt, SchuelerLeistungsdaten.FachLehrer
        FROM SchuelerLernabschnittsdaten INNER JOIN (EigeneSchule_Faecher INNER JOIN (SchuelerLeistungsdaten LEFT JOIN Kurse ON SchuelerLeistungsdaten.Kurs_ID = Kurse.ID) ON EigeneSchule_Faecher.ID = SchuelerLeistungsdaten.Fach_ID) ON SchuelerLernabschnittsdaten.ID = SchuelerLeistungsdaten.Abschnitt_ID
        WHERE (((SchuelerLernabschnittsdaten.Jahr)=${year}) AND ((SchuelerLernabschnittsdaten.Abschnitt)=${term}) AND ((SchuelerLeistungsdaten.FachLehrer) Is Not Null)); `); 
    }

    async get_course_allocation(year, term){
        return this.query(` SELECT DISTINCT SchuelerLernabschnittsdaten.Klasse, SchuelerLernabschnittsdaten.ASDJahrgang, EigeneSchule_Faecher.FachKrz, EigeneSchule_Faecher.Bezeichnung, SchuelerLeistungsdaten.Kursart, Kurse.KurzBez, SchuelerLernabschnittsdaten.Jahr, SchuelerLernabschnittsdaten.Abschnitt, SchuelerLeistungsdaten.FachLehrer, Schueler.Vorname, Schueler.Name, Schueler.EMail, Schueler.SchulEmail
        FROM Schueler INNER JOIN (SchuelerLernabschnittsdaten INNER JOIN (EigeneSchule_Faecher INNER JOIN (SchuelerLeistungsdaten LEFT JOIN Kurse ON SchuelerLeistungsdaten.Kurs_ID = Kurse.ID) ON EigeneSchule_Faecher.ID = SchuelerLeistungsdaten.Fach_ID) ON SchuelerLernabschnittsdaten.ID = SchuelerLeistungsdaten.Abschnitt_ID) ON Schueler.ID = SchuelerLernabschnittsdaten.Schueler_ID
        WHERE (((SchuelerLernabschnittsdaten.Jahr)=${year}) AND ((SchuelerLernabschnittsdaten.Abschnitt)=${term}) AND ((SchuelerLeistungsdaten.FachLehrer) Is Not Null)); `); 
    }
}

module.exports = {
    SchildNRW
};