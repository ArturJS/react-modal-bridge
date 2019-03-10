module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*index.{js,jsx}'
  ],
  setupFiles: ['<rootDir>/scripts/tools/jest/__mocks__/browser-mocks.js'],
  setupFilesAfterEnv: ['<rootDir>/scripts/tools/jest/jest-setup.js'],
  testURL: 'http://localhost:8281',
  transform: {
    '\\.jsx?$': 'babel-jest',
    '^.+\\.scss$': './scripts/tools/jest/css-transform.js'
  },
  testRegex: '(/__tests__/.*|\\.(test))\\.(js|jsx)$',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js)$'],
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/scripts/tools/jest/assets-transform.js',
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  verbose: true
};
