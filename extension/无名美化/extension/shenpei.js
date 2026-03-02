import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function shenpei() {
  window.WJMH_SHENPEI = {
    chengchi: {
      name: "../../../无名美化/animation/mouyi/chengchi",
    },
  };
  Object.assign(lib.skill.shouye, {
    content: function () {
      "step 0";
      player.line(trigger.player, "green");
      dcdAnim.loadSpine(WJMH_SHENPEI.chengchi.name, "skel");
      player.chooseToDuiben(trigger.player);
      ("step 1");
      let actionName;
      if (result.bool) {
        trigger.targets.remove(player);
        trigger.getParent().triggeredTargets2.remove(player);
        trigger.getParent().shouyeer = player;
        actionName = 'play'
      } else {
        actionName = 'play2'
      }
      WJMH_SHENPEI.chengchi.action = actionName;
      dcdAnim.playSpine(WJMH_SHENPEI.chengchi);
      game.delay(3.5);
    },
  });
}
