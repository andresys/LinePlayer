export default {
  load: (options) => new Promise((resolve) => {
      let cameras = [{
                      quality: [{
                          name: '0',
                          url: options
                      }]
                    }]

      resolve(cameras);
  })
}