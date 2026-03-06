import { htmlTags, svgTags, vueRouterTags, vueTags } from '../plugins/index.ts';

export function getBaseTags(repoUrl: string, version: string): BaseTags[] {
  return [
    {
      name: 'vuerouter',
      tags: vueRouterTags,
      source: `${repoUrl}/tree/${version}/plugins/vueRouterTags.json`
    },
    {
      name: 'vue',
      tags: vueTags,
      source: `${repoUrl}/tree/${version}/plugins/vueTags.json`
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
