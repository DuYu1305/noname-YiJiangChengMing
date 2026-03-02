import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//来源/参考自 (作者@西瓜)
//来源/参考自 EpicFX (作者@EngJ.K)
//倘若二改
window._testjx = function (skillName, seat = 1, test = false) {
	var viewSkill = getSkills(game.players[seat].name);
	if (game.players[seat].name2) {
		viewSkill = viewSkill.concat(getSkills(game.players[seat].name2));
	}
	console.log("viewSkill", viewSkill);
	console.log("skills", game.players[seat].skills);
	decadeUI.effect.skill(game.players[seat], skillName || "决进", "", test);
	// avatar_wenzhi.style.visibility = "visible";
};
//获取武将所有技能
function getSkills(name) {
	var skills = get.character(name, 3);
	var viewSkill = [];
	for (var skill of skills) {
		var info = get.info(skill);
		// console.log("info", info);
		if (!info || info.nopop || !get.translation(skill + "_info")) {
			continue;
		}
		viewSkill.add(skill);
		if (info.derivation) {
			if (typeof info.derivation === "string") {
				viewSkill.add(info.derivation);
			} else {
				for (var s of info.derivation) {
					viewSkill.add(s);
				}
			}
		}
	}
	return viewSkill;
}
//获取技能类型
function getSkillType(skillName) {
	if (!skillName) {
		// get.translation(skill + '_info')
		return "xiandingji";
	}
	var skillType = "";
	if (get.info(skillName).juexingji) {
		skillType = "juexingji";
	} else if (get.info(skillName).limited) {
		skillType = "xiandingji";
	} else if (get.info(skillName).dutySkill) {
		skillType = "shimingji";
	}
	return skillType;
}
//获取技能对应的id 决进 => mbjuejin
function getName(player, oskill) {
	let target = player.skills.findIndex(skill => get.translation(skill) == oskill);
	if (target == -1) {
		//找不到再去找一次
		var viewSkill = getSkills(player.name);
		//双将模式
		if (player.name2) {
			viewSkill = viewSkill.concat(getSkills(player.name2));
		}
		target = viewSkill.findIndex(skill => get.translation(skill) == oskill);
		return target== -1 ? false : viewSkill[target];
	}
	let skill = player.skills[target];
	return skill;
}
export function juexingji1() {
	lib.init.css(lib.assetURL + "extension/无名美化/css", "juexingji1");
	window._JUEXINGJI1 = {
		juexingji: {
			name: "../../../无名美化/animation/juexingji/juexingji1/animation/juexingji",
		},
		xiandingji: {
			name: "../../../无名美化/animation/juexingji/juexingji1/animation/xiandingji",
		},
		shimingji: {
			name: "../../../无名美化/animation/juexingji/juexingji1/animation/shimingji",
		},
	};
	if (decadeUI) {
		decadeUI.effect.skill = function (player, skillName, vice, test) {
			var name = getName(player, skillName);
			if (name && lib.juexingjiTXPool && name in lib.juexingjiTXPool) {
				lib.juexingjiTXPool[name](player, skillName, vice);
			} else {
				if (get.itemtype(player) != "player") return console.error("player");
				var skillType = getSkillType(name);
				let scale = 0.8;
				if ("juexingji" == skillType) {
					dcdAnim.loadSpine(window._JUEXINGJI1.juexingji.name, "skel", function () {
						dcdAnim.playSpine(window._JUEXINGJI1.juexingji, {
							speed: 1,
							scale,
						});
					});
					var avatar_wenzhi = ui.create.div(".juexingjinengming .wmmh-skill-common-jinengming", ui.arena);
				} else if ("xiandingji" == skillType) {
					dcdAnim.loadSpine(window._JUEXINGJI1.xiandingji.name, "skel", function () {
						dcdAnim.playSpine(window._JUEXINGJI1.xiandingji, {
							speed: 1,
							scale,
						});
					});
					var avatar_wenzhi = ui.create.div(".xiandingwujiangtu .wmmh-skill-common-jinengming", ui.arena);
				} else if ("shimingji" == skillType) {
					dcdAnim.loadSpine(window._JUEXINGJI1.shimingji.name, "skel", function () {
						dcdAnim.playSpine(window._JUEXINGJI1.shimingji, {
							speed: 1,
							scale,
						});
					});
					var avatar_wenzhi = ui.create.div(".shimingwujiangtu .wmmh-skill-common-jinengming", ui.arena);
				} else {
					dcdAnim.loadSpine(window._JUEXINGJI1.xiandingji.name, "skel", function () {
						dcdAnim.playSpine(window._JUEXINGJI1.xiandingji, {
							speed: 1,
							scale,
						});
					});
					var avatar_wenzhi = ui.create.div(".xiandingwujiangtu .wmmh-skill-common-jinengming", ui.arena);
				}
				var avatar = ui.create.div(".juexingwujiangtu", ui.arena);
				if (vice == "vice") {
					avatar.style.backgroundImage = player.node.avatar2.style.backgroundImage; // 主将立绘
				} else {
					avatar.style.backgroundImage = player.node.avatar.style.backgroundImage; // 副将立绘
				}
				avatar_wenzhi.innerHTML = skillName;
				// if (test) {
				// 	avatar_wenzhi.style.visibility = "visible";
				// 	// avatar_wenzhi.style.animation = "none";

				// 	avatar.style.visibility = "visible";
				// 	// avatar.style.animation = "none";
				// }
			}
		};
	}
}

