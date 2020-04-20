var mysql = require('mysql')
// Let’s make node/socketio listen on port 3000
var io = require('socket.io').listen(3003)
// Define our db creds
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'blog',
    password: ''
})

// Log any errors connected to the db
db.connect(function (err) {
    if (err) console.log(err)
});
// Define/initialize our global vars
var notes = [];
var isInitNotes = false;
var socketCount = 0;
global.new_id = 0;
global.new_id_new = 0;
global.arr = [];
global.arr2 = [];
io.sockets.on('connection', function (socket) {
    socket.emit('echo', 'server send message');
    setInterval(function () {
        db.query('SELECT ID FROM messages WHERE status="PUBLISHED" ORDER BY ID DESC LIMIT 1', function (err, row) {
            if (err) throw err;
            socket.emit('echo', global.arr);
            global.new_id = row[0].ID;
            console.log(global.new_id_new, global.new_id);
            if (new_id_new != new_id) {
                socket.emit('echo', row[0].ID + ' --- --- \n');
                global.new_id_new = global.new_id;
                db.query('SELECT * FROM messages WHERE status="PUBLISHED" ORDER BY ID ASC LIMIT 100', function (err, rows) {
                    if (err) throw err;
                    console.log('Data received from Db:\n');
                    console.log(rows);
                    global.arr = rows;
                    //socket.emit('echo', rows);
                    //socket.emit('showrows', rows);
                });
				db.query('SELECT id, name, avatar FROM users', function (err, rows2) {
					if (err) throw err;
					console.log('Data received from Db:\n');
					console.log(rows2);
					global.arr2 = rows2;
				});
            }
            for( msg in global.arr )
            {
                for( usr in global.arr2 )
                {
                    if( global.arr[msg].sender_id == global.arr2[usr].id ) {
                        global.arr[msg].name = global.arr2[usr].name;
                        global.arr[msg].avatar = global.arr2[usr].avatar;
                    }
                }
            }
            //console.log('result data:', global.arr);
        });
    }, 2000);
    console.log('connected2');
});
