import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//来源/参考自 Sakura美化(作者@柴油鹿鹿)   搬运请标注来源
//特别感谢 @欣子 提供的曹轶虎形态露头素材
export function caoyi() {
  // ---------------------------------------格式化路径------------------------------------------ //
  function getCalibratePath(path) {
    // 去除字符串首尾空白
    path = path.trim();
    // 将字符串中的"\"替换为"/"
    path = path.replace(/\\/g, "/");
    // 将连续的"/"替换为单个"/"
    path = path.replace(/\/+/g, "/");
    // 如果最后一个字符是"/"，那么删除最后一个字符
    if (path.charAt(path.length - 1) === "/") path = path.slice(0, -1);
    // 替换缩写
    if (path.indexOf("ext:") === 0) path = path.replace(/ext:/, "extension/");
    // 使用正则表达式匹配"extension/"往后的部分
    var matches = path.match(/extension\/.*/);
    return matches ? matches[0] : "";
  }
  function initPath(path, name, image) {
    path = getCalibratePath(path);
    if (path.indexOf("extension/") === 0) path = path.substring(9);
    if (image !== false) {
      if (lib.device || lib.node) return "ext:" + path + "/" + name;
      return "db:extension-" + path + ":" + name;
    }
    return "die:" + path + "/" + name;
  }
  // ---------------------------------------格式化路径------------------------------------------ //
  lib.character.caoyi_hu = [
    "female",
    "wei",
    4,
    [],
    [
      "des:曹轶，游卡桌游旗下产品《三国杀》原创角色。设定上为曹纯所收养的孙女，从小受到曹纯的教导，在军营中长大，性情坚毅有担当，军事谋略丰富，战斗能力超强。曹轶喜欢美食，特别是甜食，并且擅长制作各种点心。她身边跟随的雪白小老虎是曹纯在她及笄时送的生辰礼物，希望她如小老虎一样，英勇无畏。曹轶与曹婴交好，两人以姐妹相称。曹轶成年后继承祖父衣钵，接手精锐部队“虎豹骑”，成为新的虎豹骑的统领者。",
      "unseen",
    ],
  ];
  var css = lib.config.extension_无名美化_caoyi;
  lib.character.caoyi_hu[4].push(
    initPath(
      "extension/无名美化/animation/caoyi/image/character/" + css,
      "caoyi_hu.jpg",
      true
    )
  );
  lib.translate["caoyi_hu"] = "曹轶(虎)";

  window._CAOYI = {
    huanfu: {
      name: "../../../无名美化/animation/caoyi/animation/huanfu",
      speed: 1.25,
    },
  };
  Object.assign(lib.skill.dcyinjun, {
    async content(event, trigger, player) {
      const target = trigger.targets[0];
      dcdAnim.loadSpine(window._CAOYI.huanfu.name, "skel", function () {
        game.playAudio(
          "../extension/无名美化/animation/caoyi/audio/huanfu.mp3"
        );
        dcdAnim.playSpine(window._CAOYI.huanfu, {
          speed: 1.25,
          scale: 0.45,
          x: [0, 0.5],
          y: [0, 0.5],
          parent: player,
        });
      });
      player.setAvatar("caoyi", "caoyi_hu");
      await (player.useCard(
        new lib.element.VCard({ name: "sha" }),
        target,
        false
      ).oncard = () => {
        get.event().customArgs.default.customSource = {
          isDead: () => true,
        };
      });
      if (
        player.getHistory("useSkill", (evt) => evt.skill == "dcyinjun").length >
        player.getHp()
      ) {
        player.tempBanSkill("dcyinjun");
      }
      if (window._wmmh_caoyit) {
        return;
      }
      window._wmmh_caoyit = setTimeout(function () {
        dcdAnim.loadSpine(window._CAOYI.huanfu.name, "skel", function () {
          game.playAudio(
            "../extension/无名美化/animation/caoyi/audio/huanfu.mp3"
          );
          dcdAnim.playSpine(window._CAOYI.huanfu, {
            scale: 0.45,
            x: [0, 0.5],
            y: [0, 0.5],
            parent: player,
          });
        });
        player.setAvatar("caoyi", "caoyi");
        window._wmmh_caoyit = null;
        clearTimeout(window._wmmh_caoyit);
      }, 1000);
    },
  });
}
