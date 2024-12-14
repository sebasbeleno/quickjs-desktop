export class AssetUrl {
  url: URL

  constructor(url: URL) {
    this.url = url
  }

  get isNodeModule(): boolean {
    return this.url.pathname.startsWith('/node_modules')
  }

  get relativeURL(): string {
    if (this.isNodeModule) {
      return this.url.pathname.replace('/node_modules/', '')
    } else {
      return this.url.pathname.replace(/^\//, '')
    }
  }
}
