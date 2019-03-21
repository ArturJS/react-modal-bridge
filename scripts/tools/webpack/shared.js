const toMultipleReplaceQueries = obj =>
  Object.entries(obj).map(([key, value]) => ({
    search: key,
    replace: value
  }));

const reactModalClassNames = {
  ReactModalPortal: 'rmb-portal',
  'ReactModal__Body--open': 'rmb-body--open',
  ReactModal__Overlay: 'rmb-overlay',
  ReactModal__Content: 'rmb-content'
};

module.exports = {
  ruleToRenameReactModalClassNames: {
    test: /react-modal.*\.js$/,
    include: /node_modules/,
    loader: 'string-replace-loader',
    options: {
      multiple: toMultipleReplaceQueries(reactModalClassNames)
    }
  }
};
