var io = require('socket.io-client');
var Handlebars = require('handlebars');
var socket = io();
var $ = require("jquery");
var moment = require('moment');
//var bootstrapTable = require('bootstrap-table/dist/bootstrap-table.js');
//var helper = require('../helper.js');
//var request = require('unirest');
//var ranking = require('../ranking.json');
//var scroll = require('../scroll.json');


//console.log(scroll);


//현재시간 설정
function update() {
    $('#clock').text(moment().format('YYYY MMMM D H:mm:ss'));
    }
setInterval(update, 1000);

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname === '/') {
//1.방송리스트 처리
    var itemsend = document.getElementById('itemsend');
    var item = document.getElementById('item');
    itemsend.addEventListener('click', sendData);
    item.addEventListener('keyup', function(evt) {
      if (evt.keyCode == 13)
        sendData();
    });





  } else if (window.location.pathname === '/play') {



  }
});






function sendData() {                         //라우터로 보내는 펑션
  var item = document.getElementById('item');
  var itemID = matchYoutubeUrl(item.value);
    if('undefined' !== item.value && itemID !== false){
        socket.emit('ID_send', itemID);
        item.value = "";
    }else{
        $('#youtubeBtext').html('&nbsp; &nbsp;&nbsp; &nbsp;URL이 잘못되었습니다&nbsp; &nbsp;&nbsp; &nbsp;');
        setTimeout(function(){$('#youtubeBtext').html('');},1000);
    }
}

function matchYoutubeUrl(url) {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11,})(?:\S+)?$/;
  return (url.match(p)) ? RegExp.$1 : false;
}

socket.on('errorURL', function() {
  $('#youtubeBtext').html('&nbsp; &nbsp;&nbsp; &nbsp;URL이 잘못되었습니다&nbsp; &nbsp;&nbsp; &nbsp;');
  setTimeout(function(){$('#youtubeBtext').html('');},1000);
});
socket.on('errortime', function() {
  $('#youtubeBtext').html('&nbsp; &nbsp;&nbsp; &nbsp;30초 이상의 영상을 넣어주세요&nbsp; &nbsp;&nbsp; &nbsp;');
  setTimeout(function(){$('#youtubeBtext').html('');},1000);
});



/*

  var videoID = matchYoutubeUrl(item);
  //var apikey = AIzaSyBq3PA7ExjvLA0I2igVnqWikwLtgRzuGS8;
  if('undefined' !== item && videoIDd !== false){
      var tubeurl = 'https://www.googleapis.com/youtube/v3/videos?id='+
                     videoID +
                     '&key=AIzaSyBq3PA7ExjvLA0I2igVnqWikwLtgRzuGS8&fields=items(id,snippet(title,thumbnails(default)),contentDetails(duration))&part=snippet,contentDetails';
     request(tubeurl, function(error, response, body) {
          if (error) throw error;
          var bodys = JSON.parse(body);
          var items = {};
          item.id = bodys.items[0].id;
          item.title = bodys.items[0].snippet.title;
          item.thumb = bodys.items[0].snippet.thumbnails.default.url;
          item.duration = bodys.items[0].contentDetails.duration;
              if (item.id !== '') {
                  //socket.emit('add DB', item);
                  item.value = "";
                  console.log(items);
                  //addToList(items);
                  }
    });
  }else {

  }
}






function sendData() {
  var songText = document.getElementById('songText');
  var urlPre = 'http://img.youtube.com/vi/' + parseAddress(songText.value) + '/0.jpg';
  var data = {url: songText.value, prev: urlPre};
  if (data.url !== '') {
    socket.emit('add song', data);
    songText.value = "";
  }
}


/*
document.addEventListener('DOMContentLoaded', function() {

  if (window.location.pathname === '/') {
    var playlistT = document.getElementById('playlistTemplate');
    var source   = playlistT.innerHTML;
    var template = Handlebars.compile(source);




    socket.on('start', function(data) {
      playlistT.innerHTML = template(data);
    });

    var send = document.getElementById('sendButton');
    var songText = document.getElementById('songText');
    send.addEventListener('click', sendData);
    songText.addEventListener('keyup', function(evt) {
      if (evt.keyCode == 13)
        sendData();
    });

    socket.on('added', function(data) {
      addToList(data);
    });

    socket.on('delete', function() {
      console.log('delete on list');
      var t = document.querySelector('#playlist');
      if (t.children.length > 0)
        t.removeChild(t.children[0]);
    });

  } else if (window.location.pathname === '/play') {
    window.socket = socket;

    socket.on('start', function(data) {
      for (var i = 0, f; f = data.playlist[i]; ++i) {
        window.data.push(parseAddress(f.url));
      }
      if (window.data.length > 0) {
        player.loadVideoById(window.data.shift());
      }
    });

    socket.on('added', function(data) {
      window.data.push(parseAddress(data.url));
      if (player.getPlayerState() < 1)
        player.loadVideoById(window.data.shift());
    });

    socket.on('delete', function() {
      console.log('delete on player');
      window.data.shift();
    });
  }

});
*/
