<template>
  <v-card class="ma-3" :class="[$style.topCard]">
    <v-toolbar color="blue darken-4" dark>
      <v-toolbar-title>{{ title }} </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="!fetch">
        <v-btn
          :to="`/daily/${date(trends.time)}`"
          color="white"
          text
          rounded
          class="my-2"
        >
          {{ trends.time }}
        </v-btn>
        <v-icon v-if="step" @click="$emit('plus')"
          >mdi-magnify-plus-outline</v-icon
        >
        <v-icon v-if="step" @click="$emit('minus')"
          >mdi-magnify-minus-outline</v-icon
        >
      </div>
      <v-progress-circular
        v-else
        indeterminate
        color="cyan"
      ></v-progress-circular> </v-toolbar
    ><v-list dense>
      <v-list-item-group v-model="index" color="primary">
        <v-list-item
          v-for="(item, id) in trends.trends"
          :key="id"
          :to="`/daily/${date(item.trend_time)}/${item.trend_word_id}`"
          :class="{ loaded: loaded }"
          router
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.trend_word"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action-text
            v-if="item.tweet_volume"
            v-text="item.tweet_volume + '件'"
          ></v-list-item-action-text>
        </v-list-item> </v-list-item-group></v-list
  ></v-card>
</template>

<style module>
.topCard {
  width: 320px;
}
</style>

<style>
.loaded {
  animation: fadeIn 1s ease 0s 1 normal;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import moment from 'moment'
import { ITrends } from '@/service/TrendService'

@Component
export default class TodoPreview extends Vue {
  @Prop({ type: Object, required: true }) trends!: ITrends
  @Prop({ type: String }) title!: String
  @Prop({ type: String }) step!: String
  @Prop({ type: Boolean }) fetch!: Boolean
  loaded: boolean = false

  date(trendTime: string): string {
    return moment(trendTime).format('YYYY-MM-DD')
  }

  @Watch('trends')
  changeTrends(value: any) {
    this.loaded = true
  }

  @Watch('fetch')
  changeFetch(value: any) {
    if (value) {
      this.loaded = false
    }
  }

  index: Number = -1
}
</script>
