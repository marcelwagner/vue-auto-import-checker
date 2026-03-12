import {
  naiveuiTags,
  nuxtTags,
  primevueTags,
  quasarTags,
  vuetifyTags,
  vueUseTags
} from '../plugins/index.ts';
import {
  naiveuiComponentsImporter,
  nuxtComponentsImporter,
  primevueComponentsImporter,
  quasarComponentsImporter,
  vuetifyComponentsImporter,
  vueUseComponentsImporter
} from '../tools/index.ts';

/**
 * Mapping of supported frameworks to their respective tags and import tools.
 * @param repoTreeUrl - url to the framework repo with tree and version
 */
export function getFrameworksTools(repoTreeUrl: string): FrameworkToolItem[] {
  return [
    {
      name: 'vuetify',
      file: 'vuetifyTags',
      tool: vuetifyComponentsImporter,
      tags: vuetifyTags,
      source: `${repoTreeUrl}/plugins/vuetifyTags.json`
    },
    {
      name: 'vueuse',
      file: 'vueuseTags',
      tool: vueUseComponentsImporter,
      tags: vueUseTags,
      source: `${repoTreeUrl}/plugins/vueUseTags.json`
    },
    {
      name: 'quasar',
      file: 'quasarTags',
      tool: quasarComponentsImporter,
      tags: quasarTags,
      source: `${repoTreeUrl}/plugins/quasarTags.json`
    },
    {
      name: 'nuxt',
      file: 'nuxtTags',
      tool: nuxtComponentsImporter,
      tags: nuxtTags,
      source: `${repoTreeUrl}/plugins/nuxtTags.json`
    },
    {
      name: 'primevue',
      file: 'primevueTags',
      tool: primevueComponentsImporter,
      tags: primevueTags,
      source: `${repoTreeUrl}/plugins/primevueTags.json`
    },
    {
      name: 'naiveui',
      file: 'naiveuiTags',
      tool: naiveuiComponentsImporter,
      tags: naiveuiTags,
      source: `${repoTreeUrl}/plugins/naiveuiTags.json`
    }
  ];
}
