import { lib, game, ui, get, ai, _status } from "../../../noname.js";

import { createApp, ref, reactive } from "../libs/vue.esm-browser.js";
//感谢蔡徐子的素材

//默认的播放action 使用前应先判断缓存配置里有没有
ui.dgcanInfo = {
	attack: {
		cheding: "cheding1",
		cheshen: "cheshen1",
		chelun: "chelun1",
		chetou: "chetou1",
		color: "spade",
		dianshu: "A",
	},
	defense: {
		cheding: "cheding1",
		cheshen: "cheshen1",
		chelun: "chelun1",
		chetou: "chetou3",
		color: "spade",
		dianshu: "A",
	},
};
//播放所用到的变量
ui.dagongcheCommonInfo = {
	baseUrl: "../../../无名美化/animation/dagongche/",
	chetouAn: null,
	cheshenAn: null,
	chedingAn: null,
	chelunAn: null,
	chetouT: null,
	cheshenT: null,
	chedingT: null,
	chelunT: null,
	nameMap: {
		车厢: "cheshen",
		车轮: "chelun",
		装饰: "cheding",
		前档: "chetou",
	},
};
/**封装播放大公车函数 注意this指向
 * 懒得优化了type可以从atlasName提取
 * @param {*} flag 是否播放骨骼动画和语音
 * @param {*} type cheshen  cheding chelun  chetou
 * @param {*} atlasName 要播放的谷歌名称
 */
function dgcPlay(flag, type, atlasName) {
	//播放所有
	let promiseArr = [];
	Object.values(this.nameMap).forEach(item => {
		let url = this.baseUrl + this.anInfo[this.type][item];
		promiseArr.push(dgcParsePromise(url));
	});
	//播放必须按照顺序播放，不然会出现层叠问题 使用promise解决异步加载顺序问题
	Promise.all(promiseArr).then(() => {
		Object.values(this.nameMap).forEach(item => {
			//cheshen  cheding chelun  chetou
			if (this[item + "T"]) {
				clearTimeout(this[item + "T"]);
				this[item + "T"] = null;
			}
			if (this[item + "An"]) {
				dcdAnim.stopSpine(this[item + "An"]);
				this[item + "An"] = null;
			}
			let url = this.baseUrl + this.anInfo[this.type][item];
			let action = "play";
			if (type && atlasName) {
				if (type == item) {
					action = "play";
				} else {
					action = "daiji";
				}
			}
			if (!flag) {
				action = "daiji";
			}
			this[item + "An"] = dcdAnim.playSpine(
				{
					name: url,
					action,
					loop: true,
				},
				{
					scale: this.scale || 0.55,
					...this.positionInfo[item],
					parent: this.parent || document.body,
					referFollow: true,
				}
			);
			//点击部件播放部件语音

			this[item + "T"] = setTimeout(() => {
				this[item + "An"] && this[item + "An"].setAction("daiji");
			}, 2000);
		});
		if (type && atlasName) {
			//懒得判断了有些语音文件是没有的 目前cheding只有部分有语音报错就报错把不影响使用~
			if (atlasName.includes("cheding") || atlasName.includes("chetou")) {
				game.playAudio(`ext:无名美化/audio/dagongche/sound_${atlasName}.mp3`);
			}
		} else {
			if (flag) {
				//播放全车展示
				game.playAudio(`ext:无名美化/audio/dagongche/sound_${this.anInfo[this.type].chetou}.mp3`);
				game.playAudio(`ext:无名美化/audio/dagongche/sound_quanchezhanshi.mp3`);
			}
		}
	});
}
ui.dgcPlay = dgcPlay;
//清楚大公车播放函数
function dgcClearAn() {
	Object.values(this.nameMap).forEach(item => {
		let name = item + "An";
		if (this[name]) {
			dcdAnim.stopSpine(this[name]);
			this[name] = null;
		}
	});
}
ui.dgcClearAn = dgcClearAn;
//将骨骼加载转成promise函数
function dgcParsePromise(url) {
	return new Promise((resolve, reject) => {
		dcdAnim.loadSpine(url, "skel", () => {
			resolve();
		});
	});
}
/** 用vue写换装界面 第一次用vue写美化 非常滴舒服
 */
