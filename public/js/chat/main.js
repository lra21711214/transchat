$(document).ready(function(){
  socket = io({path: '/message'});
  var countOption = '106';
  function openSelect() {
    var heightSelect = $('.select').height();
    var j = 1;
    $('.select .lang').each(function(){
      $(this).addClass('reveal');
      $(this).css({
        'box-shadow': '0 1px 1px rgba(0,0,0,0.1)',
        'left': '0',
        'right': '0',
        'top': j * (heightSelect + 1) + 'px'
      });
      $('.select').css({
        'top': '0',
        'transform': 'translateY(0)',
        'transition': 'all 350ms ease-in-out',
        '-o-transition': 'all 350ms ease-in-out',
        '-ms-transition': 'all 350ms ease-in-out',
        '-moz-transition': 'all 350ms ease-in-out',
        '-webkit-transition': 'all 350ms ease-in-out'
      });
      $('.selection>span').css({'top':'18px'});
      j++;
    });
    $('#scroll').css({'width': '300px',
      'transition': 'all 300ms ease-in-out',
      '-o-transition': 'all 300ms ease-in-out',
      '-ms-transition': 'all 300ms ease-in-out',
      '-moz-transition': 'all 300ms ease-in-out',
      '-webkit-transition': 'all 300ms ease-in-out'
    });
    $('#lang_check').css({
      'opacity': '0',
      'transition': 'all 200ms ease-in-out',
      '-o-transition': 'all 200ms ease-in-out',
      '-ms-transition': 'all 200ms ease-in-out',
      '-moz-transition': 'all 200ms ease-in-out',
      '-webkit-transition': 'all 200ms ease-in-out'
    });
    $('.select').css({'width':'300px'});
    $('.selection>p').css({'width': '240px'});
  }

  function closeSelect(){
    var i = 0;
    $('.select .lang').each(function(){
      $(this).removeClass('reveal');
      if (i < countOption - 3) {
        $(this).css('top', 0);
        $(this).css('box-shadow', 'none');
      }
      else if (i === countOption - 3) {
        $(this).css('top', '3px');
        $(this).css('box-shadow', '0 1px 1px rgba(0,0,0,0.1)');
      }
      else if (i === countOption - 2) {
        $(this).css({
          'top': '7px',
          'left': '2px',
          'right': '2px'
        });
        $(this).css('box-shadow', '0 1px 1px rgba(0,0,0,0.1)');
      }
      else if (i === countOption - 1) {
        $(this).css({
          'top': '11px',
          'left': '4px',
          'right': '4px'
        });
        $(this).css('box-shadow', '0 1px 1px rgba(0,0,0,0.1)');
      }
      $('.select').css({
        'top': '50%',
        'transform': 'translateY(-50%)',
        'transition': 'all 380ms ease-in-out 100ms',
        '-o-transition': 'all 380ms ease-in-out 100ms',
        '-ms-transition': 'all 380ms ease-in-out 100ms',
        '-moz-transition': 'all 380ms ease-in-out 100ms',
        '-webkit-transition': 'all 380ms ease-in-out 100ms'
      });
      $('.selection>span').css({'top':'19px'});
      i++;
    });
    if($('.selection>p>span').text() != 'Select language'){
      $('#scroll').css({
        'width': '305px',
        'transition': 'all 300ms ease-in-out 500ms',
        '-o-transition': 'all 300ms ease-in-out 500ms',
        '-ms-transition': 'all 300ms ease-in-out 500ms',
        '-moz-transition': 'all 300ms ease-in-out 500ms',
        '-webkit-transition': 'all 300ms ease-in-out 500ms'
      });
      $('#lang_check').css({
        'opacity': '1',
        'transition': 'all 400ms ease-in-out 500ms',
        '-o-transition': 'all 400ms ease-in-out 500ms',
        '-ms-transition': 'all 400ms ease-in-out 500ms',
        '-moz-transition': 'all 400ms ease-in-out 500ms',
        '-webkit-transition': 'all 400ms ease-in-out 500ms'
      });
      $('.select').css({'width':'250px'});
      $('.selection>p').css({
        'width': '200px',
        'transition': 'all 520ms ease-in-out',
        '-o-transition': 'all 520ms ease-in-out',
        '-ms-transition': 'all 520ms ease-in-out',
        '-moz-transition': 'all 520ms ease-in-out',
        '-webkit-transition': 'all 520ms ease-in-out'
      });
    }
  }

  var reverseIndex = countOption;
  $('.select .lang').each(function(){
    $(this).css('z-index', reverseIndex);
    reverseIndex = reverseIndex - 1;
  });
  closeSelect();

  $('.selection').click(function(){
    $(this).toggleClass('open');
    if($(this).hasClass('open') === true){ 
      openSelect();
    }else{ 
      closeSelect();
    }
  });
});
  $('.lang').click(function(){
    $('.selection p span').html($(this).find('p').html());
    $('.selection p span').attr('data-select_lang', $(this).data('lang'));
    $('.selection').click();
  });

  $('#lang_check').click(function(){
    $('#language_select').css({
      'left':'-100%',
      'transition': 'all 400ms ease-in-out 100ms',
      '-o-transition': 'all 400ms ease-in-out 100ms',
      '-ms-transition': 'all 400ms ease-in-out 100ms',
      '-moz-transition': 'all 400ms ease-in-out 100ms',
      '-webkit-transition': 'all 400ms ease-in-out 100ms'
    });
    socket.emit('lang', $('#show_lang').data('select_lang'))
    resize();
  });
