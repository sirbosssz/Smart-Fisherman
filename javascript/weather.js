let url = {
    present: [
        '/forecast/present/windwave',
        '/forecast/present/tide',
        '/forecast/present/weather'
    ],
    future: [
        '/forecast/future/windwave',
        '/forecast/future/tide',
        '/forecast/future/weather'
    ]
}

axios({
    method: 'post',
    url: 'http://smartfishermans.com:8080' + url.present[0],
    data: {
        lat: 13,
        lng: 100,
    },
}).then(response => {
    console.log(response)
})
