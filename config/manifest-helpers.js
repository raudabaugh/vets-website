/* eslint-disable no-console */
const find = require('find');
const path = require('path');

const root = path.join(__dirname, '..');

function getAppManifests() {
  return find
    .fileSync(/manifest\.(json|js)$/, path.join(root, './src/applications'))
    .map(file => {
      // eslint-disable-next-line import/no-dynamic-require
      const manifest = require(file);
      const resolvedRoot = path.resolve(root, path.dirname(file));

      const templateFile = manifest?.template?.file;

      return {
        ...manifest,
        template: {
          file: templateFile ? path.join(resolvedRoot, templateFile) : null,
        },
        filePath: file,
        entryFile: path.resolve(
          root,
          path.join(path.dirname(file), manifest.entryFile),
        ),
      };
    });
}

function getAppRoutes() {
  return getAppManifests()
    .map(m => m.rootUrl)
    .filter(m => m);
}

function getWebpackEntryPoints(manifests) {
  return manifests.reduce((apps, next) => {
    // eslint-disable-next-line no-param-reassign
    apps[next.entryName] = next.entryFile;
    return apps;
  }, {});
}

function displayApplications() {
  getAppManifests().forEach(manifest => {
    console.log(manifest.appName);
    console.log(path.relative(root, manifest.filePath));
    console.log(`Production: ${manifest.production || false}`);
    console.log('');
  });
}

module.exports = {
  displayApplications,
  getWebpackEntryPoints,
  getAppManifests,
  getAppRoutes,
};
