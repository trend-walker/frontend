<template>
  <v-row justify="center">
    <v-dialog
      v-model="store.dialog"
      max-width="640"
      @click:outside="$emit('trendword-close')"
    >
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>
            <v-icon left>mdi-database-search</v-icon
            >トレンドワード</v-toolbar-title
          >
          <div class="flex-grow-1"></div>
        </v-toolbar>
        <v-toolbar>
          <v-text-field
            ref="textfield"
            v-model="word"
            :autofocus="true"
            label="キーワード・ハッシュタグ"
            single-line
            hide-details
            @keydown.enter="$emit('trendword-search', { word: word })"
            @compositionstart="composing = true"
            @compositionend="composing = false"
          ></v-text-field>

          <v-btn icon @click="$emit('trendword-search', { word: word })">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { trendwordModule as store } from '@/store'

@Component
export default class TrendwordDialog extends Vue {
  word: string = ''
  composing: boolean = false

  get store() {
    return store
  }

  @Watch('store.dialog')
  onChangeStoreDialog(value) {
    if (value) {
      this.$nextTick(this.setFocus)
      this.word = ''
    }
  }

  @Watch('store.word')
  onChangeStoreWord(value) {
    this.word = value
  }

  setFocus() {
    ;(this.$refs.textfield as any).focus()
  }
}
</script>
