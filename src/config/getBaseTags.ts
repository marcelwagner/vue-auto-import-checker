import { htmlTags, svgTags, vueRouterTags, vueTags } from '../plugins/index.ts';

/**
 * Mapping of supported base tags to their respective tags and sources.
 *
 * @param repoTreeUrl - url to the framework repo with tree and version
 * @returns BaseTags[] - list of base tags
 */
export function getBaseTags(repoTreeUrl: string): BaseTags[] {
  return [
    {
      name: 'vuerouter',
      tags: vueRouterTags,
      source: `${repoTreeUrl}/plugins/vueRouterTags.json`
    },
    {
      name: 'vue',
      tags: vueTags,
      source: `${repoTreeUrl}/plugins/vueTags.json`
    },
    {
      name: 'svg',
      tags: svgTags,
      source: 'https://github.com/wooorm/svg-tag-names'
    },
    {
      name: 'html',
      tags: htmlTags as string[],
      source: 'https://github.com/sindresorhus/html-tags'
    }
  ];
}