export function juexingji2() {
	lib.init.css(lib.assetURL + "extension/无名美化/css", "juexingji2");
	let txname = "../../../无名美化/animation/juexingji/juexingji2/animation/jxxd";
	dcdAnim.loadSpine(txname, "skel");
	
	if (decadeUI) {
		decadeUI.effect.skill = function (player, skillName, vice, test) {
			// function getName(skill) {
			// 	for (let i = 0; i < player.skills.length; i++) {
			// 		let temp = player.skills[i];
			// 		if (get.translation(temp) == skill) {
			// 			return temp;
			// 		}
			// 	}
			// 	return false;
			// }
			var name = getName(player, skillName);
			if (name && lib.juexingjiTXPool && name in lib.juexingjiTXPool) {
				lib.juexingjiTXPool[name](player, skillName, vice);
			} else {
				//off shizhounian shousha
				let lutouType = lib.config["extension_十周年UI_outcropSkin"]
				console.log("lutouType", lutouType);
				if (get.itemtype(player) != "player") return console.error("player");

				var skillType = getSkillType(name);

				var action = skillType == "juexingji" ? "animation1" : "animation2";
				// if(test){
				// 	action = "animation1";
				// }
				if (skillType == "juexingji") {
					let className = ".juexingwujiangtu .juexingwujiangtu2";
					if(lutouType=="shousha"){
						className += " .juexingwujiangtu-shousha";
					}else if(lutouType=="shizhounian"){
						className += " .juexingwujiangtu-shizhounian";
					}
					var avatar = ui.create.div(className, ui.arena);
					var avatar_wenzhi = ui.create.div(".juexingjinengming .wmmh-skill-common-jinengming .wmmh-skill-common-jinengming2", ui.arena);
				} else {
					let className = ".juexingwujiangtu";
					if(lutouType=="shousha"){
						className += " .xiandingshimingji-shousha";
					}else if(lutouType=="shizhounian"){
						className += " .xiandingshimingji-shizhounian";
					}
					var avatar = ui.create.div(className, ui.arena);
					if(skillType == "xiandingji"){
						var avatar_wenzhi = ui.create.div(".xiandingwujiangtu .wmmh-skill-common-jinengming", ui.arena);
					}else{
						var avatar_wenzhi = ui.create.div(".shimingwujiangtu .wmmh-skill-common-jinengming", ui.arena);
					}
				}
				dcdAnim.playSpine({
					name:txname,
					action,
					loop: test,
				}, {
					speed: 1,
					scale: 1.1,
				});
				var avatar_wenzhi;
				let target = null;
				if (vice == "vice") {
					target = player.node.avatar2;
					// 主将立绘
				} else {
					target = player.node.avatar;
					// 副将立绘
				}
				avatar.style.backgroundImage = target.style.backgroundImage;
				let reac = player.getBoundingClientRect();
				avatar.style.left = reac.left + "px";
				avatar.style.top = reac.top + "px";
				avatar_wenzhi.innerHTML = skillName;
				if (test) {
					avatar_wenzhi.style.visibility = "visible";
					avatar.style.visibility = "visible";
				}
			}
		};
	}
}

