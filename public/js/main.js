document.getElementById('country').addEventListener('change', getByCountry);
document.getElementById('source').addEventListener('change', getBySource);
document.getElementById('search').addEventListener('change', getBySearch);

//Api key
let API = `20249eb9150a4d4990850cd0dc1e96ba`;

//dummp data for testing
let dummyUrl = `sample.json`

// US top headlines
let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API}`;
loadData(url);


// filter by country
function getByCountry() {
    let selectCountry = document.getElementById('country');
    let selectedCountry = selectCountry.options[selectCountry.selectedIndex].value;

    let url = `https://newsapi.org/v2/top-headlines?country=${selectedCountry}&apiKey=${API}`;
    loadData(url);
}

// filter by source
function getBySource() {
    let selectSource = document.getElementById('source')
    let selectedSource = selectSource.options[selectSource.selectedIndex].value;

    let url = `https://newsapi.org/v2/top-headlines?sources=${selectedSource}&apiKey=${API}`;
    loadData(url);
}

// sraech by keywords
function getBySearch() {
    let searchkey = document.getElementById('search');
    let searchWord = searchkey.value;
    let url = `https://newsapi.org/v2/everything?q=${searchWord}&apiKey=${API}`;
    loadData(url);
}

//Update page with data 
function updatePage(data) {

    let result = '';
    data.articles.forEach(element => {
        const {
            title,
            description,
            source: {
                name
            },
            url,
            urlToImage,
            publishedAt
        } = element;

        result +=
            `
                <div >
                <div class="album">
                    
                    <img src="${urlToImage}" alt="" srcset="">
                  
                    <article>
                        <h2>${title}</h2>
                        <span>${description}</span>
                        <a href="${url}" target="_blank">  Link main source ${name}  </a>
                    </article>   
                </div>
            </div>
            `;

        document.querySelector('.albums').innerHTML = result;
    });
}


//fetch data from api usin cache, then Network stategy
function loadData(url) {

    let req = new Request(url);
    let networkDataReceived = false;

    fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            networkDataReceived = true;
            console.log('From web', data);
            updatePage(data);
        });

    //check if browser support indexDB
    if ('indexedDB' in window) {
        readData('news')
            .then(function (data) {
                //checked if network data isnot available
                if (!networkDataReceived) {
                    console.log('From cache', data);
                    let result = '';
                    data.forEach(element => {
                        const {
                            title,
                            description,
                            source: {
                                name
                            },
                            url,
                            urlToImage,
                            publishedAt
                        } = element;

                        result +=
                            `
                <div >
                <div class="album">
                    
                    <img src="${urlToImage}" alt="" srcset="">
                  
                    <article>
                        <h2>${title}</h2>
                        <span>${description}</span>
                        <a href="${url}" target="_blank" >Source ${name}</a>
                    </article>   
                </div>
            </div>
            `;

                        document.querySelector('.albums').innerHTML = result;
                    });
                }
            })
    }


}