import { lib, game, ui, get, ai, _status } from "../../noname.js";
import xingyouji from "./js/utils.js";
export const type = "extension";
export default function() {
  return {
    name: "星游记",
    editable: false,
    noSave: false,
    arenaReady: function() {},
    async content(config, pack) {
      const deps = { lib, game, ui, get, ai, _status, config };
      await new Promise(resolve => setTimeout(resolve, 50));
      xingyouji.init(deps);
    },
    prepare: function() {},
    precontent: function() {},
    help: {},
    config: {
      version: { nopointer: true, clear: true, name: "扩展版本: v1.1<br>更新日期:25120" },
      musicSwitch: { type: "boolean", name: "音乐浮标", desc: "测试", default: false }
    },
    package: {
      character: xingyouji.config.character,
      card: { card: {}, translate: {}, list: [] },
      intro: "<星空之所以美丽，就是因为在无限的宇宙中，不管黑暗如何蔓延，都有星星的光芒去把它照亮。/li>",
      author: "君逸",
      diskURL: "",
      forumURL: "",
      version: "1.0"
    },
    files: {
      "character": ["XY_ML.jpg"],
      "card": [],
      "skill": [],
      "audio": ["audio/zhutiqu/再飞行.mp3"]
    },
    connect: false
  };
}
