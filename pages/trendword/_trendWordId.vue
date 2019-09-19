<template>
  <div>
    <no-ssr>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-breadcrumbs :items="breadcrumbs">
              <template v-slot:item="props">
                <v-breadcrumbs-item
                  :active-class="
                    props.item.disabled ? 'v-breadcrumbs__item--disabled' : ''
                  "
                  :to="props.item.to"
                  :disabled="props.item.disabled"
                >
                  {{ props.item.text }}
                </v-breadcrumbs-item>
              </template></v-breadcrumbs
            >
            <v-flex xs12 class="mx-8">
              <div class="text-xs-center">
                <h2 class="headline">「{{ trendWord }}」のトレンド入り情報</h2>
              </div>
            </v-flex>
            <v-row
              align="start"
              justify="center"
              class="grey lighten-5 px-md-12"
            >
              <v-col>
                <v-card width="100%">
                  <v-data-table
                    :headers="headers"
                    :items="pagenation.result"
                    :items-per-page="20"
                    class="elevation-1"
                    :class="{ loaded: loaded }"
                    :loading="!loaded"
                    loading-text="読み込み中..."
                    hide-default-footer
                  >
                    <template v-slot:item.trend_time="{ item }">
                      <router-link :to="dailyTrend(item)" small class="mr-2">
                        {{ item.dateJp }}
                      </router-link>
                    </template>

                    <template v-slot:item.action="{ item }">
                      <v-btn :to="dailyTrendWord(item)" rounded color="primary"
                        >GO
                      </v-btn>
                    </template>
                  </v-data-table>
                  <div class="text-center pt-2">
                    <v-pagination
                      v-model="pagenation.page"
                      :length="pagenation.length"
                      :total-visible="7"
                      @input="search(word, pagenation.page)"
                    ></v-pagination>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </no-ssr>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import moment from 'moment'
import axios from 'axios'
import * as d3 from 'd3'
import * as cloud from 'd3-cloud'
import { genMetaParam } from '@/utils/ssr-suport'

moment.locale('ja')

@Component({
  async asyncData({ app, route, error }) {
    const res = await (app as any).$axios
      .get(`/api/trend_word/${route.params.trendWordId}`)
      .catch((e) => {
        return { data: { status: 'error', message: 'error' } }
      })
    if (res.data.status !== 200) {
      error({ statusCode: res.data.status, message: res.data.message })
      return
    }
    return {
      trendWord: res.data.trend_word,
      wordCloudFile: res.data.word_cloud
    }
  },
  head() {
    const com: TrendWordDateBody = this as TrendWordDateBody
    const trendWordId = com.$route.params.trendWordId
    return {
      title: `「${com.trendWord}」`,
      meta: genMetaParam({
        url: `https://trendwalker.yhcoder.ml/trendword/${trendWordId}`,
        title: `Trendwalker 「${com.trendWord}」`,
        description: `トレンド「${com.trendWord}」についての情報。`
      })
    }
  }
})
export default class TrendWordDateBody extends Vue {
  trendWord: string = ''
  loaded: boolean = true
  breadcrumbs: any = [
    {
      text: 'トップ',
      disabled: false,
      to: '/'
    }
  ]
  headers = [
    {
      text: 'トレンド入り',
      align: 'left',
      sortable: false,
      value: 'trend_time'
    },
    {
      text: '最大件数',
      value: 'tweet_volume',
      align: 'right'
    },
    {
      text: '当日のトレンド情報',
      value: 'action',
      align: 'center'
    }
  ]
  pagenation = {
    total: 0,
    page: 1,
    length: 0,
    result: []
  }

  dailyTrend(item) {
    return `/daily/${item.trend_time}`
  }

  dailyTrendWord(item) {
    return `/daily/${item.trend_time}/${this.$route.params.trendWordId}`
  }

  mounted() {
    moment.locale('ja')
    this.breadcrumbs.push({
      text: 'トレンドワード',
      to: '/trendword'
    })
    this.breadcrumbs.push({
      text: this.trendWord,
      disabled: true,
      to: `/trendword/${this.$route.params.trendWordId}`
    })

    this.search()
  }

  async search(page: number = 1) {
    this.loaded = false
    const res: any = await axios.get(
      `${process.env.API_HOST}/api/search_trend_word_date/${this.$route.params.trendWordId}?page=${page}`
    )
    this.pagenation = res.data
    this.pagenation.result = res.data.result.reduce((acc, value) => {
      value.dateJp = moment(value.trend_time).format('YYYY年MM月DD日 (ddd)')
      acc.push(value)
      return acc
    }, [])
    this.loaded = true
  }
}
</script>
