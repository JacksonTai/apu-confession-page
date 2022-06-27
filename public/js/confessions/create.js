let blacklistWords;
const getBlacklistWords = async () => {
    const rootUrl = window.location.href.split('confessions')[0];
    const { data } = await axios.get(`${rootUrl}blacklistWord/api`);
    blacklistWords = data.map(word => (word.content));
}
getBlacklistWords();

const detectedWordContainer = document.querySelector('.detected-word-container')
let detectedWordCount = 0;
const addDetectedWord = (blacklistWord) => {
    // Check if the same blacklist word has been created and added.
    if (!document.querySelector(`[data-word="${blacklistWord}"]`)) {
        let detectedWord = document.createElement('span');
        detectedWord.className = 'detected-blacklist-word';
        detectedWord.textContent = blacklistWord;
        detectedWord.dataset.word = blacklistWord;
        detectedWordContainer.append(detectedWord)
    }
    // Counter for removing error message for blacklist word.
    detectedWordCount = detectedWordContainer.children.length;
}

const contentErrMsg = document.querySelector('[data-err-msg="content"]');
const removeContentErrMsg = () => {
    if (contentErrMsg) {
        contentErrMsg.style.display = "none"
    }
}

const blacklistErrMsg = document.querySelector('[data-err-msg="blacklist"]');
const checkBlacklistWord = (input) => {
    for (let blacklistWord of blacklistWords) {
        let detectedWord = document.querySelector(`[data-word="${blacklistWord}"]`)
        if (input.includes(blacklistWord) && !detectedWord) {
            blacklistErrMsg.style.display = "block";
            addDetectedWord(blacklistWord)
            return
        } else if (!input.includes(blacklistWord) && detectedWord) {
            detectedWordContainer.removeChild(detectedWord);
            detectedWordCount -= 1;
        }
    }
}

const contentInput = document.querySelector('.confess__input--content');
contentInput.addEventListener('input', function () {
    const input = this.value.trim().toLowerCase();
    checkBlacklistWord(input);
    if (detectedWordCount == 0) {
        blacklistErrMsg.style.display = "none";
    }
    if (input) {
        removeContentErrMsg();
    };
});

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
            `<span>Confessions will be uploaded as soon as akari noticed. Depending on your luck, 
                  it would be within minutes, hours or days.</span>`,
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