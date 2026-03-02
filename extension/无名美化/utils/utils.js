import { lib, game, ui, get, ai, _status } from "../../../noname.js";
export function colMenu(title, configName, endId) {
	if (!endId) {
		endId = configName + "_end";
	}
	if (lib.config[configName] == undefined) {
		function houxu(num = 0, ele) {
			var lst = [];
			var zjys = ele;
			for (var i = 0; i < num; i++) {
				zjys = zjys.nextSibling;
				lst.push(zjys);
			}
			return lst;
		}
		function sliceConfig(end, parent) {
			var lst = [];
			var next = parent;
			while (true) {
				next = next.nextSibling;
				if (next) {
					var element = next.querySelector("[id]");
					if (element) {
						var id = element.id;
						if (id == end) break;
						else lst.push(next);
					} else lst.push(next);
				} else break;
			}
			return lst;
		}
		lib.config[configName] = sliceConfig(endId, this);
		this.innerHTML = "<span style='color:red'><font size='4'>" + title + "（点击后展开）▷" + "</font></span>";
		lib.config[configName].forEach(function (element) {
			element.hide();
		});
	} else {
		this.innerHTML = "<span style='color:red'><font size='4'>" + title + "（点击后折叠）▽" + "</font></span>";
		lib.config[configName].forEach(function (element) {
			element.show();
		});
		delete lib.config[configName];
	}
}

