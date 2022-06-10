const removeForm = document.querySelector('.confession__remove-form');
const removeBtn = document.querySelector('.btn-remove');

removeForm.addEventListener('submit', (e) => {
    e.preventDefault()
})

removeBtn.addEventListener('click', async function () {
    const { confessionId } = this.closest('.confession__action').dataset;

    Swal.fire({
        title: `Are you sure you want to remove this confession: ${confessionId}?`,
        html: '<p>This will permenantly remove the confession information ' +
            'including id, content, media, time posted and status from the database.</p>',
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        denyButtonText: `Remove`,
    }).then((result) => {
        if (result.isDenied) {
            Swal.fire({
                title: `Confession: ${confessionId} Removed`,
                icon: 'success'
            }).then(() => {
                removeForm.submit()
            })
        }
    })
})
