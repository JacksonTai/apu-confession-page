const { apucpId, _id } = confession;

const backBtn = document.querySelector('.btn-back');
backBtn.addEventListener('click', function () {
    window.location = sessionStorage.getItem('prevPageState') || '/confessions'
})

/* Remove Confession */
const actionForm = document.querySelector('.confession__action-form');
actionForm.addEventListener('submit', (e) => {
    e.preventDefault()
})

const removeBtn = document.querySelector('.btn-remove');
removeBtn.addEventListener('click', async function () {
    Swal.fire({
        icon: 'warning',
        title: `Are you sure you want to remove confession: ${apucpId}?`,
        html: '<span>This will permenantly remove the confession information ' +
            'including the id, content, media links, time posted and status from the database.</span>',
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        denyButtonText: `Remove`,
    }).then((result) => {
        if (result.isDenied) {
            window.history.replaceState(null, '', `/confessions`);
            Swal.fire({
                title: `Confession: ${apucpId} Removed`,
                icon: 'success',
                iconColor: '#1A73E8',
            }).then(() => {
                actionForm.submit()
            })
        }
    })
})

/* Approve Confession */
const showApprovalSuccess = () => {
    Swal.fire({
        icon: "success",
        title: "Confession Approved",
        html: `<a class="confession__approved-link" target="_blank" 
                href="https://www.facebook.com/hashtag/${apucpId.replace('#', '')}">
                Facebook link: ${apucpId}</a>`,
        allowOutsideClick: false,
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: 'Done',
        confirmButtonColor: '#1A73E8',
        iconColor: '#1A73E8',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = '/confessions'
        }
    });
}

const showApprovalErr = (errMsg) => {
    Swal.fire({
        icon: "error",
        title: "Something went wrong",
        html: `<p>Error: ${errMsg}</p>`,
        confirmButtonText: 'Close',
        confirmButtonColor: '#1A73E8',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = `/confessions/${_id}`
        }
    });
}

const approveBtn = document.querySelector('.btn-approve')
approveBtn.addEventListener('click', async function () {
    Swal.fire({ allowOutsideClick: false })
    Swal.showLoading()
    const res = await fetch(`/confessions/approve?id=${_id}`)
    const data = await res.json()
    if (data) {
        swal.close()
        window.history.replaceState(null, '', `/confessions`);
        if (data.success) {
            showApprovalSuccess()
        }
        if (data.message) {
            showApprovalErr(data.message)
        }
    } else if (!data) {
        showApprovalErr('Please create an album for this confession.')
    }
})