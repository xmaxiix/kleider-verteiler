// Eigener Validierungsstil (aus Bootstrap Beispiel: https://getbootstrap.com/docs/5.3/examples/checkout/)
(() => {
    'use strict'  
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  