var phantom = require('phantom');
var fs = require('fs');
var cheerio = require('cheerio');
var v = require('voca');


      phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
          page.open('http://www.crowdpapa.com/view/user/issue/issue.do').then(function(status) {
            //console.log(status);
              setTimeout(function () {
                  page.property('content').then(function(content) {
                    const $ = cheerio.load(content,{ decodeEntities: false});
                    const $ranking = $('div#type1');

                    ranking = new Array();

                    for (i = 0; i < $ranking.children().length/2; i++) {
                    var rankingobj = {};
                    const $rr = $ranking.children().eq(i*2);

                    rankingobj.rank = i+1;

                    let ranktitle = $rr.text();
                    if (i+1 < 10) {
                        ranktitle = ranktitle.substring(1);
                    } else {
                       ranktitle = ranktitle.substring(2);
                    }
                    rankingobj.text = ranktitle;
                    ranking[i] = rankingobj;
                    }
                    fs.writeFile("./ranking.json", JSON.stringify(ranking), (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    };
                    console.log("ranking File has been created");
                    });
                    page.close();
                    ph.exit();
                  });
              }, 5000);
          });
        });
      });
