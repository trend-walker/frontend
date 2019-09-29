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
          </v-col>
        </v-row>

        <v-flex xs12 class="mx-8">
          <div class="text-xs-center">
            <h2 class="headline">
              ワードクラウド
            </h2>
            <span class="subheading">
              {{ dateJp }}のトレンド「{{ trendWord }}」のツイート分析
            </span>
          </div>
        </v-flex>
        <v-row align="start" justify="center" class="grey lighten-5 px-md-12">
          <v-col cols="12">
            <v-row id="word-cloud" align="start" justify="center">
              <div v-if="wordCloudFile == null" class="text-center">
                <svg
                  width="1200"
                  height="600"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 960 480"
                  style="width: 100%; height: 100%"
                >
                  <rect
                    x="0"
                    y="0"
                    width="960"
                    height="480"
                    fill="rgba(211, 208, 201, 0.25)"
                  />
                  <rect class="progress" x="0" y="0%" height="4" />
                  <text
                    class="loading"
                    font-size="82"
                    x="50%"
                    y="50%"
                    text-anchor="middle"
                    dominant-baseline="central"
                    fill="rgb(211, 208, 201"
                  >
                    loading...
                  </text>
                </svg>
              </div>
              <v-img
                v-else
                :src="wordCloudFile"
                alt="word-cloud"
                contain
                max-width="1200"
                aspect-ratio="2"
              ></v-img>
            </v-row>
            <span id="word-cloud-temp"></span>
          </v-col>
        </v-row>

        <v-flex xs12 class="mx-8">
          <div class="text-xs-center">
            <h2 class="headline">
              関連トレンド
            </h2>
            <span class="subheading">
              {{ dateJp }}の「{{ trendWord }}」関連トレンド
            </span>
          </div>
        </v-flex>
        <v-row
          align="start"
          justify="center"
          class="grey lighten-5 px-md-12 ma-4"
        >
          <v-progress-circular
            v-if="relatedTrends == null"
            :size="70"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <v-btn
            v-else
            v-for="item in relatedTrends"
            :key="item.score"
            rounded
            x-small
            color="primary"
            class="ma-1"
            :to="`${item.trend_word_id}`"
            >{{ item.trend_word }}</v-btn
          >
        </v-row>
        <v-row
          align="start"
          justify="space-between"
          class="grey lighten-5 px-md-12 ma-4"
        >
          <v-btn
            :disabled="dayBefore == null"
            rounded
            x-small
            class="ma-1"
            :to="`/daily/${dayBefore}/${this.$route.params.trendWordId}`"
            >前の日</v-btn
          >
          <v-btn
            :disabled="dayAfter == null"
            rounded
            x-small
            class="ma-1"
            :to="`/daily/${dayAfter}/${this.$route.params.trendWordId}`"
            >次の日</v-btn
          >
        </v-row>

        <v-flex xs12 class="mx-8">
          <div class="text-xs-center">
            <h2 class="headline">
              ツイートグラフ
            </h2>
            <span class="subheading">
              {{ dateJp }}の「{{ trendWord }}」関連ツイート件数遷移グラフ
            </span>
          </div>
        </v-flex>
        <v-row align="start" justify="center" class="grey lighten-5 px-md-12">
          <canvas
            id="chart"
            width="1200"
            height="600"
            style="max-width: 1200px"
          >
            図形を表示するには、canvasタグをサポートしたブラウザが必要です。
          </canvas>
        </v-row>

        <v-flex xs12 class="mx-8">
          <div class="text-xs-center">
            <h2 class="headline">
              人気のツイート
            </h2>
          </div>
        </v-flex>
        <v-row align="start" justify="center" class="grey lighten-5 px-md-12">
          <v-col cols="12">
            <v-row
              v-if="recomendedTweets.length == 0"
              align="start"
              justify="center"
            >
              <v-progress-circular
                :size="70"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </v-row>
            <v-row v-else align="start" justify="center">
              <div
                v-for="tweets in recomendedTweets"
                :id="tweets.id_str"
                :key="tweets.id_str"
                class="px-3"
              >
                <v-progress-circular
                  v-if="tweets.loaded != true"
                  :size="70"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </no-ssr>
  </div>
</template>

<style>
#word-cloud-temp {
  opacity: 0;
}
.loading {
  animation-name: loading;
  animation-direction: alternate-reverse;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes loading {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.8;
  }
}

