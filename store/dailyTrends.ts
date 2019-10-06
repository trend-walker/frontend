import {
  Module,
  VuexModule,
  Action,
  Mutation,
  MutationAction
} from 'vuex-module-decorators'
import moment from 'moment'
import axios from 'axios'
import { TrendService, Trend, ITrend, ITrends } from '@/service/TrendService'
import { DollarApollo } from 'vue-apollo/types/vue-apollo'

export interface ITable {
  page: number
  itemLength: number
  itemPerPage: number
}

export interface IDailyTrendsStore {
  dialog: boolean
  dialogDate: string
  date: moment.Moment
  loaded: boolean
  table: ITable
  list: Trend[]
}

@Module({
  name: 'dailyTrends',
  stateFactory: true,
  namespaced: true
})
export default class DailyTrendsStore extends VuexModule
  implements IDailyTrendsStore {
  // ダイアログ
  dialog: boolean = false
  dialogDate: string = ''

  @MutationAction({ mutate: ['dialog', 'dialogDate'] })
  async setDialog({
    dialog,
    dateText = '',
  }: {
    dialog: boolean
    dateText?: string
  }) {
    let date = moment(dateText)
    if (!date.isValid()) {
      date = moment()
    }
    return { dialog, dialogDate: date.format('YYYY-MM-DD') }
  }

  @MutationAction({ mutate: ['dialogDate'] })
  async setDialogDate(dialogDate: string) {
    return { dialogDate }
  }

  // デイリートレンド
  date: moment.Moment = moment('')
  loaded: boolean = false
  table: ITable = {
    page: 1,
    itemLength: 0,
    itemPerPage: 15
  }
  page: number = 1
  list: Trend[] = []

  @Action
  async findLatest(param: { apollo: DollarApollo<any>; limit: number }) {
    const ts = new TrendService(param.apollo)

    const trend_time: string = await ts.getLatestTime()

    const date: moment.Moment = moment(trend_time).second(0)
    const m = Math.floor((date.minutes() + 5) / 15) * 15
    date.minutes(m)

    ts.refreshTimeTrends(
      date,
      async (trends: ITrends) => {
        this.findDataMutation({ date, list: trends.trends })
      },
      param.limit
    )
    return trend_time
  }

  @Action
  async findDate(param: { date: moment.Moment; limit: number }) {
    if (param.date.diff(this.date) === 0) {
      this.setLoadState(true)
      return
    }
    this.setLoadState(false)

    const res: any = await axios
      .get(
        `${process.env.API_HOST}/api/daily_trends/${param.date.format(
          'YYYY-MM-DD'
        )}?limit=${param.limit}`
      )
      .catch((e) => {
        console.log(e)
        return { data: [] }
      })

    let list: ITrend[] = []
    res.data.forEach((e: any) => list.push(new Trend(e)))
    // await new Promise((resolve) => setTimeout(resolve, 1))
    this.findDataMutation({ date: param.date, list })
  }

  @Mutation
  private setLoadState(state: boolean) {
    this.loaded = state
    if (!state) {
      this.list = []
    }
  }

  @Mutation
  private findDataMutation(p: { date: moment.Moment; list: ITrend[] }) {
    this.loaded = true
    this.date = p.date
    this.table.itemLength = p.list.length
    this.list = p.list
  }

  @MutationAction({ mutate: ['table'] })
  async setTable(table: ITable) {
    return { table }
  }

  @Action
  async setPage(page: number) {
    this.mutationPage(page)
  }

  @Mutation
  private mutationPage(page: number) {
    this.table.page = page
  }

  @Action
  async setItemsPerPage(value: number) {
    this.mutationItemsPerPage(value)
  }

  @Mutation
  private mutationItemsPerPage(value: number) {
    this.table.itemPerPage = value
  }
}
