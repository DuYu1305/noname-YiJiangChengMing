import { lib, game, ui, get, ai, _status } from "../../../noname.js";
export function initNhlxCss() {
	lib.init.css(lib.assetURL + "extension/无名美化/css", "nanhua");
}
export function nanhualaoxian() {
	window._ThunderYuFeng = {
		yf_winkuang: {
			name: "../../../无名美化/animation/nanhualaoxian/xiaoyouxi_shengli_biankuang",
		},
		yf_shenglixing: {
			name: "../../../无名美化/animation/nanhualaoxian/xiaoyouxi_shenglixing",
		},
		yf_winziti: {
			name: "../../../无名美化/animation/nanhualaoxian/xiaoyouxi_shengliziti",
		},
		yf_failkuang: {
			name: "../../../无名美化/animation/nanhualaoxian/xiaoyouxi_shibai_biankuang",
		},
		yf_shibaixing: {
			name: "../../../无名美化/animation/nanhualaoxian/xiaoyouxi_shibaixing",
		},
		yf_failziti: {
			name: "../../../无名美化/animation/nanhualaoxian/xiaoyouxi_shibaiziti",
		},
		yf_nanhua: {
			name: "../../../无名美化/animation/nanhualaoxian/nanhuadaxian",
		},
		yf_daojishi: {
			name: "../../../无名美化/animation/nanhualaoxian/xiaoyouxi_daojishi",
		},
		yf_xingpo: {
			name: "../../../无名美化/animation/nanhualaoxian/xiaoyouxi_xingxingposui",
		},
		tpys: {
			name: "../../../无名美化/animation/nanhualaoxian/taipingyaoshu",
		},
		tpysxx: {
			name: "../../../无名美化/animation/nanhualaoxian/effect_taipingyaoshu_xiexia",
		},
	};
	//太平要术弃牌特效
	Object.assign(lib.card.taipingyaoshu, {
		onLose: function () {
			var next = game.createEvent("taipingyaoshu");
			event.next.remove(next);
			var evt = event.getParent();
			if (evt.getlx === false) evt = evt.getParent();
			evt.after.push(next);
			next.player = player;
			next.setContent(lib.card.taipingyaoshu.onLosex);
		},
		onLosex: function () {
			"step 0";
			player.logSkill("taipingyaoshu");
			dcdAnim.loadSpine(_ThunderYuFeng.tpysxx.name, "skel", function () {
				dcdAnim.playSpine(_ThunderYuFeng.tpysxx, {
					parent: player,
					scale: 0.5,
				});
			});
			player.draw(2);
			("step 1");
			if (player.hp > 1) player.loseHp();
		},
	});
	//御风美化
	lib.skill.yufeng = {
		audio: 2,
		enable: "phaseUse",
		init: function (player) {
			player.storage.th_yufeng = 1;
		},
		usable: 1,
		filter: function (event, player) {
			if (!window.yufengxiao) {
				window.yufengxiao = true;
				dcdAnim.loadSpine(_ThunderYuFeng.yf_shibaixing.name, "skel");
				dcdAnim.loadSpine(_ThunderYuFeng.yf_shenglixing.name, "skel");
				_ThAnim.loadSpine(_ThunderYuFeng.yf_daojishi.name, "skel");
				_ThAnim.loadSpine(_ThunderYuFeng.yf_xingpo.name, "skel");
				_ThAnim.loadSpine(_ThunderYuFeng.yf_nanhua.name, "skel");
			}
			return true;
		},
		content: function () {
			"step 0";
			//2400*866
			game.thunderForbidTouch();
			game.pause();
			if (decadeUI && decadeUI.ease) {
				_status.old_duiease = decadeUI.ease;
				decadeUI.ease = function (fraction) {
					if (!decadeUI.b3ease) decadeUI.b3ease = new decadeUI.CubicBezierEase(0.1, 0.1, 0.1, 0.1);
					return decadeUI.b3ease.ease(fraction);
				};
			}
			var blackbg = ui.create.div(".th-dibeijing", document.body);
			blackbg.style.background = "rgba(0,0,0,0.7)";
			var shoushaJDT = document.getElementById("jindutiao");
			if (shoushaJDT) {
				shoushaJDT.style.cssText += "transition:none;";
				shoushaJDT.hide();
			}
			var frame = 0;
			var commentFrame = 0;
			var resultFrame = 0;
			var timerFrame = 550;
			event.score = 0;
			var resultType = "";
			var comment = "";
			var cT, cM, bL; //结算标题，面板，大老仙
			//关卡数据:类型，X坐标，Y坐标，宽度，高度
			var stageList = [
				[
					[7, 214, 296, 240, 218],
					[4, 418, 202, 30, 30],
					[2, 606, 6, 350, 132],
					[10, 496, -8, 128, 112],
					[5, 632, 263, 250, 198],
					[12, 909, -35, 190, 198],
					[4, 958, 308, 30, 30],
					[1, 1106, -95, 495, 207],
					[3, 1667, 48, 280, 107],
					[12, 1283, 365, 190, 190],
					[11, 1489, -4, 217, 200],
					[9, 1863, 40, 145, 172],
				],
				[
					[5, 165, 342, 250, 198],
					[7, 220, 296, 240, 218],
					[4, 442, 261, 30, 30],
					[12, 427, -70, 190, 198],
					[12, 463, 370, 185, 180],
					[6, 610, 195, 264, 280],
					[2, 606, 6, 350, 132],
					[11, 905, -27, 217, 200],
					[4, 962, 220, 30, 30],
					[10, 1018, 335, 128, 112],
					[10, 1200, 104, 124, 112],
					[5, 1243, 300, 250, 210],
					[1, 1106, -95, 495, 207],
					[3, 1622, 83, 266, 107],
					[10, 1540, -7, 128, 114],
					[10, 1868, 82, 127, 115],
					[7, 1647, 224, 240, 218],
					[4, 1900, 312, 30, 30],
				],
			];
			var goodJump = [
				[
					[526, 450, 429, 385, 310, 275, 205, 140, 80],
					[523, 450, 404, 387, 310, 248, 195, 135, 75],
				],
				[
					[518, 450, 419, 408, 326, 325, 313, 246, 208, 145, 140, 135, 59, 44],
					[520, 450, 415, 402, 399, 320, 318, 252, 215, 146, 128, 62],
				],
			];
			var badJump = [
				[
					[529, 426, 450],
					[529, 450, 413, 392, 336],
					[519, 517, 411],
					[517, 452, 413, 385, 321, 291, 249],
				],
				[
					[520, 450],
					[518, 450, 419, 408, 330, 325, 265],
					[527, 456, 405, 384, 326],
					[516, 455, 419, 405, 324, 286, 280],
					[520, 458, 446],
				],
			];
			var totalScore = 3;
			if (!_status.qhly_skillTest) totalScore = Math.max(2, player.storage.th_yufeng);
			var starNum = 0;
			var starTotal = totalScore;
			var stage = stageList[totalScore - 2];
			var yfbg = document.createElement("canvas");
			yfbg.classList.add("th-yufengbg");
			yfbg.style.setProperty("--w", document.body.offsetWidth + "px");
			var ctx = yfbg.getContext("2d");
			yfbg.width = window.innerWidth * 2;
			yfbg.height = Math.ceil(yfbg.width * 0.3617);
			var canvasScale = yfbg.width / 1200;
			yfbg.renderList = [];
			blackbg.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function (e) {
				e.stopPropagation();
				if (!event.isMine()) return;
				if (!event.loaded || event.yfFinished || laoxian.stageStep > 2) return;
				game.playAudio("..", "extension", "无名美化", "audio", "yufeng", "yufeng_fly");
				isDown = false;
				lxSpeed = 3;
				laoxian.setAction("qitiao");
			});
			var aiJump = [];
			var randomLimit = totalScore > 2 ? 0.65 : 0.9;
			if (Math.random() < randomLimit) aiJump = goodJump[totalScore - 2].randomGet();
			else aiJump = badJump[totalScore - 2].randomGet();
			document.body.appendChild(yfbg);
			var resultbg = document.createElement("canvas");
			var ctx2 = resultbg.getContext("2d");
			resultbg.classList.add("th-yfresultbg");
			resultbg.style.setProperty("--w", document.body.offsetWidth + "px");
			resultbg.width = yfbg.width;
			resultbg.height = Math.ceil(yfbg.width * 0.4);
			document.body.appendChild(resultbg);
			var bgImg = new Image();
			bgImg.src = lib.assetURL + "extension/无名美化/image/yufeng/yufengbg.jpg";
			bgImg.onload = function () {
				ctx.drawImage(this, 0, 0, 1659, 600, 0, 0, yfbg.width, yfbg.height);
			};
			var yfItems = [];
			for (var i = 0; i < 13; i++) {
				yfItems[i] = new Image();
				yfItems[i].src = lib.assetURL + "extension/无名美化/image/yufeng/bg" + i + ".png";
			}
			yfItems[13] = new Image();
			yfItems[13].src = lib.assetURL + "extension/无名美化/image/effect/blank.png";
			var timer = new Image();
			timer.src = lib.assetURL + "extension/无名美化/image/effect/time.png";
			var timecover = new Image();
			timecover.src = lib.assetURL + "extension/无名美化/image/effect/timeX.png";
			var laoxianX = (window.innerWidth * 0.09) / game.documentZoom;
			var laoxianY = (window.innerHeight * 0.5 + yfbg.height * 0.085) / game.documentZoom;
			var laoxianWidth = (window.innerWidth * 0.05) / game.documentZoom;
			var laoxianHeight = (yfbg.height * 0.075) / game.documentZoom;
			var newLaoxianX = laoxianX,
				newLaoxianY = laoxianY;
			var laoxian = _ThAnim.loopSpine(_ThunderYuFeng.yf_nanhua, {
				x: laoxianX,
				y: laoxianY,
				height: laoxianHeight,
			});
			laoxian.stageStep = 1;
			var lxSpeed = 0,
				isDown = false;
			var lxX = 0,
				lxY = 0,
				lxW = 0,
				lxH = 0; //老仙在画布上的坐标
			var vc = document.createElement("canvas");
			var vi = vc.getContext("2d");
			vc.classList.add("th-yufengbg");
			vc.style.setProperty("--w", document.body.offsetWidth + "px");
			vc.width = yfbg.width * 0.25;
			vc.height = yfbg.height * 0.25;
			function drawVirtual(img, x, y, width, height) {
				vi.clearRect(0, 0, vc.width, vc.height);
				vi.save();
				vi.drawImage(img, x * 0.25, y * 0.25, width * 0.25, height * 0.25);
				vi.restore();
			}
			function getInRect(x1, y1, x2, y2, x3, y3, x4, y4) {
				//x,y,x+w,y+h
				return [Math.max(x1, x3), Math.max(y1, y3), Math.min(x2, x4), Math.min(y2, y4)];
			}
			var laoxianImg = new Image();
			laoxianImg.src = lib.assetURL + "extension/无名美化/image/yufeng/nanhua.png";
			(function () {
				var drawItem = function (thunder) {
					var type = thunder[0] < 4 ? "grass" : "stone";
					if (thunder[0] == 4) type = "star";
					var item = {
						id: type,
						left: thunder[1] * canvasScale,
						top: thunder[2] * canvasScale,
						width: thunder[3] * canvasScale,
						height: thunder[4] * canvasScale,
						canHit: type > 3,
						img: yfItems[thunder[0]],
						hited: false,
						check: function () {},
					};
					function render() {
						var x = item.left - 1.44 * frame * canvasScale;
						var y = item.top;
						ctx.drawImage(item.img, x, y, item.width, item.height);
						if (item.hited) {
							if (item.id == "star") {
								//yfbg.renderList.remove(render);
								item.id = "grass";
								item.img = yfItems[13];
								game.playAudio("..", "extension", "无名美化", "audio", "yufeng", "yufeng_getStar");
								event.score++;
								let xingpo = _ThAnim.playSpine(_ThunderYuFeng.yf_xingpo, {
									x: (x * 0.5 + item.width * 0.25) / game.documentZoom,
									y: ((window.innerHeight + yfbg.height * 0.5) * 0.5 - y * 0.5 - item.height * 0.25) / game.documentZoom,
									height: item.height * 2,
								});
								if (laoxian.stageStep != 2) xingpo.moveTo((x * 0.5 - item.width * 0.5) / game.documentZoom, null, 400);
							} else if (item.id != "grass") laoxian.isDead = true;
						}
						if (item.id != "grass") {
							// //测试片段
							// ctx.strokeStyle = 'black';
							// ctx.beginPath();
							// ctx.strokeRect(x, y, item.width, item.height);
							// ctx.closePath();
							// //测试片段
							var rect = getInRect(lxX, lxY, lxX + lxW, lxY + lxH, x, y, x + item.width, y + item.height);
							if (rect[0] < rect[2] && rect[1] < rect[3]) {
								// ctx.strokeStyle = 'red';
								// ctx.strokeRect(rect[0], rect[1], rect[2], rect[3])
								if (item.id == "star") item.hited = true;
								else {
									drawVirtual(item.img, x, y, item.width, item.height);
									var data1 = vi.getImageData(rect[0] * 0.25, rect[1] * 0.25, rect[2] * 0.25, rect[3] * 0.25).data;
									drawVirtual(laoxianImg, lxX, lxY, lxW, lxH);
									var data2 = vi.getImageData(rect[0] * 0.25, rect[1] * 0.25, rect[2] * 0.25, rect[3] * 0.25).data;
									for (var i = 3; i < data1.length; i += 4) {
										if (data1[i] > 0 && data2[i] > 0) {
											item.hited = true;
										}
									}
								}
							}
						}
					}
					yfbg.renderList.push(render);
				};
				for (var i = 0; i < stage.length; i++) {
					drawItem(stage[i]);
				}
			})();

			var yfRender = new game.thunderRAF(yfdrawList),
				stars = [];
			function yfdrawList() {
				yfbg.height = yfbg.height;
				resultbg.height = resultbg.height;
				if (event.loaded && !laoxian.isDead) {
					if (laoxian.stageStep != 2) frame += 2.5;
					timerFrame = Math.max(0, --timerFrame);
				}
				ctx.drawImage(bgImg, frame, 0, 1659, 600, 0, 0, yfbg.width, yfbg.height);
				if (!event.yfFinished) {
					ctx2.drawImage(timer, Math.round(318 * canvasScale), Math.round(440 * canvasScale), Math.round(566 * canvasScale), Math.round(20 * canvasScale));
					ctx2.drawImage(timecover, 0, 0, timecover.width * (timerFrame / 550), timecover.height, Math.round(320 * canvasScale), Math.round(442 * canvasScale), Math.round(562 * canvasScale * (timerFrame / 550)), Math.round(16 * canvasScale));
				}
				yfbg.renderList.forEach(function (fn) {
					fn();
				});
				if (!event.isMine() && aiJump.contains(timerFrame)) {
					lxSpeed = 3;
					game.playAudio("..", "extension", "无名美化", "audio", "yufeng", "yufeng_fly");
					laoxian.setAction("qitiao");
				}
				//老仙移动
				if (!laoxian.isDead && event.loaded && laoxian.stageStep < 3 && !event.yfFinished) {
					if (lxSpeed < -0.35) isDown = true;
					if (isDown) {
						lxSpeed -= 0.1;
						lxSpeed = Math.max(-6, lxSpeed);
					} else {
						lxSpeed -= 0.15;
					}
					if (lxSpeed <= 0) laoxian.setAction("xialuo");
					if (laoxian.stageStep == 2) newLaoxianX += (2 * canvasScale) / game.documentZoom;
					if (laoxian.stageStep < 3) newLaoxianY += (lxSpeed * canvasScale) / game.documentZoom;
					laoxian.updateTimeStep("x", laoxianX, newLaoxianX, 16.67);
					laoxian.x = newLaoxianX;
					laoxian.updateTimeStep("y", laoxianY, newLaoxianY, 16.67);
					laoxian.y = newLaoxianY;
					// //测试片段
					// ctx.strokeStyle = 'black';
					// ctx.beginPath();
					lxX = (laoxianX * 2 - laoxianWidth * 1.4) * game.documentZoom;
					lxY = window.innerHeight + yfbg.height - (laoxianY * 2 + laoxianHeight * 7.6) * game.documentZoom;
					lxW = laoxianWidth * 2 * game.documentZoom;
					lxH = laoxianHeight * 2.28 * game.documentZoom;
					// ctx.strokeRect(lxX, lxY, lxW, lxH);
					// ctx.closePath();
					// //测试片段
				}
				if (!event.loaded && !event.firstLoad) {
					event.firstLoad = true;
					let daojishi = _ThAnim.playSpine(_ThunderYuFeng.yf_daojishi, {
						scale: canvasScale * 0.5,
					});
					daojishi.oncomplete = function () {
						event.loaded = true;
					};
				}
				if (event.yfFinished && comment.length) {
					if (!event.firstComment) {
						cT = new Image();
						cT.src = lib.assetURL + "extension/无名美化/image/yufeng/" + resultType + "Title.png";
						cM = new Image();
						cM.src = lib.assetURL + "extension/无名美化/image/yufeng/" + resultType + "Bg.png";
						bL = new Image();
						bL.src = lib.assetURL + "extension/无名美化/image/yufeng/nanhuaResult.png";
						event.firstComment = true;
					} else {
						ctx2.save();
						ctx2.beginPath();
						ctx2.shadowBlur = 5;
						ctx2.shadowOffsetY = 3;
						ctx2.shadowColor = "gray";
						ctx2.drawImage(cT, yfbg.width - commentFrame * canvasScale, 144 * canvasScale, 375 * canvasScale, 36 * canvasScale);
						ctx2.closePath();
						ctx2.beginPath();
						if (resultType == "fail") {
							ctx2.shadowColor = "black";
							ctx2.shadowBlur = 40;
							ctx2.shadowOffsetX = 5;
							ctx2.shadowOffsetY = 5;
						} else ctx2.restore();
						ctx2.drawImage(cM, 0, 0, cM.width * ((resultFrame - 8) / 15), cM.height, 510 * canvasScale, 180 * canvasScale, 340 * ((resultFrame - 8) / 15) * canvasScale, 140 * canvasScale);
						if (resultFrame >= 23) {
							ctx2.fillStyle = "white";
							ctx2.font = 20 * canvasScale + "px 'shousha'";
							ctx2.fillText(comment, 680 * canvasScale - comment.length * 10 * canvasScale, 260 * canvasScale);
						}
						ctx2.closePath();
						if (resultType == "fail") ctx2.restore();
						ctx2.save();
						ctx2.globalAlpha = Math.min(1, resultFrame / 8);
						ctx2.drawImage(bL, 290 * canvasScale, 106 * canvasScale, 280 * canvasScale, 230 * canvasScale);
						ctx2.restore();
					}
					commentFrame += 30;
					if (resultFrame >= 23 && !event.kuangAsset) {
						event.kuangAsset = true;
						var kuangScale = resultType == "win" ? 0.36 : 0.41;
						dcdAnim.loadSpine(_ThunderYuFeng["yf_" + resultType + "kuang"].name, "skel", function () {
							dcdAnim.playSpine(
								{
									name: _ThunderYuFeng["yf_" + resultType + "kuang"].name,
									speed: 0.9,
								},
								{
									x: (345 * canvasScale) / game.documentZoom,
									y: (159 * canvasScale) / game.documentZoom,
									scale: (kuangScale * canvasScale) / game.documentZoom,
									parent: resultbg,
								}
							);
						});
					}
					if (starTotal > 0 && (resultFrame == 26 || resultFrame == 28 || resultFrame == 30)) {
						let starScale = starNum > 0 ? 0.325 : 0.35;
						let star = dcdAnim.playSpine(
							{
								name: _ThunderYuFeng["yf_" + (starNum > 0 ? "shengli" : "shibai") + "xing"].name,
							},
							{
								x: ((345 + totalScore * 15 - starTotal * 30) * canvasScale) / game.documentZoom,
								y: (160 * canvasScale) / game.documentZoom,
								scale: (starScale * canvasScale) / game.documentZoom,
								parent: resultbg,
							}
						);
						star.onupdate = function () {
							var entry = this.skeleton.state.tracks[0];
							if (entry.trackTime >= 0.9 * entry.animationEnd) {
								this.speed = 0;
							}
						};
						stars.push(star);
						starNum--;
						starTotal--;
					}
					if (commentFrame > 728) {
						commentFrame = 728;
						if (!event.zitiAssets) {
							event.zitiAssets = true;
							var zitiScale = resultType == "win" ? 0.34 : 0.38;
							dcdAnim.loadSpine(_ThunderYuFeng["yf_" + resultType + "ziti"].name, "skel", function () {
								dcdAnim.playSpine(
									{
										name: _ThunderYuFeng["yf_" + resultType + "ziti"].name,
										speed: 0.9,
									},
									{
										x: (345 * canvasScale) / game.documentZoom,
										y: (117.5 * canvasScale) / game.documentZoom,
										scale: (zitiScale * canvasScale) / game.documentZoom,
										parent: resultbg,
									}
								);
							});
						}
					}
					resultFrame++;
					if (resultFrame >= 120 && !event.thunder) {
						event.thunder = true;
						yufengEnd();
					}
				}

				if (frame == 800) {
					laoxian.stageStep = 2;
				}
				if (!event.yfFinished && (laoxianX >= (yfbg.width * 0.3725) / game.documentZoom || laoxian.isDead)) {
					if (!laoxian.isDead && event.score) {
						laoxian.setAction("fei");
						laoxian.stageStep = 3;
					} else laoxian.isDead = true;
					setResult();
				}
			}
			function setResult() {
				event.yfFinished = true;
				starNum = event.score;
				event._result = {
					bool: !laoxian.isDead && event.score,
				};
				resultType = event._result.bool ? "win" : "fail";
				game.playAudio("..", "extension", "无名美化", "audio", "yufeng", "yufeng_" + resultType);
				comment = "“满载而归，哈哈哈”";
				if (event.score == 0) comment = "“惜哉，未能窥见星辰”";
				else if (laoxian.isDead) comment = "“风紧，赶紧跑”";
				else if (totalScore > event.score) comment = "“星辰已纳入囊中”";
			}
			function yufengEnd() {
				yfRender.stop = true;
				game.thunderAllowTouch();
				blackbg.remove();
				yfbg.remove();
				resultbg.remove();
				_ThAnim.stopSpineAll();
				stars.forEach(i => dcdAnim.stopSpine(i));
				game.resume();
				if (shoushaJDT) shoushaJDT.show();
			}
			laoxian.onupdate = function () {
				if (this.timestepMap.x) {
					laoxianX = this.timestepMap.x.current;
					laoxianY = this.timestepMap.y.current;
					if (this.timestepMap.y.current + laoxianHeight * 0.5 >= ((window.innerHeight + yfbg.height * 0.5) * 0.5 - 0) / game.documentZoom || this.timestepMap.y.current - laoxianHeight * 0.8 <= ((window.innerHeight + yfbg.height * 0.5) * 0.5 - yfbg.height * 0.5) / game.documentZoom) {
						this.isDead = true;
					}
				}
			};
			("step 1");
			if (_status.old_duiease) decadeUI.ease = _status.old_duiease;
			if (result.bool && !_status.qhly_skillTest) {
				player.storage.th_yufeng = Math.min(3, ++player.storage.th_yufeng);
				player
					.chooseTarget("你可令至多" + event.score + "名角色跳过出牌弃牌或摸牌阶段", [1, event.score], function (card, player, target) {
						return target != player && !target.hasSkill("yufeng2");
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						var att = -get.attitude(player, target),
							attx = att * 2;
						if (att <= 0 || target.hasSkill("xinfu_pdgyingshi")) return 0;
						if (target.hasJudge("lebu")) attx -= att;
						if (target.hasJudge("bingliang")) attx -= att;
						return attx / Math.max(2.25, Math.sqrt(target.countCards("h") + 1));
					});
			} else {
				if (!_status.qhly_skillTest) {
					player.storage.th_yufeng = 1;
					if (event.score) player.draw(event.score);
				} else _status.qhly_skillTest = false;
				event.finish();
			}
			("step 2");
			if (result.bool) {
				result.targets.sortBySeat();
				player.line(result.targets, "green");
				game.log(result.targets, "获得了", "#y“御风”", "效果");
				for (var i of result.targets) i.addSkill("yufeng2");
				if (event.score > result.targets.length) player.draw(event.score - result.targets.length);
			} else player.draw(event.score);
		},
		ai: {
			order: 10,
			result: { player: 1 },
			threaten: 3.2,
		},
	};
	//天书装备特效
	Object.assign(lib.skill.tianshu, {
		content: function () {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt2("tianshu"),
				filterCard: true,
				position: "he",
				ai1: function (card) {
					return 5 - get.value(card);
				},
				ai2: function (target) {
					var player = _status.event.player;
					if (get.attitude(player, target) > 0 && !target.hasEmptySlot(2)) return 0;
					return get.attitude(player, target);
				},
			});
			("step 1");
			if (!result.bool) {
				event.finish();
				return;
			}
			var target = result.targets[0];
			event.target = target;
			player.logSkill("tianshu", target);
			player.discard(result.cards);
			if (!lib.inpile.includes("taipingyaoshu")) {
				lib.inpile.push("taipingyaoshu");
				event.card = game.createCard2("taipingyaoshu", "heart", 3);
			} else {
				event.card = get.cardPile(function (card) {
					return card.name == "taipingyaoshu";
				});
			}
			if (!event.card) event.finish();
			else target.gain(event.card, "gain2");
			("step 2");
			if (target.getCards("h").includes(card) && get.name(card, target) == "taipingyaoshu") target.chooseUseTarget(card, "nopopup", true);
			dcdAnim.loadSpine(_ThunderYuFeng.tpys.name, "skel", function () {
				dcdAnim.playSpine(_ThunderYuFeng.tpys, {
					parent: result.targets[0],
					scale: 0.8,
				});
			});
		},
	});
}
