import { Module, VuexModule, MutationAction } from 'vuex-module-decorators'
import moment from 'moment'
import { ITrendStore, ITrends } from '@/service/TrendService'

@Module({
  name: 'trends',
  stateFactory: true,
  namespaced: true
})
export default class TrendsStore extends VuexModule implements ITrendStore {
  targetTime: string = ''
  current: ITrends = { trends: [] }
  lastDay: ITrends = { trends: [] }
  lastWeek: ITrends = { trends: [] }
  lastMonth: ITrends = { trends: [] }

  @MutationAction({ mutate: ['targetTime'] })
  async setTargetTime(date: moment.Moment) {
    return { targetTime: date }
  }

  @MutationAction({ mutate: ['current'] })
  async setCurrent(trends: ITrends) {
    return { current: trends }
  }

  @MutationAction({ mutate: ['lastDay'] })
  async setLastDay(trends: ITrends) {
    return { lastDay: trends }
  }

  @MutationAction({ mutate: ['lastWeek'] })
  async setLastWeek(trends: ITrends) {
    return { lastWeek: trends }
  }

  @MutationAction({ mutate: ['lastMonth'] })
  async setLastMonth(trends: ITrends) {
    return { lastMonth: trends }
  }
}