export function copyToClipboard(text) {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard
			.writeText(text)
			.then(function () {
				ui.create.toast("已复制！");
			})
			.catch(function (err) {
				console.error("Failed to copy text: ", err);
			});
	} else {
		var textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		try {
			var successful = document.execCommand("copy");
			var msg = successful ? "successful" : "unsuccessful";
			ui.create.toast("已复制！");
		} catch (err) {
			console.log("Oops, unable to copy");
		}
		document.body.removeChild(textArea);
	}
}
export class Jian {
	constructor(player, anInfo, wjname = "weizhangliao") {
		//null空 half一半 full满
		this.powerStatus = null;
		this.jianAn = null;
		this.player = player;
		this.jian = document.createElement("div");
		this.anInfo = anInfo;
		this.wjname = wjname;
		this.timeout = 500; //等待多久切换图片
		this.rotate = -90;
		this.right = 250;
		this.bottom = 70;
		//移动端的处理
		if (lib.device) {
			this.rotate = 0;
			this.right = 260;
			this.bottom = 65; //给重铸按钮让步
		}
		this.jian.style.cssText = `
			display: none;
			transform: rotate(${this.rotate+90}deg);
			position: absolute;
			bottom: ${this.bottom}px;
			right:${this.right}px;
			width: 70px;
			height: 195px;
			background-image: url("${lib.assetURL}extension/无名美化/animation/${wjname}/sword1.png");
			background-repeat: no-repeat;
			background-size: 100% 100%;
			z-index: 2;
			transition: all 0.5s ease-in-out;
		`;
		ui.window.appendChild(this.jian);
	}
	/**
	 * 写成函数而不是变量是为了动态判断 当自己接手时（22代替队友行动或者中途选择代替队友行动）就可以正常展示剑
	 * 用来判断剑是否展示的 人机玩威武将时候隐藏 自己玩的时候展示
	 * 只有播放动画和展示的时候判断这个 这样状态可以一直更新着 当自己接手的时候还能继续展示剑和状态
	 * @returns Boolean
	 */
	canShowJian() {
		let configName = "extension_无名美化_" + this.wjname + "jian";
		return this.player == game.me && lib.config[configName];
	}
	/**
	 * 控制图片的展示和销毁,图片销毁的同事通知动画的播放
	 * @param {Boolean} show
	 */
	setShowHide(show) {
		if (!this.canShowJian()) {
			return;
		}
		this.jian.style.display = show ? "block" : "none";
		if (!show) {
			this.stopSpine();
		}
	}
	/**
	 * 设置图片的背景同时展示图片
	 * @param {String} name   sword1能量空状态 sword2能量一半状态 sword3能量满的状态
	 */
	setBackImg(name) {
		this.jian.style.backgroundImage = `url("${lib.assetURL}extension/无名美化/animation/${this.wjname}/${name}.png")`;
		this.setShowHide(true);
	}
	/**
	 * 播放动画
	 * @param {*} action play能量增加 play2能量减少 play3能量满
	 */
	playAnim(action = "play") {
		if (!this.canShowJian()) {
			return;
		}
		this.anInfo.jindu.action = action;
		this.anInfo.jindu.loop = action === "play3";
		this.stopSpine();
		dcdAnim.loadSpine(this.anInfo.jindu.name, "skel", () => {
			this.jianAn = dcdAnim.playSpine(this.anInfo.jindu, { parent: this.jian, angle: 0 - this.rotate, referFollow: true });
		});
	}
	stopSpine() {
		if (!this.canShowJian()) {
			return;
		}
		if (this.jianAn) {
			dcdAnim.stopSpine(this.jianAn);
			this.jianAn = null;
		}
	}
	addPower() {
		//如果是空能量
		if (!this.powerStatus) {
			//设置初始背景空能量剑
			this.setBackImg("sword1");
			//播放增长动画
			this.playAnim();
			//增长动画结束后把背景设置成一半状态
			setTimeout(() => {
				this.setBackImg("sword2");
			}, this.timeout);
		} else if (this.powerStatus == "half") {
			//一半状态
			//设置初始背景半能量剑
			this.setBackImg("sword2");
			//播放增长动画
			this.playAnim();
			//增长动画结束后把背景设置成满状态，满状态特效播放
			setTimeout(() => {
				this.setBackImg("sword3");
				this.playAnim("play3");
			}, this.timeout);
		}
		if (!this.powerStatus) {
			this.powerStatus = "half";
		} else if (this.powerStatus == "half") {
			this.powerStatus = "full";
		}
	}
	//失去能量
	/**
	 *
	 * @param {*} flag 不传默认失去全部能量 传代表失去一半能量(有技能不发动的情况)
	 * @returns
	 */
	lessPower(flag = false) {
		//没能量了
		if (!this.powerStatus) {
			return;
		}
		//满状态失去能量
		if (this.powerStatus == "full") {
			//背景设置为满状态
			this.setBackImg("sword3");
			if (!flag) {
				this.powerStatus = null;
			} else {
				this.powerStatus = "half";
			}
		} else if (this.powerStatus == "half") {
			//背景设置为一半状态
			this.setBackImg("sword2");
			this.powerStatus = null;
		}
		//播放能量减少动画
		this.playAnim("play2");
		//动画结束后值为空能量图片
		setTimeout(() => {
			if (!flag) {
				this.setBackImg("sword1");
				setTimeout(() => {
					this.setShowHide(false);
				}, 1000);
			} else {
				this.setBackImg("sword2");
			}
		}, this.timeout);
	}
}

