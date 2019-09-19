import NuxtConfiguration from '@nuxt/config'
import colors from 'vuetify/es5/util/colors'

require('dotenv').config({
  path: process.env.NODE_ENV !== 'production' ? '.env.dev' : '.env.prod'
})

const config: NuxtConfiguration = {
  // mode: 'spa',
  mode: 'universal',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  dotenv: {
    filename: process.env.NODE_ENV !== 'production' ? '.env.dev' : '.env.prod'
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s | Trendwalker',
    title: 'Trendwalker',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://trendwalker.yhcoder.ml/'
      },
      { hid: 'og:title', property: 'og:title', content: 'Trendwalker' },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://trendwalker.yhcoder.ml/ogp.png'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'トレンド情報'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'トレンド情報'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src:
          'https://polyfill.io/v3/polyfill.min.js?features=Array.from%2CSymbol%2CPromise%2CMath.cbrt%2CArray.prototype.values%2CObject.values',
        type: 'text/javascript'
      }
    ]
    // script: [
    //   {
    //     src: 'https://polyfill.io/v3/polyfill.min.js?features=Array.from%2CSymbol%2CPromise%2CMath.cbrt%2CArray.prototype.values%2CObject.values',
    //     type: 'text/javascript'
    //   },
    //   {
    //     src: 'https://cdn.jsdelivr.net/npm/babel-standalone/babel.min.js',
    //     type: 'text/javascript'
    //   },
    //   {
    //     src: 'https://cdn.jsdelivr.net/npm/babel-polyfill/dist/polyfill.min.js',
    //     type: 'text/javascript'
    //   }
    // ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  devModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    '@nuxtjs/dotenv'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.INNER_API_HOST,
    browserBaseURL: process.env.API_HOST
  },
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.API_HOST + '/graphql',
        websocketsOnly: false
      }
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}

export default config
