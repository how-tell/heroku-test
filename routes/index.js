
var request = require("request");
//var list = []; //기본으로 트위터와 랭킹은 들어있어야함!! 현재 사용하지 않음..cause  index.ejs에서 db 건들이는 기능(삭제) 때문에
var moment = require('moment');
var jsonfile = require('jsonfile');




module.exports = function(app, io) {
  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/play', function(req, res) {
    res.render('play');
  });

  io.on('connection', function(socket) {
    //socket.emit('start', list);
    console.log('connected');

    socket.on('scrolldata',function(){
      //console.log("요청---받았다");
      var scrollfile = './scroll.json';
      jsonfile.readFile(scrollfile, function(err, scroll) {
        io.emit('scroll',scroll);
        //console.log("요청-ㅇㅇㅇㅇ--받았다");
      });
    });

    socket.on('rankingdata',function(){
      var rankingfile = './ranking.json';
      jsonfile.readFile(rankingfile, function(err, ranking) {
        io.emit('ranking',ranking);
      });
    });

    socket.on('onairDB',function(playobjarray){  //[{ID:  , time: seconds}]
      var playtime = 0;
      var interval = setInterval(function() {
          if (playobjarray.length === 0){
              clearInterval(interval);
          }else if (playtime === playobjarray[0].time) {
               playobjarray.shift();
               playtime = 0;
          }else {
             playtime = playtime + 1;
             var IDtime = {ID:playobjarray[0].ID,time:playtime};

          }
          io.emit('playing',IDtime);
        },1000);
    });




    socket.on('ID_send', function(itemID) {
      //console.log('ID received'+itemID);
      var tubeurl = 'https://www.googleapis.com/youtube/v3/videos?id='+
                     itemID +
                     '&key=AIzaSyBq3PA7ExjvLA0I2igVnqWikwLtgRzuGS8&fields=items(id,snippet(title,thumbnails(default)),contentDetails(duration))&part=snippet,contentDetails';
       request(tubeurl, function(error, response, body) {
            if (error) throw error;
            var bodys = JSON.parse(body);
            var item = {};
            if (bodys.items.length !== 0 ){
            item.thumb = bodys.items[0].snippet.thumbnails.default.url;
            item.id = bodys.items[0].id;
            item.title = bodys.items[0].snippet.title;
            item.duration = moment.duration(bodys.items[0].contentDetails.duration).asSeconds();

                if (item.title !== undefined && item.title !== null && item.duration >= 30){
                io.emit('totable', item);


                //list.push(item);  //list배열이 대체할 수 있을 것인가?!!!!!!!  현재 사용하지 않음..cause index.ejs에서 삭제 기능떄문에




              } else if (item.duration < 30){
                  io.emit('errortime');
                }
                else {
                  io.emit('errorURL');
                }
              }else {io.emit('errorURL');}
            //console.log(list.length + " " + item);
          });


              //if (item.id !== '') {


/*
      var urlInfo = 'https://www.youtube.com/oembed?url=' +
      data.url + '&format=json';

      request(urlInfo, function(err, res, body) {
        if (!err && res.statusCode == 200) {
          var info = JSON.parse(body);
          data['info'] = info;
          io.emit('added', data);
          list.playlist.push(data);
        }
        else {
          data['info'] = {'title': ''};
          io.emit('added', data);
          list.playlist.push(data);
        }
      }) */

    });

    socket.on('query', function(data) {
      socket.emit('start', list);
    })

    socket.on('delete', function() {
      console.log('Deleted song');
      socket.broadcast.emit('delete');
      if (list.playlist.length > 0) {
        list.playlist.shift();
      }
    })
  });

};
