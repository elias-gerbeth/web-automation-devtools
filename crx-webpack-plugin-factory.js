var fs = require('fs');
var ncp = require('ncp').ncp;

const generatePlugin = (sourceFolder, addHotReload, copyStaticFiles, fixSourceFolder = true) => {
  return {
    pre: function () {},
    config: function (cfg) {
      return cfg;
    },
    post: function () {
      const staticPath = 'crx-static';
      const distPath = 'dist/crx';
      const indexHtmlFile = distPath + '/' + sourceFolder + '/index.html';

      // load index.html file
      var indexHtml = fs.readFileSync(indexHtmlFile).toString();

      // fix background page links
      if (fixSourceFolder) {
        indexHtml = fixSourceTagsToFolder(indexHtml, sourceFolder);
        console.log('fixed relative links to index.html');
      }

      // add hotreload
      if (addHotReload) {
        indexHtml = addHotReloadToIndex(indexHtml);
        console.log('added hotreload.js to index.html');
      }

      fs.writeFileSync(indexHtmlFile, indexHtml);

      if (copyStaticFiles) {
        ncp(staticPath, distPath, () => {
          console.log('all ' + staticPath + ' files copied to ' + distPath);
          console.log('reloading Chrome Extension');
          //trigger reload
          fs.writeFileSync(distPath + '/dev.reload', '');
        });
      } else {
        console.log('reloading Chrome Extension');
        //trigger reload
        fs.writeFileSync(distPath + '/dev.reload', '');
      }
    }
  };
};

function addHotReloadToIndex(html) {
  return html.replace(/<\/html>/, '<script src="hotreload.js"></script></html>');
}

function fixSourceTagsToFolder(html, sourceFolder) {
  return html.replace(/src="/g, `src="${sourceFolder}/`);
}

exports.generatePlugin = generatePlugin;
