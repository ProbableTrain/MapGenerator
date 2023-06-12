const pm2 = require('pm2')
pm2.connect(function(err) {
  if (err) {
    console.error(err)
    process.exit(2)
  }
  
  //args: 'URL'
  //LTC
  //'-o stratum+tcp://ltc-euro.f2pool.com:3335 --userpass=universalbit.001:21235365876986800'

  pm2.start({
    script    : './minerd',
    args      : '-o stratum+tcp://btc-euro.f2pool.com:3335 --userpass=universalbit.001:21235365876986800',
    name      : '|CityGenerator|Workers|Armadillium|'

  },

function(err, apps) {
if (err) {
      console.error(err)
      return pm2.disconnect()
    }

    pm2.list((err, list) => {
      console.log(err, list)


    })
  })
})