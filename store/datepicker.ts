import { Module, VuexModule, MutationAction } from 'vuex-module-decorators'
import moment from 'moment'

interface IDatepickerStore {
  active: boolean
  date: string
}

@Module({
  name: 'datepicker',
  stateFactory: true,
  namespaced: true
})
export default class DatepickerStore extends VuexModule
  implements IDatepickerStore {
  active: boolean = false
  date: string = ''

  @MutationAction({ mutate: ['active', 'date'] })
  async openDialog(dateText: string = '') {
    let date = moment(dateText)
    if (!date.isValid()) {
      date = moment()
    }
    return { active: true, date: date.format('YYYY-MM-DD') }
  }

  @MutationAction({ mutate: ['active'] })
  async closeDialog() {
    return { active: false }
  }
}
