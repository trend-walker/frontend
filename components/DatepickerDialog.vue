<template>
  <v-row justify="center">
    <v-dialog
      v-model="active"
      max-width="640"
      @click:outside="$emit('date-cancel')"
    >
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>
            <v-icon left>mdi-calendar-search</v-icon
            >デイリートレンド</v-toolbar-title
          >
          <div class="flex-grow-1"></div>
        </v-toolbar>
        <v-date-picker
          v-model="date"
          full-width
          :show-current="date"
          :landscape="$vuetify.breakpoint.smAndUp"
          :day-format="dayFormt"
          locale="ja"
        ></v-date-picker>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="$emit('date-ok', date)"
            >OK</v-btn
          >
          <v-btn color="green darken-1" text @click="$emit('date-cancel')"
            >CANCEL</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { dailyTrendsModule as store } from '@/store'

@Component
export default class DatepickerDialog extends Vue {
  get active() {
    return store.dialog
  }

  get date() {
    return store.dialogDate
  }

  set date(value) {
    store.setDialogDate(value)
  }

  dayFormt(date) {
    return date.split('-')[2]
  }
}
</script>
