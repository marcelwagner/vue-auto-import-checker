---
name: vue-auto-import-checker
description: Use this skill when a user wants an agent to run vue-auto-import-checker for one of four use cases: framework tag file generation, known component tag listing, unknown tag listing, or complete project tag listing, with interactive run configuration and output preferences.
---

# Vue Auto-Import Checker Agent Skill

Use this workflow when the user asks to run one of the supported vue-auto-import-checker use cases.
Supported files are Vue Single-File Components (`*.vue` / SFC). At minimum, each file must contain a
`<template>` block.

```vue
<script>
/* TypeScript or JavaScript content */
</script>

<template>
  <!-- HTML content -->
</template>

<style>
/* CSS content */
</style>
```

## 1. Choose Use Case (Skill)

First, determine which of these 4 use cases the user wants:

1. Framework tag file generation tool:
   Generate framework tags from installed framework packages (`-t`).
   Allowed frameworks: `naiveui`, `nuxt`, `primevue`, `quasar`, `vuetify`, `vueuse`.
2. Known components tag list:
   Use only `components.d.ts` to list user-generated component tags (`-c` only).
3. List unknown tags (default checker behavior):
   Scan project folders and list unknown tags based on known tags, known frameworks, and `components.d.ts`.
4. List all tags in project folders:
   Scan project folders and list all tags (known and unknown) using the same configuration inputs as unknown-tag mode (`-k`).

If unclear, ask the user to pick one before collecting detailed inputs.

## 2. Collect Required Inputs

Collect required inputs based on the selected use case:

1. Framework tag file generation tool:
   - `tool`: one framework name (`--tool` / `-t`).
2. Known components tag list:
   - `componentsFile`: path to `components.d.ts` (`--components-file` / `-c`).
3. List unknown tags:
   - `projectPaths`: one or more directories to scan (`--project-paths` / `-p`).
   - `componentsFile`: path to `components.d.ts` (`--components-file` / `-c`).
4. List all tags in project folders:
   - `projectPaths`: one or more directories to scan (`--project-paths` / `-p`).
   - `componentsFile`: path to `components.d.ts` (`--components-file` / `-c`).

Do not run the checker until the required inputs for that use case are provided.

## 3. Collect Optional Inputs

For project scanning modes (unknown tags / all tags), ask these in order:

1. `frameworks`: optional list of frameworks to treat as known (`-f`).
   Allowed values: `naiveui`, `nuxt`, `primevue`, `quasar`, `vuetify`, `vueuse`.
2. `negateKnown`: optional list of base sets to treat as not known (`-n`).
   Allowed values: `html`, `svg`, `vue`, `vuerouter`.
3. `knownTags`: optional list of known tags (`-l`).
4. `knownTagsFile`: optional file path that contains known tags (`-j`).

Also ask whether imported components should be treated as known (`-i`).

For any mode, also ask whether quiet mode is desired (`-q`).

## 4. Ask Output Preference

Ask how the user wants output presented:

1. Output format: `text`, `md`, or `json` (`-o`).
2. Include detailed entries (`-r`) or summary only.
3. Include scan stats (`-s`) or not.
4. For project scanning modes only:
   - unknown-only (default), or
   - show all tags with `-k`.
5. Quiet mode (`-q`) only if the user wants minimal console output.

## 5. Validate Inputs

Before execution, validate all user inputs:

1. `componentsFile` exists and is a file, when required by the selected use case.
2. Every entry in `projectPaths` exists and is a directory, when required by the selected use case.
3. `knownTagsFile` exists and is a file, if provided.
4. `frameworks` only contains allowed framework names.
5. `tool` (for `-t`) is one allowed framework name.
6. `negateKnown` only contains allowed set names.

If a value is invalid, ask for correction and do not run the checker.

## 6. Build and Run Command

Run from the repository root (or where `vue-auto-import-checker` is installed):

Framework tag file generation:

```bash
npx vue-auto-import-checker -t <naiveui|nuxt|primevue|quasar|vuetify|vueuse> [ -q ] [ -o <text|md|json> ]
```

Known components tag list:

```bash
npx vue-auto-import-checker -c <componentsFile> [ -q ] [ -o <text|md|json> ]
```

Unknown tags (default project scan):

```bash
npx vue-auto-import-checker \
  -c <componentsFile> \
  -p <projectPath1> <projectPath2> ... \
  [ -f <framework1> <framework2> ... ] \
  [ -n <set1> <set2> ... ] \
  [ -l <tag1> <tag2> ... ] \
  [ -j <filePath> ] \
  [ -i ] \
  [ -r ] \
  [ -s ] \
  [ -q ] \
  -o <text|md|json>
```

All tags in project folders (known + unknown):

```bash
npx vue-auto-import-checker \
  -c <componentsFile> \
  -p <projectPath1> <projectPath2> ... \
  [ -f <framework1> <framework2> ... ] \
  [ -n <set1> <set2> ... ] \
  [ -l <tag1> <tag2> ... ] \
  [ -j <filePath> ] \
  [ -i ] \
  [ -r ] \
  [ -s ] \
  -k \
  [ -q ] \
  -o <text|md|json>
```

Rules:

1. Use only flags requested by the user.
2. Keep user-provided path values unchanged unless the user asks for normalization.
3. If the user requests multiple runs, confirm whether to reuse the previous configuration.

## 7. Present Results

After execution:

1. Report exit code.
2. Present output in the user-requested style:
   - exact console output when requested, or
   - concise summary when requested.
3. If unknown tags are found and output was too minimal to diagnose the issue, ask whether to run again with `-r` and `-s`.
4. For all-tags mode (`-k`), clarify that output includes both known and unknown tags.

## 8. Safety and Consistency

- Never invent framework names.
- Keep framework names normalized to lowercase.
- Preserve tag casing passed by the user for `-l`.
- If the user asks for multiple runs, repeat from Step 3 unless they confirm that previous settings should be reused.