$(function(){
  	socket.on('sys', function(msg){
    	if(msg.roomid != null){
      		$('#join_user').css('display','block');
      		qrcode(msg.roomid);
    	}else if(msg == 'join_user'){
      		$('#join_user').css('display','none');
          $('#main_content').css('display','block');
    	}else if(msg == 'redirect'){
      		location.href='https://slk.pw';
    	}else if(msg.user_out != null){
      		$('#join_user').css('display','block');
      		qrcode(msg.roomid);
    	}
      resize();
  	});
  	$('form').submit(function(e){
		e.preventDefault();
		var message = $('#message_send').val();
		if(message != ''){
			socket.emit('message', message, $('#show_lang').data('select_lang'));
			var msg_check = msgcheck(message);
			$('#messages_list').append('<div class="message"><li class="send_msg li_msg"><p>'+msg_check+'</p></li></div>');
	    	$('#messages_list').scrollTop($("#messages_list")[0].scrollHeight);
	    	$('#message_send').val('');
	    	return false;
	    }
	});
  socket.on('message', function(msg){
  	if(msg == 'error'){
        $('#messages_list').append('<div class="message"><li class="opponent_msg li_msg"><p>Message is too long.</p></li></div>');
  	}else if(msg == 'servererror'){
        $('#messages_list').append('<div class="message"><li class="opponent_msg li_msg"><p>Server error</p></li></div>');
    }else if(msg.user_lang == msg.trans_lang){
    		var msg_check = msgcheck(msg.original_data);
    		$('#messages_list').append('<div class="message"><li class="opponent_msg li_msg"><p>'+msg_check+'</p></li></div>');
  	}else{
    		var msg_check = msgcheck(msg.trans_data);
    		$('#messages_list').append('<div class="message"><li class="opponent_msg li_msg show_original" style="cursor: pointer;"><p style="display:block;" class="trans_msg">'+msg_check+'</p><p style="display:none;" class="original_msg">'+msg.original_data+'</p></li></div>');
  	}
  });
});
function qrcode(roomid){
  	var qrtext = window.location.protocol + '//' + window.location.host+'/transroom/'+roomid;
  	var utf8qrtext = unescape(encodeURIComponent(qrtext));
  	$("#qrcode").html("");
  	$("#qrcode").qrcode({text:utf8qrtext});
    $('#main_content').css('display','none');
}
function msgcheck(str) {
  	var regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g; // ']))/;
  	var regexp_makeLink = function(all, url, h, href) {
    	return '<a href="h' + href + '" target="_blank">' + url + '</a>';
  	}
  	return str.replace(regexp_url, regexp_makeLink);
}
window.addEventListener('resize', function(){
	resize();
}, false);
function resize(){
	var form_coordinate = $('form').offset();
	var msg_list = document.getElementById("messages_list");
	$('#fast_msg').css("margin-top",$("#messages_list")[0].scrollHeight);
	$('#messages_list').height(form_coordinate.top);
	$('#messages_list').scrollTop($("#messages_list")[0].scrollHeight);
	console.log(form_coordinate);
	console.log($("#messages_list")[0].scrollHeight);
}
$(document).on("click", ".show_original", function(){
  var original_data = $(this).children('.original_msg');
  var trans_data = $(this).children('.trans_msg')
  if(original_data.css('display') == 'block'){
    original_data.css({'display':'none'});
    trans_data.css({'display':'block'});
    $(this).next('div').remove();
  }else{
    original_data.css({'display':'block'});
    trans_data.css({'display':'none'});
    $(this).parent().append('<div class="original_msg_copy" style="display: -webkit-flex;display: flex;-webkit-align-items: center;align-items: center;-webkit-justify-content: center;justify-content: center;background:#fff; border-radius: 25px;height: 46px;margin: auto 0 auto 5px;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;max-width: 25%;"><p style="padding: 10px 18px;">copy</p></div>');
  }
});
$(document).on('click','.original_msg_copy',function(){
  console.log($(this).prev('li').children('.original_msg').text());
  var copy = $(this).prev('li').find('.original_msg');
  window.getSelection().selectAllChildren(copy[0]);
  document.execCommand('copy');
});
$(window).on('beforeunload', function(e){return 'The message will not be saved.';});