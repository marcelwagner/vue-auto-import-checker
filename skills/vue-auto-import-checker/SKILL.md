---
name: vue-auto-import-checker
description: Use this skill when a user wants an agent to run vue-auto-import-checker against one or more Vue project paths, with interactive choices for components.d.ts, known frameworks, negated base known sets, known tags, and preferred output presentation.
---

# Vue Auto-Import Checker Agent Skill

Use this workflow when the user asks to scan a Vue project to discover unimported tags from `components.d.ts`.

## 1. Collect Required Inputs

Ask the user for:

1. `projectPaths`: one or more directories to scan (`--project-paths` / `-p`).
2. `componentsFile`: path to `components.d.ts` (`--components-file` / `-c`).

Do not run the checker until both are provided.

## 2. Collect Optional Inputs

Ask the user these questions in order:

1. `frameworksToInclude`: optional explicit list of frameworks to treat as known (`-f`).
   Allowed values: `naiveui`, `nuxt`, `primevue`, `quasar`, `vuetify`, `vueuse`.
2. `negateKnownSets`: optional explicit list of known tags from base sets to treat as not known (`-n`).
   Allowed values: `html`, `svg`, `vue`, `vuerouter`.
3. `knownTags`: optional explicit list of known tags (`-l`).
4. `knownTagsFile`: optional explicit file with a list of known tags as json (`-j`).

Also ask whether imports should be treated as known (`-i`).

## 3. Ask Output Preference

Ask how the user wants output presented:

1. Output format: `text`, `md`, or `json` (`-o`).
2. Include detailed entries (`-r`) or summary only.
3. Include scan stats (`-s`) or not.
4. Show all tags (known & unknown, `-k`) or unknown-only default.
5. Quiet mode (`-q`) only when user wants exit behavior without details.

## 4. Build and Run Command

Run from the repository root (or where `vue-auto-import-checker` is installed):

```bash
npx vue-auto-import-checker \
  -c <componentsFile> \
  -p <projectPath1> <projectPath2> ... \
  [ -f <framework1> <framework2> ... ] \
  [ -n <html|svg|vue|vuerouter> ... ] \
  [ -l <tag1> <tag2> ... ] \
  [ -i ] \
  [ -r ] \
  [ -s ] \
  [ -k ] \
  [ -q ] \
  -o <text|md|json>
```

## 5. Present Results As Requested

After execution:

1. Report exit code.
2. Present output exactly as written in the console.
3. If unknown tags exist and the user wanted no results and no stats, ask if they want to run again with `-r` and `-s`.

## 6. Safety and Consistency

- Never invent framework names.
- Keep framework names normalized to lowercase.
- Preserve tag casing passed by the user for `-l`.
- If the user asks for multiple runs, repeat from Step 3 unless they confirm prior settings should be reused.
