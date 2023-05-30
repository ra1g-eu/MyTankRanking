const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    electronBuilder: {
      customFileProtocol: './'
    },
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
module.exports = {
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: './'
    },
    vuetify: {}
  },
}
