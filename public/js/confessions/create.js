const contentInput = document.querySelector('.confess__input--content');
contentInput.addEventListener('input', function () {
    if (this.value) {
        const contentErrMsg = document.querySelector('[data-err-msg="content"]');
        contentErrMsg.style.display = "none"
    }
})

const treatyCheckbox = document.querySelector('.confess__input--treaty');
treatyCheckbox.addEventListener('change', function () {
    const treatyErrMsg = document.querySelector('[data-err-msg="treaty"]')
    if (this.checked && this.value == 'on') {
        treatyErrMsg.style.display = "none"
    } else {
        treatyErrMsg.style.display = "block"
    }
})

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('status') == "submitted") {
    window.history.replaceState(null, '', `/`);
    Swal.fire({
        icon: "success",
        title: "Your confession has been submitted. 😃",
        html: `<h3>Your confession ID: ${decodeURIComponent(urlParams.get('id'))}</h3>` +
            `<p>Confessions will be uploaded as soon as akari noticed. Depending on your luck, 
                  it would be within minutes, hours or days.</p>`,
        allowOutsideClick: false,
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: 'Home',
        confirmButtonColor: '#1A73E8',
        iconColor: '#1A73E8',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = "/"
        }
    });
}

const confessionForm = document.querySelector('.confession__form');
window.addEventListener('beforeunload', async function (e) {
    const formData = new FormData(confessionForm);
    await fetch(`${window.location.href.split('confessions')[0]}confessions/tempConfession`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData)
    })
});