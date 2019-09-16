function genMetaParam(data: {
  url?: string
  title?: string
  type?: string
  image?: string
  description?: string
}) {
  let res: any[] = []
  if (data.url) {
    res.push({ hid: 'og:url', property: 'og:url', content: data.url })
  }
  if (data.title) {
    res.push({ hid: 'og:title', property: 'og:title', content: data.title })
  }
  if (data.type) {
    res.push({ hid: 'og:type', property: 'og:type', content: data.type })
  }
  if (data.image) {
    res.push({ hid: 'og:image', property: 'og:image', content: data.image })
  }
  if (data.description) {
    res.push({
      hid: 'og:description',
      property: 'og:description',
      content: data.description
    })
    res.push({
      hid: 'description',
      name: 'description',
      content: data.description
    })
  }
  return res
}

export { genMetaParam }
