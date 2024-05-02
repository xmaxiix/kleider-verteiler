// Wechsel der Registrierungssteps
function zeigeStep(step) {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((s) => s.classList.add('d-none'));
    document.getElementById(`step${step}`).classList.remove('d-none');
}

// Verarbeitung der Abgabe
document.getElementById('plz').addEventListener('input', checkPostleitzahl);
function checkPostleitzahl() {
    const plz = document.getElementById('plz').value;
    const erwartetePlz = /^(\d{5})$/;
    const abgabeInfo = document.getElementById('abgabeInfo');
    
    document.getElementById('optionAbgabe').classList.remove('d-none');
    
    if (plz.match(erwartetePlz) && plz.startsWith('01')) {
        abgabeInfo.textContent = 'Eine Abholung der Spende durch unser Sammelfahrzeug ist an diesem Ort möglich. Alternativ kann die Spende in unserer Geschäftsstelle abgegeben werden.';
        abgabeInfo.classList.add('bg-success');
        document.getElementById('optionAbholung').classList.remove('d-none');
    }
    else if (plz.match(erwartetePlz)) {
        abgabeInfo.textContent = 'Eine Abholung der Spende durch unser Sammelfahrzeug ist an diesem Ort nicht möglich. Die Spende kann in unserer Geschäftsstelle abgegeben werden.';
    }
    else {
        document.getElementById('optionAbgabe').classList.add('d-none');
        document.getElementById('optionAbholung').classList.add('d-none');
        document.getElementById('angabenAbholung').classList.add('d-none');
        abgabeInfo.classList.remove('bg-success');
    }
}

// Abholung durch Sammelfahrzeug
let abholung = false;
document.getElementById('auswahlAbholung').addEventListener('change', function() {
    if (this.checked) {
        abholung = true;
        document.getElementById('angabenAbholung').classList.remove('d-none');
    } else {
        abholung = false;
        document.getElementById('angabenAbholung').classList.add('d-none');
    }
});

// Registrierung der Kleidungsstücke
document.getElementById('kleiderFormular').addEventListener('input', () => {
    const art = document.getElementById('kleiderArt').value;
    const beschreibung = document.getElementById('kleiderBeschreibung').value.trim();
    const groesse = Array.from(document.getElementById('kleiderGroesse').selectedOptions).map(option => option.value);
    document.getElementById('ergaenzeKlStk').disabled = !art || !beschreibung || groesse.length === 0;
})

document.getElementById('ergaenzeKlStk').addEventListener('click', () => {
    const art = document.getElementById('kleiderArt').value;
    const beschreibung = document.getElementById('kleiderBeschreibung').value.trim();
    const groesse = Array.from(document.getElementById('kleiderGroesse').selectedOptions).map(option => option.value);

    const neuesKlStk = `
        <li class="list-group-item mb-3">
            Art: ${art}, Beschreibung: ${beschreibung}, Größe: ${groesse}
            <button class="btn btn-danger btn-sm float-end" onclick="entferneKlStk(this)">Entfernen</button>
        </li>`;
    document.getElementById('kleiderListe').innerHTML += neuesKlStk;

    document.getElementById('kleiderFormular').reset();
    document.getElementById('ergaenzeKlStk').disabled = true;
})

function entferneKlStk(button) {
    button.parentElement.remove();
}

function submitForm() {
    // Daten aus Formularfeldern sammeln
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    // Daten im Summary anzeigen
    document.getElementById('summaryName').textContent = name;
    document.getElementById('summaryDate').textContent = date;
    // Formular verstecken und Summary anzeigen
    document.querySelectorAll('.form-step').forEach(s => s.classList.add('d-none'));
    document.getElementById('summary').classList.remove('d-none');
}

zeigeStep(1);
document.getElementById('plz').value='';
document.getElementById('auswahlAbholung').checked = false;
// document.getElementById('auswahlKrisengebiet').checked = false;