export const defaultTemplate = {
	template: `
		<div class="dagongche-container" v-show="show">
			<img @click="back" class="dagongche-back" src="extension/无名美化/image/dagongche/backBtn.png" />
			<div class="dagongche-dialog">
				<div class="dagongche-left">
					<div class="wmdgc-header">
						<img @click="changeType" v-if="type=='attack'" src="extension/无名美化/image/dagongche/dagongche_title_tpye_1.png" />
						<img @click="changeType" v-else src="extension/无名美化/image/dagongche/dagongche_title_tpye_2.png" />
					</div>
					<div class="wmdgc-body">
						<div class="wmdgc-title">
							<div class="wmdgc-title-left">
								<span @click="changeTitle(index)" v-for="(item,index) in titleInfo[type]" :key="index" :class="['wmdgc-title-item',activeTitle==index?'wmdgc-title-item-active':'']"> {{index}} </span>
							</div>
							<div class="wmdgc-title-right">
								<div class="wmdgc-title-right-item" @click="showColor">
									<span class="wmdgc-zhanwei"></span>
									<img class="wmdgc-color" :src="'extension/无名美化/image/dagongche/dialog_pokercolor'+colorAndDianshu.color[anInfo[type].color]+'.png'" />
									<span :class="['wmdgc-color-arrow',showColorList?'wmdgc-color-arrow-active':'' ]"></span>

									<div class="wmdgc-color-list" v-show="showColorList">
										<div :class="['wmdgc-color-item',anInfo[this.type].color==index?'wmdgc-color-item-active':'']" v-for="(item,index) in colorAndDianshu.color" :key="index" @click="changeColor(index)">
											<img :src="'extension/无名美化/image/dagongche/dialog_pokercolor'+item+'.png'" />
										</div>
									</div>
								</div>
								<div class="wmdgc-title-right-item" @click="showDianshu">
									<span class="wmdgc-zhanwei"></span>
									<span class="wmdgc-dianshu"> {{anInfo[type].dianshu}} </span>
									<span :class="['wmdgc-color-arrow', showDianshuList?'wmdgc-color-arrow-active':'']"></span>
									<div class="wmdgc-color-list" v-show="showDianshuList">
										<div :class="['wmdgc-color-item',anInfo[this.type].dianshu==item?'wmdgc-color-item-active':'']" v-for="item in colorAndDianshu.dianshu" :key="item" @click="changeDianshu(item)">
											<span> {{item}} </span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="wmdgc-main">
							<div class="wmdgc-main-left">
								<div v-for="(item,index) in titleInfo[type][activeTitle]" :key="index" :class="['wmdgc-main-item',anInfo[type][nameMap[activeTitle]]==item.atlasName?'wmdgc-main-item-active':'']" @click="changeAn(item,activeTitle)">{{item.title}}</div>
							</div>
							<img class="wmdgc-line" src="extension/无名美化/image/dagongche/dagongche_divide.png" />
							<div class="wmdgc-main-right"></div>
						</div>
					</div>
				</div>
				<div class="dagongche-right">
					<div class="dagongche-right-title">方案</div>
					<div :class="['dagongche-right-item',plan[type]==item.value?'dagongche-right-item-active':'']" v-for="item in planList" @click="changePlan(item.value)">
						<img class="dagongche-right-planimg" :src="'extension/无名美化/image/dagongche/will_pan'+item.value+'.png'" />
						<span> {{item.title}} </span>
						<span class="dagongche-right-plan-editor">
							<img @click.stop="editorPlanName(item)" v-if="plan[type]==item.value" src="extension/无名美化/image/dagongche/edit.png" />
						</span>
					</div>
				</div>
			</div>
		</div>
	`,
	data() {
		let dagongcheCommonInfo = {
			//大攻车的公共信息
			//cheshen
			车厢: [
				{
					title: "铁皮车厢",
					atlasName: "cheshen1",
				},
				{
					title: "云纹车厢",
					atlasName: "cheshen4",
				},
				{
					title: "精钢车厢",
					atlasName: "cheshen3",
				},
				{
					title: "鍮石车厢",
					atlasName: "cheshen2",
				},
			],
			前档: [],
			车轮: [
				{
					title: "轧刺轮",
					atlasName: "chelun1",
				},
				{
					title: "盾纹轮",
					atlasName: "chelun2",
				},
				{
					title: "螺形轮",
					atlasName: "chelun3",
				},
				{
					title: "轴刺轮",
					atlasName: "chelun4",
				},
				{
					title: "缠辋四轮",
					atlasName: "chelun5",
				},
				{
					title: "圆轮",
					atlasName: "chelun6",
				},
			],
			//cheding
			装饰: [
				{
					title: "啸龙铳",
					atlasName: "cheding1",
				},
				{
					title: "夔鼓",
					atlasName: "cheding2",
				},
				{
					title: "鷞鸠翼",
					atlasName: "cheding4",
				},
				{
					title: "玉嶂幅",
					atlasName: "cheding5",
				},
				{
					title: "八卦台",
					atlasName: "cheding6",
				},
				{
					title: "黄幡",
					atlasName: "cheding3_1",
				},
				{
					title: "青幡",
					atlasName: "cheding3_2",
				},

				{
					title: "赤幡",
					atlasName: "cheding3_3",
				},
				{
					title: "绿幡",
					atlasName: "cheding3_4",
				},
			],
		};
		let titleInfo = {
			attack: {
				车厢: dagongcheCommonInfo.车厢,
				前档: [
					{
						title: "冲锋锥",
						atlasName: "chetou1",
					},
					{
						title: "鳌钳",
						atlasName: "chetou2",
					},
					{
						title: "钩锁",
						atlasName: "chetou4",
					},
					{
						title: "虿尾",
						atlasName: "chetou5",
					},
					{
						title: "攻城锤",
						atlasName: "chetou9",
					},
				],
				车轮: dagongcheCommonInfo.车轮,
				装饰: dagongcheCommonInfo.装饰,
			},
			defense: {
				车厢: dagongcheCommonInfo.车厢,
				前档: [
					{
						title: "铁蒺藜",
						atlasName: "chetou3",
					},
					{
						title: "於菟口",
						atlasName: "chetou6",
					},
					{
						title: "拒马",
						atlasName: "chetou7",
					},
					{
						title: "浑天盾",
						atlasName: "chetou8",
					},
				],
				车轮: dagongcheCommonInfo.车轮,
				装饰: dagongcheCommonInfo.装饰,
			},
		};
		return {
			//一些定时器等数据
			...ui.dagongcheCommonInfo,
			scale: 0.55,
			titleInfo,
			positionInfo: {
				cheshen: {
					x: [-30, 0.5],
					y: [-110, 0.5],
				},

				chelun: {
					x: [-30, 0.5],
					y: [-110, 0.5],
				},
				cheding: {
					x: [-30, 0.5],
					y: [-60, 0.5],
				},
				chetou: {
					x: [45, 0.5],
					y: [-70, 0.5],
				},
			},
			colorAndDianshu: {
				color: {
					spade: "2", //黑桃
					heart: "0", //红桃
					club: "3", //梅花
					diamond: "1", //方块
				},
				dianshu: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
			},
			show: false,
			showColorList: false,
			showDianshuList: false,
			activeTitle: "车厢",
			//状态
			type: "attack",
			plan: {
				attack: 1,
				defense: 1,
			},
			anInfo: {
				...ui.dgcanInfo,
			},
			planList: [
				{
					title: "方案一",
					value: 1,
				},
				{
					title: "方案二",
					value: 2,
				},
				{
					title: "方案三",
					value: 3,
				},
			],
		};
	},
	watch: {
		anInfo: {
			handler(newValue, oldValue) {
				game.saveConfig("extension_无名美化_dagongcheConfig", newValue);
				game.saveConfig("extension_无名美化_dagongchePlanConfig" + this.type + this.plan[this.type], newValue[this.type]);
			},
			deep: true,
			immediate: false,
		},
		show(newValue, oldValue) {
			console.log("show", newValue, oldValue);
			let arr = ["cheding", "cheshen", "chelun", "chetou"];
			let con = document.querySelector(".wmmh-dagongche");
			if (newValue) {
				con.style.display = "block";
				dgcPlay.call(this, true);
			}
			if (!newValue) {
				this.showColorList = false;
				this.showDianshuList = false;
				con.style.display = "none";
				dgcClearAn.call(this);
			}
		},
	},
	created() {
		if (lib.config["extension_无名美化_dagongcheConfig"]) {
			this.anInfo = lib.config["extension_无名美化_dagongcheConfig"];
			if (!this.anInfo[this.type].color) {
				this.anInfo[this.type].color = "spade";
			}
			if (!this.anInfo[this.type].dianshu) {
				this.anInfo[this.type].dianshu = "A";
			}
		}
		this.initPlan();
	},
	methods: {
		editorPlanName() {
			alert(decodeURIComponent("%E7%BC%96%E8%BE%91%E6%96%B9%E6%A1%88%E5%90%8D%E7%A7%B0%E5%8A%9F%E8%83%BD%E6%9A%82%E6%9C%AA%E5%BC%80%E5%8F%91%EF%BC%8C%E5%85%B3%E6%B3%A8%E3%80%90%E6%97%A0%E5%90%8D%E6%9D%80%E8%B5%84%E6%BA%90%E5%BA%93%E3%80%91%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E8%8E%B7%E5%8F%96%E6%89%A9%E5%B1%95%E6%9C%80%E6%96%B0%E5%8A%A8%E6%80%81%EF%BC%81"));
		},
		initPlan() {
			let plan = lib.config["extension_无名美化_dagongchePlan"];
			if (plan) {
				this.plan = plan;
			}
		},
		getPlanByConfig() {
			//extension_无名美化_dagongchePlanConfigattack1
			let anInfo = lib.config["extension_无名美化_dagongchePlanConfig" + this.type + this.plan[this.type]];
			if (anInfo) {
				this.anInfo[this.type] = anInfo;
			} else {
				this.anInfo[this.type] = {
					...ui.dgcanInfo[this.type],
				};
			}
		},
		changePlan(value) {
			this.showColorList = false;
			this.showDianshuList = false;
			this.plan[this.type] = value;
			game.saveConfig("extension_无名美化_dagongchePlan", this.plan);
			this.getPlanByConfig();
			dgcPlay.call(this, true);
		},
		changeDianshu(index) {
			console.log(index);
			this.anInfo[this.type].dianshu = index;
		},
		changeColor(index) {
			console.log(index);
			this.anInfo[this.type].color = index;
		},
		showColor() {
			//点击一个框要把另一个框子隐藏
			this.showDianshuList = false;
			this.showColorList = !this.showColorList;
		},
		showDianshu() {
			this.showColorList = false;
			this.showDianshuList = !this.showDianshuList;
		},
		//点击零件触发
		changeAn(item, activeTitle) {
			this.showColorList = false;
			this.showDianshuList = false;
			this.anInfo[this.type][this.nameMap[activeTitle]] = item.atlasName;
			//指定部位播放play动画
			dgcPlay.call(this, true, this.nameMap[activeTitle], item.atlasName);
		},
		changeTitle(title) {
			this.showColorList = false;
			this.showDianshuList = false;
			this.activeTitle = title;
		},
		back() {
			this.show = false;
		},
		changeType() {
			this.showColorList = false;
			this.showDianshuList = false;
			this.type == "attack" ? (this.type = "defense") : (this.type = "attack");
			this.initPlan();
			this.getPlanByConfig();
			dgcPlay.call(this, true);
		},
	},
};
//技能描述界面增加换装按钮 + 守御耐久值描述改正
function changeSkillTranslate() {
	let defendInfo = lib.translate.dagongche_defend_info;
	//不改名了 改名字后单独装备栏位会展示错位 等后面十周年ui改了在加吧
	// lib.translate.dagongche_attack = "大攻车·进击";
	// lib.translate.dagongche_defend = "大攻车·守御";
	lib.translate.dagongche_defend_info = defendInfo.replace("4点耐久", "3点耐久");
	// console.log("mbquchong", lib.translate.mbquchong_info_identity);
	//感谢扶苏滴手杀设置图标素材
	lib.translate.mbquchong_info += `
				<br/>
				<span class="tdagongche-title">
					大攻车：
				</span>
				<br/>
				<div class="dagongche-static tdagongche-btn-group">
					<span onclick="dagongchejinjiClick()" class="tdagongche-span" >
						进击
						<img class="setdagongche-icon" src="extension/无名美化/image/dagongche/set.png"/>
					</span>
					<span onclick="dagongcheshouyuClick()" class="tdagongche-span" >
						守御
						<img class="setdagongche-icon" src="extension/无名美化/image/dagongche/set.png"/>
					</span>
				</div>
			`;
}
//创建大公车换装
export function createDGC(template = defaultTemplate) {
	changeSkillTranslate();
	lib.init.css(lib.assetURL + "extension/无名美化/css", "dagongche");
	const dgcContainer = ui.create.div(".wmmh-dagongche", document.body);
	console.log("dgcContainer", dgcContainer.style);
	dgcContainer.style.display = "none";
	const app = createApp(template);
	//获取组件实例
	const dagonche = app.mount(dgcContainer);
	window.dagongchejinjiClick = () => {
		console.log("大攻车");
		dagonche.type = "attack";
		dagonche.show = true;
	};
	window.dagongcheshouyuClick = () => {
		console.log("大攻车守御");
		dagonche.type = "defense";
		dagonche.show = true;
	};
	return dagonche;
}
export class ChooseCar {
	constructor() {
		this.dialog = null;
		this.createDialog();
		this.initAnInfo();
		this.cb = null;
	}
	createDialog() {
		this.dialog = ui.create.div(".dagongche-choose-dialog", document.body);
		this.dialog.style.display = "none";
		this.dialog.innerHTML = `
			<div class="dagongche-choose-title">
				<img class="dagongche-choose-title-img" src="extension/无名美化/image/dagongche/mbquchong.png" />
				<img class="dagongche-choose-title-arrowimg" src="extension/无名美化/image/dagongche/arrow.png" />
			</div>
			</div>
			<div  class="dagongche-choose-main">
				<div class="dagongche-choose-left">
					<div class="dagongche-left-body"></div>
					<div class="dagongche-left-title">大攻车·进击</div>
				</div>
				<div class="dagongche-choose-right">
					<div class="dagongche-right-body"></div>
					<div class="dagongche-left-title">大攻车·守御</div>
				</div>
			</div>
			<div class="wmmh-process-container">
			 <div class="wmmh-process">
				  <div class="wmmh-precess2"></div>
			  </div>
			</div>
			<div class="wmmh-dgc-dialog-bottom">
			</div>
		`;
		this.process = document.querySelector(".wmmh-precess2");
		this.tip = document.querySelector(".wmmh-dgc-dialog-bottom");
		this.dialog.querySelector(".dagongche-left-body").addEventListener("click", this.resolveAtCb.bind(this));
		this.dialog.querySelector(".dagongche-right-body").addEventListener("click", this.resolveDfCb.bind(this));
	}
	resolveDfCb() {
		this.stop();
		this.cb && this.cb({ links: ["dagongche_defend"], bool: true });

		this.cb = null;
	}
	resolveAtCb() {
		this.stop();
		this.cb && this.cb({ links: ["dagongche_attack"], bool: true });
		this.cb = null;
	}
	initAnInfo() {
		this.dagongcheData = lib.config["extension_无名美化_dagongcheConfig"];
		if (!this.dagongcheData) {
			//没有就取默认数据
			this.dagongcheData = ui.dgcanInfo;
		}
		let commonInfo = {
			anInfo: this.dagongcheData,
			scale: 0.4,
			...ui.dagongcheCommonInfo,
			positionInfo: {
				cheshen: {
					x: [0, 0.5],
					y: [-80, 0.5],
				},

				chelun: {
					x: [0, 0.5],
					y: [-80, 0.5],
				},
				cheding: {
					x: [0, 0.5],
					y: [-50, 0.5],
				},
				chetou: {
					x: [45, 0.5],
					y: [-40, 0.5],
				},
			},
		};
		this.attackAnInfo = {
			...commonInfo,
			type: "attack",
			parent: this.dialog.querySelector(".dagongche-left-body"),
		};
		this.defenseAnInfo = {
			...commonInfo,
			type: "defense",
			parent: this.dialog.querySelector(".dagongche-right-body"),
		};
	}
	async play(costMark) {
		this.tip.innerHTML = `你可消耗${parseFloat(costMark)}点铸造值建造一种大攻车`;
		this.dialog.style.display = "block";
		this.process.style.transition = `width 15s linear`;

		setTimeout(() => {
			this.process.style.width = `0px`;
		}, 100);
		dgcPlay.call(this.attackAnInfo);
		dgcPlay.call(this.defenseAnInfo);
		return new Promise(resolve => {
			this.cb = resolve;
		});
	}
	stop() {
		this.dialog.style.display = "none";
		this.process.style.transition = `width 0s linear`;
		setTimeout(() => {
			this.process.style.width = `100%`;
		}, 100);

		dgcClearAn.call(this.attackAnInfo);
		dgcClearAn.call(this.defenseAnInfo);
	}
}
//给技能加特效
export function dagongche() {
	// test();

	Object.assign(lib.skill.mbquchong, {
		init() {
			// new ChooseCar().play();
			if (!ui.dagongche) {
				ui.dagongche = createDGC();
			}
		},
		async content(event, trigger, player) {
			if (
				game.hasPlayer(target => {
					return target.hasCard(card => card.name.startsWith("dagongche_"), "e");
				})
			) {
				ui.useDgcCardType = "move";
				let { result } = await player
					.moveCard(
						get.prompt("mbquchong"),
						"移动场上的一张【大攻车】",
						(card, player) => {
							return card.name.startsWith("dagongche_");
						},
						game.filterPlayer(target => {
							return target.hasCard(card => card.name.startsWith("dagongche_"), "e");
						}),
						"canReplace"
					)
					.set("nojudge", true)
					.set("logSkill", ["mbquchong", null, null, null, [4]]);
			} else {
				ui.useDgcCardType = "use";
				// const numbers = Array.from({ length: 13 }).map((_, i) => get.strNumber(i + 1));
				const list = get.mode() == "identity" ? [0, 5, 10, 10] : [0, 2, 5, 5];
				const costMark = list[player.getAllHistory("custom", evt => evt.name == "mbquchong").length];

				const { result: results } = await player.chooseBool("###" + get.prompt("mbquchong") + '###<div class="text center">消耗' + parseFloat(costMark) + "点铸造值，制造【大攻车·进击】或【大攻车·守御】</div>");
				console.log("results", results);
				if (results.bool) {
					let result;
					if (player == game.me && event.isMine()) {
						if (!ui.chooseCar) {
							ui.chooseCar = new ChooseCar();
						}
						result = await ui.chooseCar.play(costMark);
						ui.chooseCar.stop();
					} else {
						result = await player
							.chooseButton(["###" + get.prompt("mbquchong") + '###<div class="text center">消耗' + parseFloat(costMark) + "点铸造值，制造【大攻车·进击】或【大攻车·守御】</div>", [["dagongche_attack", "dagongche_defend"].map(i => [i, get.translation(i)]), "tdnodes"]], 1)
							.set("ai", () => 1 + Math.random())
							.forResult(); //插眼，PZ157
					}

					console.log("result", result);
					let dgcType = result.links.includes("dagongche_attack") ? "attack" : "defense";

					// const equips = result.links.sort((a, b) => {
					// 	return lib.suit.includes(a) + (numbers.includes(a) ? 2 : 0) - (lib.suit.includes(b) + (numbers.includes(b) ? 2 : 0));
					// });
					ui.dagongcheData = lib.config["extension_无名美化_dagongcheConfig"];
					if (!ui.dagongcheData) {
						//没有就取默认数据
						ui.dagongcheData = ui.dgcanInfo;
					}
					console.log("ui.dagongcheData", ui.dagongcheData);

					const equips = [result.links[0], ui.dagongcheData[dgcType].color, ui.dagongcheData[dgcType].dianshu];
					console.log("equips", equips);
					const card = game.createCard(equips[0], equips[1], get.numString(equips[2]));
					if (!card.storage) card.storage = {};
					if (typeof card.storage.mbquchong != "number") {
						card.storage.mbquchong = card.name == "dagongche_attack" ? 2 : 3;
					}
					lib.skill.mbquchong.broadcast(card);
					const resultx = await player
						.chooseTarget("令一名角色获得" + get.translation(card) + "并使用之", true)
						.set("ai", target => {
							const player = get.event().player,
								att = get.attitude(player, target);
							if (!target.canEquip(get.event().card)) return att;
							return att * (2.5 - target.countCards("e"));
						})
						.set("card", card)
						.forResult();
					console.log("resultx", resultx);

					if (resultx.bool) {
						const target = resultx.targets[0];

						player.logSkill("mbquchong", target, null, null, [card.name == "dagongche_attack" ? 3 : 2]);
						if (costMark > 0) player.removeMark("mbquchong", costMark);
						player.getHistory("custom").push({ name: "mbquchong" });
						await target.gain(card, "gain2");
						if (get.position(card) == "h" && get.owner(card) == target && target.hasUseTarget(card)) {
							await target.chooseUseTarget(card, "nopopup", false, true);
						}
					}
				}
			}
		},
		broadcast(card) {
			console.log("card", card.storage.mbquchong);

			if (ui.wmdagongchenaijiu) {
				ui.wmdagongchenaijiu.innerHTML = card.storage.mbquchong;
			}
			game.broadcast(
				(card, storage) => {
					card.storage = storage;
				},
				card,
				card.storage
			);
		},
		createIcon(target, mbquchongNum, dgcType) {
			lib.skill.mbquchong.clearIcon();
			//十周年和一将成名体力值是在右侧 会遮挡体力值 微调下
			let uitheme = lib.config["extension_十周年UI_newDecadeStyle"];
			//手杀 ol体力值在左边 不会遮挡
			let leftHpList = ["othersOn", "off", "onlineUI"];
			let adaptorClassName = "";
			if (!leftHpList.includes(uitheme)) {
				adaptorClassName = " wmmh-dagongche-icon-adaptor";
			}

			ui.wmdagongcheicon = ui.create.div(".wmmh-dagongche-icon .wmmh-dagongche-icon-" + dgcType + adaptorClassName, target);

			ui.wmdagongchefanwei = ui.create.div(".wmmh-dagongche-fanwei", target);
			ui.wmdagongchefanwei.innerHTML = `9`;
			ui.wmdagongchenaijiu = ui.create.div(".wmmh-dagongche-naijiu", target);
			ui.wmdagongchenaijiu.innerHTML = mbquchongNum;
		},
		clearIcon() {
			let nameList = ["wmdagongchefanwei", "wmdagongcheicon", "wmdagongchenaijiu"];
			nameList.forEach(name => {
				if (ui[name]) {
					ui[name].remove();
					ui[name] = null;
				}
			});
		},
	});
	Object.assign(lib.skill.mbquchong.subSkill.effect, {
		async content(event, trigger, player) {
			if (event.triggername == "mbquchongOnRemove") {
				const cards = player.getCards("e", card => card.name.startsWith("dagongche_") && card.storage?.mbquchong <= 0);
				await player.lose(cards, ui.special);
				for (const card of cards) {
					card.fix();
					card.remove();
					card.destroyed = true;
				}
				game.log(cards, "被移出了游戏");
				if (ui.dagongcheAnPlayer) {
					dgcClearAn.call(ui.dagongcheAnPlayer);
					lib.skill.mbquchong.clearIcon();
				}
			} else if (trigger.name == "equip") {
				if (event.triggername == "equipBefore") trigger.cancel();
				else
					await player.discard(
						player.getCards("e", card => {
							return !trigger.cards.includes(card) && lib.filter.cardDiscardable(card, player);
						})
					);
			} else {
				const cards = player.getCards("e", card => {
					if (!trigger.cards.includes(card)) return false;
					return card.name.startsWith("dagongche_") && card.storage?.mbquchong > 0;
				});
				trigger.cards.removeArray(cards);
				for (const card of cards) {
					card.storage.mbquchong--;
					game.log(card, "减少了", "#y1点", "#g耐久值");
					lib.skill.mbquchong.broadcast(card);
				}
				await event.trigger("mbquchongOnRemove");
			}
		},
	});
	Object.assign(lib.skill.dagongche_attack_skill, {
		async content(event, trigger, player) {
			dgcPlay.call(ui.dagongcheAnParams, true);
			setTimeout(() => {
				dgcClearAn.call(ui.dagongcheAnParams);
			}, 2000);
			trigger.num += Math.min(3, game.roundNumber);
			const cards = player.getCards("e", card => {
				return card.name == "dagongche_attack" && card.storage?.mbquchong > 0;
			});
			for (const card of cards) {
				card.storage.mbquchong--;
				game.log(card, "减少了", "#y1点", "#g耐久值");
				lib.skill.mbquchong.broadcast(card);
			}
			await event.trigger("mbquchongOnRemove");
		},
	});
	Object.assign(lib.skill.dagongche_defend_skill, {
		async content(event, trigger, player) {
			dgcPlay.call(ui.dagongcheAnParams, true);
			setTimeout(() => {
				dgcClearAn.call(ui.dagongcheAnParams);
			}, 2000);
			const cards = player.getCards("e", card => {
				return card.name == "dagongche_defend" && card.storage?.mbquchong > 0;
			});
			for (const card of cards) {
				const num = Math.min(trigger.num, card.storage.mbquchong);
				trigger.num -= num;
				card.storage.mbquchong -= num;
				game.log(card, "减少了", "#y" + num + "点", "#g耐久值");
				lib.skill.mbquchong.broadcast(card);
				if (trigger.num <= 0) break;
			}
			await event.trigger("mbquchongOnRemove");
		},
	});

	lib.skill._effect_dagongche = {
		charlotte: true,
		forced: true,
		popup: false,
		firstDo: true,
		trigger: {
			global: ["equipAfter"],
		},
		//装备了大公车
		filter(event, player, name) {
			return event.card && event.card.name.startsWith("dagongche_") && player.getCards("e").some(card => get.name(card).startsWith("dagongche_"));
		},
		content(event, trigger, player) {
			//大公车播放参数
			//移动大公车时耐久用上一次的耐久
			let naijiuzhi = trigger.card.storage.mbquchong;
			if (ui.useDgcCardType == "move") {
				naijiuzhi = ui.wmdagongchenaijiu.innerHTML;
			}
			let dgcType = trigger.card.name == "dagongche_attack" ? "attack" : "defense";

			//移动的时候先清楚一下
			if (ui.dagongcheAnPlayer) {
				ui.dgcClearAn.call(ui.dagongcheAnPlayer);
			}
			ui.dagongcheAnParams = {
				type: dgcType,
				anInfo: ui.dagongcheData,
				positionInfo: {
					cheshen: {
						x: [0, 0.5],
						y: [-100, 0.5],
					},

					chelun: {
						x: [0, 0.5],
						y: [-100, 0.5],
					},
					cheding: {
						x: [0, 0.5],
						y: [-28, 0.5],
					},
					chetou: {
						x: [110, 0.5],
						y: [-40, 0.5],
					},
				},
				scale: 0.8,
				...ui.dagongcheCommonInfo,
			};
			if (game.me == player) {
				game.pause();
				ui.dgcPlay.call(ui.dagongcheAnParams, true);
				let anUrl = ui.dagongcheAnParams.baseUrl + "zhuzhao/SS_gcczsgx";
				dcdAnim.loadSpine(anUrl, "skel", () => {
					dcdAnim.playSpine({
						name: anUrl,
						action: "play",
						...ui.dagongcheAnParams.positionInfo.cheshen,
					});
				});
				setTimeout(() => {
					ui.dgcClearAn.call(ui.dagongcheAnParams);
					game.resume();
				}, 2000);
			}
			//武将牌大公车播放参数
			ui.dagongcheAnPlayer = {
				...ui.dagongcheAnParams,
				positionInfo: {
					cheshen: {
						x: [10, 0.5],
						y: [0, 0.1],
					},

					chelun: {
						x: [10, 0.5],
						y: [0, 0.1],
					},
					cheding: {
						x: [10, 0.5],
						y: [12, 0.1],
					},
					chetou: {
						x: [30, 0.5],
						y: [8, 0.1],
					},
				},
				scale: 0.15,
				parent: player,
			};
			ui.dgcPlay.call(ui.dagongcheAnPlayer, true);
			lib.skill.mbquchong.createIcon(player, naijiuzhi, dgcType);
		},
	};
	//重铸是继承怀柔的   这里重写一下怀柔
	Object.assign(lib.skill.drlt_huairou, {
		async content(event, trigger, player) {
			if (event.cards && event.cards.length) {
				//重铸车
				if (event.cards[0].name.startsWith("dagongche_")) {
					if (ui.dagongcheAnPlayer) {
						dgcClearAn.call(ui.dagongcheAnPlayer);
					}
					lib.skill.mbquchong.clearIcon();
				}
			}
			await player.recast(event.cards);
		},
	});
}

function test() {
	window.positionInfo = {
		cheshen: {
			x: [0, 0.5],
			y: [-60, 0.5],
		},

		chelun: {
			x: [0, 0.5],
			y: [-60, 0.5],
		},
		cheding: {
			x: [0, 0.5],
			y: [-32, 0.5],
		},
		chetou: {
			x: [55, 0.5],
			y: [-40, 0.5],
		},
	};
	window.dagongcheAnParams = {
		type: "attack",
		anInfo: ui.dgcanInfo,
		scale: 0.4,
		...ui.dagongcheCommonInfo,
		positionInfo: window.positionInfo,
	};
	window.playdgc = () => {
		window.dagongcheAnParams.positionInfo = window.positionInfo;
		dgcClearAn.call(window.dagongcheAnParams);
		dgcPlay.call(window.dagongcheAnParams);
	};
}
