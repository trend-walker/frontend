import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import TrendsStore from '@/store/trends'
import TodosStore from '@/store/todos'
import DatepickerStore from '@/store/datepicker'
import TrendwordStore from '@/store/trendword'

let trendsModule: TrendsStore
let todosModule: TodosStore
let datepickerModule: DatepickerStore
let trendwordModule: TrendwordStore

function initialiseStores(store: Store<any>): void {
  trendsModule = getModule(TrendsStore, store)
  todosModule = getModule(TodosStore, store)
  datepickerModule = getModule(DatepickerStore, store)
  trendwordModule = getModule(TrendwordStore, store)
}

export {
  initialiseStores,
  trendsModule,
  todosModule,
  datepickerModule,
  trendwordModule
}
