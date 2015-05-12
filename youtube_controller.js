var milkcocoa = new MilkCocoa("bluei9h166if.mlkcca.com");
var dsVideo01 = milkcocoa.dataStore("video01");
var dsChat = milkcocoa.dataStore("chat");

var pName, msg, board;

//現在配信中の動画IDを持つdataStore
var dsId = "";
var vId = "islF6nUZ0XQ";

//Youtube動画情報
var tag;
var firstScriptTag;
var player;

//画面ロード時
window.onload = function(){
	pName = document.getElementById("nm");
	msg = document.getElementById("msg");
	board = document.getElementById("board");

	loadChatData();
	loadVideoData();
}

//チャット情報ロード
function loadChatData() {
	dsChat.stream().sort("desc").size(100).next(function(err, datas) {
		for(var i=0; i < datas.length; i++) {
			addText(datas[i].value.name, datas[i].value.msg, datas[i].value.inputdatetime);
		}
	});
}

//送信ボタン
function clickSend() {
	var txtName = pName.value;
	var txtMsg = msg.value;
	sendMsg(txtName, txtMsg);
}

//メッセージ送信
function sendMsg(txtName, txtMsg){
	dsChat.push({"name" : txtName , "msg" : txtMsg, "inputdatetime" : toLocaleString(new Date())},function(data){
		console.log("送信完了!");
		msg.value = "";
	});
}

//チャット更新時
dsChat.on("push",function(data){
	addText(data.value.name, data.value.msg, data.value.inputdatetime);
});

//チャットメッセージを画面に反映
function addText(txtName, txtMsg, inputtime){
	var msgDom = document.createElement("li");
	msgDom.innerHTML = txtName + ": " + txtMsg + " (" + inputtime + ")";
	board.insertBefore(msgDom, board.firstChild);
}

// This code loads the IFrame Player API code asynchronously.
tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
/*function onYouTubeIframeAPIReady() {
	//動画情報読込
	loadVideoData();

	//プレイヤー生成
	player = new YT.Player('player', {
	height: '488',
	width: '800',
	videoId: vId,
	events: {
		//'onReady': onPlayerReady,
		'onStateChange': onPlayerStateChange
		}
	});	
}*/

//動画情報ロード
function loadVideoData() {
	dsVideo01.stream().sort("desc").size(1).next(function(err, datas) {
		if (datas.length > 0) {
			dsId = datas[0].id;
			vId = datas[0].value.vid;
		} else {
			dsId = "";
			vId = "islF6nUZ0XQ";
		}
		
		loadPlayer(vId);
	});
}

function loadPlayer(v_Id) {
	//プレイヤー生成
	player = new YT.Player('player', {
	height: '360',
	width: '640',
	videoId: v_Id,
	events: {
		'onReady': onPlayerReady,
		'onStateChange': onPlayerStateChange
		}
	});	
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();
}

// The API calls this function when the player's state changes.
// The function indicates that when playing a video (state=1),
// the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING) {
		
		
	} else if (event.data == YT.PlayerState.ENDED) {
		event.target.playVideo();
	}
}

/**
 * onClickCommitButton
 */
function clickCommit(){
	//動画IDをサーバにコミット
	var txtName = pName.value;
	vid = document.getElementById("v_id").value;
	if (dsId.length == 0) {
		dsVideo01.push({"name" : txtName , "vid" : vid, "inputdatetime" : toLocaleString(new Date())},function(data){
			console.log("送信完了!");
		});
	} else {
		dsVideo01.set(dsId, { "name" : txtName , "vid" : vid , "inputdatetime" : toLocaleString(new Date())});
	}
	//動画が変更された場合もコンソールにメッセージ追加
	dsChat.push({"name" : txtName , "msg" : "動画を変更しました。ID=" + vid, "inputdatetime" : toLocaleString(new Date())},function(data){
		console.log("送信完了!");
		msg.value = "";
	});
}

//動画ID更新時
dsVideo01.on("push",function(data){
	//入力された動画IDでプレイヤー再読込
	vid = data.value.vid;
	playNewVideo();
});
dsVideo01.on("set",function(data){
	//入力された動画IDでプレイヤー再読込
	vid = data.value.vid;
	playNewVideo();
});


function playNewVideo() {
	player.clearVideo();
	player.loadVideoById(vid);
	player.playVideo();
}

//現在時刻を文字列型で
function toLocaleString(date)
{
    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
        ].join( '/' ) + ' '
        + date.toLocaleTimeString();
}
