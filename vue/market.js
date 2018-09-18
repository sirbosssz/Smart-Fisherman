data = {}

const Home = {
  template: '<div></div>',
  created() {
    document.getElementById('fish-list').classList.remove('hide')
    document.querySelector('.header').classList.remove('hide')
  }
}

const Fish = {
  template: `
<div>
  <div class="h-market-link">
    <div class="container">
      <router-link to='/' class="navigator">
        <span class="button">< กลับสู่หน้าตลาดปลา</span>
      </router-link>
    </div>
  </div>
  <div class="fish-page">
    <div v-if="found" class="fish-found">
      <div v-if="loaded">
        <img v-bind:src="showFish.image[image].link" alt="fish" />
        <div class="desc">
          <div class="title-desc">
            <div class="warning-area">
              <span class="warning">สามารถสั่งซื้อปลาได้จากแอปพลิเคชัน Smart Fisherman</span>
            </div>
            <div class="title-fish-area">
              <h1>{{showFish.title}}</h1>
              <h2>{{showFish.price}}฿</h2>
            </div>
            <span class="areaDetail">ประเภท {{showFish.type}} น้ำหนัก {{showFish.weight}} กิโลกรัม กิโลกรัมละ {{showFish.price}} บาท</span>
          </div>
          <div class="fish-desc">
            <div class="fish-photo-area">
              <div class="fish-photo" v-for="(images, index) in showFish.image" v-on:click="image = index">
                <img :src="images.link" alt="" />
                </div>
            </div>
            <div class="merchant">
              <span>จัดจำหน่ายโดย {{showFish.merchantId}}</span>
            </div>
            <div>
              <h1>รายละเอียดสินค้า</h1>
              <p>{{showFish.description}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="fish-not-found">
      <img src="image/not-found.svg" alt="fish not found" />
      <h1>Fish Not Found</h1>
      <h2>ไม่พบปลาที่ขายหรือรายการขายนั้นหมดอายุแล้ว</h2>
    </div>
  </div>
</div>`,
  props: ['fish'],
  data() {
    return {
      showFish: {},
      found: true,
      image: 0,
      loaded: false,
    }
  },
  methods: {
  },
  beforeCreate() {
    document.getElementById('fish-list').classList.add('hide')
    document.querySelector('.header').classList.add('hide')
  },
  created() {
    let route = this.fish.split('-i-')
    let dirId = route[1], dirTitle = route[0]

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
      let fishData = response.data.data
      let found = false
      document.getElementById('fish-list').classList.add('hide')
      fishData.forEach(fish => {
        if (fish.id == dirId && fish.title == dirTitle) {
          this.showFish = fish
          found = true
        }
      })
      this.found = found
    }).then(() => {
      this.loaded = true
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    })
  }
}

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/:fish',
    component: Fish,
    props: true,
  }
]

const router = new VueRouter({
  routes
})
// for market list
new Vue({
  router,
  el: '#market-list',
  data: {
    fishes: [],
    storedFish: [],
    page: 0,
    allPage: 0,
    load: false,
    searchText: '',
    searched: false,
    searchDisplay: '',
  },
  methods: {
    search: function () {
      this.searchDisplay = this.searchText
      if (this.searchText != '') {
        let searchedFish = [], searchCount = 0
        this.storedFish.forEach((page) => {
          page.forEach((fish) => {
            if (fish.title.indexOf(this.searchText) >= 0 && fish.title != 'ยังไม่มีรายการขาย') {
              searchCount++
              searchedFish.push(fish)
            }
          })
        })
        let tempFish = []
        if (parseInt(searchCount / 20) <= 0) {
          tempFish.push(searchedFish)
          this.fishes = tempFish
          this.page = 0
          this.allPage = 1
        } else {
          let page = -1, fishIndex = 0
          searchedFish.forEach((fish) => {
            if (fishIndex % 20 == 0) {
              page++
              tempFish.push([])
            }
            tempFish[page].push(fish)
            fishIndex++
          })
          this.fishes = tempFish
          this.page = 0
          this.allPage = page + 1
        }
        this.searched = true
      } else {
        this.searched = false;
        this.fishes = this.storedFish
        this.allPage = this.storedFish.length
        this.page = 0
      }
    },
    clearSearch: function () {
      this.searchText = ''
      this.search()
    }
  },
  created() {
    let blankFish = {
      title: 'ยังไม่มีรายการขาย'
    }
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
      let fishData = response.data.data //returned api data
      let pageCount = Math.ceil(fishData.length / 20) //page count
      this.allPage = pageCount
      let fish = []
      console.log('fish count: ' + fishData.length + ' | page count: ' + pageCount)
      // loop pages
      for (let page = 1; page <= pageCount; page++) {
        let temp = []
        let start = 20 * (page - 1), end = 20 * page
        for (let i = start; i < end; i++) {
          if (i < fishData.length) {
            temp.push(fishData[i])
          } else {
            temp.push(blankFish)
          }
        }
        fish.push(temp)
      }
      this.fishes = fish //push to data
      this.storedFish = fish
    }).then(() => {
      this.load = true
    })
  }
})
