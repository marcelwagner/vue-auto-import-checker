---
name: vue-auto-import-checker
description: Use this skill when a user wants an agent to scan one or more Vue projects with vue-auto-import-checker to find tags that are not registered in components.d.ts, with interactive run configuration and output preferences.
---

# Vue Auto-Import Checker Agent Skill

Use this workflow when the user asks to scan a Vue project for tags that are not registered in
`components.d.ts`. Supported files are Vue Single-File Components (`*.vue` / SFC). At minimum, each file
must contain a `<template>` block.

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

## 1. Collect Required Inputs

Ask the user for:

1. `projectPaths`: one or more directories to scan (`--project-paths` / `-p`).
2. `componentsFile`: path to `components.d.ts` (`--components-file` / `-c`).

Do not run the checker until both are provided.

## 2. Collect Optional Inputs

Ask the user these questions in order:

1. `frameworks`: optional list of frameworks to treat as known (`-f`).
   Allowed values: `naiveui`, `nuxt`, `primevue`, `quasar`, `vuetify`, `vueuse`.
2. `negateKnown`: optional list of base sets to treat as not known (`-n`).
   Allowed values: `html`, `svg`, `vue`, `vuerouter`.
3. `knownTags`: optional list of known tags (`-l`).
4. `knownTagsFile`: optional file path that contains known tags (`-j`).

Also ask whether imported components should be treated as known (`-i`).

## 3. Ask Output Preference

Ask how the user wants output presented:

1. Output format: `text`, `md`, or `json` (`-o`).
2. Include detailed entries (`-r`) or summary only.
3. Include scan stats (`-s`) or not.
4. Show all tags (known and unknown, `-k`) or unknown-only (default).
5. Quiet mode (`-q`) only if the user wants exit behavior without details.

## 4. Validate Inputs

Before execution, validate all user inputs:

1. `componentsFile` exists and is a file.
2. Every entry in `projectPaths` exists and is a directory.
3. `knownTagsFile` exists and is a file, if provided.
4. `frameworks` only contains allowed framework names.
5. `negateKnown` only contains allowed set names.

If a value is invalid, ask for correction and do not run the checker.

## 5. Build and Run Command

Run from the repository root (or where `vue-auto-import-checker` is installed):

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
  [ -k ] \
  [ -q ] \
  -o <text|md|json>
```

Rules:

1. Use only flags requested by the user.
2. Keep user-provided path values unchanged unless the user asks for normalization.
3. If the user requests multiple runs, confirm whether to reuse the previous configuration.

## 6. Present Results

After execution:

1. Report exit code.
2. Present output in the user-requested style:
   - exact console output when requested, or
   - concise summary when requested.
3. If unknown tags are found and output was too minimal to diagnose the issue, ask whether to run again with `-r` and `-s`.

## 7. Safety and Consistency

- Never invent framework names.
- Keep framework names normalized to lowercase.
- Preserve tag casing passed by the user for `-l`.
- If the user asks for multiple runs, repeat from Step 3 unless they confirm that previous settings should be reused.
