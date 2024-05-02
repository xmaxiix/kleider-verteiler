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
    
    document.getElementById('abgabeInfo').classList.remove('d-none');
    
    if (plz.match(erwartetePlz) && plz.startsWith('01')) {
        abgabeInfo.textContent = 'Die Abholung durch unser Sammelfahrzeug ist an diesem Ort möglich.';
        abgabeInfo.classList.add('bg-success');
        document.getElementById('optionAbholung').classList.remove('d-none');
    }
    else if (plz.match(erwartetePlz)) {
        if (plz === '00000') {abgabeInfo.textContent = 'Danke, dass du hier bist.';}
        else {abgabeInfo.textContent = 'Eine Abholung durch unser Sammelfahrzeug ist an diesem Ort nicht möglich. Die Spende kann in unserer Geschäftsstelle abgegeben werden.';}
    }
    else {
        document.getElementById('abgabeInfo').classList.add('d-none');
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

// Initial den ersten Schritt anzeigen
zeigeStep(1);