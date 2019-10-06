import {
  Module,
  VuexModule,
  Action,
  Mutation,
  MutationAction
} from 'vuex-module-decorators'
import moment from 'moment'
import axios from 'axios'

moment.locale('ja')

interface IPagination {
  total: number
  page: number
  length: number
  result: any[]
}

interface ITrendwordStore {
  dialog: boolean
  word: string
  loaded: boolean
  pagination: IPagination
}

@Module({
  name: 'trendword',
  stateFactory: true,
  namespaced: true
})
export default class TrendwordStore extends VuexModule
  implements ITrendwordStore {
  dialog: boolean = false
  word: string = ''
  loaded: boolean = true
  pagination: IPagination = {
    total: 0,
    page: 1,
    length: 0,
    result: []
  }

  @MutationAction({ mutate: ['dialog'] })
  async setDialog(dialog: boolean) {
    return { dialog }
  }

  @Action
  async setWord(word: string) {
    this.mutationWord(word)
  }

  @Mutation
  private mutationWord(word: string) {
    this.word = word
  }

  @Action
  async search({ word, page = 1 }: { word: string; page?: number }) {
    this.setLoaded(false)
    this.mutationWord(word)
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
    this.searchResultMutation(res.data)
    this.setLoaded(true)
  }

  @Mutation
  private searchResultMutation(list) {
    this.pagination = list
  }

  @MutationAction({ mutate: ['loaded'] })
  async setLoaded(loaded: boolean) {
    return { loaded }
  }

  @Action
  async setPage(page: number) {
    this.mutationPage(page)
  }

  @Mutation
  private mutationPage(page: number) {
    this.pagination.page = page
  }
}
