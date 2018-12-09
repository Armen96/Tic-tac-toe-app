var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var mysql = require('mysql');

var con = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'tictac'
});
con.connect();


io.on('connection', function(socket){

    socket.on('start game', function(res){
        io.emit('start game',res);
    });

    socket.on('can start', function(res){
        io.emit('can start',res);
    });

    socket.on('choose type', function(res){
        io.emit('choose type',res);
    });

    socket.on('chat message', function(msg){
       io.emit('chat message', msg);
    });

   socket.on('game over', function(msg){
        io.emit('game over',msg);
    });

   socket.on('create room',function(roomName){

       var sql = "INSERT INTO rooms (`name`) VALUES ('"+roomName.room+"')";
       con.query(sql, function (err, result) {
           if (err) {
               console.log(err.message);
           } else {
             //  console.log('success');
           }
       });

       // var rooms = [];
       // var selectRooms = "SELECT * FROM rooms";
       // con.query(selectRooms,function(err,result){
       //     if(err){
       //         console.log(err.message);
       //     }else{
       //         for(var i=0;i<result.length;i++){
       //             rooms.push(result[i].name);
       //         }
       //         io.emit('create room', rooms);
       //     }
       // });
       io.emit('create room', roomName);

   });

    socket.on('delete room',function(roomName){

        var deleteQuery = "DELETE FROM rooms WHERE `name` = '"+roomName.room+"'";
        con.query(deleteQuery, function (err, result) {

            if (err) {
                console.log(err.message);
            } else {
             //   console.log('deleted');
            }
        });

        io.emit('delete room', roomName);
    });


    socket.on('free rooms',function(msg){
        var rooms = [];
        var selectRooms = "SELECT * FROM rooms";
        con.query(selectRooms,function(err,result){
            if(err){
                console.log(err.message);
            }else{
                for(var i=0;i<result.length;i++){
                    rooms.push(result[i].name);
                }
                io.emit('free rooms', rooms);
            }
        });
    });

    socket.on('proccesing',function(res){
        io.emit('proccesing',res);
    })

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
