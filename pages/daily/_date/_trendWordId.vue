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
            <v-row
              v-if="wordCloudFile"
              id="word-cloud"
              align="start"
              justify="center"
            >
              <v-img
                :src="wordcloud"
                alt="word-cloud"
                contain
                max-width="1200"
                aspect-ratio="2"
              ></v-img>
            </v-row>
            <div v-else class="text-center">
              <v-progress-circular
                :size="70"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
            <span id="word-cloud-temp"></span>
          </v-col>
        </v-row>

        <v-flex xs12 class="mx-8">
          <div class="text-xs-center">
            <h2 class="headline">
              ツイートグラフ
            </h2>
            <span class="subheading">
              過去24時間のツイート件数を時間ごとに並べたグラフ
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
            <v-row v-if="wordCloudFile" align="start" justify="center">
              <div
                v-for="tweets in recomendedTweets"
                :id="tweets.id_str"
                :key="tweets.id_str"
                class="px-3"
              >
                <v-progress-circular
                  v-if="!tweets.loaded"
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
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import moment from 'moment'
import axios from 'axios'
import { Chart } from 'chart.js'
import * as d3 from 'd3'
import * as cloud from 'd3-cloud'
import { datepickerModule } from '@/store'
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
      trendWord: res.data.trend_word,
      wordCloudFile: res.data.word_cloud
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
      })
    }
  }
})
export default class DailyTrendWord extends Vue {
  trendWord: string = ''
  wordCloudFile: boolean = false
  breadcrumbs: any = [
    {
      text: 'トップ',
      disabled: false,
      to: '/'
    }
  ]
  recomendedTweets: any = []

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

    // ワードクラウド
    if (!this.wordCloudFile) {
      const res: any = await axios.get(
        `${process.env.API_HOST}/api/analyze_daily_tweets/${this.$route.params.date}/${this.$route.params.trendWordId}`
      )
      if (res.data.words.length > 0) {
        this.genWordCloud(res.data.words.slice(0, 200))
      }
    }

    // 人気のトレンド
    const tw: any = await axios.get(
      `${process.env.API_HOST}/api/get_tweets_list/${this.$route.params.date}/${this.$route.params.trendWordId}`
    )
    this.recomendedTweets = tw.data.tweets
      .sort((a, b) => b.favorite + b.retweet - a.favorite - a.retweet)
      .slice(0, 6)

    this.$nextTick(this.moundNextTick)
  }

  moundNextTick() {
    axios
      .get(
        `${process.env.API_HOST}/api/tweet_volume/${this.$route.params.date}/${this.$route.params.trendWordId}`
      )
      .then((res) => {
        const canvas: any = document.getElementById('chart')
        const context = canvas.getContext('2d')
        const chart = new Chart(context, {
          type: 'bar',
          data: {
            labels: Array.from(new Array(24)).map((v, i) => `${i}時`),
            datasets: [
              {
                label: 'ツイート数',
                data: res.data.reduce((a, e, i) => {
                  a[parseInt(e.trend_hour.split(' ')[1])] = e.tweet_volume
                  return a
                }, Array.from(new Array(24)).fill(0)),
                borderColor: 'rgba(54,164,235,0.8)',
                backgroundColor: 'rgba(54,164,235,0.5)'
              }
            ]
          },
          options: {
            responsive: true
          }
        })
      })

    const widgets = (window as any).twttr.widgets
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
      datepickerModule.openDialog(this.$route.params.date)
    }
  }

  get dateJp() {
    return moment(this.$route.params.date).format('YYYY年MM月DD日 (ddd)')
  }

  get wordcloud() {
    return `${process.env.API_HOST}/storage/word-cloud/${this.$route.params.date}/${this.$route.params.trendWordId}.svg`
  }

  genWordCloud(data: any) {
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
          axios
            .post(`${process.env.API_HOST}/api/gen_svg`, {
              date: this.$route.params.date,
              trendWordId: this.$route.params.trendWordId,
              svg: e.innerHTML
            })
            .then(() => {
              this.wordCloudFile = true
              e.innerHTML = ''
            })
        }
      })

    layout.start()
  }

  // 検証用
  post() {
    const e = document.querySelector('#word-cloud')
    if (e) {
      axios
        .post(`${process.env.API_HOST}/api/gen_svg`, {
          date: this.$route.params.date,
          trendWordId: this.$route.params.trendWordId,
          svg: e.innerHTML
        })
        .then((e) => {
          console.log(e)
        })
    }
  }
}
</script>
