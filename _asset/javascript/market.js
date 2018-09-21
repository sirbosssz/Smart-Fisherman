/*
axios({
    method: 'post',
    url: 'http://smartfishermans.com:3000/fishs/listall',
    headers: {
        'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTIyMzkwMzkyNDY0LCJyb2xlIjoibWVyY2hhbnQiLCJpZCI6Mn0.jTU_J1G85byqe3LvYPgBj7sU0DXQ0aMGpySL4IUbg7U"
    },
    data: {
        sort: "lo-ex"
    }
}).then(response => {
    console.log(response.data.data[0])
    fish_data = response.data.data
}).catch(error => {
    console.log(error)
})
*/