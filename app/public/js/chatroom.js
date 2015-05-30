;'use strict';
(function(){
  var socket = io();
  window.socket = socket;
  socket.on('webMessage', function(data){
      console.dir(data);
      var type = data.type || '';
      switch(type){
        case 'chat':
          appendChat(data);
          break;
        case 'login':
          appendLogin(data);
          break;
        case 'logout':
          appendLogout(data);
          break;
        case 'nologin':
          doLogin(data);
        case 'onlineUsers':
          appendOnlineUsers(data);
          break;
        default: break;
      }
    });

  function doLogin(data){
    socket.emit('webMessage', {type: 'login', username: username, userID: userID });
    if(data){
      socket.emit('webMessage', data);
    }
  }
  function appendChat(data){
    var _date = new Date(data.time||Number(data.meta.createAt)||new Date().getTime());
    var time_str = _date.getHours() + ':' + _date.getMinutes() + ':' + _date.getSeconds();
    if(data.username == username){
      $('#chatPanel').append("<li class='list-group-item' style='text-align:right;'>"+ data.username + " : " + data.message + "<span style='margin-left:10px;color:gray;'>"+time_str+"</span>" + "</li>");
    }else{
      $('#chatPanel').append("<li class='list-group-item'>" + "<span style='margin-right:10px;color:gray;'>"+time_str+"</span>" + data.username + " : " + data.message +"</li>");
    }
    $('#chatPanel')[0].scrollTop = $('#chatPanel')[0].scrollHeight;
  }
  function appendLogin(data){
    $('#chatPanel').append("<li class='list-group-item' style='text-align:center;'>"+ data.username + " : " + data.msg +"</li>");
    $('#chatPanel')[0].scrollTop = $('#chatPanel')[0].scrollHeight;
  }
  function appendLogout(data){
    $('#chatPanel').append("<li class='list-group-item' style='text-align:center;'>"+ data.username + " : " + data.msg +"</li>");
    $('#chatPanel')[0].scrollTop = $('#chatPanel')[0].scrollHeight;
  }
  function appendOnlineUsers(data){
    $('#listOnlineUser').html('');
    data.users.forEach(function(el, index){
      $('#listOnlineUser').append("<div class='list-group-item'><a href='#' id='"+ el +"' class='ou'>"+ el +"</a></div>");
    });
  }
  function sendMsg(){
    if($('#inputMessage').val()){
      socket.emit('webMessage', { type: 'chat', msg: $('#inputMessage').val(), username: username });
      $('#inputMessage').val('');
      $('#inputMessage').focus();
    }
  }
  //回车事件
  $(window).keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $('#inputMessage').focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      sendMsg();
    }
  });
  //发送按钮事件
  $('#btnSend').on('click', sendMsg);
  //定时任务，请求在线用户
  window.mtimer = function(){
    window.socket.emit('webMessage', {type: 'onlineUsers'});
  };
  setInterval("window.mtimer()", 10000);

  // 如果未登录，就先登录再发送，其中data是未登录前发送到服务器，并由服务器又原样返回的
  doLogin();
  $('.ou').on('click', function(){alert(321);});
})();