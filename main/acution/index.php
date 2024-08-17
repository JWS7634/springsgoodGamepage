$dbHost = "localhost";
		$dbName = "test";
		$dbUser = "studioranp1web";
		$dbPass = "gPiai3CdYi3zTwbR";
		$pdo = new PDO("mysql:host={$dbHost};dbname={$dbName}", $dbUser, $dbPass);
		$timenow = date('Y-m-d His');

		$statement = $pdo -> prepare('SELECT * FROM downloadkey WHERE IP = :IP AND DownloadKey = :DownloadKey');
		$statement -> bindValue(":IP", $_SERVER["REMOTE_ADDR"]);
		$statement -> bindValue(":DownloadKey", $_GET["DownloadKey"]);
		$statement -> execute();
<html>
	<head>
		<title>봄이좋냐배 발로대회</title>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="../../css/main.css">
	</head>
	<body>
		<div class="banner-box">
		</div>
		<div class="banner-box-opz">
		</div>
		<div class="title-bar">
		<h2>봄이좋냐배 발로란트 대회 1회차</h2>
		</div>
	
		<div class="context-box">
			<div class="main-content">
				<div>
					<div>
						아래 전달받은 코드를 입력하고 경매에 참여해주세요
					</div>
					<div>
						<input type="text">
					</div>
					<button onclick="location.href='/GameMake'" class="Kaif-c-button">
						방 입장
					</button>
				</div>
			</div>
		</div>
	</body>
</html>