import { lib, game, ui, get, ai, _status } from "../../../noname.js";
export function zhengxuan() {
  window.ThunderZhengJing = {
    zj_jihuo: {
      name: "../../../无名美化/animation/zhengxuan/zj_jihuo",
    },
    zj_mianban: {
      name: "../../../无名美化/animation/zhengxuan/zj_mianban",
    },
    zj_fruit: {
      name: "../../../无名美化/animation/zhengxuan/zj_dianbao1",
    },
    zj_bomb: {
      name: "../../../无名美化/animation/zhengxuan/zj_dianbao2",
    },
    zj_kabei: {
      name: "../../../无名美化/animation/zhengxuan/Ss_ZhengJing_KaBei",
    },
    zj_pangguan: {
      name: "../../../无名美化/animation/zhengxuan/SS_XiaoYouXi_ZX_guanzhan",
    },
  };
  lib.skill.zhengjing = {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    direct: true,
    // init: function () {
    //     game.thunderLoadFont({ url: lib.assetURL + 'extension/Thunder/assets/th-poem.woff2', cssValue: 'th-poem' });
    //     game.thunderLoadFont({ url: lib.assetURL + 'extension/Thunder/assets/th-zhongli.woff2', cssValue: 'th-zhongli' });
    // },
    filter: function (event, player) {
      if (!window.zhengjingxiao) {
        window.zhengjingxiao = true;
        dcdAnim.loadSpine(window.ThunderZhengJing.zj_jihuo.name, "skel");
        dcdAnim.loadSpine(window.ThunderZhengJing.zj_mianban.name, "skel");
      }
      return true;
    },
    content: function () {
      "step 0";
      game.thunderForbidTouch();
      game.pause();
      _status.startCut = false;
      _status.fruitCutting = false;
      _status.thzjFinished = false;
      _status.thzhengjingfirstload = false;
      _status.threpeatAudio = lib.config.repeat_audio;
      lib.config.repeat_audio = false;
      var cards = [];
      var names = [];
      while (true) {
        var card = get.cardPile(function (carde) {
          return carde.name != "du" && !names.contains(carde.name);
        });
        if (card) {
          cards.push(card);
          names.push(card.name);
          if (_status.qhly_skillTest) {
            if (cards.length >= 5) break;
          } else if (get.mode() == "doudizhu") {
            if (
              cards.length == 1 &&
              !get.isLuckyStar(player) &&
              Math.random() < 0.33
            )
              break;
            if (
              cards.length == 2 &&
              !get.isLuckyStar(player) &&
              Math.random() < 0.5
            )
              break;
            if (cards.length >= 3) break;
          } else {
            if (
              cards.length == 3 &&
              !get.isLuckyStar(player) &&
              Math.random() < 0.33
            )
              break;
            if (
              cards.length == 4 &&
              !get.isLuckyStar(player) &&
              Math.random() < 0.5
            )
              break;
            if (cards.length >= 5) break;
          }
        } else break;
      }
      if (!cards.length) {
        event.finish();
        return;
      }
      event.blackbg = ui.create.div(".th-dibeijing", document.body);
      event.blackbg.style.background = "rgba(0,0,0,0.7)";
      event.shoushaJDT = document.getElementById("jindutiao");
      if (event.shoushaJDT) {
        event.shoushaJDT.style.cssText += "transition:none";
        event.shoushaJDT.hide();
      }
      var zjBg = dcdAnim.playSpine(window.ThunderZhengJing.zj_mianban, {
        y: document.body.offsetHeight * 0.5 + 40,
        scale: 0.7,
      });
      _status.thzhengjingDaojishi = _status.thzhengjingDaojishiTotal = 520;
      setTimeout(function () {
        zjBg.clip = {
          x: [0, -0.01],
          y: 0,
          width: [0, 0.25],
          height: [0, 1],
          clipParent: true,
        };
      }, 2200);
      setTimeout(function () {
        player.thunderFruit(cards);
      }, 2100);
      ("step 1");
      event.blackbg.remove();
      game.thunderAllowTouch();
      if (_status.threpeatAudio)
        lib.config.repeat_audio = _status.threpeatAudio;
      if (_status.qhly_skillTest) {
        _status.qhly_skillTest = false;
        event.finish();
        return;
      } else {
        _status.firstZhengjing = true;
        if (result.bool) {
          event.cards = result.cards;
          game.cardsGotoOrdering(event.cards);
        } else event.finish();
      }
      ("step 2");
      game.updateRoundNumber();
      if (event.shoushaJDT) event.shoushaJDT.show();
      player.chooseTarget("将整理出的经典置于一名角色的武将牌上", true)
        .set("ai", function (target) {
          if (target.hasSkill("xinfu_pdgyingshi")) return 0;
          var player = _status.event.player;
          var att = get.attitude(player, target);
          return -att;
        });
      ("step 3");
      if (result.bool) {
        player.logSkill("zhengjing", target);
        var target = result.targets[0];
        event.target = target;
        player.line(target, "thunder");
      }
      ("step 4");
      if (event.cards.length == 1) {
        event._result = { bool: true, moved: [cards, []] };
        return;
      }
      var next = player.chooseToMove("整经：请分配整理出的经典", true);
      next.set("list", [
        ["置于" + get.translation(target) + "的武将牌上", event.cards],
        ["自己获得"],
      ]);
      next.set("filterMove", function (from, to, moved) {
        if (moved[0].length == 1 && to == 1 && from.link == moved[0][0])
          return false;
        return true;
      });
      next.set("filterOk", function (moved) {
        return moved[0].length > 0;
      });
      next.set("processAI", function (list) {
        var cards = list[0][1].slice(0).sort(function (a, b) {
          return get.value(a) - get.value(b);
        });
        return [cards.splice(0, 1), cards];
      });
      ("step 5");
      if (result.bool) {
        var cards = result.moved[0],
          gains = result.moved[1];
        target.addSkill("zhengjing2");
        target.addToExpansion(cards, "gain2").gaintag.add("zhengjing2");
        if (gains.length) player.gain(gains, "gain2");
      }
    },
    ai: {
      order: 10,
      result: { player: 1 },
      threaten: 3.2,
    },
  };
  lib.skill.zhengjing2 = {
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    charlotte: true,
    intro: { content: "expansion", markcount: "expansion" },
    onremove: function (player, skill) {
      var cards = player.getExpansions(skill);
      if (cards.length) player.loseToDiscardpile(cards);
    },
    content: function () {
      "step 0";
      player.gain(player.getExpansions("zhengjing2"), "gain2");
      player.skip("phaseJudge");
      player.skip("phaseDraw");
      ("step 1");
      player.removeSkill("zhengjing2");
    },
  };
}
