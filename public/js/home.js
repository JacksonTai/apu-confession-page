if (!decodeURIComponent(document.cookie)) {
    Swal.fire({
        title: 'We use cookies',
        html: `<span>By using this website, you automatically accept that
                     we use cookies to make your experience better.</span>`,
        imageUrl: '/img/cookie.png',
        imageAlt: 'Cookie',
        confirmButtonColor: '#1A73E8',
        confirmButtonText: 'Okay, got it',
        customClass: { title: 'sweet_title' }
    })
}

const setCookie = (name, value) => {
    document.cookie = name + "=" + value + ";" + ";path=/";
}
setCookie('new_user', false)