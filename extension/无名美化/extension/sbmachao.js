import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function sbmachao() {
  window.WJMH_SBMACHAO = {
    mouyi: {
      name: "../../../无名美化/animation/mouyi/mouyi",
    }, //谋奕
  };
  Object.assign(lib.skill.sbtieji, {
    content: function () {
      "step 0";
      var target = trigger.target;
      event.target = target;
      target.addTempSkill("fengyin");
      trigger.directHit.add(target);
      dcdAnim.loadSpine(WJMH_SBMACHAO.mouyi.name, "skel");
      player
        .chooseToDuiben(target)
        .set("title", "谋弈")
        .set("namelist", ["出阵迎战", "拱卫中军", "直取敌营", "扰阵疲敌"])
        .set("translationList", [
          `以防止${get.translation(player)}摸2张牌`,
          `以防止${get.translation(player)}获得你1张牌`,
          `若成功，你获得${get.translation(target)}1张牌`,
          `若成功，你摸2张牌`,
        ])
        .set("ai", (button) => {
          var source = get.event().getParent().player,
            target = get.event().getParent().target;
          if (!target.countCards("he") && button.link[2] == "db_def2")
            return 10;
          if (
            !target.countCards("he") &&
            get.attitude(target, source) <= 0 &&
            button.link[2] == "db_atk1"
          )
            return 10;
          return 1 + Math.random();
        });

      ("step 1");
      function playTargetSpine(playName, audioName) {
        WJMH_SBMACHAO.mouyi.action = playName;
        game.playAudio(
          `../../extension/无名美化/audio/mouyi/effect_jizhitu_${audioName}.mp3`
        );
        dcdAnim.playSpine(WJMH_SBMACHAO.mouyi, { scale: 0.8 });
        game.delay(3.5);
      }
      if (result.bool) {
        if (result.player == "db_def1") {
          player.gainPlayerCard(target, "he", true);
          playTargetSpine("play3", "zhiqudiying_1");
        } else {
          player.draw(2);
          playTargetSpine("play6", "raozhenpidi_1");
        }
      } else {
        if (result.player == "db_def1") {
          playTargetSpine("play4", "zhiqudiying_2");
        } else {
          playTargetSpine("play5", "raozhenpidi_2");
        }
      }
    },
  });
}
