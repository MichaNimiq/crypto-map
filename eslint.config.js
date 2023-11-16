import antfu from '@antfu/eslint-config'

export default antfu({
  files: ['**/*.ts', '**/*.vue', '**/*.js'],
  overrides: [
    {
      files: ['tsconfig.json'],
      rules: {
        'jsonc/sort-keys': 'off',
      },
    },
  ],
  ignorePatterns: ['**/dist/**/*', '**/*.config.{ts,js}', '**/*.po', '**/assets/**/*']
})
