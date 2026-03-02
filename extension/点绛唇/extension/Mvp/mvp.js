import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

lib.init.css(lib.assetURL + "extension/点绛唇/extension/Mvp", "mvp");

get.nextNickName = function (player) {
	let randomNum = Math.floor(Math.random() * 900 + 100);
	/*const randName=['缘之空', '小小恐龙', '自然萌', '海边的ebao', '小云云', '猫猫虫', '小爱莉', '冰佬', '黎', '浮牢师', 'u', '蓝宝', '影宝', '柳下跖', '无语', '小曦', '墨渊', 'k9', '扶苏', '皇叔','倘若','辰午','小华'].randomGet();*/
	let randName = "小杀00" + randomNum;
	const playName = player.nickname ? player.nickname : randName;
	const nextName = player == game.me ? lib.config.connect_nickname : playName;
	if (!player.nickname) player.nickname = nextName;
	return nextName;
};
get.nextAvatar = function (player) {
	let headCharacter = Object.keys(lib.character)
		.filter(key => !lib.filter.characterDisabled(key))
		.randomGet();
	const playHead = player.avatar ? player.avatar : headCharacter;
	const nextHead = player == game.me ? lib.config.connect_avatar : playHead;
	if (!player.avatar) player.avatar = nextHead;
	return nextHead;
};

game.openMvp = function (player, callback) {
	//打开mvp页面
	game.playAudio("../extension/点绛唇/extension/Mvp/audio/mvp.mp3");
	let skill = lib.character[player.name1].skills.randomGet();
	let selectedAudio = game.parseSkillAudio(skill, player.name1).randomGet();
	if (selectedAudio) {
		const actualPath = selectedAudio.startsWith("ext:") ? "../extension/" + selectedAudio.slice(4) : "../audio/" + selectedAudio;
		game.playAudio(actualPath);
	}
	const mvpBg = ui.create.div(document.body, ".mvpBg", function () {
		mvpBg.delete();
		if (callback && typeof callback === "function") {
			callback();
		}
	}); //整个页面的大背景
	ui.create.div(".closeText", mvpBg);
	const mvpPlayerBg = ui.create.div(".mvpPlayerBg", mvpBg);
	let playskin = (player.style.backgroundImage || player.childNodes[0].style.backgroundImage).split("/"),
    [skins1, skins2] = [playskin[playskin.length-2], playskin.at(-1).split(".")[0]];
    var realName = game.qhly_getRealName?game.qhly_getRealName(player.name1):player.name1;
    let image=new Image();
    image.src=lib.assetURL + 'extension/千幻聆音/sanguoyuanhua/'+realName+'/' + skins2+'.jpg';
	image.onload = function () {
		mvpPlayerBg.style.backgroundSize = "cover";
		mvpPlayerBg.style.backgroundRepeat = "no-repeat";
		mvpPlayerBg.style.backgroundPosition = "center center";
		if (this.width > this.height) {
			mvpPlayerBg.style.width = "667px";
			mvpPlayerBg.style.left = "45%";
		}
		mvpPlayerBg.style.backgroundImage = `url(${image.src})`;
	};
	image.onerror = function () {
		image.onload = null;
		image.onerror = null;
		image.src = lib.assetURL + "extension/千幻聆音/sanguoskin/" + player.name1 + "/" + skins2;

		image.onload = function () {
			mvpPlayerBg.style.backgroundSize = "cover";
			mvpPlayerBg.style.backgroundRepeat = "no-repeat";
			mvpPlayerBg.style.backgroundPosition = "center center";

			// 检查图片宽高比
			if (image.width > image.height) {
				mvpPlayerBg.style.width = "667px";
				mvpPlayerBg.style.left = "45%";
			}

			mvpPlayerBg.style.backgroundImage = `url(${image.src})`;
		};

		image.onerror = function () {
			mvpPlayerBg.setBackground(player.name1, "character");
		};
	};

	var rarity = game.getRarity(player.name1);
	if (!rarity) rarity = "junk";
	const skinLevel = ui.create.div(".skinLevel", mvpPlayerBg);
	var url = lib.assetURL + "extension/点绛唇/image/level/dc_" + rarity + ".png";

	skinLevel.style.backgroundImage = 'url("' + url + '")';

	const name = get.slimName(player.name1);
	let value = "";
	let value2 = lib.config.skin[player.name1] && lib.config.skin[player.name1][0] ? lib.config.skin[player.name1][0].slice(0, -4) : "经典形象";
	value += value2 + "*" + name;

	ui.create.div(".name", value, mvpPlayerBg);

	const bestBg = ui.create.div(".bestBg", mvpPlayerBg); //全场最佳

	const playBg = ui.create.div(".playBg", mvpPlayerBg);

	const playHead = ui.create.div(".playHead", playBg);
	let headCharacter = get.nextAvatar(player);
	if (!lib.config.extension_点绛唇_diyAvatar || lib.config.extension_点绛唇_diyAvatar == "default" || player != game.me) playHead.setBackground(headCharacter, "character");
	else playHead.setBackgroundImage("extension/点绛唇/extension/Mvp/image/diyAvatar/" + lib.config.extension_点绛唇_diyAvatar + ".jpg");

	const nextName = get.nextNickName(player);
	ui.create.div(".playName", nextName, playBg);

	const playGuanjie = ui.create.div(".playGuanjie", playBg);
	const num = Math.floor(Math.random() * 13) + 1;
	if (!player.guanjie) player.guanjie = num;
	playGuanjie.setBackgroundImage("extension/点绛唇/image/level/guanjie_" + player.guanjie + ".png");
};

