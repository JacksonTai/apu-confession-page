/* Add multiple photo and video */
// Event listener for removing media item.
document.addEventListener('click', (e) => {
  if (e.target.matches('.delete-media-btn')) {
    e.target.parentElement.remove(e.target);
  }
});

const photoContainer = document.querySelector('.media__container--photo');
const videoContainer = document.querySelector('.media__container--video');
const addMediaItem = (mediaLink, type) => {
  // Delete button
  const deleteBtn = document.createElement('i');
  deleteBtn.className = 'fa-solid fa-square-minus delete-media-btn';

  // Link
  const link = document.createElement('a');
  link.textContent = mediaLink;
  link.href = mediaLink;
  link.target = '_blank';

  // Input value
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = `confession[${type}]`;
  input.value = mediaLink;

  // Media Item
  const mediaItem = document.createElement('div');
  mediaItem.className = 'media__item';
  mediaItem.append(deleteBtn, link, input);

  if (type === 'photo') {
    photoContainer.append(mediaItem);
  } else if (type === 'video') {
    videoContainer.append(mediaItem);
  }
};

const addMediaBtns = document.querySelectorAll('.add-media-btn');
for (let addMediaBtn of addMediaBtns) {
  // eslint-disable-next-line func-names
  addMediaBtn.addEventListener('click', function () {
    let input = this.previousElementSibling;
    if (input.value.trim()) {
      addMediaItem(input.value.trim(), this.dataset.type);
      input.value = '';
    }
  });
}
