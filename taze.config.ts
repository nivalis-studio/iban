import { defineConfig } from 'taze';

export default defineConfig({
  force: true,
  write: true,
  update: false,
  install: false,
  recursive: false,
  interactive: false,
  includeLocked: true,
  ignoreOtherWorkspaces: false,
  mode: 'latest',
  packageMode: {
    '@types/node': 'minor',
    'typescript': 'minor',
  },
  exclude: [],
  ignorePaths: [],
});
