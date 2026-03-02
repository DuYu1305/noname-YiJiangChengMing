import { lib, game, ui, get, ai, _status } from "../../../noname.js";
export function initCXCss() {
	lib.init.css(lib.assetURL + "extension/无名美化/css", "chongxu");
}
export function mbsunhanhua() {
	window.MBSunhanhua = {
		name: "孙寒华美化",
		url: lib.assetURL + "extension/无名美化",
		shh: {
			name: "../../../无名美化/animation/sunhanhua/SS_ShhXyx_Shh",
		},
		shhfaqi: {
			name: "../../../无名美化/animation/sunhanhua/SS_ShhXyx_Faqi",
		},
		shhdaoju: {
			name: "../../../无名美化/animation/sunhanhua/SS_ShhXyx_daoju",
		},
		shhjiesuan: {
			name: "../../../无名美化/animation/sunhanhua/SS_ShhXyx_Jiesuan",
		},
		shhchangjing: {
			name: "../../../无名美化/animation/sunhanhua/SS_ShhXyx_Changjing",
		},
	};

	lib.skill.chongxu = {
		init: function (player) {
			if (!lib.config["extension_无名美化_sunhanhuaBiaoji"]) return;
			lib.translate.miaojian = "妙剑" + (player.countMark("miaojian") + 1) + "级";
			lib.translate.shhlianhua = "莲华" + (player.countMark("shhlianhua") + 1) + "级";
		},
		usable: 1,
		enable: "phaseUse",
		audio: 2,
		filter: function (event, player) {
			if (!window.chongxuxiao) {
				window.chongxuxiao = true;
				dcdAnim.loadSpine(window.MBSunhanhua.shhfaqi.name, "skel");
				dcdAnim.loadSpine(window.MBSunhanhua.shhdaoju.name, "skel");
				dcdAnim.loadSpine(window.MBSunhanhua.shhjiesuan.name, "skel");
				dcdAnim.loadSpine(window.MBSunhanhua.shh.name, "skel");
				_ThAnim.loadSpine(window.MBSunhanhua.shhchangjing.name, "skel");
			}
			return true;
		},
		content: function () {
			"step 0";
			game.thunderForbidTouch();
			if (decadeUI && decadeUI.ease) {
				_status.old_duiease = decadeUI.ease;
				decadeUI.ease = function (fraction) {
					if (!decadeUI.b3ease) decadeUI.b3ease = new decadeUI.CubicBezierEase(0.1, 0.1, 0.1, 0.1);
					return decadeUI.b3ease.ease(fraction);
				};
			}
			game.pause();
			event.blackbg = ui.create.div(".th-dibeijing", document.body);
			var thunderCanvas = document.getElementById("thunderDecadeUI-canvas");
			if (thunderCanvas) {
				var widthClip = document.body.offsetWidth * 0.5 - 398 + "px";
				var heightClip = document.body.offsetHeight * 0.5 - 187 + "px";
				thunderCanvas.style["clip-path"] = "inset(0 " + widthClip + " " + heightClip + ")";
			}
			let num = 0;
			let timer = game.thunderInterval(function () {
				num += 0.1;
				event.blackbg.style.background = "rgba(0,0,0," + num + ")";
				if (num == 0.7) {
					game.playAudio("..", "extension", "无名美化", "audio", "chongxu", "lotus_fly");
					game.thunderClearInterval(timer);
					var x = player.offsetLeft + player.offsetWidth * 0.5 + 20,
						y = document.body.offsetHeight - player.offsetTop - player.offsetHeight * 0.5 - 20;
					var faqi = dcdAnim.playSpine(
						{
							name: window.MBSunhanhua.shhfaqi.name,
							loop: true,
						},
						{ x: x, y: y, scale: 0.5 }
					);
					setTimeout(function () {
						faqi.moveTo(document.body.offsetWidth * 0.48, document.body.offsetHeight * 0.49, 400);
						faqi.onupdate = function () {
							if (this.timestepMap.x.completed && this.timestepMap.y.completed && !this._over) {
								this._over = true;
								this.setAction("play2");
								this.scaleTo(1.4, 150);
								this.loop = false;
								var that = this;
								event.bgSpine = _ThAnim.loopSpine(
									{
										name: window.MBSunhanhua.shhchangjing.name,
										opacity: 0,
									},
									{
										y: document.body.offsetHeight * 0.5 + 7,
										scale: 0,
									}
								);
								event.bgSpine.scaleTo(0.72, 490);
								event.bgSpine.fadeTo(1, 1000);
								event.bgSpine.onupdate = function () {
									if (!this.alreadyLoad) {
										this.alreadyLoad = true;
										event.bg = ui.create.div(".th-newcxbg", event.blackbg);
									}
								};
								this.oncomplete = function () {
									game.resume();
									dcdAnim.stopSpine(that);
								};
							}
						};
					}, 200);
				}
			}, 100);
			("step 1");
			game.pause();
			var lTimer = null,
				rTimer = null;
			_status.started = false;
			_status.finished = false;
			_status.cxdropTimer = null;
			event.score = 0;
			dcdAnim.playSpine(
				{
					name: window.MBSunhanhua.shhfaqi.name,
					action: "play3",
					speed: 0.5,
				},
				{
					x: document.body.offsetWidth * 0.49,
					y: document.body.offsetHeight * 0.5 - 160,
					scale: 0.8,
				}
			);
			var shhx = document.body.offsetWidth * 0.49;
			var shhy = document.body.offsetHeight * 0.5 - 170;
			var shh = dcdAnim.loopSpine({ name: window.MBSunhanhua.shh.name, opacity: 0 }, { x: shhx, y: shhy, scale: 0.72 });
			setTimeout(function () {
				shh.fadeTo(1, 100);
			}, 600);
			var daojishiNum = 2;
			var daojishibg = ui.create.div(".th-cxdaojishi", document.body);
			var daojishiT = ui.create.div("", daojishibg);
			daojishiT.innerHTML = "倒计时：" + daojishiNum;
			var daojishi = game.thunderInterval(() => {
				daojishiNum--;
				daojishiT.textContent = "倒计时：" + daojishiNum;
				if (daojishiNum == 0) {
					game.thunderClearInterval(daojishi);
					setTimeout(function () {
						daojishibg.remove();
						_status.started = true;
						addDrop();
					}, 500);
				}
			}, 1000); //倒计时时间
			var shhSpeed = 24 + (parseInt(lib.config["extension_无名美化_gameSpeed"]) - 4) * 2;
			var harassTips1 = ui.create.div(".th-hT1", document.body, "选择释放天雷或降下莲华");
			if (player == game.me) harassTips1.hide();
			var harassTips2 = ui.create.div(".th-hT2", document.body, "点击任意位置释放天雷或降下莲华");
			harassTips2.hide();
			shh.moveRight = function () {
				if (shh.flipX) shh.flipX = false;
				shhx += 10;
				if (shhx > document.body.offsetWidth * 0.5 + 330) shhx = document.body.offsetWidth * 0.5 + 330;
				shh.moveTo(shhx, shhy, shhSpeed);
			};
			shh.moveLeft = function () {
				shh.flipX = true;
				shhx -= 10;
				if (shhx < document.body.offsetWidth * 0.5 - 330) shhx = document.body.offsetWidth * 0.5 - 330;
				shh.moveTo(shhx, shhy, shhSpeed);
			};
			var scorceBg = ui.create.div(".th-cxscbg", document.body); //生成计分板
			var h1 = ui.create.div("", scorceBg);
			h1.style.left = "96px";
			h1.style.top = "50px";
			h1.innerHTML = "+1分";
			var h2 = ui.create.div("", scorceBg);
			h2.style.left = "96px";
			h2.style.top = "83px";
			h2.innerHTML = "-1分";
			var h3 = ui.create.div("", scorceBg);
			h3.style.left = "42px";
			h3.style.top = "18px";
			h3.innerHTML = "总得分：";
			var scoreText = ui.create.div("", scorceBg);
			scoreText.style.left = "115px";
			scoreText.style.top = "18px";
			scoreText.innerHTML = event.score;
			function defaultevent(e) {
				game.thunderClearInterval(lTimer);
				game.thunderClearInterval(rTimer);
				e.preventDefault();
			}
			var drops = [],
				goodDrops = [],
				badDrops = [];
			var lBtn = ui.create.div(".th-cxlbtn", document.body); //生成左按钮
			if (player == game.me) lBtn.classList.add("self");
			else {
				var item1 = ui.create.div("", lBtn);
				item1.style.cssText = "height:90%;width: 90%;position: absolute;top: 19px;left: 5px;background-repeat:no-repeat;background-size: 100%";
				item1.style.backgroundImage = "url(" + lib.assetURL + "extension/无名美化/image/chongxu/SS_ShhXyx_daoju-play2.png)";
			}
			var dropY = document.body.offsetHeight * 0.5 + 213;
			class Drop {
				constructor(x, lotus) {
					this.x = x;
					this.y = dropY;
					this.newY = dropY;
					this.lotus = lotus;
					this.hitted = false;
					this.entity = dcdAnim.loopSpine(window.MBSunhanhua.shhdaoju, { x: this.x, y: dropY, scale: 0.77 });
					this.create();
				}
				getAction() {
					if (!this.lotus) {
						let type = Math.random();
						if (type > 0.5) return 5;
						else if (type > 0.1) return 3;
						else return 1;
					} else return this.lotus;
				}
				create() {
					this.entity;
					this.action = this.getAction();
					this.dropSpeed = (this.action > 4 ? 3 : 5) + Math.round(Math.random() * 10) / 10;
					this.entity.setAction("play" + (this.action == 1 ? "" : this.action));
					if (this.action > 3) badDrops.push(this);
					else goodDrops.push(this);
					drops.push(this);
					let reflection = dcdAnim.playSpine(window.MBSunhanhua.shhdaoju, { x: this.x - 5, y: dropY - 393, scale: 0.77 });
					reflection.setAction("play" + (this.action + 1));
					setTimeout(function () {
						dcdAnim.stopSpine(reflection);
					}, 1000);
				}
				hit() {
					if (this.action == 5) {
						event.score = Math.max(event.score - 1, 0);
						this.entity.setAction("play8");
						dcdAnim.playSpine(
							{
								name: window.MBSunhanhua.shhdaoju.name,
								action: "play9",
							},
							{ x: shhx, y: shhy, scale: 0.6 }
						);
					} else {
						this.entity.setAction("play7");
						event.score = Math.min(event.score + 1, 5);
					}
					game.playAudio("..", "extension", "无名美化", "audio", "chongxu", "chongXu_daoju" + this.action);
					this.remove();
					scoreText.innerHTML = event.score;
					if (event.score >= 5) chongxuEnd(cxTime);
				}
				remove(rightnow) {
					this.hitted = true;
					let that = this;
					setTimeout(
						function () {
							dcdAnim.stopSpine(that.entity);
						},
						rightnow ? 0 : 200
					);
					drops.remove(this);
					goodDrops.remove(this);
					badDrops.remove(this);
				}
			}
			let dropMove = new game.thunderRAF(function () {
				drops.forEach(i => {
					i.newY = Math.max(dropY - 365, i.newY - i.dropSpeed);
					i.entity.updateTimeStep("y", i.y, i.newY, 16);
					if (i.newY == dropY - 365 && !i.hitted) i.remove(true);
					if (i.newY < document.body.offsetHeight * 0.5 - 20 && i.x > shhx - 70 && i.x < shhx + 70 && !i.hitted) {
						i.hit();
					}
					i.entity.y = i.y = i.newY;
				});
			});
			var shhMove = new game.thunderRAF(function () {});
			if (player == game.me) {
				document.onkeydown = function (e) {
					if (e.repeat || !_status.started) return;
					var evt = e || window.event;
					switch (evt.keyCode) {
						case 37: {
							if (event.rightKeying) return;
							event.leftKeying = true;
							shh.moveLeft();
							shhMove = game.thunderRAF(shh.moveLeft);
							break;
						}
						case 39: {
							if (event.leftKeying) return;
							event.rightKeying = true;
							shh.moveRight();
							shhMove = game.thunderRAF(shh.moveRight);
						}
					}
				};
				document.onkeyup = function (e) {
					var evt = e || window.event;
					switch (evt.keyCode) {
						case 37: {
							event.leftKeying = false;
							break;
						}
						case 39: {
							event.rightKeying = false;
						}
					}
					shhMove.stop = true;
				};
			}
			lBtn.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function (e) {
				if (!game.me.isIn()) return;
				document.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", defaultevent, false);
				e.stopPropagation();
				if (player == game.me) {
					if (!_status.started) return;
					shh.moveLeft();
					shhMove = game.thunderRAF(shh.moveLeft);
				} else {
					if (!event.cxHarass) {
						harassTips1.hide();
						harassTips2.show();
					}
					if (event.cxHarass != 3) {
						event.cxHarass = 3;
						this.addBlock();
					}
				}
			});
			lBtn.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", function () {
				document.removeEventListener(lib.config.touchscreen ? "touchend" : "mouseup", defaultevent);
				shhMove.stop = true;
			});
			var rBtn = ui.create.div(".th-cxrbtn", document.body); //生成右按钮
			if (player == game.me) rBtn.classList.add("self");
			else {
				var item2 = ui.create.div("", rBtn);
				item2.style.cssText = "height: 88%;width: 88%;position: absolute;top: 7px;left: 7px;background-repeat:no-repeat;background-size: 100%;";
				item2.style.backgroundImage = "url(" + lib.assetURL + "extension/无名美化/image/chongxu/SS_ShhXyx_daoju-play3.png)";
			}
			rBtn.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function (e) {
				if (!game.me.isIn()) return;
				document.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", defaultevent, false);
				e.stopPropagation();
				if (player == game.me) {
					if (!_status.started) return;
					shh.moveRight();
					shhMove = game.thunderRAF(shh.moveRight);
				} else {
					if (!event.cxHarass) {
						harassTips1.hide();
						harassTips2.show();
					}
					if (event.cxHarass != 5) {
						event.cxHarass = 5;
						this.addBlock();
					}
				}
			});
			rBtn.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", function () {
				document.removeEventListener(lib.config.touchscreen ? "touchend" : "mouseup", defaultevent);
				shhMove.stop = true;
			});
			lBtn.cd = rBtn.cd = function () {
				this.cded = true;
				let mengban1 = ui.create.div(".th-cxmianban", this);
				let mengban2 = ui.create.div(".th-cxmianban.right", this);
				var cd1 = ui.create.div(".th-cxcd", mengban1);
				var cd2 = ui.create.div(".th-cxcd.right", mengban2);
				cd1.style.animation = "th-cxcd 1s linear forwards";
				cd1.addEventListener("animationend", function () {
					cd2.style.animation = "th-cxcd 1s linear forwards";
					cd2.addEventListener("animationend", function () {
						mengban1.remove();
						mengban2.remove();
					});
				});
				let that = this;
				setTimeout(function () {
					that.cded = false;
				}, 2000);
			};
			lBtn.addBlock = rBtn.addBlock = function () {
				var blocks = document.getElementsByClassName("th-cxblock");
				if (blocks) {
					for (var i = 0; i < blocks.length; i++) {
						blocks[i].remove();
					}
				}
				ui.create.div(".th-cxblock", this);
			};
			event.bg.addEventListener(lib.config.touchscreen ? "touchstart" : "click", function (e) {
				e.stopPropagation();
				if (!game.me.isIn() || !_status.started || _status.finished || !event.cxHarass || lBtn.cded || rBtn.cded) return;
				harassTips2.hide();
				var evt = e || window.event;
				var touchX = lib.config.touchscreen ? evt.touches[0].clientX : evt.clientX;
				var touchY = lib.config.touchscreen ? evt.touches[0].clientY : evt.clientY;
				if (touchX - this.offsetLeft * game.documentZoom < 80 * game.documentZoom || touchX - this.offsetLeft * game.documentZoom > 875 * game.documentZoom || touchY - this.offsetTop * game.documentZoom < 31.5 * game.documentZoom || touchY - this.offsetTop * game.documentZoom > 435.5 * game.documentZoom) return;
				if (touchX - this.offsetLeft * game.documentZoom < 130 * game.documentZoom) touchX = 130 * game.documentZoom + this.offsetLeft * game.documentZoom;
				if (touchX - this.offsetLeft * game.documentZoom > 832 * game.documentZoom) touchX = 832 * game.documentZoom + this.offsetLeft * game.documentZoom;
				var harassLight = ui.create.div(".th-harasslight", document.body);
				var harassLightX = touchX / game.documentZoom - 30;
				harassLight.style.left = harassLightX + "px";
				harassLight.addEventListener("animationend", function () {
					this.remove();
				});
				new Drop(touchX / game.documentZoom, event.cxHarass);
				lBtn.cd();
				rBtn.cd();
			});

			function addDrop() {
				game.thunderClearInterval(_status.cxdropTimer);
				_status.cxdropTimer = game.thunderInterval(
					function () {
						let dropx = Math.random() * 702 + document.body.offsetWidth * 0.5 - 349;
						new Drop(dropx);
					},
					Math.random() * 300 + 350
				);
			}
			var cxTime = game.thunderCreateTimer(150, chongxuEnd);
			function chongxuEnd(timer) {
				_status.finished = true;
				rBtn.remove();
				lBtn.remove();
				scorceBg.remove();
				game.thunderClearInterval(timer[1]);
				timer[0].remove();
				harassTips1.remove();
				harassTips2.remove();
				shhMove.stop = true;
				dropMove.stop = true;
				game.thunderClearInterval(_status.cxdropTimer);
				game.thunderClearInterval(lTimer);
				game.thunderClearInterval(rTimer);
				game.thunderClearInterval(shhAutoMove);
				dcdAnim.stopSpine(shh);
				drops.forEach(i => dcdAnim.stopSpine(i.entity));
				game.resume();
			}

			var shhAutoMove = new game.thunderRAF(function () {
				if (!_status.started || event.isMine()) return;
				if (!_status.finished) {
					goodDrops.sort(function (a, b) {
						return a.y - b.y;
					});
					if (goodDrops.length) {
						var xh = goodDrops[0].x;
						if (goodDrops[0].action < 5) {
							if (shhx - 10 > xh) shh.moveLeft();
							else if (shhx + 10 < xh) shh.moveRight();
						} else {
							if (Math.abs(shhx - xh) < 15) shh.moveRight();
						}
					}
				} else shhAutoMove.stop = true;
			});
			("step 2");
			game.pause();
			if (_status.old_duiease) decadeUI.ease = _status.old_duiease;
			event.resultBg = ui.create.div(".th-cxresultload", document.body);
			if (event.score == 5) game.playAudio("..", "extension", "无名美化", "audio", "chongxu", "Five_lotus");
			var bigCircle = ui.create.div(".th-cxcircle", event.resultBg);
			var scorebg = ui.create.div(".th-cxscorebg", event.resultBg);
			var scoreText = ui.create.div("", scorebg);
			scoreText.style.cssText = "left:34px;top:7px;";
			scoreText.innerHTML = "总得分：" + event.score;
			var evaluate = "";
			switch (event.score) {
				case 5:
					evaluate = "大音希声大象无形";
					break;
				case 3:
				case 4:
					evaluate = "此间奥妙似有所得";
					break;
				default:
					evaluate = "实难<br>参悟天机";
			}
			var evaText = ui.create.div(".th-cxevaluate", bigCircle);
			evaText.innerHTML = evaluate;
			var actionName;
			if (event.score >= 3) {
				var actionName = "shengli";
			} else {
				var actionName = "shibai";
			}
			event.shh = dcdAnim.loopSpine(
				{ name: window.MBSunhanhua.shh.name, action: actionName },
				{
					x: [-220, 0.5],
					y: [-130, 0.5],
					scale: 0.7,
				}
			);
			event.shh.onupdate = function () {
				let entry = this.skeleton.state.tracks[0];
				if (!this._changed && entry.trackTime >= 0.7 * entry.animationEnd) {
					this._changed = true;
					this.setAction(actionName + "_loop");
				}
			};
			var lianhuas = [];
			for (var i = 0; i < 5; i++) {
				var xOffset = Math.sin(((i * Math.PI) / 180) * 72) * 110 + 54;
				var yOffset = 110 * Math.cos(((i * Math.PI) / 180) * 72) - 2;
				let lianhua = dcdAnim.playSpine(
					{
						name: window.MBSunhanhua.shhjiesuan.name,
						speed: 0.5,
					},
					{ x: [xOffset, 0.5], y: [yOffset, 0.5], scale: 0.75 }
				);
				lianhuas.push(lianhua);
				if (event.score > i) lianhua.setAction("play1");
				else lianhua.setAction("play2");
				lianhua.onupdate = function () {
					let entry = this.skeleton.state.tracks[0];
					if (entry.trackTime >= 0.9 * entry.animationEnd) this.speed = 0;
				};
			}
			var cxTimer = game.thunderCreateTimer(30, function () {
				game.thunderClearInterval(cxTimer[1]);
				lianhuas.forEach(i => dcdAnim.stopSpine(i));
				scorebg.remove();
				bigCircle.remove();
				cxTimer[0].remove();
				if (_status.qhly_skillTest) {
					_status.qhly_skillTest = false;
					dcdAnim.stopSpine(event.shh);
					_ThAnim.stopSpineAll();
					event.resultBg.remove();
					event.blackbg.remove();
					event.finish();
				}
				game.resume();
			});
			("step 3");
			var result = event._result;
			if (event.isMine()) {
				game.pause();
				var selectBg = ui.create.div(".th-cxbgdh", event.resultBg);
				var resultText = ui.create.div(".th-cxresulttext", selectBg);
				resultText.innerHTML = "剩余" + event.score + "分";
				function checkCanBeSel(button) {
					if (!button) return;
					if (button.classList.contains("select")) return;
					if (event.score >= button.cxcost) {
						var skill = parseInt(button.id.substring(11));
						if ((skill == 0 && !player.storage.miaojian) || (skill == 0 && player.storage.miaojian && player.storage.miaojian < 2) || (skill == 1 && !player.storage.shhlianhua) || (skill == 1 && player.storage.shhlianhua && player.storage.shhlianhua < 2) || skill == 2) button.classList.remove("disable");
						else button.classList.add("disable");
					} else button.classList.add("disable");
				}
				resultText.refresh = function () {
					var resultContent = "";
					for (var j = 0; j < 3; j++) {
						var selectx = document.getElementById("th-cxselect" + j);
						if (selectx) {
							checkCanBeSel(selectx);
							if (selectx.classList.contains("select")) {
								if (j == 0) resultContent += "升级技能“妙剑” ";
								else if (j == 1) resultContent += "升级技能“莲华” ";
								else if (j == 2) resultContent += "摸" + (event.doubleDraw ? 2 : 1) + "张牌 ";
							}
						}
					}
					resultContent += "剩余" + (event.doubleDraw ? event.score - 2 : event.score) + "分";
					resultText.innerHTML = resultContent;
				};
				for (let i = 0; i < 3; i++) {
					let select = ui.create.div(".th-cxselect", selectBg);
					select.id = "th-cxselect" + i;
					select.cxcost = i == 2 ? 2 : 3;
					select.classList.add("style" + i);
					setTimeout(function () {
						select.style.transform = "scale(5.2) translate(" + (40 + i * 20) + "px, -13px)";
					}, 50);
					select.listen(function () {
						if (this.classList.contains("disable")) return;
						if (this.classList.contains("select")) {
							this.classList.remove("select");
							event.score += this.cxcost;
							if (document.getElementById("th-cxselect2").classList.contains("select") && event.score >= 2) event.doubleDraw = true;
							else event.doubleDraw = false;
						} else {
							game.playAudio("..", "extension", "无名美化", "audio", "chongxu", "Select_rewards");
							dcdAnim.playSpine(
								{
									name: window.MBSunhanhua.shhjiesuan.name,
									action: "play3",
								},
								{
									x: [-89 + parseInt(this.id.substring(11)) * 164, 0.5],
									y: [20.5, 0.5],
									scale: 0.78,
								}
							);
							this.classList.add("select");
							event.score -= this.cxcost;
							if (this.cxcost == 2 && event.score >= 2) event.doubleDraw = true;
							else event.doubleDraw = false;
						}
						resultText.refresh();
					});
					checkCanBeSel(select);
				}
				event.control = ui.create.control("ok", "cancel2", function (link) {
					if (game.thunderHasExt("十周年")) {
						var con = document.getElementById("dui-controls");
						con.classList.remove("th-confirmdown2");
					}
					if (link == "ok") {
						result.bool = true;
						if (resultText.innerHTML.indexOf("妙剑") != -1) result.select = 1;
						if (resultText.innerHTML.indexOf("莲华") != -1) result.select = 2;
						if (resultText.innerHTML.indexOf("摸") != -1) result.draw = 1 + Math.floor(event.score / 2);
					}
					game.resume();
				});
				if (game.thunderHasExt("十周年")) {
					var con = document.getElementById("dui-controls");
					con.classList.add("th-confirmdown2");
				}
			} else {
				result.bool = true;
				if (event.score >= 3) {
					if (!player.storage.miaojian || (player.storage.miaojian && player.storage.miaojian < 2)) {
						event.score -= 2;
						result.select = 1;
					} else if (!player.storage.shhlianhua || (player.storage.shhlianhua && player.storage.shhlianhua < 2)) {
						event.score -= 2;
						result.select = 2;
					}
				}
				if (event.score >= 2) {
					result.draw = Math.floor(event.score / 2);
				}
			}
			("step 4");
			dcdAnim.stopSpine(event.shh);
			_ThAnim.stopSpineAll();
			event.resultBg.remove();
			event.blackbg.remove();
			game.thunderAllowTouch();
			var thunderCanvas = document.getElementById("thunderDecadeUI-canvas");
			if (thunderCanvas) thunderCanvas.style["clip-path"] = "none";
			if (event.control) event.control.close();
			if (result.bool) {
				if (result.select) {
					var skill = result.select == 1 ? "miaojian" : "shhlianhua";
					player.addMark(skill, 1, false);
					if (lib.config["extension_无名美化_sunhanhuaBiaoji"]) {
						if (result.select == 1 && player == game.me) lib.translate.miaojian = "妙剑" + (player.countMark("miaojian") + 1) + "级";
						else if (result.select == 2) {
							if (player == game.me) lib.translate.shhlianhua = "莲华" + (player.countMark("shhlianhua") + 1) + "级";
							var marks = player.querySelectorAll(".mark-text");
							if (marks.length) {
								for (var i = 0; i < marks.length; i++) {
									if (marks[i].innerHTML && marks[i].innerHTML.indexOf("莲华") == 0) {
										marks[i].innerHTML = "莲华" + (player.countMark("shhlianhua") + 1) + "级";
									}
								}
							}
						}
					}
					game.log(player, "升级了技能", "#g【" + get.translation(skill) + "】");
				}
				if (result.draw) player.draw(result.draw);
			}
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	};
	Object.assign(lib.skill.shhlianhua, {
		mark: true,
		intro: {
			markcount: () => "",
			content: function (storage, player) {
				var str = "";
				str += "妙剑" + (player.storage.miaojian ? player.storage.miaojian + 1 : 1) + "级<br>";
				str += "莲华" + (player.storage.shhlianhua ? player.storage.shhlianhua + 1 : 1) + "级";
				return str;
			},
		},
	});
}
