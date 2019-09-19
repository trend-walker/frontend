<template>
  <div>
    <no-ssr>
      <v-container fluid>
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
                  デイリートレンド
                </h2>
                <span class="subheading"> {{ dateJp }}のトレンド </span>
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
                    :items="store.list"
                    :items-per-page="store.table.itemPerPage"
                    class="elevation-1"
                    :class="{ loaded: store.loaded }"
                    :loading="!store.loaded"
                    :page="store.table.page"
                    loading-text="読み込み中..."
                    no-data-text="データが見つかりませんでした。"
                    @update:page="setPage"
                    @update:items-per-page="setItemsPerPage"
                  >
                    <template v-slot:item.trend_word="{ item }">
                      <router-link :to="trendwordDate(item)" small class="mr-2">
                        {{ item.trend_word }}
                      </router-link>
                    </template>

                    <template v-slot:item.action="{ item }">
                      <v-btn :to="dailyTrendWord(item)" rounded color="primary"
                        >GO
                      </v-btn>
                    </template>
                  </v-data-table>
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
import TopList from '@/components/TopList.vue'
import { TrendService, ITrends } from '@/service/TrendService'
import { genMetaParam } from '@/utils/ssr-suport'
import { dailyTrendsModule } from '@/store'
import { ITable } from '@/store/dailyTrends'

moment.locale('ja')

@Component({
  components: {
    TopList
  },
  async asyncData({ app, route, error }) {},
  head() {
    const com: DailyTrend = this as DailyTrend
    const date = com.$route.params.index
    const dateJp = moment(date).format('YYYY年MM月DD日 (ddd)')
    return {
      title: ` ${dateJp}のトレンド`,
      meta: genMetaParam({
        url: `https://trendwalker.yhcoder.ml/daily/${date}`,
        title: `Trendwalker 「${dateJp}のトレンド」`,
        description: `${dateJp} のトレンドについての情報。`
      })
    }
  }
})
export default class DailyTrend extends Vue {
  service: TrendService = new TrendService(this.$apollo)
  trendwords: ITrends = { time: '', trends: [] }
  breadcrumbs: any = [
    {
      text: 'トップ',
      to: '/'
    }
  ]
  headers = [
    {
      text: 'トレンドワード',
      align: 'left',
      value: 'trend_word'
    },
    { text: 'ツイート数', align: 'right', value: 'tweet_volume' },
    {
      text: 'トレンド情報',
      align: 'center',
      value: 'action',
      sortable: false
    }
  ]

  get store() {
    return dailyTrendsModule
  }

  breadcrumbLink(event?: string) {
    if (event === 'datepicker') {
      dailyTrendsModule.openDialog(this.$route.params.index)
    }
  }

  get dateJp() {
    return moment(this.$route.params.index).format('YYYY年MM月DD日 (ddd)')
  }

  trendwordDate(item) {
    return `/trendword/${item.trend_word_id}`
  }

  dailyTrendWord(item) {
    return `/daily/${this.$route.params.index}/${item.trend_word_id}`
  }

  setPage(value) {
    dailyTrendsModule.setPage(value)
  }

  setItemsPerPage(value) {
    dailyTrendsModule.setItemsPerPage(value)
  }

  mounted() {
    const date = this.$route.params.index
    this.breadcrumbs.push({
      text: 'デイリートレンド',
      to: this.$route.path,
      disabled: false,
      event: 'datepicker'
    })
    this.breadcrumbs.push({
      text: moment(date).format('YYYY年MM月DD日 (ddd)'),
      disabled: true,
      to: `/daily/${date}`
    })

    dailyTrendsModule.findDate({ date: moment(date), limit: 1000 })
  }
}
</script>
