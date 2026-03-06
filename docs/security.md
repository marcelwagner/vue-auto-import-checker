# Security

The tool will need some read and write permissions on the local hard disc.

To use the tool without any custom file (vuetify, vueUse, customTagFile), the tool needs:

- `read`-permission to the files and folders of `project-path`
- `read`-permission for the `components-file`-path

If you want to use a customTagFile, the tool needs additionally:

- `read`-permission for the `customtagsfile`-path

If you want to use custom vuetify or VueUse tag-lists, the tool needs additionally:

- `read` & `write`-permission for the `node_modules`-path and its subfolders

The tool will add a folder `.cache` as a subfolder to the `node_modules`-folder for your custom vuetify or VueUse
tag-lists.