var phantom = require('phantom');
var fs = require('fs');
var cheerio = require('cheerio');
var v = require('voca');


      phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
          page.open('http://www.crowdpapa.com/view/user/main/main.do').then(function(status) {
            //console.log(status);
              setTimeout(function () {
                  page.property('content').then(function(content) {

                    const $ = cheerio.load(content,{ decodeEntities: false});

                    const $contents = $('div#contents p.title');
                    const $content = $('div#contents div.type_txt');

                    scroll = new Array();

                    for (i = 0; i < $contents.children().length; i++) {
                      var scrollobj = {};
                    const $contitle = $contents.children().eq(i);
                    const $consource = $content.children().eq(i*2+1);

                    let title = $contitle.text();
                    title = v.replaceAll(title, '\t', '');
                    title = v.replaceAll(title, '\r\n', '');
                    scrollobj.title = v.trim(title);
                    scrollobj.source = $consource.text();
                    scroll[i] = scrollobj;
                    }
                    fs.writeFile("./scroll.json", JSON.stringify(scroll), (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    };
                    console.log("scroll File has been created");
                    });
                    page.close();
                    ph.exit();
                  });
              }, 5000);
          });
        });
      });
