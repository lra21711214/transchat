var express = require('express')
var app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http,{path:'/message'})
var uuid = require('node-uuid')
var {PythonShell} = require('python-shell')
app.use(express.static('public'))
app.set("view engine", "ejs")
var room = []
var lang = {}

app.get('/', function(req,res){
	res.render(__dirname+'/templates/home/index.ejs')
})

app.post('/transroom', function(req,res){
	var roomid = uuid.v4().split('-').join('')
	room.push(roomid)
	res.redirect('/transroom/'+roomid)
})

app.get('/transroom/:roomid', function(req, res){
	if(room.includes(req.params.roomid)){
		res.render(__dirname+'/templates/chat/index.ejs')
	}else{
		res.redirect('/')
	}
})

io.on('connection', function(socket){
	var roomid = socket.handshake.headers.referer.split('/')[4]
	if(roomid != null){
 		socket.join(roomid)
 		var room_user_count = io.sockets.adapter.rooms[roomid].length
 		if(room_user_count == 1){
 			io.to(socket.id).emit('sys', {'roomid':roomid})
 		}else if(room_user_count == 2){
 			socket.broadcast.to(roomid).emit('sys', 'join_user')
 		}else if(room_user_count >= 3){
 			io.to(socket.id).emit('sys', 'redirect')
 		}
 		
		socket.on('message', function(msg,sendlang){
			var client_list = io.sockets.adapter.rooms[roomid].sockets
			for (var clientId in client_list ) {
				if(socket.id != clientId && lang[clientId]){
					trans_mes(msg, lang[socket.id], lang[clientId], clientId)
				}
			}
		})
		
		socket.on('lang', function(user_lang){
			lang[socket.id] = user_lang
		})
		
		socket.on('disconnect', function(){
			socket.leave(roomid)
			if(io.sockets.adapter.rooms[roomid] == null){
				var list_room_id = room.indexOf(roomid)
				if (list_room_id > -1) {
					room.splice(list_room_id, 1)
				}
			}else{
				if(io.sockets.adapter.rooms[roomid].length == 1){
					socket.broadcast.to(roomid).emit('sys', {'user_out':roomid})
				}
			}
  		})
  	}
})

function trans_mes(mes, before_lang, trans_lang, send_user){
	if(1300 >= mes.length){
		var pyshell = new PythonShell('./python/translate.py')
		pyshell.send(JSON.stringify({'transdata':mes,'translang':trans_lang,'sendlang':before_lang}))
		pyshell.on('message', function(data){
			if(data == 'translate_error'){
				io.to(send_user).emit('message', 'servererror')
			}else{
				io.to(send_user).emit('message', JSON.parse(data))
			}
		})
	}else{
		io.to(send_user).emit('message', 'error')
	}
}

http.listen(8080, function(){
	console.log('listening on *:8080')
})