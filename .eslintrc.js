module.exports = {
  extends: ['standard'],
  plugins: ['import'],
  settings: {
    'import/ignore': [
      'node_modules'
    ],
    'import/extensions': ['.js'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.json']
      }
    }
  }
}