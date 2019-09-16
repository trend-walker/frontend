import moment from 'moment'
import axios from 'axios'
import getTimeTrend from '@/apollo/gql/getTimeTrend.gql'
import getLastTrendTime from '@/apollo/gql/getLastTrendTime.gql'
import { DollarApollo } from 'vue-apollo/types/vue-apollo'
import { trendsModule as store } from '@/store'

export interface ITrend {
  id: Number
  trend_word_id: Number
  trend_word: String
  tweet_volume: Number | null
  trend_time: Date
}

export class Trend implements ITrend {
  id: Number
  trend_word_id: Number
  trend_word: String
  tweet_volume: Number | null
  trend_time: Date
  constructor(trend: any) {
    this.id = trend.id
    this.trend_word_id = trend.trend_word_id
    this.trend_word = trend.trend_word
    this.tweet_volume = trend.tweet_volume
    this.trend_time = trend.trend_time
  }
}

export enum TrendTime {
  current,
  LastDay,
  LastWeek,
  LastMonth
}

export interface ITrends {
  time?: string
  trends: ITrend[]
}

export interface ITrendStore {
  targetTime: string
  current: ITrends
  lastDay: ITrends
  lastWeek: ITrends
  lastMonth: ITrends
}

export class TrendService {
  apollo: DollarApollo<any>

  constructor(apollo: DollarApollo<any>) {
    this.apollo = apollo
  }

  get store() {
    return store
  }

  async updateLatestTrends(): Promise<boolean> {
    // 15以内
    const over = false
    if (moment(this.store.targetTime).isValid() && !over) {
      return false
    }

    const trend_time: string = await this.apollo
      .query({
        query: getLastTrendTime,
        fetchPolicy: 'network-only'
      })
      .then((res: any) => {
        return res.data.tip.trend_time
      })
      .catch((e) => {
        return ''
      })

    const date: moment.Moment = moment(trend_time).second(0)
    const m = Math.floor((date.minutes() + 5) / 15) * 15
    date.minutes(m)
    await store.setTargetTime(date)
    return true
  }

  refreshTrends(date: moment.Moment): Promise<any> {
    return Promise.all([
      store.setTargetTime(date),
      this.refreshTimeTrends(date.clone(), store.setCurrent),
      this.refreshDailyTrends(date.clone().subtract(1, 'd'), store.setLastDay),
      this.refreshDailyTrends(date.clone().subtract(7, 'd'), store.setLastWeek),
      this.refreshDailyTrends(
        date.clone().subtract(30, 'd'),
        store.setLastMonth
      )
    ])
  }

  async refreshTimeTrends(
    date: moment.Moment,
    func: (trends: ITrends) => any
  ): Promise<any> {
    return await this.apollo
      .query({
        query: getTimeTrend,
        variables: {
          from: date
            .clone()
            .subtract(5, 'm')
            .format('YYYY-MM-DD kk:mm:ss'),
          to: date
            .clone()
            .add(5, 'm')
            .format('YYYY-MM-DD kk:mm:ss'),
          limit: 10
        }
      })
      .then((res) => {
        let list: ITrend[] = []
        res.data.timeTrend.forEach((e: any) => {
          e.trend_word = e.trendWord.trend_word
          e.tweet_volume = undefined
          list.push(new Trend(e))
        })
        func({ time: date.format('YYYY-MM-DD kk:mm:ss'), trends: list })
      })
      .catch((e) => {
        func({
          time: date.format('YYYY-MM-DD kk:mm:ss'),
          trends: [new Trend({ trendWord: { trend_word: e.message } })]
        })
      })
  }

  async refreshDailyTrends(
    date: moment.Moment,
    func: (trends: ITrends) => any
  ): Promise<any> {
    return await axios
      .get(
        `${process.env.API_HOST}/api/daily_trends/${date.format(
          'YYYY-MM-DD'
        )}?limit=10`
      )
      .then((res: any) => {
        let list: ITrend[] = []
        res.data.forEach((e: any) => list.push(new Trend(e)))
        func({ time: date.format('YYYY-MM-DD'), trends: list })
      })
      .catch((e) => {
        func({
          time: date.format('YYYY-MM-DD'),
          trends: [new Trend({ trendWord: { trend_word: e.message } })]
        })
      })
  }

  async getDailyTrends(date: moment.Moment, limit: number = 10): Promise<ITrends> {
    const res: any = await axios
      .get(
        `${process.env.API_HOST}/api/daily_trends/${date.format(
          'YYYY-MM-DD'
        )}?limit=${limit}`
      )
      .catch((e) => {
        return { data: { trendWord: { trend_word: e.message } } }
      })
    let list: ITrend[] = []
    res.data.forEach((e: any) => list.push(new Trend(e)))
    return { time: date.format('YYYY-MM-DD'), trends: list }
  }
}
