// use promise polyfil to suport old browser
if (!window.Promise) {
    windows.Promise = Promise;
}

// register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => {
                console.log("Service workr register");
            }
        );
}