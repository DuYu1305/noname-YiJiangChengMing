import { PlayCustomAnByVideo } from "../utils/utils.js";
import { lib, game, ui, get, ai, _status } from "../../../noname.js";

class DiaochanPlay extends PlayCustomAnByVideo {
	play() {
		super.play();
		this.imgMap = {
			da: {
				width: "600px",
				translate: "translate(calc(-50% - 300px), calc(-50%))",
			},
			po: {
				width: "600px",
				translate: "translate(calc(-50% - 300px), calc(-50%))",
			},
			yiqie: {
				width: "600px",
				translate: "translate(calc(-50% - 300px), calc(-50%))",
			},
		};
		Object.keys(this.imgMap).forEach((key, index) => {
			this.imgMap[key].t = setTimeout(() => {
				this.createImg(key);
			}, 3100 + index * 300);
		});
	}
	createImg(name) {
		this[name] = document.createElement("img");
		this[name].src = `${lib.assetURL}extension/无名美化/animation/modiaochan/${name}.png`;
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
		super.stop();
		this.clearImg();
	}
}
export function modiaochan() {
	Object.assign(lib.skill.olqingshi, {
		init() {
			ui.modiaochan = new DiaochanPlay({
				SS_cmmask: {
					name: "../../../无名美化/animation/mosimayi/SS_cmmask",
					speed: 0.8,
					loop: true,
					scale: 0.9,
				},
				video: `${lib.assetURL}extension/无名美化/video/modiaochan.mp4`,
			});
		},
		async content(event, trigger, player) {
			let rumo = player.hasSkill("olrumo")
			if (!player.hasSkill("olrumo")) {
				const name = event.name + "_animate";
				player.trySkillAnimate(name, name, player.checkShow(name));
				player.addSkill("olrumo");
			}
			const { targets } = event;
			const effect = async target => {
				const card = get.cardPile(card => {
					const info = get.info(card);
					return get.tag(card, "damage") > 0.5 && info.selectTarget && get.select(info.selectTarget).every(i => i == 1);
				});
				if (card) {
					const next = target.gain(card, "draw");
					next.gaintag.add("olqingshi_tag");
					await next;
				} else {
					target.chat("无牌可拿");
				}
			};
			await game.doAsyncInOrder(targets, effect);
			if(!rumo){
				ui.modiaochan.run();
			}

		},
	});
}
