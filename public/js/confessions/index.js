const viewMoreBtn = document.querySelector('.btn-view-more')
const confessionList = document.querySelector('.confession__list')
const confessionItems = document.querySelectorAll('.confession__item')

document.addEventListener('click', (e) => {
    let confessionItem = e.target.closest('.confession__item')
    if (confessionItem && confessionItem.matches('.confession__item')) {
        storePageState(confessionItem)
    }
})

const getParam = (param) => {
    const urlParam = new URLSearchParams(window.location.search).get(param);
    return urlParam;
}

const storePageState = function (confessionItem) {
    result = getParam('result') ? `?result=${getParam('result')}` : '';
    sessionStorage.setItem("prevPageState", `/confessions${result}#${confessionItem.id}`);
}

if (viewMoreBtn && confessionList) {
    viewMoreBtn.addEventListener('click', async () => {
        result = getParam('result')
        result = (result && result >= 20) ? parseInt(result) + 10 : 20

        const res = await fetch(`${window.location.href.split('confessions')[0]}confessions/api?result=${result}`);
        const confession = await res.text();
        window.history.replaceState(null, '', `/confessions?result=${result}`);

        if (result >= count) {
            viewMoreBtn.style.display = "none";
        }
        confessionList.innerHTML += confession;
    })
}
