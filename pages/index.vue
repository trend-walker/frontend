<template>
  <div>
    <v-carousel
      cycle
      height="240"
      hide-delimiters
      hide-delimiter-background
      :show-arrows="false"
    >
      <v-carousel-item>
        <v-sheet id="title-img" color="blue darken-4" height="100%" tile>
          <v-row
            id="title-content"
            class="fill-height"
            align="center"
            justify="center"
          >
            <h1 class="display-2 font-weight-thin mb-4">Trendwalker</h1>
            <h4 class="subheading">
              あの日あの時のトレンド
            </h4>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
    <v-container>
      <no-ssr>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-row align="start" justify="center">
                <v-btn
                  outlined
                  rounded
                  x-large
                  color="blue-grey"
                  class="ma-8 btn-search"
                  @click="datepicker"
                >
                  <v-icon left>mdi-calendar-search</v-icon>
                  デイリートレンド
                </v-btn>

                <v-btn
                  outlined
                  rounded
                  x-large
                  color="blue-grey"
                  class="ma-8 btn-search"
                  @click="trendword"
                >
                  <v-icon left>mdi-magnify</v-icon>
                  トレンドワード
                </v-btn>
              </v-row>
              <v-row align="start" justify="center" class="grey lighten-5">
                <TopList
                  title="最新"
                  to="/latest"
                  :trends="store.current"
                  :fetch="fetch"
                  @plus="moveTime(0, 15)"
                  @minus="moveTime(0, -15)"
                >
                </TopList>
                <TopList
                  title="きのう"
                  :trends="store.lastDay"
                  :fetch="fetch"
                  @plus="moveTime(1)"
                  @minus="moveTime(-1)"
                >
                </TopList>
                <TopList
                  title="先週"
                  :trends="store.lastWeek"
                  :fetch="fetch"
                  @plus="moveTime(7)"
                  @minus="moveTime(-7)"
                >
                </TopList>
                <TopList
                  title="先月"
                  :trends="store.lastMonth"
                  :fetch="fetch"
                  @plus="moveTime(30)"
                  @minus="moveTime(-30)"
                >
                </TopList>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </no-ssr>
    </v-container>
  </div>
</template>

<style>
#title-img:before {
  content: '';
  background: inherit;
  filter: blur(2px);
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: -1;
}
#title-img {
  background: url('/title.svg'),
    radial-gradient(ellipse farthest-side, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
  background-repeat: no-repeat;
  background-position: center;
  z-index: 0;
  overflow: hidden;
}
#title-content {
  background: radial-gradient(
    ellipse farthest-side,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.6)
  );
}
.btn-search {
  width: 200px;
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import moment from 'moment'
import { dailyTrendsModule, trendwordModule } from '@/store'
import { TrendService } from '@/service/TrendService'
import TopList from '@/components/TopList.vue'
import { genMetaParam } from '@/utils/ssr-suport'

@Component({
  components: {
    TopList
  },
  head() {
    return {
      title: 'Trendwalker',
      titleTemplate: '',
      meta: genMetaParam({
        url: 'https://trendwalker.yhcoder.ml',
        type: 'website',
        description: 'Twitterのトレンドを振り返るサービス。'
      })
    }
  }
})
export default class TrendsBody extends Vue {
  currentTimeText: string = ''
  currentTime: moment.Moment = moment('')
  service: TrendService = new TrendService(this.$apollo)
  fetch: boolean = false

  get store() {
    return this.service.store
  }

  async mounted() {
    if (await this.service.updateLatestTrends()) {
      this.moveTime()
    }
  }

  datepicker() {
    dailyTrendsModule.openDialog()
  }
  trendword() {
    trendwordModule.openDialog()
  }

  async moveTime(day: number = 0, minits: number = 0) {
    if (this.fetch) {
      return
    }
    const date = moment(this.store.targetTime)
      .clone()
      .add(day, 'd')
      .add(minits, 'm')
    this.fetch = true
    await this.service.refreshTrends(date)
    this.fetch = false
  }
}
</script>