export class createWoLongYance {
	constructor(num, type, cb) {
		this.num = num;
		this.cb = cb;
		this.type = type;
		this.links = [];
		this.yancecon = null;
		this.create();
	}
	create() {
		this.yancecon = document.createElement("div");
		this.yancecon.classList.add("yance-dialog");
		let iscolor = this.type == "color";
		let htmlStr = `
	  <div class="yance-dialog">
		  <div class="yance-dialog__content" style="height: ${iscolor ? 350 : 400}px;">
			  <img
			  class="yance-dialog__content__title"
			  src="${lib.assetURL}extension/无名美化/image/wolongyance/paiju_wlyc_jiesuan_content_biaotidi.png"
			  alt=""
			  srcset=""
			  />
			  <div class="yance-dialog-main">
	  `;
		// list = ['basic', 'trick', 'equip']
		// dialog  ['basic_0', '基本'] ['trick_0', '锦囊'] ['equip_0', '装备']
		//选择结果：links  ['basic_0', 'trick_1', 'equip_2']
		htmlStr += this.createBtn();
		htmlStr += `</div>
			  <div class="yance-dialog-footer">
			  <span class="yance-queding">确定</span>
			  <div class="yance-process">
				  <div class="yance-precess2"></div>
			  </div>
			  <div class="yance-footer-tip">
				  <img src="${lib.assetURL}extension/无名美化/image/wolongyance/paiju_wlyc_img_zhuangshi.png" alt="" />
				  <span>请预测接下来${this.num}张牌的类别</span>
				  <img src="${lib.assetURL}extension/无名美化/image/wolongyance/paiju_wlyc_img_zhuangshi.png" alt="" />
			  </div>
			  </div>
		  </div>
		  </div>`;

		this.yancecon.innerHTML = htmlStr;

		document.body.appendChild(this.yancecon);
		let yanceprocess = document.querySelector(".yance-precess2");
		setTimeout(() => {
			yanceprocess.style.width = `0px`;
		}, 0);

		this.yancequeding = document.querySelector(".yance-queding");
		this.yancemain = document.querySelector(".yance-dialog-main");

		this.yancemain.addEventListener("click", this.handerYanceClick.bind(this));
		this.yancequeding.addEventListener("click", this.handerYanceConfirm.bind(this));
	}
	createBtn() {
		// ['black_0', 'red_1', 'none_2']

		let htmlStr = "";
		Array.from({ length: this.num }, (_, k) => k).forEach((_, index) => {
			let str = `
			  <div class="yance-item">
				  <div class="yance-item-title">第${get.cnNumber(index + 1, true)}张</div>
				  <div class="yance-main">
		  `;
			let mainStr = ``;
			if (this.type == "color") {
				//官方没有无色选项
				mainStr = `
				 <div  class="yance-item-button ">
						  <span data="red_${index}" class="yance-item-text">红</span>
						  </div>
					  <div class="yance-item-button">
						  <span data="black_${index}" class="yance-item-text">黑</span>
					  </div>
					`;
			} else {
				mainStr = `
				 <div  class="yance-item-button yance-basic">
						  <span data="basic_${index}" class="yance-item-text">基本</span>
						  </div>
					  <div class="yance-item-button yance-trick">
						  <span data="trick_${index}" class="yance-item-text">锦囊</span>
					  </div>
					  <div class="yance-item-button yance-equip">
						  <span data="equip_${index}" class="yance-item-text">装备</span>
					  </div>`;
			}
			htmlStr +=
				str +
				mainStr +
				` </div>
			  </div>`;
		});
		return htmlStr;
	}
	handerYanceClick(e) {
		let target = e.target;
		if (target.classList.contains("yance-item-text")) {
			let data = target.getAttribute("data");
			//   console.log(data);
			if (this.links.includes(data)) {
				this.links = this.links.filter(item => item !== data);
				target.classList.remove("yance-item-text-checked");
				target.parentNode.classList.remove("yance-item-button-checked");
			} else {
				//获取当前点击的列
				let dataIndex = data.split("_")[1];

				//判断是否已选择列 选择了要把这列其他数据删除掉
				let hasindex = -1;
				this.links.some((item, index) => {
					let flag = item.includes(dataIndex);
					if (flag) {
						hasindex = index;
					}
					return flag;
				});
				if (hasindex !== -1) {
					let hasdata = this.links.splice(hasindex, 1)[0];
					let hasdata2 = document.querySelector(`[data="${hasdata}"]`);

					hasdata2.classList.remove("yance-item-text-checked");
					hasdata2.parentNode.classList.remove("yance-item-button-checked");
				}

				this.links.push(data);
				target.classList.add("yance-item-text-checked");
				target.parentNode.classList.add("yance-item-button-checked");
			}
			//   let yanceitembutton = document.querySelectorAll(".yance-item-button") ;
		}
		if (this.links.length === this.num) {
			this.yancequeding.style.filter = "grayscale(0)";
		} else {
			this.yancequeding.style.filter = "grayscale(1)";
		}
	}
	handerYanceConfirm() {
		if (this.links.length === this.num) {
			//排个序
			this.links.sort((a, b) => {
				let aindex = a.split("_")[1];
				let bindex = b.split("_")[1];
				return aindex - bindex;
			});
			this.cb(this.links);
			this.yancemain.removeEventListener("click", this.handerYanceClick);
			this.yancequeding.removeEventListener("click", this.handerYanceConfirm);
			document.body.removeChild(this.yancecon);
		}
	}
}
export function createwo(num, type) {
	return new Promise(res => {
		new createWoLongYance(num, type, links => {
			res(links);
		});
	});
}
export class WolongYanceAn {
	constructor(info, dev) {
		this.dev = dev;
		//猜几张牌  3 ....
		this.num = info[3];
		//结果集  [true,false,true]
		this.result = info[0];
		//颜色还是类型 color颜色 type2类型
		this.type = info[2];
		//猜测的类型  ['basic', 'trick', 'equip'] 基本 锦囊 装备
		this.htype = info[1];
		//下面两个是骨骼 等结束了要停止播放
		this.qixingAn = null;
		this.baguaAn = null;
		//正确错误那个小图片集合 动画结束需要全删了
		this.shitiImgArr = [];
		//动画播放完停留多久消失
		this.endTimeout = 2000;
		this.dianInfo = {
			1: {
				timeout: 0,
				info: [
					{
						//静态图片位置
						left: "calc(50% - 25px)",
						top: "calc(50% - 25px)",
						//点动画位置
						x: [0, 0.5],
						y: [0, 0.5],
					},
				],
			},
			2: {
				timeout: 1200,
				info: [
					{
						//静态图片位置
						left: "calc(50% - 100px)",
						top: "calc(50% - 45px)",
						//点动画位置
						x: [-70, 0.5],
						y: [18, 0.5],
					},
					{
						//静态图片位置
						left: "calc(50% + 50px)",
						top: "calc(50% - 10px)",
						//点动画位置
						x: [70, 0.5],
						y: [-18, 0.5],
					},
				],
			},
			3: {
				timeout: 800,
				info: [
					{
						//静态图片位置
						left: "calc(50% - 90px)",
						top: "calc(50% - 40px)",
						//点动画位置
						x: [-64, 0.5],
						y: [15, 0.5],
					},
					{
						//静态图片位置
						left: "calc(50% - 20px)",
						top: "50%",
						//点动画位置
						x: [6, 0.5],
						y: [-28, 0.5],
					},
					{
						//静态图片位置
						left: "calc(50% + 40px)",
						top: "calc(50% - 52px)",
						//点动画位置
						x: [65, 0.5],
						y: [26, 0.5],
					},
				],
			},
			4: {
				timeout: 800,
				info: [
					{
						//静态图片位置
						top: "calc(50% - 75px)",
						left: "calc(50% - 75px)",
						//点动画位置
						x: [-50, 0.5],
						y: [50, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 24px)",
						left: "calc(50% - 58px)",
						//点动画位置
						x: [-35, 0.5],
						y: [0, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 4px)",
						left: "calc(50% - 14px)",
						//点动画位置
						x: [8, 0.5],
						y: [-18, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 66px)",
						left: "calc(50% + 20px)",
						//点动画位置
						x: [45, 0.5],
						y: [45, 0.5],
					},
				],
			},
			5: {
				timeout: 800,
				info: [
					{
						//静态图片位置
						top: "calc(50% - 60px)",
						left: "calc(50% - 136px)",
						//点动画位置
						x: [-110, 0.5],
						y: [35, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 42px)",
						left: "calc(50% - 84px)",
						//点动画位置
						x: [-60, 0.5],
						y: [20, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 70px)",
						left: "calc(50% - 52px)",
						//点动画位置
						x: [-30, 0.5],
						y: [45, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% + 4px)",
						left: "calc(50% + 12px)",
						//点动画位置
						x: [35, 0.5],
						y: [-30, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 8px)",
						left: "calc(50% + 90px)",
						//点动画位置
						x: [110, 0.5],
						y: [-15, 0.5],
					},
				],
			},
			6: {
				timeout: 800,
				info: [
					{
						//静态图片位置
						top: "calc(50% - 58px)",
						left: "calc(50% - 176px)",
						//点动画位置
						x: [-152, 0.5],
						y: [30, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 105px)",
						left: "calc(50% - 158px)",
						//点动画位置
						x: [-135, 0.5],
						y: [80, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 84px)",
						left: "calc(50% - 87px)",
						//点动画位置
						x: [-65, 0.5],
						y: [60, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 40px)",
						left: "calc(50% - 62px)",
						//点动画位置
						x: [-38, 0.5],
						y: [15, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 2px)",
						left: "calc(50% + 38px)",
						//点动画位置
						x: [60, 0.5],
						y: [-25, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 38px)",
						left: "calc(50% + 132px)",
						//点动画位置
						x: [155, 0.5],
						y: [15, 0.5],
					},
				],
			},
			7: {
				timeout: [0, 800, 1600, 2400, 3200, 3800, 4200],
				info: [
					{
						//静态图片位置
						top: "calc(50% - 132px)",
						left: "calc(50% - 198px)",
						//点动画位置
						x: [-175, 0.5],
						y: [110, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 116px)",
						left: "calc(50% - 92px)",
						//点动画位置
						x: [-68, 0.5],
						y: [92, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 88px)",
						left: "calc(50% - 52px)",
						//点动画位置
						x: [-30, 0.5],
						y: [62, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 28px)",
						left: "calc(50% + 9px)",
						//点动画位置
						x: [32, 0.5],
						y: [0, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% + 34px)",
						left: "calc(50% + 11px)",
						//点动画位置
						x: [35, 0.5],
						y: [-56, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% + 56px)",
						left: "calc(50% + 122px)",
						//点动画位置
						x: [146, 0.5],
						y: [-80, 0.5],
					},
					{
						//静态图片位置
						top: "calc(50% - 8px)",
						left: "calc(50% + 158px)",
						//点动画位置
						x: [182, 0.5],
						y: [-16, 0.5],
					},
				],
			},
		};
		this.WMWOLONGYANCE = {
			bagua: {
				name: "../../../无名美化/animation/wolongyance/SS_wolongyance_beitu",
				speed: 0.8,
				scale: 0.8,
			},
			kongqiu: {
				name: "../../../无名美化/animation/wolongyance/SS_wolongyance_kongqiu",
				speed: 0.8,
				scale: 0.8,
			},
			shiti: {
				name: "../../../无名美化/animation/wolongyance/SS_wolongyance_shiti",
				speed: 0.8,
				scale: 0.8,
			},
			qixing: {
				name: "../../../无名美化/animation/wolongyance/SS_wolongyance_qixing",
				speed: 0.8,
				scale: 0.8,
			},
		};
		this.anInfo = this.dianInfo[this.num];
		this.init();
		this.play();
	}
	//创建背景和标题
	init() {
		this.wolongbg = ui.create.div(".wlan-bg", document.body);
		this.wolonganTitle = ui.create.div(".wlan-title", document.body);
		this.playBagua();
	}
	createShitiImg(left, top, type) {
		let className = type ? ".wlan-shiti-dui" : ".wlan-shiti-cuo";
		let audioName = type ? "Skillerr" : "Skillok";
		game.playAudio(`../extension/无名美化/audio/wolongyance/${audioName}.mp3`);
		let shitiImg = ui.create.div(className + " .wlan-shiti", document.body);
		shitiImg.style.cssText += `top: ${top};left:${left};`;
		this.shitiImgArr.push(shitiImg);
	}
	end() {
		this.wolongbg && this.wolongbg.remove();
		this.wolonganTitle && this.wolonganTitle.remove();
		this.shitiImgArr.forEach(item => {
			item.remove();
		});
		this.qixingAn && dcdAnim.stopSpine(this.qixingAn);
		this.baguaAn && dcdAnim.stopSpine(this.baguaAn);
	}
	//动画播放
	play() {
		game.pause();
		if (this.num > 1) {
			this.playQixing();
		}
		for (let index = 0; index < this.anInfo.info.length; index++) {
			const item = this.anInfo.info[index];
			let timeout = this.anInfo.timeout * index;
			if (typeof this.anInfo.timeout == "number") {
				timeout = this.anInfo.timeout * index;
			} else {
				timeout = this.anInfo.timeout[index];
			}
			setTimeout(() => {
				this.createShitiImg(item.left, item.top, this.result[index]);
				this.playShiti(item.x, item.y);
				if (index == this.anInfo.info.length - 1) {
					setTimeout(() => {
						if (!this.dev) {
							this.end();
							game.resume();
						}
					}, this.endTimeout);
				}
			}, timeout);
		}
	}