.progress {
  animation-name: progress;
  animation-direction: normal;
  animation-duration: 10s;
  animation-timing-function: cubic-bezier(0, 0, 0, 1);
}
@keyframes progress {
  0% {
    fill: rgb(75, 87, 255);
    width: 0%;
  }
  100% {
    fill: rgb(203, 215, 221);
    width: 100%;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import moment from 'moment'
import axios from 'axios'
import { Chart } from 'chart.js'
import * as d3 from 'd3'
import * as cloud from 'd3-cloud'
import { dailyTrendsModule } from '@/store'
import { genMetaParam } from '@/utils/ssr-suport'

moment.locale('ja')

@Component({
  async asyncData({ app, route, error }) {
    const res = await (app as any).$axios
      .get(
        `/api/daily_trend_word/${route.params.date}/${route.params.trendWordId}`
      )
      .catch((e) => {
        return { data: { status: 'error', message: 'error' } }
      })
    if (res.data.status !== 200) {
      error({ statusCode: res.data.status, message: res.data.message })
      return
    }
    return {
      date: res.data.date,
      trendWord: res.data.trend_word
    }
  },
  head() {
    const com: DailyTrendWord = this as DailyTrendWord
    const date = com.$route.params.date
    const dateJp = moment(date).format('YYYY年MM月DD日 (ddd)')
    const trendWordId = com.$route.params.trendWordId
    return {
      title: `「${com.trendWord}」 ${dateJp}`,
      meta: genMetaParam({
        url: `https://trendwalker.yhcoder.ml/daily/${date}/${trendWordId}`,
        title: `Trendwalker 「${com.trendWord}」`,
        description: `${dateJp} のトレンド「${com.trendWord}」についての情報。`
      }),
      script: [
        {
          src: 'https://platform.twitter.com/widgets.js',
          type: 'text/javascript'
        }
      ]
    }
  }
})
export default class DailyTrendWord extends Vue {
  trendWord: string = ''
  wordCloudFile: string | null = null
  breadcrumbs: {
    text: string
    disabled: boolean
    to: string
    event?: string
  }[] = [
    {
      text: 'トップ',
      disabled: false,
      to: '/'
    }
  ]
  recomendedTweets: any = []
  chart?: Chart = null
  relatedTrends: any = null
  dayBefore: any = null
  dayAfter: any = null

  async mounted() {
    // パンくず
    this.breadcrumbs.push({
      text: 'デイリートレンド',
      disabled: false,
      to: this.$route.path,
      event: 'datepicker'
    })
    this.breadcrumbs.push({
      text: this.dateJp,
      disabled: false,
      to: `/daily/${this.$route.params.date}`
    })
    this.breadcrumbs.push({
      text: this.trendWord,
      disabled: false,
      to: `/trendword/${this.$route.params.trendWordId}`
    })

    await this.$nextTick()
    const canvas: any = document.getElementById('chart')
    const context = canvas.getContext('2d')
    this.chart = new Chart(context, {
      type: 'bar',
      data: {
        labels: Array(24)
          .fill(0)
          .map((v, i) => `${i}時`),
        datasets: []
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [
            {
              barPercentage: 0.5,
              scaleLabel: {
                display: true,
                labelString: `「${this.trendWord}」${this.dateJp}`,
                fontSize: 14
              }
            }
          ],
          yAxes: [
            {
              id: 'volume',
              scaleLabel: {
                display: true,
                fontSize: 14,
                labelString: '過去24時間のツイート件数'
              },
              ticks: {
                beginAtZero: true,
                fontColor: 'rgba(54,164,235)'
              }
            },
            {
              id: 'id-count',
              position: 'right',
              scaleLabel: {
                display: true,
                fontSize: 14,
                labelString: '観測件数'
              },
              ticks: {
                beginAtZero: true,
                fontColor: 'rgba(235,164,54)'
              },
              gridLines: {
                drawOnChartArea: false
              }
            }
          ]
        }
      }
    })

    this.getAnalyze()

    this.getRelatedTrends()

    this.createVolumeGraph()
  }

  async getAnalyze() {
    const res = await axios.get(
      `${process.env.API_HOST}/api/analyze_daily_tweets/${this.$route.params.date}/${this.$route.params.trendWordId}`
    )
    // await new Promise((resolve) => setTimeout(resolve, 9000))
    // ワードクラウド
    this.generateWordCloud(res.data.analyze.word_weights)
    // 人気ツイート
    this.createRecomendedTweets(res.data.analyze.id_list)
    // 観測ツイート件数
    if (this.chart) {
      this.chart.data.datasets.unshift({
        label: '観測件数',
        yAxisID: 'id-count',
        type: 'bar',
        borderColor: 'rgba(235,164,54,0.8)',
        backgroundColor: 'rgba(235,164,54,0.6)',
        data: res.data.analyze.value_per_hour
      })
      this.chart.update()
    }
  }

  async getRelatedTrends() {
    const res = await axios.get(
      `${process.env.API_HOST}/api/related_daily_trends/${this.$route.params.date}/${this.$route.params.trendWordId}`
    )
    this.relatedTrends = res.data.list
    this.dayBefore = res.data.day_before
    this.dayAfter = res.data.day_after
  }

  // ツイート数グラフ
  async createVolumeGraph() {
    if (this.chart) {
      const res = await axios.get(
        `${process.env.API_HOST}/api/tweet_volume/${this.$route.params.date}/${this.$route.params.trendWordId}`
      )

      this.chart.data.datasets.push({
        label: 'ツイート件数',
        yAxisID: 'volume',
        type: 'line',
        lineTension: 0,
        pointRadius: 8,
        pointHoverRadius: 12,
        borderColor: 'rgba(54,164,235,0.8)',
        backgroundColor: 'rgba(54,164,235,0.2)',
        data: res.data.reduce((a, e) => {
          a[parseInt(e.trend_hour.split(' ')[1])] = e.tweet_volume
          return a
        }, Array(24).fill(null))
      })
    }
    this.chart.update()
  }

  // 人気のツイート
  async createRecomendedTweets(tweets) {
    const widgets = ((e) =>
      e.twttr && e.twttr.widgets ? e.twttr.widgets : undefined)(window as any)
    if (widgets === undefined) {
      return
    }

    this.recomendedTweets = tweets
      .sort((a, b) => b.favorite + b.retweet - a.favorite - a.retweet)
      .slice(0, 6)
    await this.$nextTick()

    this.recomendedTweets.forEach((e, i) => {
      const p = document.getElementById(e.id_str)
      const res = widgets
        .createTweet(e.id_str, p, {
          exclude_script: true,
          conversation: 'none',
          align: 'center',
          lang: 'ja'
        })
        .then((event) => {
          e.loaded = true
          this.$set(this.recomendedTweets, i, e)
        })
    })
  }

  breadcrumbLink(event?: string) {
    if (event === 'datepicker') {
      dailyTrendsModule.openDialog(this.$route.params.date)
    }
  }

  get dateJp() {
    return moment(this.$route.params.date).format('YYYY年MM月DD日 (ddd)')
  }

  generateWordCloud(data) {
    data = data.slice(0, 200)
    const rate = 24 / data[0].size
    const layout = cloud()
      .size([960, 480])
      .words(data)
      .padding(1)
      .rotate(function(v, i) {
        if (i > 2) {
          return ~~(Math.random() * 2) * 60 * ((i % 2) * 2 - 1)
        }
        return 0
      })
      .font('Impact')
      .fontSize((d) => {
        return Math.log(rate * d.size + 1.3) * 24
      })
      .on('end', (words) => {
        d3.select('#word-cloud-temp')
          .append('svg')
          .attr('width', layout.size()[0])
          .attr('height', layout.size()[1])
          .append('g')
          .attr(
            'transform',
            `translate(${layout.size()[0] / 2}, ${layout.size()[1] / 2})`
          )
          .selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', function(d) {
            return d.size + 'px'
          })
          .style('font-family', 'Impact')
          .style('fill', function(d, i) {
            return d3.interpolateViridis((i % 10) * 0.1)
          })
          .attr('text-anchor', 'middle')
          .attr('transform', function(d) {
            return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
          })
          .text(function(d) {
            return d.text
          })

        const e = document.querySelector('#word-cloud-temp')
        if (e) {
          const blob = new Blob(
            [
              e.innerHTML.replace(
                /<svg.*?>/,
                '<svg width="960" height="480" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
              )
            ],
            {
              type: 'image/svg+xml'
            }
          )
          this.wordCloudFile = window.URL.createObjectURL(blob)
          e.innerHTML = ''
        }
      })

    layout.start()
  }
}
</script>
