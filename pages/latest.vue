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
                  最新のトレンド
                </h2>
                <span class="subheading"> {{ dateJp }}更新 </span>
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
                    dense
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
                      <v-btn
                        :to="dailyTrendWord(item)"
                        rounded
                        x-small
                        color="primary"
                        class="ma-1 px-8 py-3"
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
import { genMetaParam } from '@/utils/ssr-suport'
import { ITrends } from '@/service/TrendService'
import { dailyTrendsModule } from '@/store'
import { ITable } from '@/store/dailyTrends'

moment.locale('ja')

@Component({
  head() {
    return {
      title: ` 最新のトレンド`,
      meta: genMetaParam({
        url: `https://trendwalker.yhcoder.ml/latest`,
        title: `Trendwalker 最新のトレンド`,
        description: `最新のトレンド情報。`
      })
    }
  }
})
export default class LatestTrend extends Vue {
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
  date: moment.Moment = moment('')

  get store() {
    return dailyTrendsModule
  }

  get dateJp() {
    return this.date.format('YYYY年MM月DD日 (ddd) HH:mm:ss')
  }

  trendwordDate(item) {
    return `/trendword/${item.trend_word_id}`
  }

  dailyTrendWord(item) {
    return `/daily/${this.date.format('YYYY-MM-DD')}/${item.trend_word_id}`
  }

  setPage(value) {
    dailyTrendsModule.setPage(value)
  }

  setItemsPerPage(value) {
    dailyTrendsModule.setItemsPerPage(value)
  }

  async mounted() {
    const date = this.$route.params.index
    this.breadcrumbs.push({
      text: '最新のトレンド',
      disabled: true,
      to: `/latest`
    })

    const dateText = await dailyTrendsModule.findLatest({
      apollo: this.$apollo,
      limit: 1000
    })
    this.date = moment(dateText)
  }
}
</script>