	playShiti(x, y) {
		dcdAnim.loadSpine(this.WMWOLONGYANCE.shiti.name, "skel", () => {
			if (this.dev) {
				this.WMWOLONGYANCE.shiti.loop = true;
			}
			dcdAnim.playSpine(this.WMWOLONGYANCE.shiti, {
				x,
				y,
			});
		});
	}
	playQixing() {
		dcdAnim.loadSpine(this.WMWOLONGYANCE.qixing.name, "skel", () => {
			this.WMWOLONGYANCE.qixing.action = "play" + this.num;
			if (this.dev) {
				this.WMWOLONGYANCE.qixing.loop = true;
			}
			this.qixingAn = dcdAnim.playSpine(this.WMWOLONGYANCE.qixing);
		});
	}
	playBagua() {
		dcdAnim.loadSpine(this.WMWOLONGYANCE.bagua.name, "skel", () => {
			this.baguaAn = dcdAnim.playSpine(this.WMWOLONGYANCE.bagua);
		});
	}
}
export class WoLongIcon {
	/**
	 *
	 * @param {*} links 结果集
	 * @param {*} player 卧龙的玩家
	 * @param {*} show 限定技是否触发（明示选择的猜策牌）
	 */
	constructor(links, player, show = false) {
		this.links = links.map(item => item.split("_")[0]);
		this.player = player;
		this.iconCon = null;
		this.show = show;
		this.iconList = [];
		this.iconAnList = [];
		this.WMWOLONGYANCE = {
			chenggong: {
				name: "../../../无名美化/animation/wolongyance/SS_junei_wolongyancechenggong",
				speed: 0.8,
				scale: 0.8,
				loop: true,
			},
		};
		this.createIcon();
	}
	createIcon() {
		this.iconCon = ui.create.div(".wlyc-icon-con", this.player);
		this.links.forEach((item, index) => {
			let iconName = item;
			if (this.hide()) {
				iconName = "wenhao";
			}
			let icon = ui.create.div(".wlyc-icon", this.iconCon);
			icon.style.cssText += `background-image:url(${lib.assetURL}extension/无名美化/image/wolongyance/paiju_jingce_icon_${iconName}.png);`;
			this.iconList.push(icon);
		});
	}
	hide() {
		return !this.show && this.player != game.me;
	}