game.openOverDialog = function (winners, losers,resolve) {
	//对局记录
	const mvpBg = ui.create.div(document.body, ".mvpBg"); //整个页面的大背景
	ui.create.div(".closeButton", "返回", mvpBg, function () {
		mvpBg.delete();
		resolve&&resolve();
	});
	const topEl = ui.create.div(".top", mvpBg);
	const bottomEl = ui.create.div(".bottom", mvpBg, function () {
		if (modetop.innerHTML == "对局数据详情") updateFirst();
		else updateSecond();
		// 第二步：根据更新后的modetop文本，自动切换背景图
		if (modetop.innerHTML === "对局数据详情") {
			// 对局数据详情 → 显示top2、bottom2
			topEl.setBackgroundImage("extension/点绛唇/extension/Mvp/image/top2.png");
			bottomEl.setBackgroundImage("extension/点绛唇/extension/Mvp/image/bottom2.png");
		} else {
			topEl.setBackgroundImage("extension/点绛唇/extension/Mvp/image/top.png");
			bottomEl.setBackgroundImage("extension/点绛唇/extension/Mvp/image/bottom.png");
		}
	});

	const modetop = ui.create.div(".topBg", mvpBg);
	const gameInfo = ui.create.div(".game-info", mvpBg);
	gameInfo.innerHTML = `
             <span class="round">游戏轮数：<span>${game.roundNumber || 1}</span></span>
             <span class="time">游戏时长：<span>${ui.time4?.innerText || "01:38"}</span></span>
        `;

	const createPlayerEntry = (container, playerInfo, isWin, isSecond) => {
		//添加玩家函数
		const node = ui.create.div(".mvpCharBg", container);
		if (playerInfo == game.me) node.setBackgroundImage("extension/点绛唇/extension/Mvp/image/meBg.png");
		if (isWin) ui.create.div(".win", node);
		if (game.mvpPlayer && game.mvpPlayer == playerInfo) ui.create.div(".bestPlay", node);
		const identityBg = ui.create.div(".identityBg", node);
		switch (playerInfo.identity) {
			case "zhu":
				if (get.mode() == "identity") {
					identityBg.setBackgroundImage("extension/点绛唇/image/identity/zhu.png");
				} else if (get.mode() == "doudizhu") {
					identityBg.setBackgroundImage("extension/点绛唇/image/identity/dizhu.png");
				} else if (get.mode() == "single") {
					identityBg.setBackgroundImage("extension/点绛唇/image/identity/xian.png");
				}
				break;
			case "zhong":
				identityBg.setBackgroundImage("extension/点绛唇/image/identity/zhong.png");
				break;
			case "mingzhong":
				identityBg.setBackgroundImage("extension/点绛唇/image/identity/zhong.png");
				break;
			case "fan":
				if (get.mode() == "identity") {
					identityBg.setBackgroundImage("extension/点绛唇/image/identity/fan.png");
				} else if (get.mode() == "doudizhu") {
					identityBg.setBackgroundImage("extension/点绛唇/image/identity/nongmin.png");
				} else if (get.mode() == "single") {
					identityBg.setBackgroundImage("extension/点绛唇/image/identity/hou.png");
				}
				break;
			case "nei":
				identityBg.setBackgroundImage("extension/点绛唇/image/identity/nei.png");
				break;
			case "boss":
				identityBg.setBackgroundImage("extension/点绛唇/image/identity/boss.png");
				break;
			case "wei":
				identityBg.setBackgroundImage("extension/点绛唇/image/identity/wei.png");
				break;
			case "shu":
				identityBg.setBackgroundImage("extension/点绛唇/image/identity/shu.png");
				break;
			case "wu":
				identityBg.setBackgroundImage("extension/点绛唇/image/identity/wu.png");
				break;
			case "qun":
				identityBg.setBackgroundImage("extension/点绛唇/image/identity/qun.png");
				break;
			case "jin":
				identityBg.setBackgroundImage("extension/点了绛唇/image/identity/jin.png");
				break;
			case "ye":
				identityBg.setBackgroundImage("extension/点绛唇/image/identity/ye.png");
				break;
			case "friend":
				identityBg.setBackgroundImage("extension/点绛唇/image/identity/friend.png");
				break;
			case "enemy":
				identityBg.setBackgroundImage("extension/点绛唇/image/identity/enemy.png");
				break;
		}
		// identityBg.setBackgroundImage('extension/点绛唇/image/identity/' + playerInfo.identity + '.png');
		const mvpTouxiang = ui.create.div(".mvpTouxiang", node);
		mvpTouxiang.setBackground(playerInfo.name1, "character");
		if (playerInfo.name2) {
			const mvpTouxiang2 = ui.create.div(".mvpTouxiang2", node);
			mvpTouxiang2.setBackground(playerInfo.name2, "character");
		}
		const name = lib.translate[playerInfo.name1 + "_prefix"] ? `${get.prefixSpan(get.translation(playerInfo.name1 + "_prefix"), playerInfo.name1)}${get.rawName(playerInfo.name1)}` : get.translation(playerInfo.name1);
		let name2 = "";
		if (playerInfo.name2) name2 = lib.translate[playerInfo.name2 + "_prefix"] ? `${get.prefixSpan(get.translation(playerInfo.name2 + "_prefix"), playerInfo.name2)}${get.rawName(playerInfo.name2)}` : get.translation(playerInfo.name2);
		ui.create.div(".name", name + (name2 ? "/" + name2 : ""), node);

		const nextName = get.nextNickName(playerInfo);
		ui.create.div(".playName", nextName, node);

		const num = Math.floor(Math.random() * 13) + 1;
		if (!playerInfo.guanjie) playerInfo.guanjie = num;
		const guanjie = ui.create.div(".guanjie", node);
		guanjie.setBackgroundImage("extension/点绛唇/image/level/guanjie_icon_" + playerInfo.guanjie + ".png");

		if (playerInfo !== game.me) {
			const xianhua = ui.create.div(".xianhua", node);
			xianhua.style.display = isSecond ? "none" : "block";
			const haoyou = ui.create.div(".haoyou", node);
			haoyou.style.display = isSecond ? "none" : "block";
			const jubao = ui.create.div(".jubao", node);
			jubao.style.display = isSecond ? "none" : "block";
		}
		const handCardsBg = ui.create.div(".handCardsBg", node);
		handCardsBg.style.display = isSecond ? "block" : "none";
		ui.create.div(".handCard", handCardsBg, function () {
			game.openCardsDialog(playerInfo);
		});
		let kills = 0;
		for (let evt of playerInfo.stat) {
			if (evt.kill) kills += evt.kill;
		}
		let gains = 0;
		playerInfo.getAllHistory("gain", evt => {
			gains += evt.cards.length;
		});
		const useCards = playerInfo.getAllHistory("useCard").length + playerInfo.getAllHistory("respond").length;
		let damageEvents = 0;
		let recoverEvents = 0;
		game.getAllGlobalHistory("changeHp", evt => {
			if (evt.getParent().source && evt.getParent().source === playerInfo) {
				if (evt.getParent().name == "recover") recoverEvents += evt.getParent().num;
				else if (evt.getParent().name == "damage") damageEvents += evt.getParent().num;
			}
		});
		if (kills > 1) {
			const killBadge = ui.create.div(".killBadge", node);
			killBadge.style.display = isSecond ? "none" : "block";

			// 1. 创建击杀数弹窗
			const killPopup = ui.create.div(".kill-popup", mvpBg);
			killPopup.innerHTML = `<span>击杀数：${kills}</span>`;
			killPopup.style.display = "none"; // 默认隐藏
			// 2. 徽章点击事件
			killBadge.addEventListener("click", e => {
				e.stopPropagation(); // 防止事件冒泡触发全局关闭
				killPopup.style.display = "block";
				// 定位到徽章附近
				const badgeRect = killBadge.getBoundingClientRect();
				killPopup.style.left = `${badgeRect.left}px`;
				killPopup.style.top = `${badgeRect.top - 30}px`;
			});
			// 3. 全局点击关闭弹窗
			document.addEventListener("click", () => {
				killPopup.style.display = "none";
			});
			// 4. 防止点击弹窗本身时关闭
			killPopup.addEventListener("click", e => {
				e.stopPropagation();
			});
		} else if (kills < 1 && damageEvents > 6) {
			const helpBadge = ui.create.div(".helpBadge", node);
			helpBadge.style.display = isSecond ? "none" : "block";
		}
		if (damageEvents > 6) {
			const damageBadge = ui.create.div(".damageBadge", node);
			damageBadge.style.display = isSecond ? "none" : "block";
		}
		if (gains > 10) {
			const gainBadge = ui.create.div(".gainBadge", node);
			gainBadge.style.display = isSecond ? "none" : "block";
		}
		if (recoverEvents > 3) {
			const recoverBadge = ui.create.div(".recoverBadge", node);
			recoverBadge.style.display = isSecond ? "none" : "block";
		}
		if (isSecond) {
			const dataData = ui.create.div(".dataData", node);
			let kills = 0;
			for (let evt of playerInfo.stat) {
				if (evt.kill) kills += evt.kill;
			}
			let gains = 0;
			playerInfo.getAllHistory("gain", evt => {
				gains += evt.cards.length;
			});
			const useCards = playerInfo.getAllHistory("useCard").length + playerInfo.getAllHistory("respond").length;
			let damageEvents = 0;
			let recoverEvents = 0;
			game.getAllGlobalHistory("changeHp", evt => {
				if (evt.getParent().source && evt.getParent().source === playerInfo) {
					if (evt.getParent().name == "recover") recoverEvents += evt.getParent().num;
					else if (evt.getParent().name == "damage") damageEvents += evt.getParent().num;
				}
			});
			const dataItems = ["击杀数:" + kills, "摸牌数:" + gains, "用牌数:" + useCards, "造成伤害:" + damageEvents, "治疗量:" + recoverEvents];

			for (let name of dataItems) {
				ui.create.div(".dataText", name, dataData);
			}
		}
	};

	let winnersBg = null;
	let losersBg = null;
	let dataBg = null;

	function clearBackgrounds() {
		[winnersBg, losersBg, dataBg].forEach(element => {
			if (element) {
				element.delete();
				element = null;
			}
		});
	}

	function updateFirst() {
		//初始页面
		clearBackgrounds(); // 清除旧的背景元素

		const modeType = lib.config.all.mode.find(mode => lib.configOL[mode + "_mode"] || (mode !== "connect" && lib.config.mode === mode));
		modetop.innerHTML = lib.translate[modeType] || "未知模式";

		winnersBg = ui.create.div(".winnersBg", mvpBg);
		losersBg = ui.create.div(".losersBg", mvpBg);

		winners.forEach(player => createPlayerEntry(winnersBg, player, true));
		losers.forEach(player => createPlayerEntry(losersBg, player));
	}

	function updateSecond() {
		//战绩数据页面
		clearBackgrounds();

		modetop.innerHTML = "对局数据详情";
		// modetop.innerHTML = `
		// <span class="left-title">对局数据详情</span>
		// <span class="right-info">
		// <span class="round">游戏轮数：<span id="gameRound">${game.roundNumber || 1}</span></span>
		// <span class="time">游戏时长：<span id="gameTime">${ui.time4?.innerText || '01:38'}</span></span>
		// </span>
		// `;
		dataBg = ui.create.div(".dataBg", mvpBg);
		winners.forEach(player => createPlayerEntry(dataBg, player, true, true));
		losers.forEach(player => createPlayerEntry(dataBg, player, null, true));
	}

	updateFirst();
};

