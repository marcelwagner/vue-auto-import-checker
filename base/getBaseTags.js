import { htmlTags, svgTags, vueRouterTags, vueTags } from "../plugins/index.js";
export function getBaseTags(repoUrl, version) {
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
            tags: htmlTags,
            source: 'https://github.com/sindresorhus/html-tags'
        }
    ];
}