	changeIcon(index, flag) {
		let type = "cuo";
		if (flag) {
			type = "dui";
		}
		console.log(this.iconList[index].style);
		this.iconList[index].style.cssText += `background-image:url(${lib.assetURL}extension/无名美化/image/wolongyance/paiju_jingce_icon_${type}.png);`;
		if (flag) {
			dcdAnim.loadSpine(this.WMWOLONGYANCE.chenggong.name, "skel", () => {
				let iconan = dcdAnim.playSpine(this.WMWOLONGYANCE.chenggong, {
					parent: this.iconList[index],
				});
				this.iconAnList.push(iconan);
			});
		}
	}
	clear() {
		this.iconAnList.forEach(item => {
			dcdAnim.stopSpine(item);
		});
		this.iconList.forEach(item => {
			item.remove();
		});

		this.iconCon.remove();
		this.iconCon = null;
	}
}
export class PlayCustomAnByVideo {
	constructor(
		CustomAn = {
			SS_cmmask: {
				name: "../../../无名美化/animation/caomao/juejin/SS_cmmask",
				speed: 0.8,
				loop: true,
				scale: 0.9,
			},
			video: `${lib.assetURL}extension/无名美化/video/huangzhong.mp4`,
		},
		stopGame = true
	) {
		this.CustomAn = CustomAn;
		this.stopGame = stopGame;
		this.createVideo();
	}
	createVideo() {
		this.maskAn = null;
		this.stopTimeout = null;
		// 移除已存在的视频元素
		// if (this.video) {
		// 	document.body.removeChild(this.video);
		// }
		this.video = document.createElement("video");
		this.video.src = this.CustomAn.video;
		this.status = "stop"; // 播放状态 stop, playing
		this.video.controls = false;
		this.video.loop = false;
		//预加载视频 load是重新加载 https://blog.csdn.net/u012347650/article/details/137863919
		this.video.preload = "auto";
		this.video.autoplay = true;
		this.videoInit = false;
		this.monitorInterval = null;
		this.canplaythrough = false;
		this.video.muted = true; // 静音以允许自动播放
		//visibility: hidden;
		this.setVideoStyle();
		this.video.style.objectFit = "cover";
		document.body.appendChild(this.video);
		//https://www.runoob.com/tags/ref-av-dom.html
		this.video.onended = () => {
			console.log("onended");
			this.stop();
		};
		//当浏览器预计能够在不停下来进行缓冲的情况下持续播放指定的音频/视频时，会发生 canplaythrough 事件。
		this.video.oncanplaythrough = () => {
			//保证这个方法只执行一次
			if (!this.videoInit) {
				this.videoInit = true;
				//加载完成后有两种情况
				//第一种是自然加载完成，改变一下状态即可
				console.log("加载完毕", this.canplaythrough);
				if (!this.canplaythrough) {
					this.canplaythrough = true;
				} else {
					//第二种是手动调用过播放方法 等待加载完成了，直接播放
					this.play();
				}
			}
		};
	}
	setVideoStyle() {
		this.video.style.cssText = `
			width: 1200px;
			height: 320px;
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 14;
			display:none;
		`;
	}
	play() {
		this.status = "play"; // 播放状态 stop, playing
		dcdAnim.loadSpine(this.CustomAn.SS_cmmask.name, "skel", () => {
			this.maskAn = dcdAnim.playSpine(this.CustomAn.SS_cmmask);
		});
		// 重置播放位置并显示视频
		// this.video.style.visibility = "visible";
		this.video.style.display = "block";
		this.video.currentTime = 0;
		this.video.muted = false; // 取消静音
		this.video.play();
	}
	run() {
		if (this.stopGame) {
			game.pause();
		}
		//两种情况 一种没加载完
		if (!this.canplaythrough) {
			this.canplaythrough = true;
		} else {
			//第二种 加载完了直接播放
			this.play();
		}
	}