export function juexingji3() {
	lib.init.css(lib.assetURL + "extension/无名美化/css", "juexingji3");
	window._JUEXINGJI3 = {
		oljuexingji: {
			name: "../../../无名美化/animation/juexingji/juexingji3/animation/oljuexingji",
		},
		olxiandingji: {
			name: "../../../无名美化/animation/juexingji/juexingji3/animation/olxiandingji",
		},
		olshimingji: {
			name: "../../../无名美化/animation/juexingji/juexingji3/animation/olshimingji",
		},
	};
	if (decadeUI) {
		decadeUI.effect.skill = function (player, skillName, vice, test) {
			// function getName(skill) {
			// 	for (let i = 0; i < player.skills.length; i++) {
			// 		let temp = player.skills[i];
			// 		if (get.translation(temp) == skill) {
			// 			return temp;
			// 		}
			// 	}
			// 	return false;
			// }
			var name = getName(player, skillName);
			// var name = getName(skillName);
			if (name && lib.juexingjiTXPool && name in lib.juexingjiTXPool) {
				lib.juexingjiTXPool[name](player, skillName, vice);
			} else {
				if (get.itemtype(player) != "player") return console.error("player");
				var skillType = getSkillType(name);

				if ("juexingji" == skillType) {
					dcdAnim.loadSpine(window._JUEXINGJI3.oljuexingji.name, "skel", function () {
						dcdAnim.playSpine(window._JUEXINGJI3.oljuexingji, {
							speed: 0.75,
							scale: 0.9,
						});
					});
					ui.create.div(".juexingicon .wmmh-skill-common-icon", ui.arena);
				} else if ("xiandingji" == skillType) {
					dcdAnim.loadSpine(window._JUEXINGJI3.olxiandingji.name, "skel", function () {
						dcdAnim.playSpine(window._JUEXINGJI3.olxiandingji, {
							speed: 0.75,
							scale: 0.9,
							// loop: test,
						});
					});
					ui.create.div(".xiandingicon .wmmh-skill-common-icon", ui.arena);
				} else if ("shimingji" == skillType) {
					dcdAnim.loadSpine(window._JUEXINGJI3.olshimingji.name, "skel", function () {
						dcdAnim.playSpine(window._JUEXINGJI3.olshimingji, {
							speed: 0.75,
							scale: 0.9,
						});
					});
					ui.create.div(".shimingicon .wmmh-skill-common-icon", ui.arena);
				} else {
					dcdAnim.loadSpine(window._JUEXINGJI3.olxiandingji.name, "skel", function () {
						dcdAnim.playSpine(window._JUEXINGJI3.olxiandingji, {
							speed: 0.75,
							scale: 0.9,
						});
					});
					ui.create.div(".xiandingicon .wmmh-skill-common-icon", ui.arena);
				}
				//技能名字
				var avatar_wenzhi = ui.create.div(".wmmh-skill-common-jinengming", ui.arena);
				var skillName1 = "\n ";
				var skillName2 = skillName.substring(0, 1);
				var skillName3 = skillName.substring(1);
				var skillName4 = skillName2.concat(skillName1);
				var skillName5 = skillName4.concat(skillName3);
				avatar_wenzhi.innerHTML = skillName5;
				//武将图
				var avatar = ui.create.div(".juexingwujiangtu", ui.arena);
				if (vice == "vice") {
					avatar.style.backgroundImage = player.node.avatar2.style.backgroundImage; // 主将立绘
				} else {
					avatar.style.backgroundImage = player.node.avatar.style.backgroundImage; // 副将立绘
				}
				// if (test) {
				// 	avatar_wenzhi.style.visibility = "visible";
				// 	avatar.style.visibility = "visible";
				// }
			}
		};
	}
}
