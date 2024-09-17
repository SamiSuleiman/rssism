import { Injectable } from '@nestjs/common';
import parse from 'node-html-parser';

@Injectable()
export class AppService {
  async getRssUrl(url: string): Promise<string | null> {
    if (!URL.canParse(url)) return null;
    const _url = new URL(url);
    const _rssUrl =
      this.constructRedditRssUrl(_url) || (await this.getFromHtml(url));
    return _rssUrl;
  }

  private constructRedditRssUrl(url: URL): string | null {
    if (!url.hostname.includes('reddit.com') || url.pathname.endsWith('.rss'))
      return null;
    if (
      url.pathname.startsWith('/r/') ||
      url.pathname.startsWith('/user/') ||
      url.pathname.startsWith('/u/')
    )
      return `${url.protocol}//${url.hostname}${url.pathname}.rss`;

    return null;
  }

  private async getFromHtml(url: string) {
    try {
      const _page = await fetch(url);
      if (!_page.ok) return null;
      const _doc = parse(await _page.text());
      const _rss = _doc.querySelector('link[type="application/rss+xml"]');
      const _href = _rss?.getAttribute('href');
      if (!_href) return null;
      return URL.canParse(_href) ? _href : `${new URL(url).origin}/${_href}`;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
