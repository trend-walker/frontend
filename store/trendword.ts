import { Module, VuexModule, MutationAction } from 'vuex-module-decorators'

interface ITrendwordStore {
  active: boolean
  word: string
}

@Module({
  name: 'trendword',
  stateFactory: true,
  namespaced: true
})
export default class TrendwordStore extends VuexModule
  implements ITrendwordStore {
  active: boolean = false
  word: string = ''

  @MutationAction({ mutate: ['active'] })
  async openDialog() {
    return { active: true }
  }

  @MutationAction({ mutate: ['active'] })
  async closeDialog() {
    return { active: false }
  }

  @MutationAction({ mutate: ['word'] })
  async setWord(word: string) {
    return { word: word }
  }
}
