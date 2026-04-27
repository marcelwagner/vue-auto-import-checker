# Security

## Base

The tool needs some read and write permissions on the local hard disk.

To use the tool without any custom file (Vuetify, VueUse, `known-tags-file`), the tool needs:

- `read` permission for the files and folders of `project-path`
- `read` permission for the `components-file` path

## Known tags file

If you want to use a `known-tags-file`, the tool additionally needs:

- `read` permission for the `known-tags-file` path

## Frameworks

If you want to use custom Vuetify, VueUse, Quasar, Nuxt, Naive UI or PrimeVue tag lists, the tool additionally needs:

- `read` & `write` permission for the `node_modules` path and its subfolders

## Cache

The tool will add a `.cache` folder as default as a subfolder to the `node_modules` folder for your custom tag lists.  
The cache folder can be configured with `--cache-path` or with `-a`.  
(Example: `--cache-path /tmp/cache` )
