let globalOrt = '';

function zeigeStep(step) {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((s) => s.classList.add('d-none'));
    document.getElementById(`step${step}`).classList.remove('d-none');
}

document.getElementById('plz').addEventListener('input', pruefePostleitzahl);
function pruefePostleitzahl() {
    const plz = document.getElementById('plz').value;
    const erwarteteEingabe = /^(\d{5})$/;
    const url = 'https://openplzapi.org/de/Localities?postalCode=' + plz;
    const plzInfo = document.getElementById('plzInfo');
    const abgabeInfo = document.getElementById('abgabeInfo');

    if (plz.match(erwarteteEingabe)) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Netzwerkantwort war nicht okay');
                }
                return response.json();
            })
            .then(data => {
                zeigeOrtsdaten(data);
            })
            .catch(error => {
                console.error('Fehler beim Aufrufen der PLZ-Daten:', error);
                plzInfo.textContent = 'Fehler beim Abrufen der Daten';
            })
    } else {
        plzInfo.textContent = 'Bitte gib deine Postleitzahl zur Überprüfung ein.';
        document.getElementById('optionAbgabe').classList.add('d-none');
        document.getElementById('angabenAbholung').classList.add('d-none');
        abgabeInfo.textContent = '';
        abgabeInfo.classList.remove('bg-success');
        document.getElementById('optionAbholung').classList.remove('d-none');
        document.getElementById('abholung').checked = false;
        document.getElementById('uebergabe').checked = false;
        document.getElementById('mail').value='';
        document.getElementById('adresse').value='';
        document.getElementById('zusatzAbholung').value='';
        document.getElementById('abgabeDatum').value='';
    }

}

function zeigeOrtsdaten(data) {
    const plzInfoDiv = document.getElementById('plzInfo');
    if (data.length > 0) {
        const ort = data[0];
        globalOrt = ort.name;
        plzInfoDiv.innerHTML = `<strong>Ort:</strong> ${ort.name} (${ort.federalState.name})`;
        zeigeAbgabeoptionen();
    } else {
        plzInfoDiv.textContent = 'Dies scheint keine gültige Postleitzahl zu sein.'
        globalOrt = '';
    }
}

function zeigeAbgabeoptionen() {
    const plz = document.getElementById('plz').value;
    const abgabeInfo = document.getElementById('abgabeInfo');

    document.getElementById('optionAbgabe').classList.remove('d-none');

    if (plz.startsWith('01')) {
        abgabeInfo.textContent = 'Eine Abholung der Spende durch unser Sammelfahrzeug ist an diesem Ort grundsätzlich möglich.';
        abgabeInfo.classList.add('bg-success');
    } else {
        abgabeInfo.textContent = 'Eine Abholung der Spende durch unser Sammelfahrzeug ist an diesem Ort nicht möglich. Die Spende kann ausschließlich in unserer Geschäftsstelle übergegeben werden.';
        document.getElementById('optionAbholung').classList.add('d-none');
    }
}

document.getElementById('abholung').addEventListener('change', updateAbgabeanzeige);
document.getElementById('uebergabe').addEventListener('change', updateAbgabeanzeige);
function updateAbgabeanzeige() {
    const abholungSelected = document.getElementById('abholung').checked;
    const angabenAbholung = document.getElementById('angabenAbholung');

    if (abholungSelected) {
        angabenAbholung.classList.remove('d-none');
    } else {
        angabenAbholung.classList.add('d-none');
    }
}

document.getElementById('kleiderFormular').addEventListener('input', () => {
    const art = document.getElementById('kleiderArt').value;
    const beschreibung = document.getElementById('kleiderBeschreibung').value.trim();
    const groesse = Array.from(document.getElementById('kleiderGroesse').selectedOptions).map(option => option.value);
    document.getElementById('ergaenzeKleidungsstueck').disabled = !art || !beschreibung || groesse.length === 0;
})

