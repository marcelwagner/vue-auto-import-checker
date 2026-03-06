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
} from './index.ts';

/**
 * Mapping from canonical tool keys to their importer functions.
 *
 * The importer functions are invoked by the CLI flow to produce tag lists or
 * perform tool-specific operations. Keys must match the values produced by
 * `getToolName`.
 */
export function getFrameworksTools(repoUrl: string, version: string): FrameworkToolItem[] {
  return [
    {
      name: 'vuetify',
      file: 'vuetifyTags',
      tool: vuetifyComponentsImporter,
      tags: vuetifyTags,
      source: `${repoUrl}/tree/${version}/plugins/vuetifyTags.json`
    },
    {
      name: 'vueuse',
      file: 'vueUseTags',
      tool: vueUseComponentsImporter,
      tags: vueUseTags,
      source: `${repoUrl}/tree/${version}/plugins/vueUseTags.json`
    },
    {
      name: 'quasar',
      file: 'quasarTags',
      tool: quasarComponentsImporter,
      tags: quasarTags,
      source: `${repoUrl}/tree/${version}/plugins/quasarTags.json`
    },
    {
      name: 'nuxt',
      file: 'nuxtTags',
      tool: nuxtComponentsImporter,
      tags: nuxtTags,
      source: `${repoUrl}/tree/${version}/plugins/nuxtTags.json`
    },
    {
      name: 'primevue',
      file: 'primevueTags',
      tool: primevueComponentsImporter,
      tags: primevueTags,
      source: `${repoUrl}/tree/${version}/plugins/primevueTags.json`
    },
    {
      name: 'naiveui',
      file: 'naiveuiTags',
      tool: naiveuiComponentsImporter,
      tags: naiveuiTags,
      source: `${repoUrl}/tree/${version}/plugins/naiveuiTags.json`
    }
  ];
}
