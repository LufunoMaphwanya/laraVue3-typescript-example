module.exports = {
    "testEnvironment": "jsdom",
    collectCoverage: true,
    "collectCoverageFrom": [
        "resources/js/**/*.{js,jsx}",
        "resources/js/**/*.{ts,tsx}",
        "resources/js/**/*.vue",
        "!resources/js/tests/**/*.*",
        "!**/node_modules/**",
        "!**/vendor/**"
      ],
    testRegex: 'resources/js/tests/.*.spec.ts$',
    moduleFileExtensions: [
      'js',
      'json',
      'vue',
      'ts'
    ],
    'transform': {
      '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
      '.*\\.(vue)$': '@vue/vue3-jest',
      "^.+\\.tsx?$": "ts-jest"
    },
  }
