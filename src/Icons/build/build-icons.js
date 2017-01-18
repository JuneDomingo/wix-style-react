const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');
const esformatter = require('esformatter');
const rimraf = require('rimraf');
const _ = require('lodash');
esformatter.register(require('esformatter-jsx'));

const rootDir = path.join(__dirname, '..');
const outputDir = path.join(__dirname, '..', 'components');
const svgDir = 'raw';
const components = {};
const attributesToRemove = [];//['xlink:href', 'clip-path', 'fill-opacity', 'fill'];
const attributesToRename = {'xlink:href': 'xlinkHref'};

let $;

const cleanPrevious = () => {
  rimraf.sync(outputDir);
  fs.mkdirSync(outputDir);
};

const cleanAttributes = ($el, $) => {
  attributesToRemove.forEach(attr => {
    $el.removeAttr(attr);
  });

  _.each($el.attr(), (val, name) => {
    if (name.indexOf('-') === -1 && !attributesToRename[name]) {
      return;
    }

    const newName = attributesToRename[name] || _.camelCase(name);
    $el.attr(newName, val).removeAttr(name);
  });

  if ($el.children().length === 0) {
    return false;
  }

  $el.children().each((index, el) => {
    const $child = $(el);
    cleanAttributes($child, $);
  });
};

const cleanComments = $el => {
  $el
    .contents()
    .filter(function () {return this.type === 'comment';}) //eslint-disable-line
    .remove();
};

const getComponentTemplate = (name, viewBox, iconSvg) => {
  const uglyComponent = `import React from 'react';
import Icon from '../Icon';

/*eslint-disable */
const ${name} = props => (
  <Icon viewBox="${viewBox}" {...props}>   
    <g>${iconSvg}</g>
  </Icon>
);
/*eslint-enable */

export default ${name};
`;

  return esformatter.format(uglyComponent);
};

const createReactComponents = svgPath => {
  const name = path.basename(svgPath, '.svg');
  const svg = fs.readFileSync(svgPath, 'utf-8');
  $ = cheerio.load(svg, {
    xmlMode: true
  });
  const $svg = $('svg');
  cleanAttributes($svg, $);
  cleanComments($svg);
  const iconSvg = $svg.html();
  const viewBox = $svg.attr('viewBox');
  const location = path.join('components', name + '.js');
  components[name] = location;
  const componentTemplate = getComponentTemplate(name, viewBox, iconSvg);

  fs.writeFileSync(path.join(rootDir, location), componentTemplate, 'utf-8');
  console.log(`created: ${path.join('.', location)}`);
};

const createIndexFile = () => {
  const iconsModule = Object.keys(components).map(name => {
    const loc = `./${components[name].replace('.js', '')}`;
    return `export {default as ${name}} from '${loc}';`;
  }).join('\n') + '\n';
  fs.writeFileSync(path.join(rootDir, 'index.js'), iconsModule, 'utf-8');
  console.log(path.join('.', 'index.js'));
};

glob(rootDir + `/${svgDir}/**/*.svg`, (err, icons) => {
  if (err) {
    console.error(err);
    return;
  }

  cleanPrevious();
  icons.forEach(createReactComponents);
  createIndexFile();
});

