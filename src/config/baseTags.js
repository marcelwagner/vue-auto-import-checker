import { htmlTags, svgTags, vueRouterTags, vueTags } from "../plugins/index.js";
export function getBaseTags(repoTreeUrl) {
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
            tags: htmlTags,
            source: 'https://github.com/sindresorhus/html-tags'
        }
    ];
}
