const { Console } = require('console');
const express = require('express');
const session = require('express-session');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = 8080;

var highesttenderprice = 0;
var highesttenderid = "";
var highesttendertime = "";

const Playerlist = [1252156,23e6426];
const MapBanPlayerlist = [1252156,23e6426];
var MapBanList=[false,false,false,false,false,false,false,false,false,false];
var BanedMapNum = 0;
var LatestBanPlayer;

function PlayerCodeCheck(PlayerCode)
{
	for(var i = 0; i < Playerlist.length; i++)
	{
		if(Playerlist[i] == PlayerCode)
			return true;
		else if(i == Playerlist.length - 1)
			return false;
	}
}
function MapBanPlayerCodeCheck(PlayerCode)
{
	for(var i = 0; i < MapBanPlayerlist.length; i++)
	{
		if(MapBanPlayerlist[i] == PlayerCode)
			return true;
		else if(i == MapBanPlayerlist.length - 1)
			return false;
	}
	
}

server.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

io.on('connection', (socket) => {
	console.log('새로운 사용자가 연결되었습니다.');
	//io.emit('chat message', "Connected");
	// 클라이언트에서 보낸 채팅 메시지 수신
	socket.on('tenderstart', (msg) => {
		highesttendertime = msg;
		io.emit('tenderstart', msg);
	});
	socket.on('tender', (msg) => {
		const id = msg.substr(25,7);

		if(!PlayerCodeCheck(id))
			return;

		const price = msg.substr(33);
		const time = msg.substr(0,24);
		if(new Date(time) - new Date(highesttendertime) < 30000)
		{
			if(price > highesttenderprice && highesttenderid != id)
			{
				console.log('입찰가:', price);
				console.log('입찰자:', id);
				highesttenderid = id;
				highesttenderprice = price;
				highesttendertime = time;
				io.emit('tender', msg);
			}
		}
	  	else
	  	{
			console.log('입찰 실패:', msg);
	  	}
	});
	socket.on('MapBan', function (data) {
		
		const playercode = data.substr(0,7);

		if(!MapBanPlayerCodeCheck(playercode))
			return;

		if(LatestBanPlayer != playercode)
		{
			LatestBanPlayer = playercode;
			const Banindex = data.substr(8);
			MapBanList[Banindex] = true;
			BanedMapNum++;
			io.emit('MapBan', Banindex);
			console.log(BanedMapNum);
			if(BanedMapNum == 6)
			{
				io.emit('MapBanEnd',Math.floor(Math.random()*4+1), MapBanPlayerlist[Math.floor(Math.random()*2+1)]);
			}
		}
	});
	socket.on('MapBanStart', function () {
		MapBanList=[false,false,false,false,false,false,false,false,false,false];
		LatestBanPlayer = MapBanPlayerlist[Math.floor(Math.random()*2+1)]
		io.emit('MapBanStart', LatestBanPlayer);
		BanedMapNum = 0;
	});
	socket.on('MapBanStartHost', function () {
		MapBanPlayerlist[0] = Math.floor(Math.random()*250539758+17895697).toString(16);
		MapBanPlayerlist[1] = Math.floor(Math.random()*250539758+17895697).toString(16);
		io.emit('MapBanStartHost', MapBanPlayerlist);
	});
});

app.use(session({
	secret: '145n98f23n23f98hdf',  
	resave: false,   
	saveUninitialized: false,
	cookie: {
	  maxAge: 60 * 60 * 1000
	}
}));

app.get('/auction/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/mapban/', function(req, res) {
    res.sendFile(__dirname + '/mapban/room/index.html');
});
app.get('/mapbanmain/', function(req, res) {
    res.sendFile(__dirname + '/mapban/index.html');
});
app.get('/mapbanhost/', function(req, res) {
    res.sendFile(__dirname + '/mapban/hostroom/index.html');
});

app.use(express.static('public'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

app.post('/signin', (req, res) => {
	const signinplayercode = req.body.PlayerCode;
	if(MapBanPlayerCodeCheck(signinplayercode))
	{
		res.write("<script>sessionStorage.setItem('CodeAuth','"+signinplayercode+"'); document.location.href = '/mapban/';</script>");
	}
	else
	{
		res.write("<script>document.location.href = '/mapbanmain/'; alert('입장 코드가 유효하지 않습니다');</script>");
	}
	//console.log(PlayerCodeCheck(signinplayercode));
	//console.log(MapBanPlayerlist);
	//console.log(MapBanPlayerlist[0] == req.body.PlayerCode);
});