const backBtn = document.querySelector('.btn-back');
backBtn.addEventListener('click', function () {
    window.location = sessionStorage.getItem('prevPageState') || '/confessions'
})

const removeForm = document.querySelector('.confession__remove-form');
const removeBtn = document.querySelector('.btn-remove');

removeForm.addEventListener('submit', (e) => {
    e.preventDefault()
})

removeBtn.addEventListener('click', async function () {
    Swal.fire({
        icon: 'warning',
        title: `Are you sure you want to remove confession: ${apucpId}?`,
        html: '<p>This will permenantly remove the confession information ' +
            'including the id, content, media links, time posted and status from the database.</p>',
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        denyButtonText: `Remove`,
    }).then((result) => {
        if (result.isDenied) {
            Swal.fire({
                title: `Confession: ${apucpId} Removed`,
                icon: 'success',
                iconColor: '#1A73E8',
            }).then(() => {
                removeForm.submit()
            })
        }
    })
})
