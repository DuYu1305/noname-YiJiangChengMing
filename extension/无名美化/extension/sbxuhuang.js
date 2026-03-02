import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function sbxuhuang() {
  window.WJMH_SBXUHUANG = {
    mouyi: {
      name: "../../../无名美化/animation/mouyi/mouyi",
    }, //谋奕
    chengchi: {
      name: "../../../无名美化/animation/mouyi/chengchi",
    },
  };
  Object.assign(lib.skill.sbduanliang, {
    content: function () {
      "step 0";
      dcdAnim.loadSpine(WJMH_SBXUHUANG.mouyi.name, "skel");
      player
        .chooseToDuiben(target)
        .set("title", "谋弈")
        .set("namelist", ["固守城池", "突出重围", "围城断粮", "擂鼓进军"])
        .set("translationList", [
          `以防止${get.translation(player)}通过此技能对你使用【决斗】`,
          `以防止${get.translation(player)}通过此技能对你使用【兵粮寸断】`,
          `若成功，将牌堆顶的牌当做【兵粮寸断】对${get.translation(
            target
          )}使用`,
          `若成功，视为对${get.translation(target)}使用【决斗】`,
        ])
        .set("ai", (button) => {
          var source = _status.event.getParent().player,
            target = _status.event.getParent().target;
          if (
            get.effect(target, { name: "juedou" }, source, source) >= 10 &&
            button.link[2] == "db_def2" &&
            Math.random() < 0.5
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
          if (target.hasJudge("bingliang")) {
            player.gainPlayerCard(target, "he", true);
          } else {
            if (ui.cardPile.childNodes.length > 0) {
              if (
                player.canUse(
                  get.autoViewAs({ name: "bingliang" }, [
                    ui.cardPile.firstChild,
                  ]),
                  target,
                  false
                )
              ) {
                player.useCard({ name: "bingliang" }, target, get.cards());
              }
            }
          }
          playTargetSpine("play7", "duanliangchenggon_1");
        } else {
          var card = { name: "juedou", isCard: true };
          if (player.canUse(card, target)) player.useCard(card, target);
          playTargetSpine("play1", "leigujinjun_1");
        }
      } else {
        if (result.player == "db_def1") {
          playTargetSpine("play8", "duanliangchenggon_2");
        } else {
          playTargetSpine("play2", "leigujinjun_2");
        }
      }
    },
  });
}
