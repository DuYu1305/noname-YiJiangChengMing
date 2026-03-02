import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function mbcaomao() {
  window._MBCaoMao = {
    name: "无名美化",
    url: lib.assetURL + "extension/无名美化",
    mbcmjja: {
      name: "../../../无名美化/animation/caomao/juejin/SS_cmskill",
      speed: 0.8,
    },
    mbcmjj2: {
      name: "../../../无名美化/animation/caomao/juejin2/SS_cmnewskill",
    },
    mbcmjjmaskb: {
      name: "../../../无名美化/animation/caomao/juejin2/SS_cmnewmask",
    },
    mbcmjjb: {
      name: "../../../无名美化/animation/caomao/juejin/SS_cmmask",
      speed: 0.8,
      action: "play2",
    },
    mbcmjjbj: {
      name: "../../../无名美化/animation/caomao/aozhan_huo",
    },
    mbcmjjdc: {
      name: "../../../无名美化/animation/caomao/SS_CM_DestoryCard",
    },
    mbcmzw: {
      name: "../../../无名美化/animation/caomao/caomaozhengwang/SS_CM_zhenwang",
    },
    mbcmzw2: {
      name: "../../../无名美化/animation/caomao/zhenwang2/SS_CM_2025zhenwang",
    },
  };

  let scale = 1,
    aozhanScale = 1.34;
  if (lib.device) {
    scale = 1;
    aozhanScale = 1;
  }
  //来源/参考自 Sakura美化(作者@柴油鹿鹿)   搬运请标注来源
  //决进美化
  Object.assign(lib.skill.mbjuejin, {
    async contentBefore(event, trigger, player) {
      if (get.mode() != "taixuhuanjing") {
        dcdAnim.loadSpine(window._MBCaoMao.mbcmjjbj.name, "skel", function () {
          window._MBCaoMao.mbcmjjbj.loop = true;
          player.storage._mbcmjjbj_ = dcdAnim.playSpine(
            window._MBCaoMao.mbcmjjbj,
            {
              speed: 0.9,
              scale: aozhanScale,
            }
          );
        });
      }

      player.changeSkin({ characterName: "mb_caomao" }, "mb_caomao_shadow");
      player.awakenSkill(event.skill);
      let skillType = lib.config.extension_无名美化_mbcaomao;
      let skillAnName =
        skillType == "a" ? window._MBCaoMao.mbcmjja : window._MBCaoMao.mbcmjj2;
      let skillMaskName =
        skillType == "a"
          ? window._MBCaoMao.mbcmjjb
          : window._MBCaoMao.mbcmjjmaskb;
      dcdAnim.loadSpine(skillMaskName.name, "skel", function () {
        player.storage._mbcmjjb_ = dcdAnim.playSpine(
          {
            ...skillMaskName,
            loop: true,
          },
          {
            scale: scale,
            speed: 1,
            loop: true,
          }
        );
      });
      function playcaomaoAn() {
        return new Promise((resolve, reject) => {
          dcdAnim.loadSpine(skillAnName.name, "skel", function () {
            let audioName =
              skillType == "a"
                ? "effect_caomao_skill"
                : "effect_caomao_skill_2025";
            game.playAudio(
              "..",
              "extension",
              "无名美化",
              "animation",
              "caomao",
              "audio",
              audioName
            );
            player.storage._mbcmskill_ = dcdAnim.playSpine(skillAnName, {
              scale: scale,
              speed: 1,
            });
            player.storage._mbcmskill_.oncomplete = () => {
              dcdAnim.stopSpine(player.storage._mbcmjjb_);
              player.storage._mbcmjjb_ = undefined;
              resolve()
            };
          });
        });
      }
      await playcaomaoAn();
      // let timeout = skillType == "a" ? 5700 : 4500;

      // await game.delay(0, timeout);
      game.broadcastAll(() => {
        _status.tempMusic = "effect_caomaoBJM";
        game.playBackgroundMusic();
      });
      //   console.log("player.storage._mbcmskill_", player.storage._mbcmskill_);
      //   dcdAnim.stopSpine(player.storage._mbcmjjb_);

      if (lib.config.extension_无名美化_cmqhdp) {
        try {
          let pifuname = skillType == "a" ? "向死存魏" : "枭龙破渊2";
          game.qhly_changeDynamicSkin(player.name, pifuname);
        } catch (error) {}
      }
    },
    async contentAfter(event, trigger, player) {
      var xscwbtn = ui.create.div(".xscwbtn", document.body);
      var xscwdialog = ui.create.div();
      xscwbtn.addEventListener("click", function () {
        var xscwdialog = ui.create.div(".xscwdialog", document.body);
        var xscwditu = ui.create.div(".xscwditu", document.body);
        xscwditu.addEventListener("click", function () {
          document.querySelector(".xscwdialog").remove();
          document.querySelector(".xscwditu").remove();
        });
      });
      game.addGlobalSkill("mbjuejin_xiangsicunwei");
      const cards = ["cardPile", "discardPile"]
        .map((pos) => Array.from(ui[pos].childNodes))
        .flat();
      const filter = (card) => ["shan", "tao", "jiu"].includes(card.name);
      const cardx = cards.filter(filter);
      if (cardx.length) {
        await game.cardsGotoSpecial(cardx);
        game.log(cardx, "被移出了游戏");
      }
      for (const target of game.filterPlayer()) {
        const sishis = target.getCards("hej", filter);
        if (sishis.length) {
          target.$throw(sishis);
          game.log(sishis, "被移出了游戏");
          await target.lose(sishis, ui.special);
        }
      }
      dcdAnim.loadSpine(window._MBCaoMao.mbcmjjdc.name, "skel", function () {
        dcdAnim.playSpine(window._MBCaoMao.mbcmjjdc, {
          speed: 1.3,
          scale: 0.72,
          x: [0, 0.575],
        });
      });
    },
  });
  //来源/参考自 Sakura美化(作者@柴油鹿鹿)   搬运请标注来源
  //曹髦阵亡
  lib.skill._sscaomaodie = {
    trigger: { player: "dieBefore" },
    direct: true,
    firstDo: true,
    charlotte: true,
    priority: Infinity,
    filter: function (event, player) {
      return (
        player.name == "mb_caomao" ||
        player.name1 == "mb_caomao" ||
        player.name2 == "mb_caomao"
      );
    },
    content: function () {
      "step 0";
      // lib.config.background_music = "ext:无名美化/animation/caomao/audio/die.mp3";
      // game.playBackgroundMusic();
      if (ui.backgroundMusic) {
        ui.backgroundMusic.pause();
      }
      if (player.storage._mbcmjjbj_) {
        dcdAnim.stopSpine(player.storage._mbcmjjbj_);
      }
      let skillType = lib.config.extension_无名美化_mbcaomao;
      let skillAnName =
        skillType == "a" ? window._MBCaoMao.mbcmzw : window._MBCaoMao.mbcmzw2;
      dcdAnim.loadSpine(skillAnName.name, "skel", function () {
        let audioName =
          skillType == "a" ? "effect_caomao_dead" : "effect_caomao_dead_2025";
        game.playAudio(
          "..",
          "extension",
          "无名美化",
          "animation",
          "caomao",
          "audio",
          audioName
        );
        dcdAnim.playSpine(skillAnName, { scale: 0.8 });
      });
      game.delay(0, 6000);
      // ("step 1");
      // game.playAudio("..", "extension", "无名美化", "animation", "caomao", "audio", "die");
    },
  };
}
