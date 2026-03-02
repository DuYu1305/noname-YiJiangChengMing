export function _package(extensionInfo) {
	return {
		// 在这里添加扩展的配置信息
		character: {
			character: {},
			translate: {},
		},
		card: {
			card: {},
			translate: {},
			list: [],
		},
		skill: {
			skill: {},
			translate: {},
		},
		// <span style='color: pink; font-weight: bold;'>开启至臻动皮需要安装皮切。</span>
		intro: extensionInfo.intro,
		author: extensionInfo.author,
		diskURL: "",
		forumURL: "",
		version: extensionInfo.version,
	};
}
export const help = {};
export const files = { character: [], card: [], skill: [], audio: [] };