document.getElementById('ergaenzeKleidungsstueck').addEventListener('click', () => {
    const art = document.getElementById('kleiderArt').value;
    const beschreibung = document.getElementById('kleiderBeschreibung').value.trim();
    const groesse = document.getElementById('kleiderGroesse').value;

    const neuesKleidungsstueck = `
        <li class="list-group-item mb-1">
            ${art}, ${beschreibung}, ${groesse}
            <button class="btn btn-danger btn-sm float-end" onclick="entferneKleidungsstueck(this)">Entfernen</button>
        </li>`;
    document.getElementById('kleiderListe').innerHTML += neuesKleidungsstueck;

    document.getElementById('kleiderFormular').reset();
    document.getElementById('ergaenzeKleidungsstueck').disabled = true;
})

function entferneKleidungsstueck(button) {
    button.parentElement.remove();
}

function extrahiereSpendenDetails() {
    const kleidungsstuecke = document.querySelectorAll('#kleiderListe .list-group-item');
    let details = '';
    kleidungsstuecke.forEach(kleidungsstueck => {
        const text = kleidungsstueck.cloneNode(true);
        const button = text.querySelector('button');
        if (button) button.remove();
        details += `${text.textContent.trim()}<br>`;
    });
    return details;
}

function generiereZusammenfassung() {
    const name = document.getElementById('vorname').value + ' ' + document.getElementById('nachname').value;
    const adresse = document.getElementById('adresse').value;
    const abgabeDatum = document.getElementById('abgabeDatum').value;
    const abholungChecked = document.getElementById('abholung').checked;
    const uebergabeChecked = document.getElementById('uebergabe').checked
    const zusatzAbholung = document.getElementById('zusatzAbholung').value;
    const mail = document.getElementById('mail').value;

    let detailsAbholung = '';
    if (abholungChecked && adresse != '' && abgabeDatum != '') {
        detailsAbholung = `Abholung von ${adresse} am ${abgabeDatum} gewünscht.`;
    } else if (abholungChecked) {
        detailsAbholung = 'Abholung gewünscht.';
    } else if (uebergabeChecked) {
        detailsAbholung = 'Die Spende wird an der Geschäftsstelle übergeben.';
    } 

    const kommentarHtml = zusatzAbholung ? `<br>Kommentar zur Abholung: ${zusatzAbholung}` : '';
    const mailHtml = mail ? `<br>E-Mail-Adresse für Kontaktaufnahme: ${mail}`: '';
    const detailsSpende = extrahiereSpendenDetails();
    const spendengebiet = document.querySelector('input[name="spendengebiet"]:checked')?.value || '';

    const zusammenfassungHtml =`
        <tr>
            <th scope="row">Spender:in:</th>
            <td>${name}</td>
        </tr>
        <tr>
            <th scope="row">Ort:</th>
            <td>${globalOrt}</td>
        </tr>
        <tr>
            <th scope="row">Abgabe:</th>
            <td>${detailsAbholung}${kommentarHtml}${mailHtml}</td>
        </tr>
        <tr>
            <th scope="row">Spende:</th>
            <td>${detailsSpende}</td>
        </tr>
        <tr>
            <th scope="row">Spendengebiet:</th>
            <td>${spendengebiet}</td>
        </tr>
    `;

    return zusammenfassungHtml;
}

