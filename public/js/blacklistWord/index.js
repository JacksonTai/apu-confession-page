/* global Swal */
/* eslint-disable no-loop-func */
/* eslint-disable func-names */
const deleteBtns = document.querySelectorAll('.blacklist__delete-btn');
for (let deleteBtn of deleteBtns) {
  deleteBtn.addEventListener('click', function () {
    const word = this.previousElementSibling.textContent.trim();
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: `<span>This will permenantly remove <strong>${word}</strong> from the blacklist.</span>`,
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      denyButtonText: 'Remove',
    }).then(async (result) => {
      if (result.isDenied) {
        await fetch(
          `${window.location.href.split('blacklistWords')[0]}/${
            this.dataset.id
          }`,
          {
            method: 'DELETE',
          },
        );
        Swal.fire({
          title: 'Removed',
          icon: 'success',
          iconColor: '#1A73E8',
        }).then(() => {
          window.location = '/blacklistWord';
        });
      }
    });
  });
}