	stop() {
		if (this.video) {
			this.video.muted = true;
			this.video.pause();
			// this.video.style.visibility = "hidden";
			this.video.style.display = "none";
		}
		if (this.maskAn) {
			dcdAnim.stopSpine(this.maskAn);
			this.maskAn = null;
		}
		if (this.stopGame && this.status == "play") {
			game.resume();
		}
		if (this.stopTimeout) {
			clearTimeout(this.stopTimeout);
			this.stopTimeout = null;
		}
		if (this.monitorInterval) {
			clearInterval(this.monitorInterval);
			this.monitorInterval = null;
		}
		this.status = "stop"; // 播放状态 stop, playing
	}
}

export function createPlayerEle(player) {
	let playerRect = player.getBoundingClientRect();
	let { width, height, top, left } = playerRect;
	let newEle = ui.create.div(".wmmh-player-clone-ele", document.body);
	newEle.style.cssText += `
		width: ${width}px;
		height: ${height}px;
		top: ${top}px;
		left: ${left}px;
	`;
	newEle.style.position = "absolute";
	return newEle;
}

export function commonCreateImg(src, name, parent = document.body) {
	let img = document.createElement("img");
	if (name) {
		img.className += name;
		ui["_" + name] = img;
	}
	img.src = src;
	parent.appendChild(img);
	img.style.position = "absolute";
	return img;
	// img.style.top = "50%";
	// img.style.left = "50%";
	// img.style.transform = "translate(-50%,-50%)";
	// img.style.zIndex = "2";
}
export function checkMode(){
	const mode = typeof get.mode === "function" ? get.mode() : get.mode;
	if (new Set(["chess", "tafang", "hs_hearthstone"]).has(mode)) return false;
	return true;
}