function validiereAngaben() {
    const errors = [];
    const vorname = document.getElementById('vorname').value.trim();
    const nachname = document.getElementById('nachname').value.trim();
    const plz = document.getElementById('plz').value.trim();
    const abholung = document.getElementById('abholung').checked;
    const uebergabe = document.getElementById('uebergabe').checked;
    const mail = document.getElementById('mail').value.trim();
    const adresse = document.getElementById('adresse').value.trim();
    const abgabeDatum = document.getElementById('abgabeDatum').value.trim();
    const kleidungsstuecke = document.querySelectorAll('#kleiderListe .list-group-item').length;
    const spendengebietChecked = document.querySelector('input[name="spendengebiet"]:checked');

    if (!vorname || !nachname) {
        errors.push("Vorname und Nachname müssen angegeben werden.");
    }
    if (!plz) {
        errors.push("Bitte gib deine Postleitzahl an.")
    }
    if (!(abholung || uebergabe)) {
        errors.push("Bitte wähle eine Abgabeoption aus (Übergabe oder Abholung).");
    }
    if (abholung && (!mail || !adresse || !abgabeDatum)) {
        errors.push("Für die Abholung müssen Mail, Adresse und Abgabedatum angegeben werden.");
    }
    if (kleidungsstuecke === 0) {
        errors.push("Bitte füge mindestens ein Kleidungsstück hinzu.");
    }
    if (!spendengebietChecked) {
        errors.push("Bitte wähle ein Spendengebiet aus.");
    }

    return errors;
}

function pruefeRegistrierung() {
    const errors =validiereAngaben();
    const zusammenfassungHtml = generiereZusammenfassung();
    document.querySelector('#ueberpruefung').innerHTML = zusammenfassungHtml;
    const abschlussButton = document.querySelector('#step5 button[data-bs-target="#endeRegistrierung"]');
    const fehlermeldungDiv = document.getElementById('fehlermeldung');
    fehlermeldungDiv.innerHTML = 'Ihre Angaben sind unvollständig:<br>';

    if (errors.length > 0) {
        abschlussButton.disabled = true;
        let errorHtml = '<ul>';
        errors.forEach(error => {
            errorHtml += `<li>${error}</li>`;
        });
        errorHtml += '</ul>';
        fehlermeldungDiv.innerHTML += errorHtml;
        fehlermeldungDiv.classList.remove('d-none');
    } else {
        abschlussButton.disabled = false;
        const existingErrors = document.querySelector('.alert-danger');
        if (existingErrors) existingErrors.remove();
    }   
    zeigeStep(5);
}

function abschlussRegistrierung() {
    const zeitpunkt = new Date();
    const formatierterZeitpunkt = formatiereDatum(zeitpunkt);
    const uebertragungHtml = `<p>Die Daten wurde am ${formatierterZeitpunkt} erfolgreich übermittelt.</p>`;
    document.getElementById('uebertragung').innerHTML = uebertragungHtml;
    const zusammenfassungHtml = generiereZusammenfassung();
    document.querySelector('#abschluss').innerHTML = zusammenfassungHtml;

    zeigeStep(1);

    document.getElementById('nachname').value='';
    document.getElementById('vorname').value='';
    document.getElementById('plz').value='';
    document.getElementById('plzInfo').innerHTML='Bitte gib deine Postleitzahl zur Überprüfung ein.';
    document.getElementById('optionAbgabe').classList.add('d-none');
    document.getElementById('angabenAbholung').classList.add('d-none');
    document.getElementById('abholung').checked = false;
    document.getElementById('uebergabe').checked = false;
    document.getElementById('mail').value='';
    document.getElementById('adresse').value='';
    document.getElementById('zusatzAbholung').value='';
    document.getElementById('abgabeDatum').value='';
    document.getElementById('kleiderListe').innerHTML = '';
    document.querySelectorAll('input[name="spendengebiet"]').forEach(radio => {radio.checked = false;});

    globalOrt = '';
}

function formatiereDatum(datum) {
    const tag = String(datum.getDate()).padStart(2, '0');
    const monat = String(datum.getMonth() + 1).padStart(2, '0');
    const jahr = datum.getFullYear();
    const stunden = String(datum.getHours()).padStart(2, '0');
    const minuten = String(datum.getMinutes()).padStart(2, '0');
    const sekunden = String(datum.getSeconds()).padStart(2, '0');
    return `${tag}.${monat}.${jahr} ${stunden}:${minuten}:${sekunden}`;
}

zeigeStep(1);