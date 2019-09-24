<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">
            Trendwalker
          </v-card-title>
          <v-card-text>
            <p>
              トレンド情報を収集・整理・加工し利用者に提供するサービスです。
            </p>
            <p>
              トレンド情報の収集にはツイッターAPIを利用しています。
            </p>
            <hr class="my-3" />
            開発・運営者：yhcoder
            <br />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" nuxt to="/">
              トップページへ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {}
</script>
