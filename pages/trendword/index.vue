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
                  @click="breadcrumbLink(props.item.event)"
                >
                  {{ props.item.text }}
                </v-breadcrumbs-item>
              </template></v-breadcrumbs
            >
            <v-flex xs12 class="mx-8">
              <div class="text-xs-center">
                <h2 class="headline">
                  トレンドワード
                </h2>
                <span class="subheading">
                  トレンド入りしたキーワード・ハッシュタグを検索
                </span>
              </div>
            </v-flex>
            <v-row
              align="start"
              justify="center"
              class="grey lighten-5 px-md-12"
            >
              <v-col>
                <v-card width="100%">
                  <v-card-title>
                    <v-text-field
                      v-model="word"
                      append-icon="mdi-magnify"
                      label="キーワード・ハッシュタグ"
                      single-line
                      hide-details
                      @keydown.enter="search(word)"
                      @compositionstart="composing = true"
                      @compositionend="composing = false"
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    :headers="headers"
                    :items="pagenation.result"
                    :items-per-page="20"
                    class="elevation-1"
                    :class="{ loaded: loaded }"
                    :loading="!loaded"
                    loading-text="読み込み中..."
                    no-data-text="データが見つかりませんでした。"
                    hide-default-footer
                  >
                    <template v-slot:item.trend_word="{ item }">
                      <router-link :to="trendwordDate(item)" small class="mr-2">
                        {{ item.trend_word }}
                      </router-link>
                    </template>

                    <template v-slot:item.latest_trend_time="{ item }">
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

<style>
.loaded {
  animation: fadeIn 1s ease 0s 1 normal;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import moment from 'moment'
import axios from 'axios'
import { trendwordModule as store } from '@/store'
import { genMetaParam } from '@/utils/ssr-suport'

moment.locale('ja')

@Component({
  head() {
    return {
      title: 'トレンドワード検索 | Trendwalker',
      titleTemplate: '',
      meta: genMetaParam({
        url: 'https://trendwalker.yhcoder.ml/trendword',
        title: 'Trendwalker「トレンドワード検索」',
        type: 'website',
        description: 'キーワードでトレンドを検索。'
      })
    }
  }
})
export default class TrendWordBody extends Vue {
  word: string = ''
  composing: boolean = false
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
      text: 'トレンドワード',
      align: 'left',
      sortable: false,
      value: 'trend_word'
    },
    { text: '最新のトレンド入り', value: 'latest_trend_time', sortable: false },
    {
      text: '最新のトレンド情報',
      align: 'center',
      value: 'action',
      sortable: false
    }
  ]
  pagenation = {
    total: 0,
    page: 1,
    length: 0,
    result: []
  }

  mounted() {
    this.breadcrumbs.push({
      text: 'トレンドワード',
      disabled: true,
      to: this.$route.path
    })

    this.search(store.word)
  }

  get store() {
    return store
  }

  @Watch('store.word')
  onchangeWord(value) {
    this.word = value
    this.search(value)
  }

  breadcrumbLink(event?: string) {
    if (event === 'trendword') {
      store.openDialog()
    }
  }

  dailyTrend(item) {
    return `/daily/${item.latest_trend_time}`
  }

  dailyTrendWord(item) {
    return `/daily/${item.latest_trend_time}/${item.trend_word_id}`
  }

  trendwordDate(item) {
    return `/trendword/${item.trend_word_id}`
  }

  async search(word: string, page: number = 1) {
    this.loaded = false
    const res: any = await axios.get(
      `${process.env.API_HOST}/api/search_trend_word?word=${encodeURIComponent(
        word
      )}&page=${page}`
    )
    res.data.length = Math.ceil(res.data.total / res.data.max_per_page)
    res.data.result = res.data.result.reduce((acc, value) => {
      value.latest_trend_time = moment(value.latest_trend_time).format(
        'YYYY-MM-DD'
      )
      value.dateJp = moment(value.latest_trend_time).format(
        'YYYY年MM月DD日 (ddd)'
      )
      acc.push(value)
      return acc
    }, [])
    this.pagenation = res.data

    this.loaded = true
  }
}
</script>
