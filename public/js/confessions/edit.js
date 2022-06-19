const contentInput = document.querySelector('.confess__input--content');
contentInput.addEventListener('input', function () {
    if (this.value) {
        const contentErrMsg = document.querySelector('[data-err-msg="content"]');
        contentErrMsg.style.display = "none"
    }
})

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('status') == "edited") {
    window.history.replaceState(null, '', `/confessions`);
    Swal.fire({
        icon: "success",
        title: `Confession: ${apucpId} successfully edited.`,
        allowOutsideClick: false,
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: 'Back',
        confirmButtonColor: '#1A73E8',
        iconColor: '#1A73E8',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = `${window.location.href.split('confessions')[0]}confessions/${id}`
        }
    });
}
