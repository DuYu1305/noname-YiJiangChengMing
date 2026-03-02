import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function sbspzhugeliang() {
  window._SBSPZHUGELIANG = {
    huojishibai: {
      name: "../../../无名美化/animation/sbspzhugeliang/huojishibai",
    }, //火计失败
  };
  //来源/参考自 Sakura美化(作者@柴油鹿鹿)   搬运请标注来源
  lib.skill.sbhuoji.subSkill.fail.content = function () {
    game.delay(0, 1000);
    dcdAnim.loadSpine(window._SBSPZHUGELIANG.huojishibai.name, "skel", function () {
      dcdAnim.playSpine(window._SBSPZHUGELIANG.huojishibai, {
        scale: 0.8,
        speed: 1,
        x: [0, 0.55],
        parent: player,
      });
    });
    player.awakenSkill("sbhuoji");
    game.log(player, "使命失败");
  };
}
