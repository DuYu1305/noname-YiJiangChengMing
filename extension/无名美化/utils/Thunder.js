import { lib, game, ui, get, ai, _status } from "../../../noname.js";
export let ThunderGame = {
	thunderHasExt: function (str) {
		if (!str || typeof str != "string") return false;
		if (lib.config && lib.config.extensions) {
			for (var i of lib.config.extensions) {
				if (i.indexOf(str) == 0) {
					if (lib.config["extension_" + i + "_enable"]) return true;
				}
			}
		}
		return false;
	},
	thunderFileExist(url) {
		//同步
		if (window.XMLHttpRequest) {
			var http = new XMLHttpRequest();
		} else {
			var http = new ActiveXObject("Microsoft.XMLHTTP");
		}
		http.open("HEAD", url, false);
		try {
			http.send();
		} catch (err) {
			return false;
		}
		return http.status != 404;
	},
	thunderFileExist2(path, callback) {
		//异步
		if (lib.node && lib.node.fs) {
			try {
				var stat = lib.node.fs.statSync(__dirname + "/" + path);
				callback(stat);
			} catch (e) {
				callback(false);
				return;
			}
		} else {
			resolveLocalFileSystemURL(
				lib.assetURL + path,
				(function (name) {
					return function (entry) {
						callback(true);
					};
				})(name),
				function () {
					callback(false);
				}
			);
		}
	},
	thunderIsPhone() {
		//获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
		var info = navigator.userAgent;
		//通过正则表达式的test方法判断是否包含“Mobile”字符串
		var isPhone = /mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(info);
		//如果包含“Mobile”（是手机设备）则返回true
		return isPhone;
	},
	thunderCreateStand: function (player, dialog, height, y) {
		var jinyu = ui.create.div(".th-jinyu", dialog);
		jinyu.style.setProperty("--h", height + "px");
		jinyu.style.setProperty("--y", y);

		var playerRealSkin = player.style.backgroundImage;
		if (!playerRealSkin) playerRealSkin = player.childNodes[0].style.backgroundImage;

		let playerSkin = playerRealSkin.split("/");
		var skin1 = playerSkin[playerSkin.length - 2],
			skin2 = playerSkin[playerSkin.length - 1].split(".")[0];
		var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
		var skinPath = lib.assetURL + lib.config["extension_无名美化_standPath"];
		// var skinPath = lib.assetURL + "extension/无名美化/image/stand/";
		if (reg.test(skin2)) {
			skinPath += skin1 + "-" + skin2 + ".png";
		} else {
			skinPath += skin2 + ".png";
		}
		if (game.thunderFileExist(skinPath)) jinyu.style.backgroundImage = "url(" + skinPath + ")";
		else jinyu.style.backgroundImage = playerRealSkin;
	},
	//用到在补充
	thunderCreateHead(player, dialog, width, x, y, type) {
		var originPlayer = player;
		if (typeof player != "string") player = player.name || "";
		var head = ui.create.div(".th-headpic", dialog);
		head.style.setProperty("--w", width + "px");
		head.style.left = x + "px";
		head.style.top = y + "px";
		var headPath = lib.assetURL + "extension/无名美化/image/head/" + player + "/" + player + ".png";
		// }
		game.thunderFileExist2(headPath, function (s) {
			if (s) {
				head.style.backgroundImage = "url(" + headPath + ")";
			} else {
				if (player == "未知") head.style.backgroundImage = "url(" + lib.assetURL + "extension/无名美化/image/character/th_unknown.png)";
				else {
					head.setBackground(player, "character");
					head.style.backgroundSize = "200%";
					head.style.backgroundPosition = "50% 10%";
				}
			}
		});
		if (type) {
			if (type == "border") {
				let headbord = ui.create.div("", head);
				headbord.style.cssText = "width:100%;height:100%;top:0;left:0;background-size:100%;";
				headbord.style["background-image"] = 'url("' + lib.assetURL + "extension/无名美化/image/effect/" + game.getRarity(player) + '.png")';
				let headName = ui.create.div(".th-headname", headbord);
				let playerName = get.rawName2(player).slice(0, 5);
				if (playerName.length < 5) headName.style.letterSpacing = "1px";
				headName.innerHTML = playerName;
			} else if (type == "ol") {
				var playerName = get.rawName(player).slice(0, 4);
				if (playerName.length == 2) playerName = playerName.slice(0, 1) + " " + playerName.slice(1, 2);
				ui.create.div(".th-sgheadborder", head);
				var groupColor = ui.create.div(".th-sggroupcolor", head);
				var headColor = "";
				switch (originPlayer.group) {
					case "wei":
						headColor = "rgba(85, 135, 184, 1), rgba(85, 135, 184, 1)";
						break;
					case "wu":
						headColor = "rgba(54, 162, 108, 1), rgba(54, 162, 108, 1)";
						break;
					case "shu":
						headColor = "rgba(210, 98, 84, 1), rgba(210, 98, 84, 1)";
						break;
					case "jin":
						headColor = "rgba(170, 95, 185, 1), rgba(170, 95, 185, 1)";
						break;
					default:
						headColor = "rgba(126, 122, 111, 1), rgba(126, 122, 111, 1)";
						break;
				}
				groupColor.style["background-image"] = "linear-gradient(" + headColor + ")";
				var headName = ui.create.div(".th-sgheadname", groupColor);
				headName.innerHTML = playerName;
			}
		}
	},
	thCreateSkillInfo(skill, dialog) {
		var node = ui.create.div(".th-skilltishi", dialog),
			node1 = ui.create.div(".th-radiusTL", node),
			node2 = ui.create.div(".th-radiusTR", node),
			node3 = ui.create.div(".th-radiusBL", node),
			ndoe4 = ui.create.div(".th-radiusBR", node),
			topic = ui.create.div("", node),
			content = ui.create.div("", node);
		topic.style.cssText = 'width:90%;height:20px;font-size:18px;color:#58bf32;font-family:"th-kaishu";position:absolute;left:5%;top:5px;';
		topic.innerHTML = get.translation(skill);
		content.style.cssText = 'width:90%;height:auto;font-size:13px;font-family:"th-kaishu";position:absolute;left:5%;top:30px;';
		content.innerHTML = "    " + get.translation(skill + "_info");
		node.style.setProperty("--h", content.offsetHeight + 38 + "px");
	},
	thRemoveSkillInfo() {
		var node = document.getElementsByClassName("th-skilltishi");
		if (!node) return;
		for (var i = 0; i < node.length; i++) {
			node[i].remove();
		}
	},
	thunderPlayerRank: function (player) {
		if (!player || !player.name) return 0;
		var list = ["s", "ap", "a", "am", "bp", "b", "bm", "c", "d"];
		for (var i = 0; i < list.length; i++) {
			for (var j of lib.rank[list[i]]) {
				if (player.name.indexOf(j) >= 0) return 9 - i;
			}
		}
		return 0;
	},
	thunderForbidTouch: function () {
		_status.th_swipe_up = lib.config.swipe_up;
		lib.config.swipe_up = "";
		_status.th_swipe_down = lib.config.swipe_down;
		lib.config.swipe_down = "";
		_status.th_swipe_left = lib.config.swipe_left;
		lib.config.swipe_left = "";
		_status.th_swipe_right = lib.config.swipe_right;
		lib.config.swipe_right = "";
		_status.th_gamePause = ui.click.pause;
		ui.click.pause = function () {};
	},
	thunderAllowTouch: function () {
		if (_status.th_swipe_up) {
			lib.config.swipe_up = _status.th_swipe_up;
			lib.config.swipe_down = _status.th_swipe_down;
			lib.config.swipe_left = _status.th_swipe_left;
			lib.config.swipe_right = _status.th_swipe_right;
			ui.click.pause = _status.th_gamePause;
		}
	},
	thunderCreateTimer: function (last, callback, background, width, index, y, theme) {
		if (!last || !callback) return;
		var timeTheme;
		if (theme) timeTheme = theme;
		else {
			if (lib.config["extension_无名美化_timeTheme"] == "follow") {
				if (lib.config["extension_十周年UI_newDecadeStyle"] == "on") timeTheme = "decade";
				else timeTheme = "shousha";
			} else timeTheme = lib.config["extension_无名美化_timeTheme"] || "decade";
		}
		var bg = background || document.body;
		var shoushaJDT = document.getElementById("jindutiao");
		if (shoushaJDT) {
			shoushaJDT.style.cssText += "transition:none;";
			shoushaJDT.hide();
		}
		var time, timex;
		if (timeTheme == "shousha") {
			((time = ".th-cxtime"), (timex = ".th-cxtimecover"));
		} else {
			((time = ".th-cxtime2"), (timex = ".th-cxtimecover2"));
		}
		let cxTime = ui.create.div(time, bg); //生成进度条；
		if (width) cxTime.style.setProperty("--w", width + "px");
		if (index) cxTime.style.zIndex = index;
		if (y) cxTime.style.setProperty("top", "calc(50% + " + y + "px)");
		let cxTimeCover = ui.create.div(timex, cxTime);
		if (width) cxTimeCover.style.setProperty("--w", width - 4 + "px");
		else width = 500;
		cxTimeCover.data = last;
		var ct = game.thunderInterval(() => {
			cxTimeCover.data--;
			cxTimeCover.style.width = cxTimeCover.data * Math.round(((width - 4) / last) * 100) * 0.01 + "px";
			if (cxTimeCover.data == 0) {
				if (shoushaJDT) shoushaJDT.show();
				callback([cxTime, ct]);
			}
		}, 100); //进度条时间
		return [cxTime, ct];
	},
	thunderInterval(fn, timeout) {
		var timer = {
			thunderFlag: true,
		};
		function interval() {
			if (timer.thunderFlag) {
				fn();
				setTimeout(interval, timeout);
			}
		}
		setTimeout(interval, timeout);
		return timer;
	},
	thunderClearInterval(name) {
		if (!name || name == null || typeof name != "object") return;
		name.thunderFlag = false;
	},
	thunderCreateVCard(info, background, onclick) {
		let vb = ui.create.div(".th-vcardback", background, onclick);
		let vc = ui.create.button(info[2], "vcard", vb);
		if (["sha", "shan", "tao", "jiu", "du"].contains(info[2])) {
			let vn = ui.create.div(".th-vcardnamePic", vb);
			vn.style.setProperty("--b", `url('image/effect/card_${info[2]}.png')`);
		} else ui.create.div(".th-vcardname", vb, get.translation(info[2]));
		let vt = ui.create.div(".th-vardtips", vb);
		vc.classList.add("th-vcard");
		vb.style.setProperty("--fz", Math.max(50 / get.translation(info[2]).length, 21) + "px");
		return vb;
	},
	thunderDialog(player, str, background, height, width, theme, standScale, sswidth) {
		//触发者  标题  父元素  高度  宽度  指定主题 立绘缩放 手杀主题是否有全屏宽
		var dialogTheme;
		if (theme && lib.config["extension_无名美化_yuqiTheme"] == "default") dialogTheme = theme;
		else {
			if (lib.config["extension_无名美化_yuqiTheme"] == "follow") {
				if (lib.config["extension_十周年UI_newDecadeStyle"] == "on") dialogTheme = "decade";
				else dialogTheme = "shousha";
			} else dialogTheme = lib.config["extension_无名美化_yuqiTheme"];
		}
		var dialogHeight = height || 400;
		if (dialogTheme == "decade") dialogHeight = Math.max(290, dialogHeight);
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		canvas.classList.add("th-thunderDialog");
		canvas.theme = dialogTheme;
		canvas.width = document.body.offsetWidth;
		canvas.height = document.body.offsetHeight;
		canvas.dialogHeight = dialogHeight;
		canvas.onResize = [];
		background.appendChild(canvas);
		var dialogTop = Math.round(canvas.height - dialogHeight) * 0.35; //0.4
		var miniTop = Math.round(canvas.height * 0.6);
		var dialogImg = new Image();
		if (dialogTheme == "shousha") {
			dialogImg.src = lib.assetURL + "extension/无名美化/image/effect/ssdialog.png";
			var dialogCanvasWidth = sswidth ? Math.max(width, canvas.width * 0.5) : canvas.width;
			var dialogTap = sswidth ? (canvas.width - dialogCanvasWidth) / 2 : 0;
			var cssWidth = sswidth ? dialogCanvasWidth + "px" : "100%";
			var cssLeft = sswidth ? "calc(50% - " + dialogCanvasWidth / 2 + "px)" : "0";
			dialogImg.onload = function () {
				ctx.beginPath();
				ctx.drawImage(this, 0, 2, this.width, 50, 0, dialogTop, canvas.width, canvas.width * 0.036);
				ctx.drawImage(this, 0, 54, this.width, 16, dialogTap, dialogTop + canvas.width * 0.036, dialogCanvasWidth, canvas.width * 0.016);
				ctx.drawImage(this, 0, 71, this.width, 20, dialogTap, dialogTop + canvas.width * 0.052, dialogCanvasWidth, dialogHeight);
				ctx.drawImage(this, 0, 92, this.width, 20, dialogTap, dialogTop + canvas.width * 0.052 + dialogHeight, dialogCanvasWidth, canvas.width * 0.011);
				var color = ctx.createLinearGradient(canvas.width * 0.5, dialogTop + 10, canvas.width * 0.5, dialogTop + canvas.width * 0.036 - 20);
				color.addColorStop(0, "#fcfcbf");
				color.addColorStop(1, "#b58b59");
				ctx.font = '40px "th-zhongli"';
				ctx.fillStyle = color;
				// document.fonts.ready.then(function () {
				ctx.fillText(str, canvas.width * 0.46, dialogTop + 35, 75);
				// })
				ctx.moveTo(canvas.width * 0.52 + 5, dialogTop + 17);
				ctx.lineTo(canvas.width * 0.527 + 5, dialogTop + 27);
				ctx.lineTo(canvas.width * 0.534 + 5, dialogTop + 17);
				ctx.fill();
				ctx.closePath();
				ctx.beginPath();
				ctx.strokeStyle = "black";
				// document.fonts.ready.then(function () {
				ctx.strokeText(str, canvas.width * 0.46, dialogTop + 35, 75);
				// })
				ctx.moveTo(canvas.width * 0.52 + 5, dialogTop + 17);
				ctx.lineTo(canvas.width * 0.527 + 5, dialogTop + 27);
				ctx.lineTo(canvas.width * 0.534 + 5, dialogTop + 17);
				ctx.stroke();
				ctx.closePath();
			};
			canvas.minBtn = ui.create.div(".th-thunderDssMin", background);
			canvas.minBtn.style.cssText += "top:" + (dialogTop + 2) + "px;";
			canvas.minBtn.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function (e) {
				e.stopPropagation();
				canvas.resize();
			});
			canvas.container = ui.create.div(".th-thunderDssCon", background);
			canvas.container.style.cssText += "height:" + dialogHeight + "px;top:" + (dialogTop + canvas.width * 0.052) + "px;width:" + cssWidth + ";left:" + cssLeft;
			canvas.resize = function () {
				this.height = this.height;
				if (!this.min) {
					//最小化
					this.min = true;
					this.container.hide();
					this.container.style.pointerEvents = "none";
					background.style.pointerEvents = "none";
					this.minBtn.style.top = miniTop + 2 + "px";
					ctx.beginPath();
					ctx.drawImage(dialogImg, 0, 2, dialogImg.width, 50, 0, miniTop, this.width, this.width * 0.036);
					var color = ctx.createLinearGradient(this.width * 0.5, miniTop + 10, this.width * 0.5, miniTop + this.width * 0.036 - 20);
					color.addColorStop(0, "#fcfcbf");
					color.addColorStop(1, "#b58b59");
					ctx.font = '40px "th-zhongli"';
					ctx.fillStyle = color;
					ctx.fillText(str, this.width * 0.46, miniTop + 35);
					ctx.moveTo(this.width * 0.527 + 5, miniTop + 18);
					ctx.lineTo(this.width * 0.52 + 5, miniTop + 28);
					ctx.lineTo(this.width * 0.534 + 5, miniTop + 28);
					ctx.fill();
					ctx.closePath();
					ctx.beginPath();
					ctx.strokeStyle = "black";
					ctx.strokeText(str, this.width * 0.46, miniTop + 35);
					ctx.moveTo(this.width * 0.527 + 5, miniTop + 18);
					ctx.lineTo(this.width * 0.52 + 5, miniTop + 28);
					ctx.lineTo(this.width * 0.534 + 5, miniTop + 28);
					ctx.stroke();
					ctx.closePath();
				} else {
					//还原
					this.min = false;
					this.container.show();
					this.container.style.pointerEvents = "auto";
					if (!sswidth) background.style.pointerEvents = "auto";
					this.minBtn.style.top = dialogTop + 2 + "px";
					ctx.beginPath();
					ctx.drawImage(dialogImg, 0, 2, dialogImg.width, 50, 0, dialogTop, this.width, this.width * 0.036);
					ctx.drawImage(dialogImg, 0, 54, dialogImg.width, 16, dialogTap, dialogTop + this.width * 0.036, dialogCanvasWidth, this.width * 0.016);
					ctx.drawImage(dialogImg, 0, 71, dialogImg.width, 20, dialogTap, dialogTop + this.width * 0.052, dialogCanvasWidth, dialogHeight);
					ctx.drawImage(dialogImg, 0, 92, dialogImg.width, 20, dialogTap, dialogTop + this.width * 0.052 + dialogHeight, dialogCanvasWidth, this.width * 0.011);
					var color = ctx.createLinearGradient(this.width * 0.5, dialogTop + 10, this.width * 0.5, dialogTop + this.width * 0.036 - 20);
					color.addColorStop(0, "#fcfcbf");
					color.addColorStop(1, "#b58b59");
					ctx.font = '40px "th-zhongli"';
					ctx.fillStyle = color;
					ctx.fillText(str, this.width * 0.46, dialogTop + 35, 75);
					ctx.moveTo(this.width * 0.52 + 5, dialogTop + 17);
					ctx.lineTo(this.width * 0.527 + 5, dialogTop + 27);
					ctx.lineTo(this.width * 0.534 + 5, dialogTop + 17);
					ctx.fill();
					ctx.closePath();
					ctx.beginPath();
					ctx.strokeStyle = "black";
					ctx.strokeText(str, this.width * 0.46, dialogTop + 35, 75);
					ctx.moveTo(this.width * 0.52 + 5, dialogTop + 17);
					ctx.lineTo(this.width * 0.527 + 5, dialogTop + 27);
					ctx.lineTo(this.width * 0.534 + 5, dialogTop + 17);
					ctx.stroke();
					ctx.closePath();
				}
				canvas.onResize.forEach(function (fn) {
					fn();
				});
			};
		} else {
			background.style.background = "rgba(0,0,0,0.6)";
			dialogImg.src = lib.assetURL + "extension/无名美化/image/effect/buy_dlg.png";
			var dialogWidth;
			if (dialogTheme == "shousha") dialogWidth = "100%";
			else dialogWidth = width || 800;
			var dialogCanvasWidth = dialogWidth / 0.868;
			dialogImg.onload = function () {
				ctx.beginPath();
				ctx.drawImage(this, 0, 0, this.width, 46, canvas.width * 0.5 - dialogCanvasWidth * 0.5, dialogTop, dialogCanvasWidth, 40);
				ctx.drawImage(this, 0, 47, this.width, 446, canvas.width * 0.5 - dialogCanvasWidth * 0.5, dialogTop + 40, dialogCanvasWidth, dialogHeight);
				ctx.drawImage(this, 0, 493, this.width, 35, canvas.width * 0.5 - dialogCanvasWidth * 0.5, dialogTop + 40 + dialogHeight, dialogCanvasWidth, 20);
				ctx.font = '23px "th-kaishu"';
				ctx.fillStyle = "#281312";
				// document.fonts.ready.then(function () {
				ctx.fillText(str, canvas.width * 0.5 - 23, dialogTop + 30);
				// })
				ctx.closePath();
			};
			canvas.minBtn = ui.create.div(".th-thunderDdcMin", background);
			canvas.minBtn.style.bottom = game.thunderIsPhone() ? "calc(23% + 33px)" : "calc(20% + 40px)";
			canvas.minBtn.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function (e) {
				e.stopPropagation();
				canvas.resize();
			});
			canvas.container = ui.create.div(".th-thunderDdcCon", background);
			canvas.container.style.cssText += "width:" + dialogWidth + "px;left:calc(50% - " + dialogWidth * 0.5 + "px);height:" + dialogHeight + "px;top:" + (dialogTop + 40) + "px;";
			if (player == game.me) game.thunderCreateStand(player, canvas.container, dialogHeight, standScale || 1);
			canvas.resize = function () {
				this.height = this.height;
				if (!this.min) {
					//最小化
					this.min = true;
					canvas.minBtn.style.backgroundImage = 'url("' + lib.assetURL + 'extension/无名美化/image/effect/showDialog.png")';
					background.style.background = "rgba(0,0,0,0)";
					this.container.style.pointerEvents = "none";
					background.style.pointerEvents = "none";
					this.container.hide();
				} else {
					//还原
					this.min = false;
					canvas.minBtn.style.backgroundImage = 'url("' + lib.assetURL + 'extension/无名美化/image/effect/hideDialog.png")';
					background.style.background = "rgba(0,0,0,0.6)";
					this.container.style.pointerEvents = "auto";
					background.style.pointerEvents = "auto";
					this.container.show();
					ctx.beginPath();
					ctx.drawImage(dialogImg, 0, 0, dialogImg.width, 46, canvas.width * 0.5 - dialogCanvasWidth * 0.5, dialogTop, dialogCanvasWidth, 40);
					ctx.drawImage(dialogImg, 0, 47, dialogImg.width, 446, canvas.width * 0.5 - dialogCanvasWidth * 0.5, dialogTop + 40, dialogCanvasWidth, dialogHeight);
					ctx.drawImage(dialogImg, 0, 493, dialogImg.width, 35, canvas.width * 0.5 - dialogCanvasWidth * 0.5, dialogTop + 40 + dialogHeight, dialogCanvasWidth, 20);
					ctx.font = '23px "th-kaishu"';
					ctx.fillStyle = "#281312";
					// document.fonts.ready.then(function () {
					ctx.fillText(str, canvas.width * 0.5 - 23, dialogTop + 30);
					// })
					ctx.closePath();
				}
				canvas.onResize.forEach(function (fn) {
					fn();
				});
			};
		}
		//if(window.shoushaBlanks) window.shoushaBlanks.add(canvas);
		return canvas;
	},
	thunderRAF: function (callback) {
		this.stop = false;
		let id = null;
		let date1 = Date.now();
		let speed = 24 + (parseInt(lib.config["extension_无名美化_gameSpeed"]) - 4) * 2;
		let that = this;
		this.callbackFn = callback;
		(function thunderrAF() {
			if (that.stop == true) {
				cancelAnimationFrame(id);
				return;
			}
			let date2 = Date.now();
			if (date2 - date1 >= speed) {
				that.callbackFn();
				date1 = date2;
			}
			id = requestAnimationFrame(thunderrAF);
		})();
		return this;
	},
	thunderLoadFont: function (obj) {
		if (document.fonts && !checkFont(obj.cssValue)) {
			const fontFace = new FontFace(obj.cssValue, `local('${obj.cssValue}'),url('${obj.url}')`);
			fontFace.load().then(font => document.fonts.add(font));
		}
		function checkFont(name) {
			const values = document.fonts.values();
			let isHave = false;
			let item = values.next();
			while (!item.done && !isHave) {
				let fontFace = item.value;
				if (fontFace.family === name) {
					isHave = true;
				}
				return isHave;
			}
		}
	},
};
export let ThunderPlayer = {
	$thshowdam: function (num, font) {
		game.addVideo("showdam", this, [num, font]);
		var node = ui.create.div(".damage");
		if (font) {
			node.classList.add("normal-font");
		}
		if (typeof num == "number" && num > 0) {
			if (num == Infinity) num = "∞";
			else num = "-" + num;
		} else if (num == -Infinity) num = "-∞";
		node.innerHTML = num;
		this.appendChild(node);
		ui.refresh(node);
		node.classList.add("damageadded");
	},
	$thdeletedam: function () {
		var node = this.getElementsByClassName("damageadded")[0];
		if (node) node.delete();
	},
	thgetSuitNum: function () {
		if (this.countCards("h") == 0) return 0;
		var list = [],
			cards = this.getCards("h");
		for (var i = 0; i < cards.length; i++) {
			if (!list.contains(get.suit(cards[i]))) list.push(get.suit(cards[i]));
		}
		return list.length;
	},
	thcaiyi: function (list, control, source) {
		var next = game.createEvent("thcaiyi");
		next.list = list;
		next.control = control;
		next.player = this;
		next.source = source;
		next.setContent("thcaiyi");
		return next;
	},
	thChooseToInit: function (topic, list1, list2, total) {
		var next = game.createEvent("thChooseToInit");
		next.list1 = list1;
		next.list2 = list2;
		next.topic = topic;
		next.total = total;
		next.player = this;
		next.setContent("thChooseToInit");
		return next;
	},
	thunderFruit: function (cards) {
		_status.event._result = {
			bool: false,
		};
		var cardList = cards.map(function (card) {
			return card.name;
		});
		var xPercent = 690 / cardList.length;
		var cutNum = {};
		var cutProcess = {};
		_status.thzhengjingFinished = {};
		for (var i = 0; i < cardList.length; i++) {
			cutNum[cardList[i]] = [3, 4, 6].randomGet();
			cutProcess[cardList[i]] = 0;
		}
		var cardItem = [];
		if (!_status.firstZhengjing) {
			cardItem[0] = cardList[0];
			cardItem[1] = "bomb";
			var list = new Array();
			for (var i = 0; i < cardList.length; i++) {
				list = list.concat(Array(cutNum[cardList[i]] - (i == 0 ? 1 : 0)).fill(cardList[i]));
			}
			list = list.concat(Array(cardList.length - 1).fill("bomb"));
			list.randomSort();
			cardItem = cardItem.concat(list);
		} else {
			var list = [];
			for (var i = 0; i < cardList.length; i++) {
				list = list.concat(Array(cutNum[cardList[i]]).fill(cardList[i]));
			}
			list = list.concat(Array(cardList.length).fill("bomb"));
			cardItem = list.randomSort();
		}
		var spines = [];
		var list = ["关关雎鸠/在河之洲/窈窕淑女/君子好逑/参差荇菜/左右流之/窈窕淑女/寤寐求之", "蒹葭苍苍/白露为霜/所谓伊人/在水一方/溯洄从之/道阻且长/溯游从之/宛在水中央", "淇则有岸/隰则有泮/总角之宴/言笑晏晏/信誓旦旦/不思其反/反是不思/亦已焉哉"];
		var poemAlpha = Array(8).fill(0);
		var poemType = get.rand(1, 3);
		var poem = list[poemType - 1];
		var deletePointFrame = 0;
		poem = poem.split("/");
		var poemNum = 0;
		function writePoem() {
			ctx.fillStyle = "#9d9a87";
			ctx.font = '40px "th-poem"';
			for (var i = 0; i < 8; i++) {
				ctx.globalAlpha = poemAlpha[i];
				var str = poem[i];
				for (var j = 0; j < str.length; j++) {
					if (str.length == 4) {
						ctx.fillText(str.slice(j, j + 1), canvas.width - 118 - i * 70, j * 50 + 94);
					} else {
						ctx.fillText(str.slice(j, j + 1), canvas.width - 118 - i * 70, j * 38 + 94);
					}
				}
			}
			ctx.globalAlpha = 1;
		}
		function readPoem() {
			var line = poemNum;
			if (poemNum % 2 == 0) game.playAudio("..", "extension", "无名美化", "audio", "zhengjing", "zhengjing_bgm" + poemType + "_" + (Math.floor(poemNum * 0.5) + 1));
			poemNum++;
			_status.poemAddAlpha = game.thunderInterval(function () {
				if (poemAlpha[line] < 0.9) {
					poemAlpha[line] += 0.1;
				} else {
					game.thunderClearInterval(_status.poemAddAlpha);
				}
			}, 100);
		}
		readPoem();
		var poemTimer = game.thunderInterval(function () {
			readPoem();
			if (poemNum >= 8) game.thunderClearInterval(poemTimer);
		}, 1600);
		var player = this;
		var timeoutIds = [];
		var intervalIds = [];
		var _setTimeout = function () {
			var id = setTimeout.apply(null, arguments);
			timeoutIds.push(id);
			return id;
		};
		var _setInterval = function () {
			var id = setInterval.apply(null, arguments);
			intervalIds.push(id);
			return id;
		};
		var bgcanvas = document.createElement("canvas");
		var bgctx = bgcanvas.getContext("2d");
		bgcanvas.classList.add("th-zhengjingbgcanvas");
		bgcanvas.width = 877;
		bgcanvas.height = 372;
		var bgimg = new Image();
		bgimg.src = lib.assetURL + "extension/无名美化/image/zhengjing/zhengjingBg2.png";
		bgimg.onload = function () {
			bgctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, bgcanvas.width, bgcanvas.height);
		};
		document.body.appendChild(bgcanvas);
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		canvas.classList.add("th-zhengjingcanvas");
		canvas.width = 690;
		canvas.height = 320;
		canvas.items = [];
		canvas.renderList = [];
		canvas.total = cardItem.length;
		document.body.appendChild(canvas);
		var canvas2 = document.createElement("canvas");
		var ctx2 = canvas2.getContext("2d");
		canvas2.classList.add("th-zhengjingcanvas2");
		canvas2.width = 690;
		canvas2.height = 80;
		document.body.appendChild(canvas2);
		var resultBg = ui.create.div(".th-zjgamebg", document.body);
		// 绘制鼠标轨迹
		var mouse = null;
		var lastMouse = null;
		var zhengjingMouse = Array(5).fill({});
		(function () {
			var pointNum = 0;
			function addLine(point) {
				if (pointNum % 3 == 0) {
					for (var i = 4; i > 0; i--) {
						zhengjingMouse[i] = zhengjingMouse[i - 1];
					}
					zhengjingMouse[0] = point;
				}
				pointNum++;
			}
			function onMove(x, y) {
				if (!isMine()) return;
				if (mouse) {
					lastMouse = mouse;
				}
				mouse = {
					x: x,
					y: y,
				};
				addLine(mouse);
			}
			function startFruitCut() {
				_status.startCut = true;
				// if (!lib.config['extension_Thunder_zjnotips']) {
				//     if (!_status.zhengjingFirstTouch) _status.zhengjingFirstTouch = Date.now();
				//     else if (Date.now() - _status.zhengjingFirstTouch < 200) {
				//         game.saveConfig('extension_Thunder_zjnotips', true);
				//     } else {
				//         _status.zhengjingFirstTouch = Date.now();
				//     }
				// }
			}
			function onCancel2() {
				mouse = null;
				lastMouse = null;
				_status.startCut = false;
				_status.fruitCutting = false;
				zhengjingMouse = Array(5).fill({});
			}

			if (lib.config.touchscreen) {
				canvas.ontouchstart = startFruitCut;
				canvas.ontouchmove = function (e) {
					if (!_status.startCut) return;
					_status.fruitCutting = true;
					var rect = canvas.getBoundingClientRect();
					var x = ((e.touches[0].clientX / game.documentZoom - rect.left) / rect.width) * canvas.width;
					var y = ((e.touches[0].clientY / game.documentZoom - rect.top) / rect.height) * canvas.height;
					onMove(x, y);
				};
				canvas.ontouchend = onCancel2;
			} else {
				canvas.onmousedown = startFruitCut;
				canvas.onmousemove = function (e) {
					if (!_status.startCut) return;
					_status.fruitCutting = true;
					onMove(e.clientX / game.documentZoom - canvas.offsetLeft, e.clientY / game.documentZoom - canvas.offsetTop);
				};
				canvas.onmouseup = onCancel2;
			}
			canvas.renderList.push(function () {
				if (Object.keys(zhengjingMouse[1]).length) {
					game.playAudio("..", "extension", "无名美化", "audio", "zhengjing", "zhengjing_huadao");
					var j = 4;
					while (!Object.keys(zhengjingMouse[j]).length && j >= 1) {
						j--;
					}
					var color = ctx.createLinearGradient(zhengjingMouse[0].x, zhengjingMouse[0].y, zhengjingMouse[j].x, zhengjingMouse[j].y);
					color.addColorStop(0, "#054163");
					color.addColorStop(1, "#e0e7eb");
					for (let i = 0; i < 3; i++) {
						if (!Object.keys(zhengjingMouse[i + 1]).length) break;
						let distance = (100 - Math.sqrt(Math.pow(Math.abs(zhengjingMouse[i + 1].x - zhengjingMouse[i].x), 2) + Math.pow(Math.abs(zhengjingMouse[i + 1].y - zhengjingMouse[i].y), 2))) * 0.076;
						distance = Math.min(10, distance);
						distance = Math.max(4, distance);
						ctx.beginPath();
						ctx.moveTo(zhengjingMouse[i].x, zhengjingMouse[i].y);
						ctx.lineTo(zhengjingMouse[i + 1].x, zhengjingMouse[i + 1].y);
						ctx.strokeStyle = color;
						ctx.lineCap = "round";
						ctx.lineJoin = "round";
						ctx.lineWidth = distance;
						ctx.stroke();
					}
				}
				deletePointFrame++;
				if (deletePointFrame % 3 == 0) {
					for (var i = 4; i >= 0; i--) {
						if (!Object.keys(zhengjingMouse[i]).length) continue;
						zhengjingMouse[i] = {};
						break;
					}
				}
			});
		})();
		var currentTime = 11;
		(function () {
			var aspeed = 15;
			function rotateCanvas(x, y, angle, img, str, size) {
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(angle);
				ctx.drawImage(img, 0, 0, img.width, img.height, -size * 0.5, -size * 0.5, size, size);
				if (str) addCardName(str);
				ctx.restore();
			}
			function addCardName(str) {
				ctx.fillStyle = "#e7e2c2";
				var fontX, fontY;
				var newLine = false;
				switch (str.length) {
					case 1: {
						ctx.font = '49px "th-zhongli"';
						fontX = -24;
						fontY = 11;
						break;
					}
					case 2: {
						ctx.font = '34px "th-zhongli"';
						fontX = -32;
						fontY = 7;
						break;
					}
					case 3: {
						ctx.font = '25px "th-zhongli"';
						fontX = -37;
						fontY = 4;
						break;
					}
					case 4: {
						ctx.font = '24px "th-zhongli"';
						fontX = -22;
						fontY = -8;
						newLine = true;
						break;
					}
					default: {
						ctx.font = '24px "th-zhongli"';
						fontX = -24;
						fontY = -9;
						newLine = true;
					}
				}
				if (newLine) {
					ctx.fillText(str.slice(0, 2), fontX, fontY);
					if (str.length == 4) ctx.fillText(str.slice(2), fontX, fontY + 26);
					else ctx.fillText(str.slice(2), fontX - 12, fontY + 23);
				} else {
					ctx.fillText(str, fontX, fontY);
				}
			}
			var addFruit = function (type, first) {
				let size = type == "bomb" ? 70 : 80;
				var isBomb = type === "bomb";
				var fruit = {
					id: type == "bomb" ? "bomb" : type,
					left: get.rand(size, canvas.width - 3 * size),
					bottom: 0,
					fruitType: type == "bomb" ? "zj_bomb" : "zj_fruit",
					speed: 12,
					name: isBomb ? "" : get.translation(type),
					isBomb: isBomb,
					tips: type == "bomb" ? "bombTip" : "fruitTip",
					direct: get.rand(70, 110),
					isOffScreen: function () {
						if (this.bottom + size < 0) return true;
						return false;
					},
					angle: 0,
					boom: false,
					check: function (x, y) {
						// 两点间距离
						var dis = function (x1, y1, x2, y2) {
							return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
						};
						if (mouse && lastMouse) {
							// 求三边长
							// 圆心到鼠标当前坐标
							var a = dis(x, y, mouse.x, mouse.y);
							// 圆心到鼠标上一坐标
							var b = dis(x, y, lastMouse.x, lastMouse.y);
							// 鼠标轨迹长度
							var c = dis(mouse.x, mouse.y, lastMouse.x, lastMouse.y);
							// 求面积
							var p = (a + b + c) / 2;
							var s = Math.sqrt(p * (p - a) * (p - b) * (p - c));
							// 求圆心到轨迹的距离
							var h = (2 * s) / c;
							// 碰撞条件为 h < 半径 且 轨迹与圆相交
							if (h >= size * 0.5) return false;
							// 有一个点在圆内，a或b小于半径
							if (a < size * 0.5 || b < size * 0.5) return true;
							// 两个点都在圆外
							var d1 = mouse.x - x;
							var d2 = lastMouse.x - x;
							// 当 d1 与 d2 符号相同时，线段不与圆相交
							return (d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0);
						}
						return false;
					},
				};
				fruit.anglePercent = (90 - fruit.direct) * 0.005;
				function render() {
					if (fruit.boom) {
						fruit.type = "blank";
						fruit.boom = false;
						dcdAnim.loadSpine(window.ThunderZhengJing[fruit.fruitType].name, "skel", function () {
							dcdAnim.playSpine(window.ThunderZhengJing[fruit.fruitType], {
								x: fruit.left + 70,
								y: fruit.bottom,
								parent: canvas,
								scale: 0.9,
							});
						});
						var audio = new Audio();
						var audioName = fruit.isBomb ? "zhengjing_baozhubaozha" : "zhengjing_qiezhong";
						audio.src = lib.assetURL + "extension/无名美化/audio/zhengjing/" + audioName + ".mp3";
						audio.play();
						//canvas.renderList.remove(render);
						canvas.items.remove(fruit);
						canvas.total--;
						handler(fruit);
					} else {
						fruit.speed = fruit.speed - aspeed * 0.0167;
						fruit.bottom += fruit.speed * Math.sin((fruit.direct * 2 * Math.PI) / 360);
						fruit.left += Math.abs(fruit.speed) * Math.cos((fruit.direct * 2 * Math.PI) / 360);
						//var radius = size / 2;
						var x = fruit.left + size;
						var y = canvas.height - fruit.bottom;
						if (fruit.type != "blank") {
							if (fruit.check(x, y, 35)) fruit.boom = true;
							if (!fruit.loaded) {
								fruit.img = new Image();
								fruit.img.src = lib.assetURL + "extension/无名美化/image/zhengjing/" + fruit.fruitType + ".png";
								fruit.loaded = true;
								fruit.tipImg = new Image();
								fruit.tipImg.src = lib.assetURL + "extension/无名美化/image/zhengjing/" + fruit.tips + ".png";
							} else {
								fruit.angle += fruit.anglePercent;
								rotateCanvas(x, y, fruit.angle, fruit.img, fruit.name, size);
								if (first) {
									ctx.drawImage(fruit.tipImg, 0, 0, fruit.tipImg.width, fruit.tipImg.height, x - 40, y - size - 30, size, size);
								}
							}
							if (fruit.isOffScreen()) {
								//canvas.renderList.remove(render);
								fruit.type = "blank";
								canvas.items.remove(fruit);
								canvas.total--;
							}
						}
					}
					if (canvas.total === 0 && !_status.thzjFinished) {
						setResult();
					}
				}
				if (!_status.thzjFinished) {
					canvas.renderList.push(render);
					canvas.items.push(fruit);
				}
			};
			var firstIndex = 0;
			var next = function (name) {
				if (name == "bomb") game.playAudio("..", "extension", "无名美化", "audio", "zhengjing", "zhengjing_baozhudianhuo2");
				var alltime = Math.min(currentTime * 1000, cardList.length * 1500);
				addFruit(name, !_status.firstZhengjing && firstIndex < 2);
				firstIndex++;
				if (cardItem.length) {
					var time = alltime / cardItem.length;
					_setTimeout(next, get.rand(time, 2 * time), cardItem.shift());
				}
			};
			next(cardItem.shift());
		})();
		// 处理与实体的碰撞
		function handler(item) {
			if (_status.thzjFinished) return;
			if (item.isBomb) {
				setResult();
			} else {
				cutProcess[item.id]++;
				for (var k in cutProcess) {
					if (cutProcess[k] == cutNum[k] && !_status.thzhengjingFinished[k]) {
						_status.thzhengjingFinished[k] = true;
						game.playAudio("..", "extension", "无名美化", "audio", "zhengjing", "zhengjing_get");
						var finished = dcdAnim.loopSpine(window.ThunderZhengJing.zj_jihuo, {
							x: cardList.indexOf(k) * xPercent + document.body.offsetWidth * 0.5 + (xPercent - 144) * 0.5 - 235,
							y: document.body.offsetHeight * 0.5 - 163,
							scale: 0.72,
						});
						spines.add(finished);
						finished.oncomplete = function () {
							this.setAction("play02");
						};
					}
				}
				if (Object.keys(_status.thzhengjingFinished).length == cardList.length) setResult();
			}
		}

		function setResult() {
			_status.thzjFinished = true;
			_status.thzhengjingDaojishi = _status.thzhengjingDaojishiTotal = 140;
			game.thunderClearInterval(poemTimer);
			game.thunderClearInterval(_status.poemAddAlpha);
			canvas.renderList = [];
			canvas.items = [];
			for (var i = 0; i < spines.length; i++) {
				dcdAnim.stopSpine(spines[i]);
			}
			var result = [];
			for (var k in cutProcess) {
				if (cutProcess[k] == cutNum[k]) result.push(k);
			}
			if (Object.keys(_status.thzhengjingFinished).length == 0) {
				poemAlpha = Array(8).fill(0);
				canvas.renderList.push(function () {
					var jiesuanx, jiesuany, jiesuanwidth, jiesuanheight;
					jiesuanx = 100;
					jiesuany = 60;
					jiesuanwidth = 460;
					jiesuanheight = 200;
					if (player != game.me) {
						jiesuanx = 60;
						jiesuany = 100;
						jiesuanwidth = 540;
						jiesuanheight = 100;
					}
					if (!_status.firstfailed) {
						_status.firstfailed = true;
						_status.thzhengjingfailimg = new Image();
						_status.thzhengjingfailimg.src = lib.assetURL + "extension/无名美化/image/zhengjing/zhengjing_fail.png";
						if (player != game.me) _status.thzhengjingfailimg.src = lib.assetURL + "extension/无名美化/image/zhengjing/failed_tip.png";
					} else {
						ctx.drawImage(_status.thzhengjingfailimg, 0, 0, _status.thzhengjingfailimg.width, _status.thzhengjingfailimg.height, jiesuanx, jiesuany, jiesuanwidth, jiesuanheight);
					}
				});
			} else {
				poemAlpha = Array(8).fill(1);
				var getCards = cards.filter(function (card) {
					return result.contains(card.name);
				});
				_status.event._result = {
					bool: true,
					cards: getCards,
				};
				if (getCards.length) {
					var createCards = [];
					var xPercent2 = 610 / getCards.length;
					dcdAnim.loadSpine(window.ThunderZhengJing.zj_kabei.name, "skel", function () {
						for (var i = 0; i < getCards.length; i++) {
							var x = i * xPercent2 + (xPercent2 - 54) * 0.5 + 10;
							var info = [getCards[i].suit || undefined, getCards[i].number || undefined, getCards[i].name || undefined, getCards[i].nature || undefined];
							createCards[i] = ui.create.card(resultBg, "noclick", true).init(info);
							createCards[i].classList.add("th-zjcard");
							createCards[i].style.left = x + "px";
							dcdAnim.playSpine({ name: window.ThunderZhengJing.zj_kabei.name, speed: 0.5 }, { parent: createCards[i], scale: 0.75 });
						}
					});
				}
			}

			_setTimeout(function () {
				// 清理缓存
				timeoutIds.forEach(function (id) {
					clearTimeout(id);
				});
				intervalIds.forEach(function (id) {
					clearInterval(id);
				});
			}, 300);
			setTimeout(function () {
				zhengjingRender.stop = true;
				game.thunderClearInterval(_status.thunderzjLine);
				//dcdAnim.stopSpineAll();
				canvas.remove();
				canvas2.remove();
				bgcanvas.remove();
				resultBg.remove();
				game.resume();
			}, 3600);
		}
		function isMine() {
			return player === game.me && !_status.auto && !player.isMad();
		}
		_setInterval(function () {
			if (currentTime > 0) {
				currentTime--;
			}
		}, 1000);

		if (player != game.me) {
			dcdAnim.loadSpine(window.ThunderZhengJing.zj_pangguan.name, "skel", function () {
				dcdAnim.playSpine(window.ThunderZhengJing.zj_pangguan, {
					x: document.body.offsetWidth * 0.5,
					y: document.body.offsetHeight * 0.5 + 50,
					scale: 0.9,
				});
			});
		}
		// AI
		_setInterval(function () {
			if (isMine()) return;
			canvas.items.forEach(function (item) {
				if (item.type == "blank") return;
				var djl = get.rand(10) > 4;
				if (item.isBomb) return;
				if (djl) {
					item.boom = true;
					return;
				}
			});
		}, 400);
		function canvasDraw() {
			canvas.height = canvas.height;
			writePoem();
			canvas.renderList.forEach(function (fn) {
				fn();
			});
			// if (!lib.config['extension_Thunder_zjnotips']) {
			//     ctx.fillStyle = "#FFF";
			//     ctx.font = '30px "shousha"';
			//     ctx.fillText("若游戏速度过快或过慢，可在设置中调节速度", 40, 220);
			//     ctx.fillText("（双击屏幕将不再显示此提示）", 135, 270);
			// }
			//ctx2-------------
			_status.thzhengjingDaojishi = Math.max(0, --_status.thzhengjingDaojishi);
			ctx2.clearRect(0, _status.thzjFinished ? 0 : 50, canvas2.width, _status.thzjFinished ? 80 : 30);
			ctx2.font = '24px "th-zhongli"';
			ctx2.fillStyle = "#000";
			if (!_status.thzhengjingfirstload) {
				_status.thzhengjingfirstload = true;
				_status.thzhengjingTime = new Image();
				_status.thzhengjingTime.src = lib.assetURL + "extension/无名美化/image/effect/time.png";
				_status.thzhengjingTime.onload = function () {
					ctx2.drawImage(this, 0, 0, this.width, this.height, 50, 60, 540, 20);
				};
				_status.thzhengjingTimeCover = new Image();
				_status.thzhengjingTimeCover.src = lib.assetURL + "extension/无名美化/image/effect/timeX.png";
				var cardBg = new Image();
				cardBg.src = lib.assetURL + "extension/无名美化/image/zhengjing/cardBg.png";
				cardBg.onload = function () {
					for (let i = 0; i < cards.length; i++) {
						ctx2.drawImage(this, 0, 0, this.width, this.height, i * xPercent + (xPercent - 144) * 0.5, 0, 144, 45);
						if (get.type(cards[i]) == "basic") {
							let cardwidth = 34;
							var nature = get.nature(cards[i]);
							if (nature) {
								nature = "_" + nature;
								cardwidth = 50;
							}
							var vCard = new Image();
							vCard.src = lib.assetURL + "extension/无名美化/image/effect/card_" + cardList[i] + (nature ? nature : "") + ".png";
							vCard.onload = function () {
								ctx2.drawImage(this, 0, 0, this.width, this.height, (i + 0.5) * xPercent - cardwidth * 0.5, 2, cardwidth, 32);
							};
						} else {
							// document.fonts.ready.then(function () {
							ctx2.fillText(get.translation(cardList[i]), (i + 0.5) * xPercent - get.translation(cardList[i]).length * 0.5 * 15, 27, get.translation(cardList[i]).length * 15);
							// })
						}
					}
				};
				_status.thzhengjingProcess = new Image();
				_status.thzhengjingProcess.src = lib.assetURL + "extension/无名美化/image/zhengjing/zq_game_timebar_other.png";
			} else {
				ctx2.drawImage(_status.thzhengjingTime, 0, 0, _status.thzhengjingTime.width, _status.thzhengjingTime.height, 50, 60, 540, 20);
				ctx2.drawImage(_status.thzhengjingTimeCover, 0, 0, _status.thzhengjingTimeCover.width * (_status.thzhengjingDaojishi / _status.thzhengjingDaojishiTotal), _status.thzhengjingTimeCover.height, 52, 62, 536 * (_status.thzhengjingDaojishi / _status.thzhengjingDaojishiTotal), 16);
				if (!_status.thzjFinished) {
					for (var i = 0; i < cardList.length; i++) {
						ctx2.drawImage(_status.thzhengjingProcess, 0, 0, (_status.thzhengjingProcess.width * cutProcess[cardList[i]]) / cutNum[cardList[i]], _status.thzhengjingProcess.height, i * xPercent + (xPercent - 122) * 0.5, 35, (124 * cutProcess[cardList[i]]) / cutNum[cardList[i]], 5);
					}
				}
			}
		}
		let zhengjingRender = new game.thunderRAF(canvasDraw);
	},
};
export let _ThunderFn = {
	skillTips: function (tipname, id) {
		var dibeijing = ui.create.div(".th-dibeijing", document.body);
		dibeijing.style.zIndex = 16;
		var skilltip = ui.create.div(".th-skilltip", dibeijing);
		skilltip.innerHTML = tipname;
		var herf = document.getElementById(id);
		if (herf) {
			var left = herf.getBoundingClientRect().left;
			if (game.thunderIsPhone()) left += herf.offsetParent.offsetLeft;
			left += document.body.offsetWidth * 0.15;
			skilltip.style.left = left + "px";
			skilltip.style.top = herf.getBoundingClientRect().top + 30 + "px";
		}
		dibeijing.listen(function (e) {
			e.stopPropagation();
			this.remove();
		});
	},
	thunderAnimationPlayer: (function () {
		/**
		 * spine动画播放对象
		 * @param {string} pathPrefix  存放skel相关文件的地址, 供spine api的assetManager调用.
		 * @param {string||HTMLDivElement} parentNode  父节点对象如document.body, 如果传入的是'offscreen', 那么后面的elementId是离屏渲染使用的canvas对象
		 * @param {string|HTMLCanvasElement} elementId
		 */
		function thunderAnimationPlayer(pathPrefix, parentNode, elementId) {
			if (!window.spine) return console.error("spine 未定义.");

			var canvas;
			if (parentNode === "offscreen") {
				canvas = elementId;
				this.offscreen = true;
			} else {
				canvas = document.createElement("canvas");
				canvas.className = "th-animation-player";
				if (elementId != undefined) canvas.id = elementId;
				if (parentNode != undefined) parentNode.appendChild(canvas);
			}

			var config = { alpha: true };
			var gl = canvas.getContext("webgl2", config);
			if (gl == undefined) {
				gl = canvas.getContext("webgl", config) || canvas.getContext("experimental-webgl", config);
			} else {
				gl.isWebgl2 = true;
			}

			if (gl) {
				// 定义了spine动画的相关上下文, 都是后面渲染动画需要的内容, 文档可以参考官方后面的文档, 当前的文档找不到了, 只能找到ts版本的了.
				// https://github.com/EsotericSoftware/spine-runtimes/blob/726ad4ddbe5c9c8b386b495692c2f55c2039d15d/spine-ts/spine-webgl/example/index.html#L64
				this.spine = {
					shader: spine.webgl.Shader.newTwoColoredTextured(gl),
					batcher: new spine.webgl.PolygonBatcher(gl),
					skeletonRenderer: new spine.webgl.SkeletonRenderer(gl),
					assetManager: new spine.webgl.AssetManager(gl, pathPrefix),
					assets: {},
					skeletons: [],
				};
			} else {
				this.spine = { assets: {} };
				console.error("当前设备不支持 WebGL.");
			}

			this.gl = gl;
			this.canvas = canvas;
			this.$canvas = canvas;
			this.frameTime = undefined;
			this.running = false;
			this.resized = false;
			this.dpr = 1;
			this.nodes = [];
			this.BUILT_ID = 0; // 管理当前的动画id.  每个动画id对应一个APNode对象, 存入nodes数组.
			this._dprAdaptive = false;

			this.debugShader = spine.webgl.Shader.newColored(gl);

			Object.defineProperties(this, {
				dprAdaptive: {
					get: function () {
						return this._dprAdaptive;
					},
					set: function (value) {
						if (this._dprAdaptive == value) return;
						this._dprAdaptive = value;
						this.resized = false;
					},
				},
				useMipMaps: {
					get: function () {
						if (!gl) return;
						return this.gl.useMipMaps;
					},
					set: function (value) {
						if (!gl) return;
						this.gl.useMipMaps = value;
					},
				},
			});

			if (!this.offscreen) {
				this.canvas.width = canvas.clientWidth;
				this.canvas.height = canvas.clientHeight;
			}

			this.check = function () {
				if (!this.gl) {
					function empty() {}
					var key;
					for (key in this.__proto__) {
						if (typeof this.__proto__[key] == "function") {
							this.__proto__[key] = empty;
						}
					}

					for (key in this) {
						if (typeof this[key] == "function" && key != "check") {
							this[key] = empty;
						}
					}
				}
			};

			this.check();
		}

		thunderAnimationPlayer.prototype.createTextureRegion = function (image, name) {
			var page = new spine.TextureAtlasPage();
			page.name = name;
			page.uWrap = spine.TextureWrap.ClampToEdge;
			page.vWrap = spine.TextureWrap.ClampToEdge;
			page.texture = this.spine.assetManager.textureLoader(image);
			page.texture.setWraps(page.uWrap, page.vWrap);
			page.width = page.texture.getImage().width;
			page.height = page.texture.getImage().height;

			var region = new spine.TextureAtlasRegion();
			region.page = page;
			region.rotate = false;
			region.width = page.width;
			region.height = page.height;
			region.x = 0;
			region.y = 0;
			region.u = region.x / page.width;
			region.v = region.y / page.height;
			if (region.rotate) {
				region.u2 = (region.x + region.height) / page.width;
				region.v2 = (region.y + region.width) / page.height;
			} else {
				region.u2 = (region.x + region.width) / page.width;
				region.v2 = (region.y + region.height) / page.height;
			}

			region.originalWidth = page.width;
			region.originalHeight = page.height;
			region.index = -1;
			region.texture = page.texture;
			region.renderObject = region;

			return region;
		};

		thunderAnimationPlayer.prototype.hasSpine = function (filename) {
			return this.spine.assets[filename] != undefined;
		};

		thunderAnimationPlayer.prototype.loadSpine = function (filename, skelType, onload, onerror) {
			skelType = skelType == undefined ? "skel" : skelType.toLowerCase();
			var thisAnim = this;
			var reader = {
				name: filename,
				filename: filename,
				skelType: skelType,
				onsuccess: onload,
				onfailed: onerror,
				loaded: 0,
				errors: 0,
				toLoad: 2,
				onerror: function (path, msg) {
					var _this = reader;
					_this.toLoad--;
					_this.errors++;
					if (_this.toLoad == 0) {
						console.error("loadSpine: [" + _this.filename + "] 加载失败.");
						if (_this.onfailed) _this.onfailed();
					}
				},
				onload: function (path, data) {
					var _this = reader;
					_this.toLoad--;
					_this.loaded++;
					if (_this.toLoad == 0) {
						if (_this.errors > 0) {
							console.error("loadSpine: [" + _this.filename + "] 加载失败.");
							if (_this.onfailed) _this.onfailed();
						} else {
							thisAnim.spine.assets[_this.filename] = {
								name: _this.filename,
								skelType: _this.skelType,
							};
							if (_this.onsuccess) _this.onsuccess();
						}
					}
				},
				ontextLoad: function (path, data) {
					var _this = reader;
					var imageName = null;
					var atlasReader = new spine.TextureAtlasReader(data);
					var prefix = "";
					var a = _this.name.lastIndexOf("/");
					var b = _this.name.lastIndexOf("\\");
					if (a != -1 || b != -1) {
						if (a > b) prefix = _this.name.substring(0, a + 1);
						else prefix = _this.name.substring(0, b + 1);
					}

					while (true) {
						var line = atlasReader.readLine();
						if (line == null) break;
						line = line.trim();

						if (line.length == 0) {
							imageName = null;
						} else if (!imageName) {
							imageName = line;
							_this.toLoad++;
							thisAnim.spine.assetManager.loadTexture(prefix + imageName, _this.onload, _this.onerror);
						} else {
							continue;
						}
					}

					_this.onload(path, data);
				},
			};

			if (skelType == "json") {
				thisAnim.spine.assetManager.loadText(filename + ".json", reader.onload, reader.onerror);
			} else {
				thisAnim.spine.assetManager.loadBinary(filename + ".skel", reader.onload, reader.onerror);
			}

			thisAnim.spine.assetManager.loadText(filename + ".atlas", reader.ontextLoad, reader.onerror);
		};

		thunderAnimationPlayer.prototype.prepSpine = function (filename, autoLoad) {
			var _this = this;
			var spineAssets = _this.spine.assets;
			if (!spineAssets[filename]) {
				if (autoLoad) {
					_this.loadSpine(filename, "skel", function () {
						_this.prepSpine(filename);
					});
					return "loading";
				}
				return console.error("prepSpine: [" + filename + "] 骨骼没有加载");
			}

			var skeleton;
			var skeletons = _this.spine.skeletons;
			for (var i = 0; i < skeletons.length; i++) {
				skeleton = skeletons[i];
				if (skeleton.name == filename && skeleton.completed) return skeleton;
			}

			var asset = spineAssets[filename];
			var manager = _this.spine.assetManager;

			// 下面的获取原始数据是spine动画的固定写法, api可以参考官网 https://github.com/EsotericSoftware/spine-runtimes/blob/726ad4ddbe5c9c8b386b495692c2f55c2039d15d/spine-ts/spine-webgl/example/index.html#L158
			var skelRawData = asset.skelRawData;
			if (!skelRawData) {
				var prefix = "";
				var a = filename.lastIndexOf("/");
				var b = filename.lastIndexOf("\\");
				if (a != -1 || b != -1) {
					if (a > b) prefix = filename.substring(0, a + 1);
					else prefix = filename.substring(0, b + 1);
				}
				var atlas = new spine.TextureAtlas(manager.get(filename + ".atlas"), function (path) {
					return manager.get(prefix + path);
				});

				var atlasLoader = new spine.AtlasAttachmentLoader(atlas);
				if (asset.skelType.toLowerCase() == "json") {
					skelRawData = new spine.SkeletonJson(atlasLoader);
				} else {
					skelRawData = new spine.SkeletonBinary(atlasLoader);
				}

				spineAssets[filename].skelRawData = skelRawData;
				spineAssets[filename].ready = true;
			}

			var data = skelRawData.readSkeletonData(manager.get(filename + "." + asset.skelType));
			skeleton = new spine.Skeleton(data);

			// 为骨骼添加名字
			skeleton.name = filename;
			// 标记骨骼加载状态为true
			skeleton.completed = true;

			skeleton.setSkinByName("default");
			skeleton.setToSetupPose();
			skeleton.updateWorldTransform();
			skeleton.state = new spine.AnimationState(new spine.AnimationStateData(skeleton.data));
			skeleton.state.addListener({
				complete: function (track) {
					var node = skeleton.node;
					if (node) {
						track.loop = node.loop == undefined ? false : node.loop;
						if (track.loop && node.loopCount > 0) {
							node.loopCount--;
							if (node.loopCount == 0) track.loop = false;
						}
						skeleton.completed = node.completed = !track.loop;
						if (node.complete) node.complete();
					} else {
						skeleton.completed = !track.loop;
						console.error("skeleton complete: 超出预期的错误");
					}
				},
			});
			skeleton.bounds = {
				offset: new spine.Vector2(),
				size: new spine.Vector2(),
			};
			skeleton.getBounds(skeleton.bounds.offset, skeleton.bounds.size, []);
			skeleton.defaultAction = data.animations[0].name;
			skeleton.node = undefined;
			skeletons.push(skeleton);
			return skeleton;
		};

		thunderAnimationPlayer.prototype.playSpine = function (sprite, position) {
			// if (self.duicfg && !self.duicfg.gameAnimationEffect) return;
			if (sprite == undefined) return console.error("playSpine: parameter undefined");
			if (typeof sprite == "string") sprite = { name: sprite };
			if (!this.hasSpine(sprite.name)) return console.error("playSpine: [" + sprite.name + "] 骨骼没有加载");

			var skeletons = this.spine.skeletons;
			var skeleton;
			if (!(sprite instanceof decadeUI.APNode && sprite.skeleton.completed)) {
				for (var i = 0; i < skeletons.length; i++) {
					skeleton = skeletons[i];
					if (skeleton.name == sprite.name && skeleton.completed) break;
					skeleton = null;
				}
				if (!skeleton) skeleton = this.prepSpine(sprite.name);

				if (!(sprite instanceof decadeUI.APNode)) {
					var param = sprite;
					sprite = new decadeUI.APNode(sprite);
					sprite.id = param.id == undefined ? this.BUILT_ID++ : param.id;
					this.nodes.push(sprite);
				}

				sprite.skeleton = skeleton;
				skeleton.node = sprite;
			}

			sprite.completed = false;
			skeleton.completed = false;

			if (position != undefined) {
				sprite.x = position.x;
				sprite.y = position.y;
				sprite.height = position.height;
				sprite.width = position.width;
				sprite.scale = position.scale;
				sprite.angle = position.angle;
				sprite.referNode = position.parent;
				sprite.referFollow = position.follow;
			}

			var entry = skeleton.state.setAnimation(0, sprite.action ? sprite.action : skeleton.defaultAction, sprite.loop);
			entry.mixDuration = 0;
			if (this.requestId == undefined) {
				this.running = true;
				if (!this.offscreen) this.canvas.style.visibility = "visible";
				this.requestId = requestAnimationFrame(this.render.bind(this));
			}

			sprite.referBounds = undefined;
			return sprite;
		};

		thunderAnimationPlayer.prototype.loopSpine = function (sprite, position) {
			if (typeof sprite == "string") {
				sprite = {
					name: sprite,
					loop: true,
				};
			} else {
				sprite.loop = true;
			}

			return this.playSpine(sprite, position);
		};

		thunderAnimationPlayer.prototype.stopSpine = function (sprite) {
			var nodes = this.nodes;
			var id = sprite.id == undefined ? sprite : sprite.id;
			for (var i = 0; i < nodes.length; i++) {
				sprite = nodes[i];
				if (sprite.id == id) {
					if (!sprite.completed) {
						sprite.completed = true;
						sprite.skeleton.state.setEmptyAnimation(0);
					}
					return sprite;
				}
			}

			return null;
		};

		thunderAnimationPlayer.prototype.stopSpineAll = function () {
			var sprite;
			var nodes = this.nodes;
			for (var i = 0; i < nodes.length; i++) {
				sprite = nodes[i];
				if (!sprite.completed) {
					sprite.completed = true;
					sprite.skeleton.state.setEmptyAnimation(0);
				}
			}
		};

		thunderAnimationPlayer.prototype.getSpineActions = function (filename) {
			if (!this.hasSpine(filename)) return console.error("getSpineActions: [" + filename + "] 骨骼没有加载");

			var skeleton;
			var skeletons = this.spine.skeletons;
			for (var i = 0; i < skeletons.length; i++) {
				skeleton = skeletons[i];
				if (skeleton.name == filename) break;
				skeleton = undefined;
			}

			if (skeleton == undefined) skeleton = this.prepSpine(filename);
			var actions = skeleton.data.animations;
			var result = new Array(actions.length);
			for (var i = 0; i < actions.length; i++)
				result[i] = {
					name: actions[i].name,
					duration: actions[i].duration,
				};
			return result;
		};

		thunderAnimationPlayer.prototype.getSpineBounds = function (filename) {
			if (!this.hasSpine(filename)) return console.error("getSpineBounds: [" + filename + "] 骨骼没有加载");

			if (!this.resized) {
				var dpr = 1;
				if (this.dprAdaptive == true) dpr = Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1);

				canvas.elementHeight = canvas.clientHeight;
				canvas.elementWidth = canvas.clientWidth;
				canvas.height = canvas.elementHeight * dpr;
				canvas.width = canvas.elementWidth * dpr;
			}

			var skeleton;
			var skeletons = this.spine.skeletons;
			for (var i = 0; i < skeletons.length; i++) {
				skeleton = skeletons[i];
				if (skeleton.name == filename) break;
				skeleton = undefined;
			}

			if (skeleton == undefined) skeleton = this.prepSpine(filename);
			return skeleton.bounds;
		};

		thunderAnimationPlayer.prototype.render = function (timestamp) {
			var canvas = this.canvas;
			var offscreen = this.offscreen;
			var dpr = 1;
			if (this.dprAdaptive) {
				if (offscreen) dpr = this.dpr != undefined ? this.dpr : 1;
				else dpr = Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1);
			}
			var delta = timestamp - (this.frameTime == undefined ? timestamp : this.frameTime);
			this.frameTime = timestamp;

			var erase = true;
			var resize = !this.resized || canvas.width == 0 || canvas.height == 0;
			if (resize) {
				this.resized = true;
				if (!offscreen) {
					canvas.width = dpr * canvas.clientWidth;
					canvas.height = dpr * canvas.clientHeight;
					erase = false;
				} else {
					if (this.width) {
						canvas.width = dpr * this.width;
						erase = false;
					}
					if (this.height) {
						canvas.height = dpr * this.height;
						erase = false;
					}
				}
			}

			var ea = {
				dpr: dpr,
				delta: delta,
				canvas: canvas,
				frameTime: timestamp,
			};

			var nodes = this.nodes;
			for (var i = 0; i < nodes.length; i++) {
				if (!nodes[i].completed) {
					nodes[i].update(ea);
				} else {
					nodes.remove(nodes[i]);
					i--;
				}
			}

			var gl = this.gl;
			gl.viewport(0, 0, canvas.width, canvas.height);

			if (erase) {
				gl.clearColor(0, 0, 0, 0);
				gl.clear(gl.COLOR_BUFFER_BIT);
			}

			if (nodes.length == 0) {
				this.frameTime = void 0;
				this.requestId = void 0;
				this.running = false;
				if (!offscreen) this.canvas.style.visibility = "hidden";
				return;
			}

			var sprite, state, skeleton;
			var shader = this.spine.shader;
			var batcher = this.spine.batcher;
			var renderer = this.spine.skeletonRenderer;

			gl.enable(gl.SCISSOR_TEST);
			gl.scissor(0, 0, canvas.width, canvas.height);

			if (this.bindShader == undefined) {
				this.bindShader = shader;
				shader.bind();
				shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
			}

			var speed;
			for (var i = 0; i < nodes.length; i++) {
				sprite = nodes[i];
				if (sprite.renderClip != undefined) {
					gl.clipping = sprite.renderClip;
					gl.scissor(gl.clipping.x, gl.clipping.y, gl.clipping.width, gl.clipping.height);
				}

				skeleton = sprite.skeleton;
				state = skeleton.state;
				speed = sprite.speed == undefined ? 1 : sprite.speed;
				skeleton.flipX = sprite.flipX;
				skeleton.flipY = sprite.flipY;
				skeleton.opacity = sprite.renderOpacity == undefined ? 1 : sprite.renderOpacity;
				state.hideSlots = sprite.hideSlots;
				state.update((delta / 1000) * speed);
				state.apply(skeleton);
				skeleton.updateWorldTransform();
				// sprite.mvp.translate(canvas.width*(-0.1), -0.1 * canvas.height, 0)
				// if (sprite.renderX && sprite.renderY) {
				// 	sprite.mvp.translate(sprite.renderX, sprite.renderY, 0)
				// }
				shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, sprite.mvp.values);
				batcher.begin(shader);
				renderer.premultipliedAlpha = sprite.premultipliedAlpha;
				renderer.outcropMask = this.outcropMask;
				if (renderer.outcropMask) {
					renderer.outcropX = sprite.renderX;
					renderer.outcropY = sprite.renderY;
					renderer.outcropScale = sprite.renderScale;
					renderer.outcropAngle = sprite.renderAngle;
					renderer.clipSlots = sprite.clipSlots;
				}

				renderer.hideSlots = sprite.hideSlots;
				renderer.disableMask = sprite.disableMask;
				renderer.draw(batcher, skeleton);
				batcher.end();

				if (gl.clipping) {
					gl.clipping = undefined;
					gl.scissor(0, 0, canvas.width, canvas.height);
				}
			}

			gl.disable(gl.SCISSOR_TEST);

			// this.debugShader.bind();
			// this.debugShader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);
			// this.debugRenderer.premultipliedAlpha = premultipliedAlpha;
			// this.shapes.begin(debugShader);
			// this.debugRenderer.draw(shapes, skeleton);
			// this.shapes.end();
			// this.debugShader.unbind();

			this.requestId = requestAnimationFrame(this.render.bind(this));
		};
		return thunderAnimationPlayer;
	})(),
};
export let ThunderContent = {
	$thdeletedam: function () {
		var node = this.getElementsByClassName("damageadded")[0];
		if (node) node.delete();
	},
	chooseToYuqi: function () {
		"step 0";
		// 保留了个原版的函数可调用
		// window.chooseToMoveDialog
		if (event.chooseTime && _status.connectMode && !game.online) {
			event.time = lib.configOL.choose_timeout;
			game.broadcastAll(function (time) {
				lib.configOL.choose_timeout = time;
			}, event.chooseTime);
		}
		function isOverlap(obj1, obj2) {
			if (!obj1 || !obj2) return false;
			var rect1 = obj1.getBoundingClientRect(),
				rect2 = obj2.getBoundingClientRect();
			var numx = (rect1.right - rect1.left) / 2,
				numy = (rect1.bottom - rect1.top) / 2;
			if (rect1.left + numx > rect2.left && rect1.left + numx < rect2.right && rect1.top + numy > rect2.top && rect1.top + numy < rect2.bottom) return true;
			return false;
		}
		game.thunderForbidTouch();
		var list = event.list;
		var filterMove = event.filterMove;
		var filterOk = event.filterOk;
		_status.imchoosing = true;
		var event = _status.event;
		event.settleed = false;
		if (event.isMine()) {
			event.dibeijing = ui.create.div(".th-dibeijing", document.body);
			var str = get.translation(event.getParent().name) || event.prompt || "请选择要操作的牌";
			console.log("str", str, event.getParent().name, event.prompt);
			//friendmanjuan_cost 友庞统的处理
			if (str == "friendmanjuan_cost") str = "漫卷";
			var yuqiDialogHeight = 320 * (game.thunderIsPhone() ? 0.66 : 0.88) + 40;
			var yuqipartWidth = game.thunderIsPhone() ? 620 : 800;
			event.yuqiDialog = game.thunderDialog(event.player, str, event.dibeijing, yuqiDialogHeight + 40, yuqipartWidth * 1.45);
			if (event.yuqiDialog.theme == "shousha") {
				var sstishi = ui.create.div(".th-sstishi", event.yuqiDialog.container);
				// var sstishilist = ['牌堆', '手牌'];
				var sstishilist = ["上栏", "下栏"];
				for (var i = 0; i < list.length; i++) {
					if (i > 1) continue;
					let sstishiX = ui.create.div(".th-sstishiX", sstishi);
					sstishiX.innerHTML = sstishilist[i];
				}
			}
			var yuqiPart = ui.create.div(".th-yuqipart", event.yuqiDialog.container);
			yuqiPart.style.setProperty("--w", yuqipartWidth + "px");
			if (player != game.me && event.yuqiDialog.theme == "decade") game.thunderCreateStand(player, event.yuqiDialog.container, event.yuqiDialog.dialogHeight, 1.2);
			// yuqiPart.draggable = true;
			if (game.thunderHasExt("十周年") && game.thunderIsPhone()) yuqiPart.classList.add("dui-mobile", "th-yuqimobile");
			event.switchToAuto = function () {
				if (!filterOk(event.moved)) {
					if (!event.forced) event._result = { bool: false };
					else event._result = "ai";
				} else {
					event._result = {
						bool: true,
						moved: event.moved,
					};
				}
				if (ui.confirm) ui.confirm.close();
				game.resume(player);
				_status.imchoosing = false;
			};
			event.moved = [];
			var buttonss = [];
			var updateButtons = function () {
				for (let i of buttonss) {
					let all = i.childNodes.length,
						left,
						width;
					if (i.classList.contains("th-yuqi0")) width = yuqipartWidth;
					else width = Math.floor((yuqipartWidth * 100) / (event.list.length - 1)) / 100;
					if (all == 1) left = 200;
					else left = Math.floor(((width - 108) / (all - 1)) * 100) / 100;
					for (let x = 0; x < all; x++) {
						if (left < 108) i.childNodes[x].style.left = `${left * x}px`;
						else i.childNodes[x].style.left = `${108 * x}px`;
					}
					event.moved[i._link] = get.links(Array.from(i.childNodes));
					if (i.textPrompt) i.previousSibling.innerHTML = '<div class="text center">' + i.textPrompt(event.moved[i._link]) + "</div>";
				}
				if (filterOk(event.moved)) {
					ui.create.confirm("o");
				} else {
					if (!event.forced) ui.create.confirm("c");
					else if (ui.confirm) ui.confirm.close();
				}
				if (game.thunderHasExt("十周年")) {
					var con = document.getElementById("dui-controls");
					con.classList.add("th-confirmdown2");
				}
				if (ui.selected.guanxing_button) {
					// ui.selected.guanxing_button.style.zIndex = 0;
					ui.selected.guanxing_button.style.opacity = 1;
					ui.selected.guanxing_button.style["transition"] = "none";
					ui.selected.guanxing_button.style["transition-duration"] = "0";
					var butt1 = document.querySelectorAll(".th-yuqiAa");
					var ftp1 = 0;
					for (let k = 0; k < butt1.length; k++) {
						// 遍历butt1
						if (ui.selected.guanxing_button.parentNode != butt1[k]) {
							ftp1 += k * 100;
						}
					}
					var juTop = ui.selected.guanxing_button.fromTop0 - ftp1;
					ui.selected.guanxing_button.style.transform = "translate(" + (ui.selected.guanxing_button.yuanLeft1 + ui.selected.guanxing_button.yuanLeft0 - parseFloat(ui.selected.guanxing_button.style.left.slice(0, -2))) + "px, calc(" + (ui.selected.guanxing_button.yuanTop1 + ui.selected.guanxing_button.yuanTop0) + "px - " + juTop + "%))";
					window.gx_bt_opa = function (num, him) {
						him.style.opacity = num * 0.1;
						if (num < 10) {
							setTimeout(function () {
								window.gx_bt_opa(num + 1, him);
							}, 20);
						}
					};
					setTimeout(function () {
						ui.selected.guanxing_button.style["transition"] = "all 0.5s";
						ui.selected.guanxing_button.style["transition-duration"] = "0.5s";
						ui.selected.guanxing_button.style.transform = "translate(0,0)";
						delete ui.selected.guanxing_button;
					}, 0);
				}
			};
			var content = [];
			for (var ik = 0; ik < 2; ik++) {
				content[ik] = ui.create.div(".th-yuqiContent", yuqiPart);
			}
			event.dibeijing.addEventListener(lib.config.touchscreen ? "touchmove" : "mousemove", move);
			event.dibeijing.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", end);
			function start(evt) {
				ui.selected.guanxing_button = this;
				ui.selected.guanxing_button.style.zIndex = 10;
				_status.yuqiTouchX = lib.config.touchscreen ? evt.touches[0].clientX : evt.pageX;
				_status.yuqiTouchY = lib.config.touchscreen ? evt.touches[0].clientY : evt.pageY;
				ui.selected.guanxing_button.style["transition-duration"] = "0.05s";
				ui.selected.guanxing_button.yuanLeft0 = parseFloat(ui.selected.guanxing_button.style.left.slice(0, -2));
				ui.selected.guanxing_button.yuanTop0 = ui.selected.guanxing_button.style.top.length > 2 ? parseFloat(ui.selected.guanxing_button.style.top.slice(0, -2)) : 0;
				var butt1 = document.querySelectorAll(".th-yuqiAa");
				var ftp0 = 0;
				for (let k = 0; k < butt1.length; k++) {
					//遍历butt1
					if (ui.selected.guanxing_button.parentNode != butt1[k]) {
						ftp0 += k * 100;
					}
				}
				ui.selected.guanxing_button.fromTop0 = ftp0;
				window.guanxing_button_xy = false;
			}
			function move(e) {
				if (!ui.selected.guanxing_button) return;
				let x = ((lib.config.touchscreen ? e.touches[0].clientX : e.pageX) - _status.yuqiTouchX) / game.documentZoom / (game.thunderIsPhone() ? 0.8 : 1);
				let y = ((lib.config.touchscreen ? e.touches[0].clientY : e.pageY) - _status.yuqiTouchY) / game.documentZoom / (game.thunderIsPhone() ? 0.8 : 1);
				window.guanxing_button_xy = [parseFloat(ui.selected.guanxing_button.style.left) + x, y];
				// window.guanxing_button_xys=[x,y];
				ui.selected.guanxing_button.yuanLeft1 = x;
				ui.selected.guanxing_button.yuanTop1 = y;
				ui.selected.guanxing_button.style.transform = `translate(${x}px,${y}px)`;
			}
			function end() {
				if (!ui.selected.guanxing_button) return;
				ui.selected.guanxing_button.style.opacity = 1;
				var butt1 = document.querySelectorAll(".th-yuqiAa");
				for (let k = 0; k < butt1.length; k++) {
					// 遍历butt1
					if (isOverlap(ui.selected.guanxing_button, butt1[k])) {
						// 如果与卡槽相交
						if (ui.selected.guanxing_button.parentNode != butt1[k] && filterMove(ui.selected.guanxing_button, butt1[k]._link, event.moved)) {
							butt1[k].appendChild(ui.selected.guanxing_button);
							ui.selected.guanxing_button.style.opacity = 0;
							updateButtons();
							return;
						} else {
							// 检查是否与卡牌相交
							for (let l of butt1[k].childNodes) {
								if (isOverlap(ui.selected.guanxing_button, l)) {
									if (filterMove(l, ui.selected.guanxing_button, event.moved) && ui.selected.guanxing_button != l) {
										var par1 = ui.selected.guanxing_button.parentNode,
											ind1 = ui.selected.guanxing_button.nextSibling,
											par2 = l.parentNode,
											ind2 = l.nextSibling;
										par1.insertBefore(l, ind1);
										par2.insertBefore(ui.selected.guanxing_button, ind2);
										ui.selected.guanxing_button.style.opacity = 0;
										updateButtons();
										return;
									}
								}
							}
							if (k == butt1.length - 1) {
								ui.selected.guanxing_button.style.transform = "translate(0,0)";
								ui.selected.guanxing_button.style.zIndex = 0;
								// ui.selected.guanxing_button.style.opacity = 1;
								delete ui.selected.guanxing_button;
								return;
							}
						}
					}
				}
				ui.selected.guanxing_button.style.transform = "translate(0,0)";
				ui.selected.guanxing_button.style.zIndex = 0;
				// ui.selected.guanxing_button.style.opacity = 1;
				delete ui.selected.guanxing_button;
			}
			let elEventList = [];
			for (let i = 0; i < list.length; i++) {
				var yuqii = ui.create.div(".th-yuqiBb", i == 0 ? content[0] : content[1]);
				yuqii.style.flexDirection = i == 0 ? "column" : "column-reverse";
				if (i != 0) yuqii.style.setProperty("--w", `${Math.floor(100 / (list.length - 1))}%`);
				var tishi = ui.create.div(".th-tishi", yuqii);
				tishi.innerHTML = list[i][0];
				tishi.style["font-family"] = "shousha";
				tishi.style["font-size"] = "25px";
				var buttons = ui.create.div(".buttons", yuqii);
				buttons._link = i;
				buttonss.push(buttons);
				buttons.classList.add("th-yuqiAa", "th-yuqi" + i);
				if (event.yuqiDialog.theme == "decade") buttons.style.backgroundColor = "rgba(162, 133, 91, 0.4)";
				else buttons.style.backgroundColor = "rgba(76, 65, 59, 0.4)";
				if (game.thunderIsPhone()) {
					buttons.style.setProperty("--z", 0.7);
					buttons.style.setProperty("--h", "38px");
				}
				if (list[i][1]) {
					if (get.itemtype(list[i][1]) == "cards") {
						var cardType = player == game.me ? "card" : "blank";
						var bb = ui.create.buttons(list[i][1], cardType, buttons);
						if (list[i][2] && typeof list[i][2] == "string") {
							for (let ij of bb) {
								if (ij.node) ij.node.gaintag.innerHTML = get.translation(list[i][2]);
							}
						}
					} else if (list[i][1].length == 2) {
						var bb = ui.create.buttons(list[i][1][0], list[i][1][1], buttons);
					}
					if (!bb) continue;
					for (let j = 0; j < bb.length; j++) {
						// debugger
						bb[j].addEventListener("click", function () {
							if (!event.isMine()) return;
							clickButton(this);
						});
						bb[j].addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", start);

						elEventList.push(bb[j]);
					}
				}
			}
			updateButtons();
			event.aiList = event.processAI(event.list);
			function clickButton(button) {
				var node = button.parentNode;
				if (!buttonss.contains(node)) return;
				ui.selected.guanxing_button = button;
				if (!filterMove(ui.selected.guanxing_button, 0, event.moved)) return;
				document.getElementsByClassName("th-yuqi0")[0].appendChild(ui.selected.guanxing_button);
				delete ui.selected.guanxing_button;
				updateButtons();
			}
			game.pause(player);
			game.countChoose();
			event.choosing = true;

			event.custom.replace.confirm = function (bool) {
				// 移除监听事件
				elEventList.forEach(item => {
					if (typeof item === "object") {
						item.removeEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", start);
					}
				});
				elEventList = [];
				if (bool)
					event._result = {
						bool: true,
						moved: event.moved,
					};
				else event._result = { bool: false };
				if (ui.confirm) ui.confirm.close();
				if (event.dibeijing) event.dibeijing.removeEventListener(lib.config.touchscreen ? "touchmove" : "mousemove", move);
				if (event.dibeijing) event.dibeijing.removeEventListener(lib.config.touchscreen ? "touchend" : "mouseup", end);
				event.moved.forEach(i => {
					i.forEach(j => {
						// debugger
						if (typeof j === "object" && j.nodeType == 1) {
							j.removeEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", start);
						}
					});
				});
				game.resume(player);
				_status.imchoosing = false;
			};
		} else if (event.isOnline()) {
			event.send();
		} else {
			event.result = "ai";
		}
		("step 1");
		game.thunderAllowTouch();
		if (event.time)
			game.broadcastAll(function (time) {
				lib.configOL.choose_timeout = time;
			}, event.time);
		var result = event.result || result;
		if ((!result || result == "ai" || (event.forced && !result.bool)) && event.processAI) {
			var moved = event.processAI(event.list);
			if (moved)
				result = {
					bool: true,
					moved: moved,
				};
			else result = { bool: false };
		}
		event.result = result;
		if (event.yuqiDialog) event.yuqiDialog.remove();
		if (event.dibeijing) event.dibeijing.remove();
		if (game.thunderHasExt("十周年")) {
			var con = document.getElementById("dui-controls");
			if (con && con.classList) con.classList.remove("th-confirmdown2");
		}
	},
	chooseToYuqiNew: function () {
		"step 0";
		// 保留了个原版的函数可调用
		// window.chooseToMoveDialog
		if (event.chooseTime && _status.connectMode && !game.online) {
			event.time = lib.configOL.choose_timeout;
			game.broadcastAll(function (time) {
				lib.configOL.choose_timeout = time;
			}, event.chooseTime);
		}
		function isOverlap(obj1, obj2) {
			if (!obj1 || !obj2) return false;
			var rect1 = obj1.getBoundingClientRect(),
				rect2 = obj2.getBoundingClientRect();
			var numx = (rect1.right - rect1.left) / 2,
				numy = (rect1.bottom - rect1.top) / 2;
			if (rect1.left + numx > rect2.left && rect1.left + numx < rect2.right && rect1.top + numy > rect2.top && rect1.top + numy < rect2.bottom) return true;
			return false;
		}
		game.thunderForbidTouch();
		var list = event.list;
		// --------------------------------------------------------------------
		// 整个 chooseToYuqi 就加了这一点代码
		// 对于 chooseToMove_new 新用法的简单适配，可能导致部分显示出错
		let newList = [];
		for (let block of list) {
			if (Array.isArray(block) && block.every(Array.isArray)) {
				newList.push(...block);
			} else {
				newList.push(block);
			}
		}
		list = event.list = newList;
		// --------------------------------------------------------------------
		var filterMove = event.filterMove;
		var filterOk = event.filterOk;
		_status.imchoosing = true;
		var event = _status.event;
		event.settleed = false;
		if (event.isMine()) {
			event.dibeijing = ui.create.div(".th-dibeijing", document.body);
			var str = get.translation(event.getParent().name) || event.prompt || "请选择要操作的牌";
			var yuqiDialogHeight = 320 * (game.thunderIsPhone() ? 0.66 : 0.88) + 40;
			var yuqipartWidth = game.thunderIsPhone() ? 620 : 800;
			event.yuqiDialog = game.thunderDialog(event.player, str, event.dibeijing, yuqiDialogHeight + 40, yuqipartWidth * 1.45);
			if (event.yuqiDialog.theme == "shousha") {
				var sstishi = ui.create.div(".th-sstishi", event.yuqiDialog.container);
				// var sstishilist = ['牌堆', '手牌'];
				var sstishilist = ["上栏", "下栏"];
				for (var i = 0; i < list.length; i++) {
					if (i > 1) continue;
					let sstishiX = ui.create.div(".th-sstishiX", sstishi);
					sstishiX.innerHTML = sstishilist[i];
				}
			}
			var yuqiPart = ui.create.div(".th-yuqipart", event.yuqiDialog.container);
			yuqiPart.style.setProperty("--w", yuqipartWidth + "px");
			if (player != game.me && event.yuqiDialog.theme == "decade") game.thunderCreateStand(player, event.yuqiDialog.container, event.yuqiDialog.dialogHeight, 1.2);
			// yuqiPart.draggable = true;
			if (game.thunderHasExt("十周年") && game.thunderIsPhone()) yuqiPart.classList.add("dui-mobile", "th-yuqimobile");
			event.switchToAuto = function () {
				if (!filterOk(event.moved)) {
					if (!event.forced) event._result = { bool: false };
					else event._result = "ai";
				} else {
					event._result = {
						bool: true,
						moved: event.moved,
					};
				}
				if (ui.confirm) ui.confirm.close();
				game.resume(player);
				_status.imchoosing = false;
			};
			event.moved = [];
			var buttonss = [];
			var updateButtons = function () {
				for (let i of buttonss) {
					let all = i.childNodes.length,
						left,
						width;
					if (i.classList.contains("th-yuqi0")) width = yuqipartWidth;
					else width = Math.floor((yuqipartWidth * 100) / (event.list.length - 1)) / 100;
					if (all == 1) left = 200;
					else left = Math.floor(((width - 108) / (all - 1)) * 100) / 100;
					for (let x = 0; x < all; x++) {
						if (left < 108) i.childNodes[x].style.left = `${left * x}px`;
						else i.childNodes[x].style.left = `${108 * x}px`;
					}
					event.moved[i._link] = get.links(Array.from(i.childNodes));
					if (i.textPrompt) i.previousSibling.innerHTML = '<div class="text center">' + i.textPrompt(event.moved[i._link]) + "</div>";
				}
				if (filterOk(event.moved)) {
					ui.create.confirm("o");
				} else {
					if (!event.forced) ui.create.confirm("c");
					else if (ui.confirm) ui.confirm.close();
				}
				if (game.thunderHasExt("十周年")) {
					var con = document.getElementById("dui-controls");
					con.classList.add("th-confirmdown2");
				}
				if (ui.selected.guanxing_button) {
					// ui.selected.guanxing_button.style.zIndex = 0;
					ui.selected.guanxing_button.style.opacity = 1;
					ui.selected.guanxing_button.style["transition"] = "none";
					ui.selected.guanxing_button.style["transition-duration"] = "0";
					var butt1 = document.querySelectorAll(".th-yuqiAa");
					var ftp1 = 0;
					for (let k = 0; k < butt1.length; k++) {
						// 遍历butt1
						if (ui.selected.guanxing_button.parentNode != butt1[k]) {
							ftp1 += k * 100;
						}
					}
					var juTop = ui.selected.guanxing_button.fromTop0 - ftp1;
					ui.selected.guanxing_button.style.transform = "translate(" + (ui.selected.guanxing_button.yuanLeft1 + ui.selected.guanxing_button.yuanLeft0 - parseFloat(ui.selected.guanxing_button.style.left.slice(0, -2))) + "px, calc(" + (ui.selected.guanxing_button.yuanTop1 + ui.selected.guanxing_button.yuanTop0) + "px - " + juTop + "%))";
					window.gx_bt_opa = function (num, him) {
						him.style.opacity = num * 0.1;
						if (num < 10) {
							setTimeout(function () {
								window.gx_bt_opa(num + 1, him);
							}, 20);
						}
					};
					setTimeout(function () {
						ui.selected.guanxing_button.style["transition"] = "all 0.5s";
						ui.selected.guanxing_button.style["transition-duration"] = "0.5s";
						ui.selected.guanxing_button.style.transform = "translate(0,0)";
						delete ui.selected.guanxing_button;
					}, 0);
				}
			};
			var content = [];
			for (var ik = 0; ik < 2; ik++) {
				content[ik] = ui.create.div(".th-yuqiContent", yuqiPart);
			}
			event.dibeijing.addEventListener(lib.config.touchscreen ? "touchmove" : "mousemove", move);
			event.dibeijing.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", end);
			function start(evt) {
				ui.selected.guanxing_button = this;
				ui.selected.guanxing_button.style.zIndex = 10;
				_status.yuqiTouchX = lib.config.touchscreen ? evt.touches[0].clientX : evt.pageX;
				_status.yuqiTouchY = lib.config.touchscreen ? evt.touches[0].clientY : evt.pageY;
				ui.selected.guanxing_button.style["transition-duration"] = "0.05s";
				ui.selected.guanxing_button.yuanLeft0 = parseFloat(ui.selected.guanxing_button.style.left.slice(0, -2));
				ui.selected.guanxing_button.yuanTop0 = ui.selected.guanxing_button.style.top.length > 2 ? parseFloat(ui.selected.guanxing_button.style.top.slice(0, -2)) : 0;
				var butt1 = document.querySelectorAll(".th-yuqiAa");
				var ftp0 = 0;
				for (let k = 0; k < butt1.length; k++) {
					//遍历butt1
					if (ui.selected.guanxing_button.parentNode != butt1[k]) {
						ftp0 += k * 100;
					}
				}
				ui.selected.guanxing_button.fromTop0 = ftp0;
				window.guanxing_button_xy = false;
			}
			function move(e) {
				if (!ui.selected.guanxing_button) return;
				let x = ((lib.config.touchscreen ? e.touches[0].clientX : e.pageX) - _status.yuqiTouchX) / game.documentZoom / (game.thunderIsPhone() ? 0.8 : 1);
				let y = ((lib.config.touchscreen ? e.touches[0].clientY : e.pageY) - _status.yuqiTouchY) / game.documentZoom / (game.thunderIsPhone() ? 0.8 : 1);
				window.guanxing_button_xy = [parseFloat(ui.selected.guanxing_button.style.left) + x, y];
				// window.guanxing_button_xys=[x,y];
				ui.selected.guanxing_button.yuanLeft1 = x;
				ui.selected.guanxing_button.yuanTop1 = y;
				ui.selected.guanxing_button.style.transform = `translate(${x}px,${y}px)`;
			}
			function end() {
				if (!ui.selected.guanxing_button) return;
				ui.selected.guanxing_button.style.opacity = 1;
				var butt1 = document.querySelectorAll(".th-yuqiAa");
				for (let k = 0; k < butt1.length; k++) {
					// 遍历butt1
					if (isOverlap(ui.selected.guanxing_button, butt1[k])) {
						// 如果与卡槽相交
						if (ui.selected.guanxing_button.parentNode != butt1[k] && filterMove(ui.selected.guanxing_button, butt1[k]._link, event.moved)) {
							butt1[k].appendChild(ui.selected.guanxing_button);
							ui.selected.guanxing_button.style.opacity = 0;
							updateButtons();
							return;
						} else {
							// 检查是否与卡牌相交
							for (let l of butt1[k].childNodes) {
								if (isOverlap(ui.selected.guanxing_button, l)) {
									if (filterMove(l, ui.selected.guanxing_button, event.moved) && ui.selected.guanxing_button != l) {
										var par1 = ui.selected.guanxing_button.parentNode,
											ind1 = ui.selected.guanxing_button.nextSibling,
											par2 = l.parentNode,
											ind2 = l.nextSibling;
										par1.insertBefore(l, ind1);
										par2.insertBefore(ui.selected.guanxing_button, ind2);
										ui.selected.guanxing_button.style.opacity = 0;
										updateButtons();
										return;
									}
								}
							}
							if (k == butt1.length - 1) {
								ui.selected.guanxing_button.style.transform = "translate(0,0)";
								ui.selected.guanxing_button.style.zIndex = 0;
								// ui.selected.guanxing_button.style.opacity = 1;
								delete ui.selected.guanxing_button;
								return;
							}
						}
					}
				}
				ui.selected.guanxing_button.style.transform = "translate(0,0)";
				ui.selected.guanxing_button.style.zIndex = 0;
				// ui.selected.guanxing_button.style.opacity = 1;
				delete ui.selected.guanxing_button;
			}
			let elEventList = [];
			for (let i = 0; i < list.length; i++) {
				var yuqii = ui.create.div(".th-yuqiBb", i == 0 ? content[0] : content[1]);
				yuqii.style.flexDirection = i == 0 ? "column" : "column-reverse";
				if (i != 0) yuqii.style.setProperty("--w", `${Math.floor(100 / (list.length - 1))}%`);
				var tishi = ui.create.div(".th-tishi", yuqii);
				tishi.innerHTML = list[i][0];
				tishi.style["font-family"] = "shousha";
				tishi.style["font-size"] = "25px";
				var buttons = ui.create.div(".buttons", yuqii);
				buttons._link = i;
				buttonss.push(buttons);
				buttons.classList.add("th-yuqiAa", "th-yuqi" + i);
				if (event.yuqiDialog.theme == "decade") buttons.style.backgroundColor = "rgba(162, 133, 91, 0.4)";
				else buttons.style.backgroundColor = "rgba(76, 65, 59, 0.4)";
				if (game.thunderIsPhone()) {
					buttons.style.setProperty("--z", 0.7);
					buttons.style.setProperty("--h", "38px");
				}
				if (list[i][1]) {
					if (get.itemtype(list[i][1]) == "cards") {
						var cardType = player == game.me ? "card" : "blank";
						var bb = ui.create.buttons(list[i][1], cardType, buttons);
						if (list[i][2] && typeof list[i][2] == "string") {
							for (let ij of bb) {
								if (ij.node) ij.node.gaintag.innerHTML = get.translation(list[i][2]);
							}
						}
					} else if (list[i][1].length == 2) {
						var bb = ui.create.buttons(list[i][1][0], list[i][1][1], buttons);
					}
					if (!bb) continue;
					for (let j = 0; j < bb.length; j++) {
						// debugger
						bb[j].addEventListener("click", function () {
							if (!event.isMine()) return;
							clickButton(this);
						});
						bb[j].addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", start);

						elEventList.push(bb[j]);
					}
				}
			}
			updateButtons();
			event.aiList = event.processAI(event.list);
			function clickButton(button) {
				var node = button.parentNode;
				if (!buttonss.contains(node)) return;
				ui.selected.guanxing_button = button;
				if (!filterMove(ui.selected.guanxing_button, 0, event.moved)) return;
				document.getElementsByClassName("th-yuqi0")[0].appendChild(ui.selected.guanxing_button);
				delete ui.selected.guanxing_button;
				updateButtons();
			}
			game.pause(player);
			game.countChoose();
			event.choosing = true;

			event.custom.replace.confirm = function (bool) {
				// 移除监听事件
				elEventList.forEach(item => {
					if (typeof item === "object") {
						item.removeEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", start);
					}
				});
				elEventList = [];
				if (bool)
					event._result = {
						bool: true,
						moved: event.moved,
					};
				else event._result = { bool: false };
				if (ui.confirm) ui.confirm.close();
				if (event.dibeijing) event.dibeijing.removeEventListener(lib.config.touchscreen ? "touchmove" : "mousemove", move);
				if (event.dibeijing) event.dibeijing.removeEventListener(lib.config.touchscreen ? "touchend" : "mouseup", end);
				event.moved.forEach(i => {
					i.forEach(j => {
						// debugger
						if (typeof j === "object" && j.nodeType == 1) {
							j.removeEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", start);
						}
					});
				});
				game.resume(player);
				_status.imchoosing = false;
			};
		} else if (event.isOnline()) {
			event.send();
		} else {
			event.result = "ai";
		}
		("step 1");
		game.thunderAllowTouch();
		if (event.time)
			game.broadcastAll(function (time) {
				lib.configOL.choose_timeout = time;
			}, event.time);
		var result = event.result || result;
		if ((!result || result == "ai" || (event.forced && !result.bool)) && event.processAI) {
			var moved = event.processAI(event.list);
			if (moved)
				result = {
					bool: true,
					moved: moved,
				};
			else result = { bool: false };
		}
		event.result = result;
		if (event.yuqiDialog) event.yuqiDialog.remove();
		if (event.dibeijing) event.dibeijing.remove();
		if (game.thunderHasExt("十周年")) {
			var con = document.getElementById("dui-controls");
			if (con && con.classList) con.classList.remove("th-confirmdown2");
		}
	},
};
export function initThunder() {
	window.Thunder_yuqiTitle = {
		dctuoyu: {
			name1: "手牌",
			name2: "副区域",
		},
		lkbushi: {
			name1: "卜筮",
		},
		qixing: {
			name1: ["七星", 7],
		},
		qixing2: {
			name1: ["七星", 7],
		},
		dcsushou: {
			name1: e => get.translation(e.parent.target) + "手牌",
			name2: "你的手牌",
		},
		thguanxing: {
			name1: ["星牌", 7],
			name2: ["牌堆顶", 7],
		},
	};
	Object.assign(lib.element.player, ThunderPlayer);
	Object.assign(lib.element.content, ThunderContent);
	Object.assign(game, ThunderGame);
	//有需要自己加
	// game.thunderLoadFont({
	//   url: lib.assetURL + "extension/无名美化/assets/shousha.ttf",
	//   cssValue: "shousha",
	// });
	game.thunderLoadFont({
		url: lib.assetURL + "extension/无名美化/assets/th-zhongli.woff2",
		cssValue: "th-zhongli",
	});
	game.thunderLoadFont({
		url: lib.assetURL + "extension/无名美化/assets/th-decade.woff2",
		cssValue: "th-kaishu",
	});
	game.thunderLoadFont({
		url: lib.assetURL + "extension/无名美化/assets/th-poem.woff2",
		cssValue: "th-poem",
	});
	window._Thunder.thunderAnimation = (function () {
		var animation = new _Thunder.thunderAnimationPlayer(lib.assetURL + "extension/十周年UI/assets/animation/", document.body, "thunderDecadeUI-canvas");
		return animation;
	})();
	window._ThAnim = _Thunder.thunderAnimation;
	lib.init.css(lib.assetURL + "extension/无名美化/css", "thunder");
	//   if (lib.config["extension_无名美化_UIpatch"]) {
	//     lib.element.content.chooseToMoveTemp = lib.element.content.chooseToMove;
	//     lib.element.content.chooseToMove = lib.element.content.chooseToYuqi;

	//     lib.element.content.chooseToMove_newTemp = lib.element.content.chooseToMove_new;
	//     lib.element.content.chooseToMove_new = lib.element.content.chooseToYuqiNew;

	//   }
}
