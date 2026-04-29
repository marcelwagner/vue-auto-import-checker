# Workflows

## Github Actions

To run this tool in your github actions you can use the following steps:

- Add a folder `.github/workflows` to you repository
- Add a file with a name for the workflow (for us, we will test the frontend so the name will be `test-frontend.yml`)
- Decide when your workflow has to run (for us, we will run it on every push to the main branch)
- We will use node 24.11 as recommended
- Install the dependencies of your repository (for us, we will use `npm install`)
- After that run this tool. (for us, we have the components.d.ts in the base folder and all files in ./src. We use the
  vuetify framework and imports should be recognized as known)
- Add the following content to the file:

```yaml
## test-framework.yaml
name: Test frontend

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24.11
      - run: npm install
      - run: npx vue-auto-import-checker -c ./components.d.ts -p ./src/ -f vuetify -i -q
```

Better approach would be to use a npm script so there are no files or folders exposed in the workflow file.

```JSON
// package.json
{
  ...
  "scripts": {
    ...
    "components:check": "npx vue-auto-import-checker -c ./components.d.ts -p ./src/ -f vuetify -i -q"
  }
}
```

```yaml
## test-framework.yaml
name: Test frontend
...
    steps:
      ...
      - run: npm run components:check
```
