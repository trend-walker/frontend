import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import TrendsStore from '@/store/trends'
import TodosStore from '@/store/todos'
import TrendwordStore from '@/store/trendword'
import DailyTrendsStore from '@/store/dailyTrends'

let trendsModule: TrendsStore
let todosModule: TodosStore
let trendwordModule: TrendwordStore
let dailyTrendsModule: DailyTrendsStore

function initialiseStores(store: Store<any>): void {
  trendsModule = getModule(TrendsStore, store)
  todosModule = getModule(TodosStore, store)
  trendwordModule = getModule(TrendwordStore, store)
  dailyTrendsModule = getModule(DailyTrendsStore, store)
}

export {
  initialiseStores,
  trendsModule,
  todosModule,
  trendwordModule,
  dailyTrendsModule
}
