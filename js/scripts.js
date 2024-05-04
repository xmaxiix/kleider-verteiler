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
                zeigePostleitzahlData(data);
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

function zeigePostleitzahlData(data) {
    const plzInfoDiv = document.getElementById('plzInfo');
    if (data.length > 0) {
        const ort = data[0];
        plzInfoDiv.innerHTML = `<strong>Ort:</strong> ${ort.name} (${ort.federalState.name})`;
        zeigeAbgabeoptionen();
    } else {
        plzInfoDiv.textContent = 'Dies scheint keine gültige Postleitzahl zu sein.'
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

document.getElementById('abholung').addEventListener('change', updateAbgabeAnzeige);
document.getElementById('uebergabe').addEventListener('change', updateAbgabeAnzeige);
function updateAbgabeAnzeige() {
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
    document.getElementById('ergaenzeKlStk').disabled = !art || !beschreibung || groesse.length === 0;
})

document.getElementById('ergaenzeKlStk').addEventListener('click', () => {
    const art = document.getElementById('kleiderArt').value;
    const beschreibung = document.getElementById('kleiderBeschreibung').value.trim();
    const groesse = document.getElementById('kleiderGroesse').value;

    const neuesKlStk = `
        <li class="list-group-item mb-1">
            ${art}, ${beschreibung}, ${groesse}
            <button class="btn btn-danger btn-sm float-end" onclick="entferneKlStk(this)">Entfernen</button>
        </li>`;
    document.getElementById('kleiderListe').innerHTML += neuesKlStk;

    document.getElementById('kleiderFormular').reset();
    document.getElementById('ergaenzeKlStk').disabled = true;
})

function entferneKlStk(button) {
    button.parentElement.remove();
}

function extrahiereSpendenDetails() {
    const klStk = document.querySelectorAll('#kleiderListe .list-group-item');
    let details = '';
    klStk.forEach(stk => {
        const text = stk.cloneNode(true);
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
    const detailsAbholung = document.getElementById('abholung').checked ? `Abholung von ${adresse} am ${abgabeDatum} gewünscht.` : `Die Spende wird an der Geschäftsstelle übergeben.`;
    const zusatzAbholung = document.getElementById('zusatzAbholung').value;
    const kommentarHtml = zusatzAbholung ? `<br>Kommentar zur Abholung: ${zusatzAbholung}` : '';
    const mail = document.getElementById('mail').value;
    const mailHtml = mail ? `E-Mail-Adresse für Kontaktaufnahme: ${mail}`: 'Es wurde keine E-Mail-Adresse angegeben.';
    const spendengebietRadioButtons = document.querySelectorAll('input[name="spendengebiet"]');
    let spendengebiet = '';
    document.querySelectorAll('input[name="spendengebiet"]').forEach(radio => {
        if (radio.checked) spendengebiet = radio.value;
    });
    const detailsSpende = extrahiereSpendenDetails();

    const zusammenfassungHtml =`
        <tr>
            <th scope="row">Spender:in:</th>
            <td>${name}</td>
        </tr>
        <tr>
            <th scope="row">Abgabe:</th>
            <td>${detailsAbholung}${kommentarHtml}<br>${mailHtml}</td>
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

function pruefeRegistrierung() {
    const zusammenfassungHtml = generiereZusammenfassung();
    document.querySelector('#ueberpruefung').innerHTML = zusammenfassungHtml;
    zeigeStep(5);
}

function abschlussRegistrierung() {
    const zeitpunkt = new Date();
    const formatierterZeitpunkt = formatiereDatum(zeitpunkt);
    const uebertragungHtml = `<p>Die Daten wurde am ${formatierterZeitpunkt} erfolgreich übermittelt.</p>`;
    document.getElementById('uebertragung').innerHTML = uebertragungHtml;
    const zusammenfassungHtml = generiereZusammenfassung();
    document.querySelector('#abschluss').innerHTML = zusammenfassungHtml;
    // document.getElementById('abschluss').innerHTML = zusammenfassungHtml;

    zeigeStep(1);
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
document.getElementById('nachname').value='';
document.getElementById('vorname').value='';
document.getElementById('plz').value='';