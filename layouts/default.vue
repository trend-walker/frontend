<template>
  <v-app id="layout">
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="primaryDrawer.mini"
      :permanent="primaryDrawer.type === 'permanent'"
      :temporary="primaryDrawer.type === 'temporary'"
      app
      overflow
      :right="true"
      ><v-app-bar color="blue darken-3" dark>
        <v-toolbar-title>Trendwalker</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="primaryDrawer.model = !primaryDrawer.model">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          @click="menuEvent(item.event)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-footer app>
        <v-col class="text-center" cols="12">&copy;yhcoder </v-col>
      </v-footer>
    </v-navigation-drawer>
    <v-btn
      v-if="primaryDrawer.type !== 'permanent'"
      color="primary"
      fab
      small
      fixed
      :top="true"
      :right="true"
      class="m-4"
      @click.stop="primaryDrawer.model = !primaryDrawer.model"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <v-content>
      <nuxt />
    </v-content>

    <DatepickerDialog
      @date-ok="moveDate"
      @date-cancel="closeDialog"
    ></DatepickerDialog>

    <TrendwordDialog
      @trendword-search="searchWord"
      @trendword-close="closeDialog"
    >
    </TrendwordDialog>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { dailyTrendsModule, trendwordModule } from '@/store'
import DatepickerDialog from '@/components/DatepickerDialog.vue'
import TrendwordDialog from '@/components/TrendwordDialog.vue'

@Component({
  components: {
    DatepickerDialog,
    TrendwordDialog
  }
})
export default class Top extends Vue {
  primaryDrawer = {
    model: false,
    type: 'temporary',
    clipped: false,
    floating: false,
    mini: false
  }
  items = [
    {
      title: 'トップページ',
      icon: 'mdi-home',
      to: '/'
    },
    {
      title: '最新のトレンド',
      icon: 'mdi-calendar-clock',
      to: '/latest'
    },
    {
      title: 'デイリートレンド',
      icon: 'mdi-calendar-search',
      event: 'datepicker'
    },
    {
      title: 'トレンドワード',
      icon: 'mdi-database-search',
      event: 'trendword'
    },
    {
      title: 'About',
      icon: 'mdi-information-outline',
      to: '/about'
    }
  ]
  menuEvent(eventName) {
    this.primaryDrawer.model = false
    if (eventName === 'datepicker') {
      dailyTrendsModule.setDialog({ dialog: true })
    }
    if (eventName === 'trendword') {
      trendwordModule.setDialog(true)
    }
  }
  moveDate(date) {
    this.$router.push(`/daily/${date}`)
    dailyTrendsModule.setDialog({ dialog: false })
  }
  searchWord(data: { word: string }) {
    trendwordModule.search({ word: data.word })
    trendwordModule.setDialog(false)
    this.$router.push(`/trendword`)
  }
  closeDialog() {
    dailyTrendsModule.setDialog({ dialog: false })
    trendwordModule.setDialog(false)
  }
}
</script>
