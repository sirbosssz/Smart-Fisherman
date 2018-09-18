const url = {
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

timeButton = document.getElementsByClassName('time-button')
Chart.defaults.global.legend.display = false;
Vue.component('line-chart', {
  extends: VueChartJs.Line,
  data() {
    return {
      tideLevel: {}
    }
  },
  mounted() {
    this.tideLevel = this.$root.$data.weatherData.tideLevel
    setInterval(() => {
      if (this.tideLevel != this.$root.$data.weatherData.tideLevel) {
        this.tideLevel = this.$root.$data.weatherData.tideLevel
        this.renderChart({
          labels: this.tideLevel.time,
          datasets: [
            {
              label: 'ระดับน้ำ (เมตร)',
              data: this.tideLevel.amplitude,
              backgroundColor: '#b2d2ff',
              borderColor: '#187ca8',
              pointBorderColor: '#187ca8',
              pointBackgroundColor: '#187ca8',
              pointHoverBackgroundColor: '#187ca8',
              pointHoverBorderColor: '#187ca8',
              pointBorderWidth: 10,
              pointHoverRadius: 10,
              pointHoverBorderWidth: 1,
              pointRadius: 3,
              fill: 'start',
              borderWidth: 4,
            }
          ]
        }, {
            responsive: true,
            maintainAspectRatio: false,
          })
      }
    }, 500)
    this.renderChart({
      labels: this.tideLevel.time,
      datasets: [
        {
          label: 'ระดับน้ำ (เมตร)',
          data: this.tideLevel.amplitude,
          backgroundColor: '#b2d2ff',
          borderColor: '#187ca8',
          pointBorderColor: '#187ca8',
          pointBackgroundColor: '#187ca8',
          pointHoverBackgroundColor: '#187ca8',
          pointHoverBorderColor: '#187ca8',
          pointBorderWidth: 10,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 1,
          pointRadius: 3,
          fill: 'start',
          borderWidth: 4,
        }
      ]
    }, {
        responsive: true,
        maintainAspectRatio: false,
      })
  },
})

weatherPage = new Vue({
  el: '#weather',
  data: {
    load: {
      data0: false,
      data1: false,
      data2: false,
      data3: false
    },
    location: { lat: 13, lng: 100 },
    loc_option: [
      { text: 'จังหวัดกระบี่', value: { lat: 13, lng: 100 } },
    ],
    forecast: 'present',
    futureDay: 0,
    weatherData: {
      lunarDay: {
        phase: 'กำลังโหลด',
        day: 0,
        img: 'image/full-moon.svg'
      },
      temperature: {
        temp: 0,
        max: 0,
        min: 0
      },
      tideLevel: {
        time: ['2:00 am', '10:00 am', '2:00 pm', '10:00 pm'],
        amplitude: [0, 0, 0, 0],
      },
      windDirection: {
        direction: 0,
        speed: 1
      },
      windGuts: 0,
      waveDirection: {
        direction: 0,
        height: 1
      },
      wavePeriod: 0,
      sun: {
        rise: '0:00 AM',
        set: '0:00 PM'
      },
      moon: {
        rise: '0:00 AM',
        set: '0:00 PM'
      },
      humidity: '0',
      rain: '0',
      pressure: '0',
      cloud: '0',
      visibility: '0',
    },
  },
  methods: {
    changeForecast: (time, day) => {
      weatherPage.forecast = time
      weatherPage.futureDay = day
      for (var i = 0; i < timeButton.length; i++) {
        if (i == day) {
          timeButton[i].classList.add('selected')
        } else {
          timeButton[i].classList.remove('selected')
        }
      }
      console.log("change to " + weatherPage.futureDay)
      weatherPage.loadWeather()
    },
    loadWeather: () => {
      console.log('loading...')
      console.log('-----------------------')
      weatherPage.load = {
        data0: false,
        data1: false,
        data2: false,
        data3: false
      }
      //load api data
      if (weatherPage.forecast == 'present') {
        //wind wave
        axios({
          method: 'post',
          url: 'http://smartfishermans.com:8080' + url.present[0],
          data: {
            lat: 13,
            lng: 100,
          },
        }).then(response => {
          // console.log('wind wave data')
          // console.log(response.data.data)
          // console.log('-----------------------')
          let data = response.data.data
          //wind direction
          weatherPage.weatherData.windDirection = {
            direction: parseInt(data.WindDirection),
            speed: parseInt(data.WindSpeed)
          }
          // guts
          weatherPage.weatherData.windGuts = parseInt(data.WindGuts)
          // wave direction
          weatherPage.weatherData.waveDirection = {
            direction: parseInt(data.WaveDirection),
            height: parseFloat(data.WaveHeight)
          }
          // wave period
          weatherPage.weatherData.wavePeriod = parseInt(data.WavePeriod)
        }).then(() => {
          weatherPage.load.data1 = true
          console.log('data1 loaded')
        })

        //tide
        axios({
          method: 'post',
          url: 'http://smartfishermans.com:8080' + url.present[1],
          data: {
            lat: 13,
            lng: 100,
          },
        }).then(response => {
          // console.log('tide data')
          // console.log(response.data.data)
          // console.log('-----------------------')
          let data = response.data.data
          let tideDataTemp = [], tideData = {
            time: [],
            amplitude: []
          }
          data.high.forEach(item => {
            let amplitude = item.amplitude.split(' ')
            let itemData = {
              time: item.time,
              amplitude: parseFloat(amplitude[0])
            }
            tideDataTemp.push(itemData)
          })
          data.low.forEach(item => {
            let amplitude = item.amplitude.split(' ')
            let itemData = {
              time: item.time,
              amplitude: parseFloat(amplitude[0])
            }
            tideDataTemp.push(itemData)
          })
          //sort
          let temp_noon1 = '', temp_noon2 = ''
          let am_temp = [], pm_temp = []
          tideDataTemp.forEach((item) => {
            temp = item.time.split(' ')
            time_temp = temp[0].split(':')
            if (temp[1] == 'am') {
              if (time_temp[0] != '12') {
                am_temp.push(item)
              } else {
                temp_noon1 = item
              }
              am_temp.sort()
            } else {
              if (time_temp[0] != '12') {
                pm_temp.push(item)
              } else {
                temp_noon2 = item
              }
              pm_temp.sort()
            }
          })
          if (temp_noon1 != '') {
            am_temp.unshift(temp_noon1)
          }
          if (temp_noon2 != '') {
            pm_temp.unshift(temp_noon2)
          }
          am_temp.forEach(temp => {
            tideData.time.push(temp.time)
            tideData.amplitude.push(temp.amplitude)
          })
          pm_temp.forEach(temp => {
            tideData.time.push(temp.time)
            tideData.amplitude.push(temp.amplitude)
          })
          weatherPage.weatherData.tideLevel = tideData
        }).then(() => {
          weatherPage.load.data2 = true
          console.log('data2 loaded')
        })

        //weather
        axios({
          method: 'post',
          url: 'http://smartfishermans.com:8080' + url.present[2],
          data: {
            lat: 13,
            lng: 100,
          },
        }).then(response => {
          // console.log('weather data')
          // console.log(response.data.data)
          // console.log('-----------------------')
          let data = response.data.data
          //lunarDay
          let lunarDate = data.waning.split(' ')
          weatherPage.weatherData.lunarDay.phase = 'ข้าง' + lunarDate[1]
          weatherPage.weatherData.lunarDay.day = parseInt(lunarDate[2])
          if (weatherPage.weatherData.lunarDay.phase == 'ข้างขึ้น') {
            if (weatherPage.weatherData.lunarDay.day < 8) {
              weatherPage.weatherData.lunarDay.img = 'image/waning-crescent.svg'
            } else if (weatherPage.weatherData.lunarDay.day == 8) {
              weatherPage.weatherData.lunarDay.img = 'image/third-quater.svg'
            } else if (weatherPage.weatherData.lunarDay.day < 15) {
              weatherPage.weatherData.lunarDay.img = 'image/waning-gibbous.svg'
            } else {
              weatherPage.weatherData.lunarDay.img = 'image/full-moon.svg'
            }
          } else {
            if (weatherPage.weatherData.lunarDay.day < 8) {
              weatherPage.weatherData.lunarDay.img = 'image/waxing-gibbous.svg'
            } else if (weatherPage.weatherData.lunarDay.day == 8) {
              weatherPage.weatherData.lunarDay.img = 'image/first-quater.svg'
            } else if (weatherPage.weatherData.lunarDay.day < 15) {
              weatherPage.weatherData.lunarDay.img = 'image/waxing-crescent.svg'
            } else {
              weatherPage.weatherData.lunarDay.img = 'image/new-moon.svg'
            }
          }

          // temperature
          weatherPage.weatherData.temperature = {
            temp: data.tempC,
            max: data.maxtempC,
            min: data.mintempC
          }

          //moon rise
          weatherPage.weatherData.moon = {
            rise: data.moonrise,
            set: data.moonset
          }

          //sun rise
          weatherPage.weatherData.sun = {
            rise: data.sunrise,
            set: data.sunset
          }

          //others
          weatherPage.weatherData.humidity = data.Humidity
          weatherPage.weatherData.rain = parseFloat(data.Precipitation) * 100
          weatherPage.weatherData.pressure = data.pressure
          weatherPage.weatherData.cloud = data.cloudcover
          weatherPage.weatherData.visibility = data.visibility
        }).then(() => {
          weatherPage.load.data3 = true
          console.log('data3 loaded')
          weatherPage.load.data0 = true
          console.log('data0 loaded')
        })
      } else {
        //lunar
        axios({
          method: 'post',
          url: 'http://smartfishermans.com:8080' + url.present[2],
          data: {
            lat: 13,
            lng: 100,
          },
        }).then(response => {
          let data = response.data.data
          //lunarDay
          let lunarDate = data.waning.split(' ')
          weatherPage.weatherData.lunarDay.phase = 'ข้าง' + lunarDate[1]
          weatherPage.weatherData.lunarDay.day = parseInt(lunarDate[2]) + weatherPage.futureDay
          if (weatherPage.weatherData.lunarDay.phase == 'ข้างขึ้น') {
            if (weatherPage.weatherData.lunarDay.day < 8) {
              weatherPage.weatherData.lunarDay.img = 'image/waning-crescent.svg'
            } else if (weatherPage.weatherData.lunarDay.day == 8) {
              weatherPage.weatherData.lunarDay.img = 'image/third-quater.svg'
            } else if (weatherPage.weatherData.lunarDay.day < 15) {
              weatherPage.weatherData.lunarDay.img = 'image/waning-gibbous.svg'
            } else {
              weatherPage.weatherData.lunarDay.img = 'image/full-moon.svg'
            }
          } else {
            if (weatherPage.weatherData.lunarDay.day < 8) {
              weatherPage.weatherData.lunarDay.img = 'image/waxing-gibbous.svg'
            } else if (weatherPage.weatherData.lunarDay.day == 8) {
              weatherPage.weatherData.lunarDay.img = 'image/first-quater.svg'
            } else if (weatherPage.weatherData.lunarDay.day < 15) {
              weatherPage.weatherData.lunarDay.img = 'image/waxing-crescent.svg'
            } else {
              weatherPage.weatherData.lunarDay.img = 'image/new-moon.svg'
            }
          }
        }).then(() => {
          weatherPage.load.data0 = true
          console.log('data0 loaded')
        })

        //wind wave
        axios({
          method: 'post',
          url: 'http://smartfishermans.com:8080' + url.future[0],
          data: {
            lat: 13,
            lng: 100,
          },
        }).then(response => {
          // console.log('wind wave data')
          // console.log(response.data.data.data[weatherPage.futureDay - 1])
          // console.log('-----------------------')
          let data = response.data.data.data[weatherPage.futureDay - 1]
          //wind direction
          weatherPage.weatherData.windDirection = {
            direction: parseInt(data.WindDirection),
            speed: parseInt(data.WindSpeed)
          }
          // guts
          weatherPage.weatherData.windGuts = parseInt(data.WindGuts)
          // wave direction
          weatherPage.weatherData.waveDirection = {
            direction: parseInt(data.WaveDirection),
            height: parseFloat(data.WaveHeight)
          }
          // wave period
          weatherPage.weatherData.wavePeriod = parseInt(data.WavePeriod)
        }).then(() => {
          weatherPage.load.data1 = true
          console.log('data1 loaded')
        })

        //tide
        axios({
          method: 'post',
          url: 'http://smartfishermans.com:8080' + url.future[1],
          data: {
            lat: 13,
            lng: 100,
          },
        }).then(response => {
          console.log('tide data')
          console.log(response.data.data.data[weatherPage.futureDay - 1])
          console.log('-----------------------')
          let data = response.data.data.data[weatherPage.futureDay - 1]
          let tideDataTemp = [], tideData = {
            time: [],
            amplitude: []
          }
          data.high.forEach(item => {
            let amplitude = item.amplitude.split(' ')
            let itemData = {
              time: item.time,
              amplitude: parseFloat(amplitude[0])
            }
            tideDataTemp.push(itemData)
          })
          data.low.forEach(item => {
            let amplitude = item.amplitude.split(' ')
            let itemData = {
              time: item.time,
              amplitude: parseFloat(amplitude[0])
            }
            tideDataTemp.push(itemData)
          })
          //sort
          let temp_noon1 = '', temp_noon2 = ''
          let am_temp = [], pm_temp = []
          tideDataTemp.forEach((item) => {
            temp = item.time.split(' ')
            time_temp = temp[0].split(':')
            if (temp[1] == 'AM') {
              if (time_temp[0] != '12') {
                am_temp.push(item)
              } else {
                temp_noon1 = item
              }
              am_temp.sort()
            } else {
              if (time_temp[0] != '12') {
                pm_temp.push(item)
              } else {
                temp_noon2 = item
              }
              pm_temp.sort()
            }
          })
          if (temp_noon1 != '') {
            am_temp.unshift(temp_noon1)
          }
          if (temp_noon2 != '') {
            pm_temp.unshift(temp_noon2)
          }
          am_temp.forEach(temp => {
            tideData.time.push(temp.time)
            tideData.amplitude.push(temp.amplitude)
          })
          pm_temp.forEach(temp => {
            tideData.time.push(temp.time)
            tideData.amplitude.push(temp.amplitude)
          })
          weatherPage.weatherData.tideLevel = tideData
        }).then(() => {
          // weatherPage.load.data2 = true
          console.log('data2 loaded')
        })

        //weather
        axios({
          method: 'post',
          url: 'http://smartfishermans.com:8080' + url.future[2],
          data: {
            lat: 13,
            lng: 100,
          },
        }).then(response => {
          console.log('weather data')
          console.log(response.data.data[weatherPage.futureDay - 1])
          console.log('-----------------------')
          let data = response.data.data[weatherPage.futureDay - 1]

          // temperature
          weatherPage.weatherData.temperature = {
            temp: data.tempC,
            max: data.maxtempC,
            min: data.mintempC
          }

          //moon rise
          weatherPage.weatherData.moon = {
            rise: data.moonrise,
            set: data.moonset
          }

          //sun rise
          weatherPage.weatherData.sun = {
            rise: data.sunrise,
            set: data.sunset
          }

          //others
          weatherPage.weatherData.humidity = data.Humidity
          weatherPage.weatherData.rain = parseFloat(data.Precipitation) * 100
          weatherPage.weatherData.pressure = data.pressure
          weatherPage.weatherData.cloud = data.cloudcover
          weatherPage.weatherData.visibility = data.visibility
        }).then(() => {
          weatherPage.load.data3 = true
          console.log('data3 loaded')
        })
      }
    },
  },
  created() {
    console.log('created instance')
    console.log('-----------------------')

    //load api data
    //wind wave
    axios({
      method: 'post',
      url: 'http://smartfishermans.com:8080' + url.present[0],
      data: {
        lat: 13,
        lng: 100,
      },
    }).then(response => {
      console.log('wind wave data')
      console.log(response.data.data)
      console.log('-----------------------')
      let data = response.data.data
      //wind direction
      this.weatherData.windDirection = {
        direction: parseInt(data.WindDirection),
        speed: parseInt(data.WindSpeed)
      }
      // guts
      this.weatherData.windGuts = parseInt(data.WindGuts)
      // wave direction
      this.weatherData.waveDirection = {
        direction: parseInt(data.WaveDirection),
        height: parseFloat(data.WaveHeight)
      }
      // wave period
      this.weatherData.wavePeriod = parseInt(data.WavePeriod)
    }).then(() => {
      this.load.data1 = true
      console.log('data1 loaded')
    })

    //tide
    axios({
      method: 'post',
      url: 'http://smartfishermans.com:8080' + url.present[1],
      data: {
        lat: 13,
        lng: 100,
      },
    }).then(response => {
      console.log('tide data')
      console.log(response.data.data)
      console.log('-----------------------')
      let data = response.data.data
      let tideDataTemp = [], tideData = {
        time: [],
        amplitude: []
      }
      data.high.forEach(item => {
        let amplitude = item.amplitude.split(' ')
        let itemData = {
          time: item.time,
          amplitude: parseFloat(amplitude[0])
        }
        tideDataTemp.push(itemData)
      })
      data.low.forEach(item => {
        let amplitude = item.amplitude.split(' ')
        let itemData = {
          time: item.time,
          amplitude: parseFloat(amplitude[0])
        }
        tideDataTemp.push(itemData)
      })
      //sort
      let temp_noon1 = '', temp_noon2 = ''
      let am_temp = [], pm_temp = []
      tideDataTemp.forEach((item) => {
        temp = item.time.split(' ')
        time_temp = temp[0].split(':')
        if (temp[1] == 'am') {
          if (time_temp[0] != '12') {
            am_temp.push(item)
          } else {
            temp_noon1 = item
          }
          am_temp.sort()
        } else {
          if (time_temp[0] != '12') {
            pm_temp.push(item)
          } else {
            temp_noon2 = item
          }
          pm_temp.sort()
        }
      })
      if (temp_noon1 != '') {
        am_temp.unshift(temp_noon1)
      }
      if (temp_noon2 != '') {
        pm_temp.unshift(temp_noon2)
      }
      am_temp.forEach(temp => {
        tideData.time.push(temp.time)
        tideData.amplitude.push(temp.amplitude)
      })
      pm_temp.forEach(temp => {
        tideData.time.push(temp.time)
        tideData.amplitude.push(temp.amplitude)
      })
      this.weatherData.tideLevel = tideData
    }).then(() => {
      this.load.data2 = true
      console.log('data2 loaded')
    })

    //weather
    axios({
      method: 'post',
      url: 'http://smartfishermans.com:8080' + url.present[2],
      data: {
        lat: 13,
        lng: 100,
      },
    }).then(response => {
      console.log('weather data')
      console.log(response.data.data)
      console.log('-----------------------')
      let data = response.data.data
      //lunarDay
      let lunarDate = data.waning.split(' ')
      this.weatherData.lunarDay.phase = 'ข้าง' + lunarDate[1]
      this.weatherData.lunarDay.day = parseInt(lunarDate[2])
      if (this.weatherData.lunarDay.phase == 'ข้างขึ้น') {
        if (this.weatherData.lunarDay.day < 8) {
          this.weatherData.lunarDay.img = 'image/waning-crescent.svg'
        } else if (this.weatherData.lunarDay.day == 8) {
          this.weatherData.lunarDay.img = 'image/third-quater.svg'
        } else if (this.weatherData.lunarDay.day < 15) {
          this.weatherData.lunarDay.img = 'image/waning-gibbous.svg'
        } else {
          this.weatherData.lunarDay.img = 'image/full-moon.svg'
        }
      } else {
        if (this.weatherData.lunarDay.day < 8) {
          this.weatherData.lunarDay.img = 'image/waxing-gibbous.svg'
        } else if (this.weatherData.lunarDay.day == 8) {
          this.weatherData.lunarDay.img = 'image/first-quater.svg'
        } else if (this.weatherData.lunarDay.day < 15) {
          this.weatherData.lunarDay.img = 'image/waxing-crescent.svg'
        } else {
          this.weatherData.lunarDay.img = 'image/new-moon.svg'
        }
      }

      // temperature
      this.weatherData.temperature = {
        temp: data.tempC,
        max: data.maxtempC,
        min: data.mintempC
      }

      //moon rise
      this.weatherData.moon = {
        rise: data.moonrise,
        set: data.moonset
      }

      //sun rise
      this.weatherData.sun = {
        rise: data.sunrise,
        set: data.sunset
      }

      //others
      this.weatherData.humidity = data.Humidity
      this.weatherData.rain = parseFloat(data.Precipitation) * 100
      this.weatherData.pressure = data.pressure
      this.weatherData.cloud = data.cloudcover
      this.weatherData.visibility = data.visibility
    }).then(() => {
      this.load.data3 = true
      console.log('data3 loaded')
      this.load.data0 = true
      console.log('data0 loaded')
    })
  }
})
