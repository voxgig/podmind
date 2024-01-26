
export type RSS = {
  title: string,
  description: string,
  items: {
    guid: string
    title: string
    link: string
    pubDate: string
    content: string
    enclosure: { url: string }
  }[]
}
