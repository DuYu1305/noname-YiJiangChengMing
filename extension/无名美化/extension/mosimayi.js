import { PlayCustomAnByVideo } from "../utils/utils.js";
import { lib, game, ui, get, ai, _status } from "../../../noname.js";

class SimayiPlay extends PlayCustomAnByVideo {
	play() {
		super.play()
		this.imgMap = {
			wu1: {
				width: "100px",
				translate: "translate(calc(-50% + 190px), calc(-50% - 175px))",
			},
			tian: {
				width: "130px",
				translate: "translate(calc(-50% + 250px), calc(-50% - 87px))",
			},
			wu2: {
				width: "130px",
				translate: "translate(calc(-50% + 300px), calc(-50% - -14px))",
			},
			jie: {
				width: "180px",
				translate: "translate(calc(-50% + 369px), calc(-50% - -158px)",
			},
		};
		Object.keys(this.imgMap).forEach((key, index) => {
			this.imgMap[key].t = setTimeout(() => {
				this.createImg(key);
			}, 3000 + index * 100);
		});
	}
	createImg(name) {
		this[name] = document.createElement("img");
		this[name].src = `${lib.assetURL}extension/无名美化/animation/mosimayi/${name}.png`;
		this[name].style.position = "absolute";
		this[name].style.width = this.imgMap[name].width;
		// this[name].style.height = "100%";
		this[name].style.top = "50%";
		this[name].style.left = "50%";
		this[name].style.transform = this.imgMap[name].translate;
		this[name].style.zIndex = "16";
		document.body.appendChild(this[name]);
		// this[name].style.transition = "all 0.5s";
	}
	clearImg() {
		if (this.imgMap) {
			Object.keys(this.imgMap).forEach((key, index) => {
				if (this[key]) {
					document.body.removeChild(this[key]);
				}
				if (this.imgMap[key].t) {
					clearTimeout(this.imgMap[key].t);
					this.imgMap[key].t = null;
				}
			});
		}
	}
	stop() {
		super.stop()
		this.clearImg();
	}
}
export function mosimayi() {
	// window.mosimayi = () => {
	// 	let msmy = new SimayiPlay({
	// 		SS_cmmask: {
	// 			name: "../../../无名美化/animation/mosimayi/SS_cmmask",
	// 			speed: 0.8,
	// 			loop: true,
	// 			scale: 0.9,
	// 		},
	// 		video: `${lib.assetURL}extension/无名美化/video/mosimayi.mp4`,
	// 	});
	// 	msmy.run();
	// };
	Object.assign(lib.skill.olmoubian, {
		init() {
			ui.mosimayi = new SimayiPlay({
				SS_cmmask: {
					name: "../../../无名美化/animation/mosimayi/SS_cmmask",
					speed: 0.8,
					loop: true,
					scale: 0.9,
				},
				video: `${lib.assetURL}extension/无名美化/video/mosimayi.mp4`,
			});
		},
		async content(event, trigger, player) {
			ui.mosimayi.run();
			player.addSkill("olrumo");
			const skills = player.storage.olguifu_record?.skill;
			if (skills?.length) await player.addSkills(skills);
			await player.addSkills(["olzhouxi"]);
		},
	});
}
