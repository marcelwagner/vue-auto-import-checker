import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { getToolTags } from './index.ts';
import { statistics } from './utils/index.ts';

const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../');

const cachePath = 'node_modules/.cache';

describe('naiveui as tool', async () => {
  const config: InternalConfig = {
    componentsFile: '',
    projectPaths: [],
    tool: 'naiveui',
    knownTags: [],
    knownTagsFile: '',
    negateKnown: [],
    knownFrameworks: [],
    cachePath,
    importsKnown: false,
    basePath,
    kafka: true,
    outputFormat: 'text'
  };

  statistics._stats = { ...statistics._initialState };

  const { toolTags, toolName } = await getToolTags(config);

  // Expected result
  const tags = [
    'NAffix',
    'NAlert',
    'NAnchor',
    'NAnchorLink',
    'NAutoComplete',
    'NAvatar',
    'NAvatarGroup',
    'NBackTop',
    'NBadge',
    'NBreadcrumb',
    'NBreadcrumbItem',
    'NButtonGroup',
    'NCalendar',
    'NCard',
    'NCarousel',
    'NCarouselItem',
    'NCascader',
    'NCheckbox',
    'NCheckboxGroup',
    'NCode',
    'NCollapse',
    'NCollapseItem',
    'NCollapseTransition',
    'NColorPicker',
    'NConfigProvider',
    'NCountdown',
    'NDataTable',
    'NDatePicker',
    'NDescriptions',
    'NDescriptionsItem',
    'NDivider',
    'NDrawer',
    'NDrawerContent',
    'NDropdown',
    'NDynamicInput',
    'NDynamicTags',
    'NElement',
    'NEl',
    'NEllipsis',
    'NEmpty',
    'NFlex',
    'NFloatButton',
    'NFloatButtonGroup',
    'NForm',
    'NFormItem',
    'NFormItemCol',
    'NFormItemGridItem',
    'NFormItemRow',
    'NGlobalStyle',
    'NGradientText',
    'NGrid',
    'NGridItem',
    'NGi',
    'NHeatmap',
    'NHighlight',
    'NImage',
    'NImageGroup',
    'NImagePreview',
    'NInfiniteScroll',
    'NInput',
    'NInputGroup',
    'NInputGroupLabel',
    'NInputNumber',
    'NInputOtp',
    'NLayout',
    'NLayoutContent',
    'NLayoutFooter',
    'NLayoutHeader',
    'NLayoutSider',
    'NCol',
    'NLegacyTransfer',
    'NList',
    'NListItem',
    'NLoadingBarProvider',
    'NLog',
    'NMarquee',
    'NMention',
    'NMenu',
    'NMessageProvider',
    'NModal',
    'NTbody',
    'NTd',
    'NTh',
    'NThead',
    'NTr',
    'NThemeEditor',
    'NA',
    'NBlockquote',
    'NHr',
    'NLi',
    'NUploadDragger',
    'NUploadFileList',
    'NUploadTrigger'
  ];

  test(`should return components ${tags.join(', ')}`, () => {
    expect(toolTags).toEqual(tags);
  });
  test(`should return ${tags.length} components`, () => {
    expect(toolTags).toHaveLength(tags.length);
  });
  test(`should return naiveui as tool name`, () => {
    expect(toolName).toBe('naiveui');
  });
});
