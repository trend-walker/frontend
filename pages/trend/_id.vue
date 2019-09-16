<template>
  <div>
    <div id="word-cloud"></div>
    <no-ssr>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-row align="start" justify="center" class="grey lighten-5">
            </v-row>
          </v-col>
        </v-row>
        <div id="tw-container"></div>
      </v-container>
    </no-ssr>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import moment from 'moment'
import axios from 'axios'
import * as d3 from 'd3'
import * as cloud from 'd3-cloud'
import { trendsModule } from '@/store'

@Component({})
export default class TrendBody extends Vue {
  data: any = []

  async mounted() {
    // const tw: any = await axios.get(
    //   `${process.env.API_HOST}/api/get_tweets/${this.$route.params.id}`
    // )
    // this.data = tw.data

    const wc: any = await axios.get(
      `${process.env.API_HOST}/api/analyze_tweets/${this.$route.params.id}`
    )
    this.wordCloud(wc.data)
  }

  @Watch('data')
  onDataCahge() {
    const pare = document.getElementById('tw-container')
    for (const i in this.data) {
      const e = this.data[i]
      ;(window as any).twttr.widgets.createTweet(e.id_str, pare, {
        // cards: 'hidden',
        conversation: 'none',
        align: 'center',
        lang: 'ja'
      })
    }
  }

  wordCloud(data: any) {
    const layout = cloud()
      .size([960, 480])
      .words(data.slice(0, 200))
      .padding(1)
      .rotate(function(v, i) {
        if (i > 2) {
          return ~~(Math.random() * 2) * 60 * ((i % 2) * 2 - 1)
        }
        return 0
      })
      .font('Impact')
      .fontSize((d) => {
        return Math.log(d.size + 1) * 16
      })
      .on('end', (words) => {
        d3.select('#word-cloud')
          .append('svg')
          .attr('width', layout.size()[0])
          .attr('height', layout.size()[1])
          .append('g')
          .attr(
            'transform',
            `translate(${layout.size()[0] / 2}, ${layout.size()[1] / 2})`
          )
          .selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', function(d) {
            return d.size + 'px'
          })
          .style('font-family', 'Impact')
          .style('fill', function(d, i) {
            return d3.interpolateViridis((i % 10) * 0.1)
          })
          .attr('text-anchor', 'middle')
          .attr('transform', function(d) {
            return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
          })
          .text(function(d) {
            return d.text
          })
      })

    layout.start()
  }
}
</script>