game.mvpShow = function (bool) {
	return new Promise((resolve, reject) => {
		if (!lib.config.extension_点绛唇_overMvp) return;
		ui.dialogs[0] && ui.dialogs[0].hide();

		// 胜负判定
		const addToWinner = character => {
			winner.push(character);
		};
		const processCharacters = characters => {
			characters.forEach(character => addToWinner(character));
		};
		const winner = [];

		const zhu = game.zhu;
		if (zhu) {
			if (zhu.isAlive()) {
				addToWinner(zhu);
				processCharacters(zhu.getFriends(null, true));
			} else {
				const nei = game.filterPlayer2(p => !p.getFriends(null, true).length);
				const hasOther = game.filterPlayer(p => !nei.includes(p) && p !== zhu).length;

				if (nei.length) {
					if (!hasOther) {
						processCharacters(nei.filter(p => p.isAlive()));
					} else {
						processCharacters(zhu.getEnemies(null, true).filter(p => !nei.includes(p)));
					}
				} else {
					processCharacters(zhu.getEnemies(null, true));
				}
			}
		} else {
			if (bool === true) {
				addToWinner(game.me);
				processCharacters(game.me.getFriends(null, true));
			} else if (bool === false) {
				const alive = game.filterPlayer();
				const target = alive.length === 1 ? alive[0] : alive[0].getEnemies(null, false).length ? game.me : alive[0];

				addToWinner(target);
				processCharacters(target.getFriends(null, true));
			}
		}

		const loser = game.filterPlayer2(current => !winner.includes(current));

		//mvp分计算
		let maxMvpPlayer = game.me;
		let maxMvpScore = -Infinity;
		game.filterPlayer2(current => {
			let damageEvents = 0;
			let recoverEvents = 0;
			game.getAllGlobalHistory("changeHp", evt => {
				if (evt.getParent().source && evt.getParent().source === current) {
					if (evt.getParent().name == "recover") recoverEvents += evt.getParent().num;
					else if (evt.getParent().name == "damage") damageEvents += evt.getParent().num;
				}
			});
			let kills = 0;
			for (let evt of current.stat) {
				if (evt.kill) kills += evt.kill;
			}
			let gains = 0;
			current.getAllHistory("gain", evt => {
				gains += evt.cards.length;
			});
			const useCards = current.getAllHistory("useCard").length;
			const responds = current.getAllHistory("respond").length;
			let mvpCount = (damageEvents + recoverEvents) * 2 + kills * 10 + Math.floor((gains + useCards + responds) / 2);
			if (winner.includes(current)) mvpCount += Math.floor(Math.pow(current.getEnemies(null, true).length, 2) * 1.5);

			current.mvpCount = mvpCount;

			if (mvpCount > maxMvpScore) {
				maxMvpScore = mvpCount;

				maxMvpPlayer = current;
			}
		});

		//mvp页面
		setTimeout(() => {
			game.broadcastAll(
				(winner, loser, maxMvpPlayer) => {
					game.mvpPlayer = maxMvpPlayer;
					if (game.openMvp)
						game.openMvp(maxMvpPlayer, () => {
							game.openOverDialog(winner, loser,resolve);
							ui.create.control("查看MVP", function () {
								game.openMvp(maxMvpPlayer);
							});
							ui.create.control("对局记录", function () {
								game.openOverDialog(winner, loser);
							});
						});
				},
				winner,
				loser,
				maxMvpPlayer
			);
		}, 500);
	});
};

if (window._pushYjcmJsFn) {
	window._pushYjcmJsFn({
		index: 101,
		fn: game.mvpShow,
	});
} else {
	lib.onover.push(game.mvpShow);
}
