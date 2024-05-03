function zeigeStep(step) {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((s) => s.classList.add('d-none'));
    document.getElementById(`step${step}`).classList.remove('d-none');
}

document.getElementById('plz').addEventListener('input', checkPostleitzahl);
function checkPostleitzahl() {
    const plz = document.getElementById('plz').value;
    const erwartetePlz = /^(\d{5})$/;
    const abgabeInfo = document.getElementById('abgabeInfo');

    document.getElementById('abholung').checked = false;
    document.getElementById('uebergabe').checked = false;
    document.getElementById('optionAbgabe').classList.remove('d-none');
    
    if (plz.match(erwartetePlz) && plz.startsWith('01')) {
        abgabeInfo.textContent = 'Eine Abholung der Spende durch unser Sammelfahrzeug ist an diesem Ort grundsätzlich möglich.';
        abgabeInfo.classList.add('bg-success');
    }
    else if (plz.match(erwartetePlz)) {
        abgabeInfo.textContent = 'Eine Abholung der Spende durch unser Sammelfahrzeug ist an diesem Ort nicht möglich. Die Spende kann ausschließlich in unserer Geschäftsstelle übergegeben werden.';
    }
    else {
        document.getElementById('optionAbgabe').classList.add('d-none');
        document.getElementById('angabenAbholung').classList.add('d-none');
        abgabeInfo.textContent = '';
        abgabeInfo.classList.remove('bg-success');
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

function pruefeRegistrierung() {
    const nachname = document.getElementById('nachname').value;
    const vorname = document.getElementById('vorname').value;
    const spendengebietRadioButtons = document.querySelectorAll('input[name="spendengebiet"]');
    let spendengebiet = '';
    spendengebietRadioButtons.forEach((radio) => {
        if (radio.checked) {
            spendengebiet = radio.value;
        }
    });
    
    document.getElementById('zfname').textContent = vorname + ' ' + nachname;
    document.getElementById('zfspendengebiet').textContent = spendengebiet;
    
    if (document.getElementById('abholung').checked) {
        document.getElementById('zfabholung').classList.remove('d-none');
        const mail = document.getElementById('mail').value;
        const adresse = document.getElementById('adresse').value;
        const zusatzAbholung = document.getElementById('zusatzAbholung').value;
        const abgabeDatum = document.getElementById('abgabeDatum').value;
        document.getElementById('zfmail').textContent = mail;
        if (mail === '' || adresse === '' || abgabeDatum === '') {
            document.getElementById('fehlendeAngabenAbholung').classList.remove('d-none');
        } else {
            document.getElementById('zfadresse').textContent = adresse;
            document.getElementById('zfabgabeDatum').textContent = abgabeDatum;
            document.getElementById('zfangabenAbholung').classList.remove('d-none');
        }
        if (zusatzAbholung != ''){
            document.getElementById('zfzusatzAbholung').textContent = zusatzAbholung;
            document.getElementById('optKommentar').classList.remove('d-none');
        }
    } else {
        document.getElementById('zfabgabe').classList.remove('d-none');
    }

    const kleiderListeElemente = document.querySelectorAll('#kleiderListe .list-group-item');
    let kleiderListeHTML = '';
    kleiderListeElemente.forEach(element => {
        kleiderListeHTML += element.textContent + '<br>';
    });
    document.getElementById('zfkleiderListe').innerHTML = kleiderListeHTML;

    zeigeStep(5);
    // document.querySelectorAll('.form-step').forEach(s => s.classList.add('d-none'));
    // document.getElementById('zusammenfassung').classList.remove('d-none');
}

zeigeStep(4);
// document.getElementById('plz').value='';