import { lib, game, ui, get, ai, _status } from "../../../noname.js";
export function tuozhuaizhishixian() {
	Object.assign(lib.ui.click, {
		windowmousemove: function (e) {
			if (window.inSplash) return;
			if (_status.tempunpopup) {
				if (get.evtDistance(_status.tempunpopup, e) > 5) {
					delete _status.tempunpopup;
				}
			}
			if (e.button == 2) return;
			var dialogs = document.querySelectorAll(
				"#window>.dialog.popped:not(.static)"
			);
			for (var i = 0; i < dialogs.length; i++) {
				dialogs[i].delete();
			}
			var node = _status.currentmouseenter;
			var sourceitem = document.elementFromPoint(e.clientX, e.clientY);
			if (game.chess && ui.selected.cards.length) {
				var itemtype = get.itemtype(sourceitem);
				if (itemtype != "card" && itemtype != "button") {
					for (var i = 0; i < game.players.length; i++) {
						var ex =
							e.clientX / game.documentZoom - ui.arena.offsetLeft;
						var ey =
							e.clientY / game.documentZoom - ui.arena.offsetTop;
						var left =
							-ui.chessContainer.chessLeft +
							ui.chess.offsetLeft +
							game.players[i].getLeft();
						var top =
							-ui.chessContainer.chessTop +
							ui.chess.offsetTop +
							game.players[i].getTop();
						var width = game.players[i].offsetWidth;
						var height = game.players[i].offsetHeight;
						if (
							ex > left &&
							ex < left + width &&
							ey > top &&
							ey < top + height
						) {
							sourceitem = game.players[i];
							break;
						}
					}
				}
			}
			var item = sourceitem;
			if (_status.mousedragging) {
				e.preventDefault();
				if (lib.config.enable_dragline) {
					ui.canvas.width = ui.arena.offsetWidth;
					ui.canvas.height = ui.arena.offsetHeight;
					var ctx = ui.ctx;
					ctx.shadowBlur = 10;
					ctx.shadowColor = "rgba(229, 225, 92)";
					ctx.lineCap = "round";
					ctx.lineJoin = "round";
					ctx.lineWidth = 10;
					ctx.setLineDash([]);
					ctx.beginPath();
					var l = 25;
					var x1 =
						_status.mousedragging.clientX / game.documentZoom -
						ui.arena.offsetLeft;
					var y1 =
						_status.mousedragging.clientY / game.documentZoom -
						ui.arena.offsetTop;
					var a, x2, y2, x3, y3, x4, y4;

					ctx.moveTo(x1, y1);
					if (_status.multitarget) {
						for (
							var i = 0;
							i < _status.lastdragchange.length;
							i++
						) {
							var exy = _status.lastdragchange[i]._lastdragchange;
							ctx.lineTo(exy[0], exy[1]);
							x2 = exy[0];
							y2 = exy[1];
							a = Math.atan2(y2 - y1, x2 - x1);
							x3 = x2 - l * Math.cos(a + (30 * Math.PI) / 180);
							y3 = y2 - l * Math.sin(a + (30 * Math.PI) / 180);
							x4 = x2 - l * Math.cos(a - (30 * Math.PI) / 180);
							y4 = y2 - l * Math.sin(a - (30 * Math.PI) / 180);
							ctx.moveTo(x3, y3);
							ctx.lineTo(x2, y2);
							ctx.lineTo(x4, y4);
							var gnt = ctx.createLinearGradient(x1, y1, x2, y2);
							gnt.addColorStop(0, "transparent");
							gnt.addColorStop(1, "red");
							ctx.strokeStyle = gnt;
						}
					}
					if (!_status.selectionfull) {
						x2 =
							e.clientX / game.documentZoom - ui.arena.offsetLeft;
						y2 = e.clientY / game.documentZoom - ui.arena.offsetTop;
						ctx.lineTo(x2, y2);
						a = Math.atan2(y2 - y1, x2 - x1);
						x3 = x2 - l * Math.cos(a + (30 * Math.PI) / 180);
						y3 = y2 - l * Math.sin(a + (30 * Math.PI) / 180);
						x4 = x2 - l * Math.cos(a - (30 * Math.PI) / 180);
						y4 = y2 - l * Math.sin(a - (30 * Math.PI) / 180);
						ctx.moveTo(x3, y3);
						ctx.lineTo(x2, y2);
						ctx.lineTo(x4, y4);
						var gnt = ctx.createLinearGradient(x1, y1, x2, y2);
						gnt.addColorStop(0, "transparent");
						gnt.addColorStop(1, "red");
						ctx.strokeStyle = gnt;
					}
					ctx.stroke();

					if (!_status.multitarget) {
						for (
							var i = 0;
							i < _status.lastdragchange.length;
							i++
						) {
							ctx.moveTo(
								_status.mousedragging.clientX /
									game.documentZoom -
									ui.arena.offsetLeft,
								_status.mousedragging.clientY /
									game.documentZoom -
									ui.arena.offsetTop
							);
							var exy = _status.lastdragchange[i]._lastdragchange;
							ctx.lineTo(exy[0], exy[1]);
							x2 = exy[0];
							y2 = exy[1];
							a = Math.atan2(y2 - y1, x2 - x1);
							x3 = x2 - l * Math.cos(a + (30 * Math.PI) / 180);
							y3 = y2 - l * Math.sin(a + (30 * Math.PI) / 180);
							x4 = x2 - l * Math.cos(a - (30 * Math.PI) / 180);
							y4 = y2 - l * Math.sin(a - (30 * Math.PI) / 180);
							ctx.moveTo(x3, y3);
							ctx.lineTo(x2, y2);
							ctx.lineTo(x4, y4);
							var gnt = ctx.createLinearGradient(x1, y1, x2, y2);
							gnt.addColorStop(0, "transparent");
							gnt.addColorStop(1, "red");
							ctx.strokeStyle = gnt;
							ctx.stroke();
						}
					}
				}

				while (item) {
					if (item == _status.mousedragorigin) {
						if (_status.mouseleft) {
							_status.mousedragging = null;
							_status.mousedragorigin = null;
							_status.clicked = false;
							if (
								_status.event.type == "phase" &&
								!_status.event.skill &&
								ui.confirm
							) {
								ui.confirm.classList.add("removing");
							}
							game.uncheck();
							game.check();
							_status.clicked = true;
						}
						return;
					}
					var itemtype = get.itemtype(item);
					if (
						itemtype == "card" ||
						itemtype == "button" ||
						itemtype == "player"
					) {
						_status.mouseleft = true;
						if (ui.selected.cards.length) {
							ui.selected.cards[0].updateTransform(true, 100);
						}
						var ex =
							e.clientX / game.documentZoom - ui.arena.offsetLeft;
						var ey =
							e.clientY / game.documentZoom - ui.arena.offsetTop;
						var exx = ex,
							eyy = ey;
						if (game.chess) {
							ex -=
								-ui.chessContainer.chessLeft +
								ui.chess.offsetLeft;
							ey -=
								-ui.chessContainer.chessTop +
								ui.chess.offsetTop;
						}
						if (
							itemtype != "player" ||
							game.chess ||
							(ex > item.offsetLeft &&
								ex < item.offsetLeft + item.offsetWidth &&
								ey > item.offsetTop &&
								ey < item.offsetTop + item.offsetHeight)
						) {
							var targetfixed = false;
							if (itemtype == "player") {
								if (
									get.select(_status.event.selectTarget)[1] <=
									-1
								) {
									targetfixed = true;
								}
							}
							if (
								!targetfixed &&
								item.classList.contains("selectable") &&
								_status.dragstatuschanged != item
							) {
								_status.mouseleft = true;
								_status.dragstatuschanged = item;
								_status.clicked = false;
								var notbefore =
									itemtype == "player" &&
									!item.classList.contains("selected");
								ui.click[itemtype].call(item);
								if (item.classList.contains("selected")) {
									if (notbefore) {
										_status.lastdragchange.push(item);
										item._lastdragchange = [exx, eyy];
									}
								} else {
									_status.lastdragchange.remove(item);
								}
								_status.selectionfull = true;
								if (
									_status.event.filterButton &&
									ui.selected.buttons.length <
										get.select(
											_status.event.selectButton
										)[1]
								) {
									_status.selectionfull = false;
								} else if (
									_status.event.filterCard &&
									ui.selected.cards.length <
										get.select(_status.event.selectCard)[1]
								) {
									_status.selectionfull = false;
								} else if (
									_status.event.filterTarget &&
									ui.selected.targets.length <
										get.select(
											_status.event.selectTarget
										)[1]
								) {
									_status.selectionfull = false;
								}
							}
						}
						return;
					}
					item = item.parentNode;
				}
				if (!_status.mouseleft) {
					_status.mouseleft = true;
					game.check();
					for (var i = 0; i < ui.selected.cards.length; i++) {
						ui.selected.cards[i].updateTransform(true);
					}
				}
				_status.dragstatuschanged = null;
			} else {
				while (item) {
					if (item == node && !node._mouseentercreated) {
						ui.click.mouseentercancel();
						var hoveration;
						if (typeof node._hoveration == "number") {
							hoveration = node._hoveration;
						} else {
							hoveration = parseInt(lib.config.hoveration);
							if (
								node.classList.contains("button") ||
								(node.parentNode &&
									node.parentNode.parentNode) == ui.me
							) {
								hoveration += 500;
							}
						}
						_status._mouseentertimeout = setTimeout(function () {
							if (
								_status.currentmouseenter != node ||
								node._mouseentercreated ||
								_status.tempunpopup ||
								_status.mousedragging ||
								_status.mousedown ||
								!node.offsetWidth ||
								!node.offsetHeight
							) {
								return;
							}
							if (node._hoverfunc && !node._nopup) {
								var dialog = node._hoverfunc.call(node, e);
								if (dialog) {
									dialog.classList.add("popped");
									ui.window.appendChild(dialog);
									lib.placePoppedDialog(dialog, e);
									if (node._hoverwidth) {
										dialog.style.width =
											node._hoverwidth + "px";
										dialog._hovercustomed = true;
									}
									node._mouseenterdialog = dialog;
									node._mouseentercreated = true;
								}
							}
						}, hoveration);
						break;
					}
					item = item.parentNode;
				}
				if (_status.draggingdialog) {
					var ddialog = _status.draggingdialog;
					if (ddialog._dragorigin && ddialog._dragtransform) {
						var translate = ddialog._dragtransform.slice(0);
						translate[0] +=
							e.clientX / game.documentZoom -
							ddialog._dragorigin.clientX / game.documentZoom;
						translate[1] +=
							e.clientY / game.documentZoom -
							ddialog._dragorigin.clientY / game.documentZoom;
						ui.click.checkdialogtranslate(translate, ddialog);
					}
					_status.clicked = true;
				}
				if (_status.draggingroundmenu) {
					if (
						ui.roundmenu._dragorigin &&
						ui.roundmenu._dragtransform
					) {
						var translate = ui.roundmenu._dragtransform.slice(0);
						translate[0] +=
							e.clientX / game.documentZoom -
							ui.roundmenu._dragorigin.clientX /
								game.documentZoom;
						translate[1] +=
							e.clientY / game.documentZoom -
							ui.roundmenu._dragorigin.clientY /
								game.documentZoom;
						ui.click.checkroundtranslate(translate);
					}
					_status.clicked = true;
				}
			}
		},
		windowtouchmove: function (e) {
			e.preventDefault();
			if (window.inSplash) return;
			if (_status.draggingroundmenu) {
				delete _status._swipeorigin;
				if (
					ui.roundmenu._dragorigin &&
					ui.roundmenu._dragtransform &&
					e.touches.length
				) {
					var translate = ui.roundmenu._dragtransform.slice(0);
					var dx =
						e.touches[0].clientX / game.documentZoom -
						ui.roundmenu._dragorigin.clientX / game.documentZoom;
					var dy =
						e.touches[0].clientY / game.documentZoom -
						ui.roundmenu._dragorigin.clientY / game.documentZoom;
					translate[0] += dx;
					translate[1] += dy;
					if (dx * dx + dy * dy > 100) {
						if (ui.roundmenu._resetTimeout) {
							clearTimeout(ui.roundmenu._resetTimeout);
							delete ui.roundmenu._resetTimeout;
						}
					}
					ui.roundmenu._dragtouches = e.touches[0];
					ui.click.checkroundtranslate(translate);
				}
				_status.clicked = true;
			} else if (_status.draggingtouchdialog) {
				delete _status._swipeorigin;
				if (
					_status.draggingtouchdialog._dragorigin &&
					_status.draggingtouchdialog._dragtransform &&
					e.touches.length
				) {
					var translate =
						_status.draggingtouchdialog._dragtransform.slice(0);
					var dx =
						e.touches[0].clientX / game.documentZoom -
						_status.draggingtouchdialog._dragorigin.clientX /
							game.documentZoom;
					var dy =
						e.touches[0].clientY / game.documentZoom -
						_status.draggingtouchdialog._dragorigin.clientY /
							game.documentZoom;
					translate[0] += dx;
					translate[1] += dy;
					_status.draggingtouchdialog._dragtouches = e.touches[0];
					ui.click.checkdialogtranslate(
						translate,
						_status.draggingtouchdialog
					);
				}
				_status.clicked = true;
			} else if (_status._swipeorigin && e.touches[0]) {
				_status._swipeorigin.touches = e.touches[0];
			}

			if (_status.mousedragging && e.touches.length) {
				e.preventDefault();
				var item = document.elementFromPoint(
					e.touches[0].clientX,
					e.touches[0].clientY
				);
				if (game.chess && ui.selected.cards.length) {
					var itemtype = get.itemtype(item);
					if (itemtype != "card" && itemtype != "button") {
						var ex =
							e.touches[0].clientX / game.documentZoom -
							ui.arena.offsetLeft;
						var ey =
							e.touches[0].clientY / game.documentZoom -
							ui.arena.offsetTop;
						for (var i = 0; i < game.players.length; i++) {
							var left =
								-ui.chessContainer.chessLeft +
								ui.chess.offsetLeft +
								game.players[i].getLeft();
							var top =
								-ui.chessContainer.chessTop +
								ui.chess.offsetTop +
								game.players[i].getTop();
							var width = game.players[i].offsetWidth;
							var height = game.players[i].offsetHeight;
							if (
								ex > left &&
								ex < left + width &&
								ey > top &&
								ey < top + height
							) {
								item = game.players[i];
								break;
							}
						}
					}
				}
				while (item) {
					if (
						lib.config.enable_touchdragline &&
						_status.mouseleft &&
						!game.chess
					) {
						ui.canvas.width = ui.arena.offsetWidth;
						ui.canvas.height = ui.arena.offsetHeight;
						var ctx = ui.ctx;
						ctx.shadowBlur = 10;
						ctx.shadowColor = "rgba(229, 225, 92)";
						ctx.lineCap = "round";
						ctx.lineJoin = "round";
						ctx.lineWidth = 10;
						ctx.setLineDash([]);
						ctx.beginPath();
						var l = 25;
						var x1 =
							_status.mousedragging.clientX / game.documentZoom -
							ui.arena.offsetLeft;
						var y1 =
							_status.mousedragging.clientY / game.documentZoom -
							ui.arena.offsetTop;
						var a, x2, y2, x3, y3, x4, y4;

						ctx.moveTo(x1, y1);

						if (_status.multitarget) {
							for (
								var i = 0;
								i < _status.lastdragchange.length;
								i++
							) {
								var exy =
									_status.lastdragchange[i]._lastdragchange;
								ctx.lineTo(exy[0], exy[1]);
								x2 = exy[0];
								y2 = exy[1];
								a = Math.atan2(y2 - y1, x2 - x1);
								x3 =
									x2 - l * Math.cos(a + (30 * Math.PI) / 180);
								y3 =
									y2 - l * Math.sin(a + (30 * Math.PI) / 180);
								x4 =
									x2 - l * Math.cos(a - (30 * Math.PI) / 180);
								y4 =
									y2 - l * Math.sin(a - (30 * Math.PI) / 180);
								ctx.moveTo(x3, y3);
								ctx.lineTo(x2, y2);
								ctx.lineTo(x4, y4);
								var gnt = ctx.createLinearGradient(
									x1,
									y1,
									x2,
									y2
								);
								gnt.addColorStop(0, "transparent");
								gnt.addColorStop(1, "red");
								ctx.strokeStyle = gnt;
							}
						}
						if (!_status.selectionfull) {
							x2 =
								e.touches[0].clientX / game.documentZoom -
								ui.arena.offsetLeft;
							y2 =
								e.touches[0].clientY / game.documentZoom -
								ui.arena.offsetTop;
							ctx.lineTo(x2, y2);
							a = Math.atan2(y2 - y1, x2 - x1);
							x3 = x2 - l * Math.cos(a + (30 * Math.PI) / 180);
							y3 = y2 - l * Math.sin(a + (30 * Math.PI) / 180);
							x4 = x2 - l * Math.cos(a - (30 * Math.PI) / 180);
							y4 = y2 - l * Math.sin(a - (30 * Math.PI) / 180);
							ctx.moveTo(x3, y3);
							ctx.lineTo(x2, y2);
							ctx.lineTo(x4, y4);
							var gnt = ctx.createLinearGradient(x1, y1, x2, y2);
							gnt.addColorStop(0, "transparent");
							gnt.addColorStop(1, "red");
							ctx.strokeStyle = gnt;
						}
						ctx.stroke();
						if (!_status.multitarget) {
							for (
								var i = 0;
								i < _status.lastdragchange.length;
								i++
							) {
								ctx.moveTo(
									_status.mousedragging.clientX /
										game.documentZoom -
										ui.arena.offsetLeft,
									_status.mousedragging.clientY /
										game.documentZoom -
										ui.arena.offsetTop
								);
								var exy =
									_status.lastdragchange[i]._lastdragchange;
								ctx.lineTo(exy[0], exy[1]);
								x2 = exy[0];
								y2 = exy[1];
								a = Math.atan2(y2 - y1, x2 - x1);
								x3 =
									x2 - l * Math.cos(a + (30 * Math.PI) / 180);
								y3 =
									y2 - l * Math.sin(a + (30 * Math.PI) / 180);
								x4 =
									x2 - l * Math.cos(a - (30 * Math.PI) / 180);
								y4 =
									y2 - l * Math.sin(a - (30 * Math.PI) / 180);
								ctx.moveTo(x3, y3);
								ctx.lineTo(x2, y2);
								ctx.lineTo(x4, y4);
								var gnt = ctx.createLinearGradient(
									x1,
									y1,
									x2,
									y2
								);
								gnt.addColorStop(0, "transparent");
								gnt.addColorStop(1, "red");
								ctx.strokeStyle = gnt;
								ctx.stroke();
							}
						}
					}

					if (item == _status.mousedragorigin) {
						if (_status.mouseleft) {
							_status.mousedragging = null;
							_status.mousedragorigin = null;
							_status.clicked = false;
							game.uncheck();
							game.check();
							_status.clicked = true;
						}
						return;
					}
					var itemtype = get.itemtype(item);
					if (
						itemtype == "card" ||
						itemtype == "button" ||
						itemtype == "player"
					) {
						_status.mouseleft = true;
						if (ui.selected.cards.length) {
							ui.selected.cards[0].updateTransform(true, 100);
						}
						var ex =
							e.touches[0].clientX / game.documentZoom -
							ui.arena.offsetLeft;
						var ey =
							e.touches[0].clientY / game.documentZoom -
							ui.arena.offsetTop;
						var exx = ex,
							eyy = ey;
						if (game.chess) {
							ex -=
								-ui.chessContainer.chessLeft +
								ui.chess.offsetLeft;
							ey -=
								-ui.chessContainer.chessTop +
								ui.chess.offsetTop;
						}
						if (
							itemtype != "player" ||
							game.chess ||
							(ex > item.offsetLeft &&
								ex < item.offsetLeft + item.offsetWidth &&
								ey > item.offsetTop &&
								ey < item.offsetTop + item.offsetHeight)
						) {
							var targetfixed = false;
							if (itemtype == "player") {
								if (
									get.select(_status.event.selectTarget)[1] <=
									-1
								) {
									targetfixed = true;
								}
							}
							if (
								!targetfixed &&
								item.classList.contains("selectable") &&
								_status.dragstatuschanged != item
							) {
								_status.mouseleft = true;
								_status.dragstatuschanged = item;
								_status.clicked = false;
								_status.dragged = false;
								var notbefore =
									itemtype == "player" &&
									!item.classList.contains("selected");
								ui.click[itemtype].call(item);
								if (item.classList.contains("selected")) {
									if (notbefore) {
										_status.lastdragchange.push(item);
										item._lastdragchange = [exx, eyy];
										if (lib.falseitem) {
											var from = [
												_status.mousedragging.clientX /
													game.documentZoom -
													ui.arena.offsetLeft,
												_status.mousedragging.clientY /
													game.documentZoom -
													ui.arena.offsetTop,
											];
											var to = [exx, eyy];
											var node =
												ui.create.div(".linexy.hidden");
											node.style.left = from[0] + "px";
											node.style.top = from[1] + "px";
											node.style.transitionDuration =
												"0.3s";
											node.style.backgroundColor =
												"white";
											var dy = to[1] - from[1];
											var dx = to[0] - from[0];
											var deg =
												(Math.atan(
													Math.abs(dy) / Math.abs(dx)
												) /
													Math.PI) *
												180;
											if (dx >= 0) {
												if (dy <= 0) {
													deg += 90;
												} else {
													deg = 90 - deg;
												}
											} else {
												if (dy <= 0) {
													deg = 270 - deg;
												} else {
													deg += 270;
												}
											}
											node.style.transform =
												"rotate(" +
												-deg +
												"deg) scaleY(0)";
											node.style.height =
												get.xyDistance(from, to) + "px";
											if (game.chess) {
												ui.chess.appendChild(node);
											} else {
												ui.arena.appendChild(node);
											}
											ui.refresh(node);
											node.show();
											node.style.transform =
												"rotate(" +
												-deg +
												"deg) scaleY(1)";
											ui.touchlines.push(node);
											node._origin = item;
										}
									}
								} else {
									_status.lastdragchange.remove(item);
									for (
										var i = 0;
										i < ui.touchlines.length;
										i++
									) {
										if (ui.touchlines[i]._origin == item) {
											ui.touchlines[i].delete();
											ui.touchlines.splice(i--, 1);
										}
									}
								}
								_status.selectionfull = true;
								if (
									_status.event.filterButton &&
									ui.selected.buttons.length <
										get.select(
											_status.event.selectButton
										)[1]
								) {
									_status.selectionfull = false;
								} else if (
									_status.event.filterCard &&
									ui.selected.cards.length <
										get.select(_status.event.selectCard)[1]
								) {
									_status.selectionfull = false;
								} else if (
									_status.event.filterTarget &&
									ui.selected.targets.length <
										get.select(
											_status.event.selectTarget
										)[1]
								) {
									_status.selectionfull = false;
								}
							}
						}
						return;
					}
					item = item.parentNode;
				}
				_status.mouseleft = true;
				_status.dragstatuschanged = null;
			}
		},
	});
	if (!lib.config.touchscreen)
		document.addEventListener("mousemove", ui.click.windowmousemove);
	else document.addEventListener("touchmove", ui.click.windowtouchmove);
}
