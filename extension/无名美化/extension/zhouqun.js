import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function zhouqun() {
  window._ThunderTianSuan = {
    qiuqian: {
      name: "../../../无名美化/animation/zhouqun/SSXF_PJN_qiuqian",
    },
    qiuqianyan: {
      name: "../../../无名美化/animation/zhouqun/SSXF_PJN_qiuqianyanwu",
    },
    hengfu: {
      name: "../../../无名美化/animation/zhouqun/SSXF_PJN_hengfu",
    },
    zhongqian: {
      name: "../../../无名美化/animation/zhouqun/SSXF_PJN_zhongqian",
      scale: 0.7,
    },
  };
  Object.assign(lib.skill.tiansuan, {
    filter: function (event, player) {
      if (!window.tiansuanxiao) {
        window.tiansuanxiao = true;
        dcdAnim.loadSpine(window._ThunderTianSuan.qiuqian.name, "skel");
        dcdAnim.loadSpine(window._ThunderTianSuan.qiuqianyan.name, "skel");
        dcdAnim.loadSpine(window._ThunderTianSuan.zhongqian.name, "skel");
        dcdAnim.loadSpine(window._ThunderTianSuan.hengfu.name, "skel");
      }
      return !player.storage.tiansuan2;
    },
    content: function () {
      "step 0";
      game.thunderForbidTouch();
      game.pause(player);
      _status.imchoosing = true;
      event.ditu = new Image();
      event.ditu.src =
        lib.assetURL + "extension/无名美化/image/tiansuan/ditu.png";
      event.bgcanvas = document.createElement("canvas");
      event.bgcanvas.classList.add("th-tiansuantipbg");
      event.bgcanvas.style.zIndex = 8;
      document.body.appendChild(event.bgcanvas);
      event.canvas = document.createElement("canvas");
      event.canvas.classList.add("th-tiansuantipbg");
      document.body.appendChild(event.canvas);
      event.bgcanvas.width = event.bgcanvas.clientWidth;
      event.bgcanvas.height = event.bgcanvas.clientHeight;
      event.canvas.width = event.canvas.clientWidth;
      event.canvas.height = event.canvas.clientHeight;
      event.ctx = event.canvas.getContext("2d");
      event.bgctx = event.bgcanvas.getContext("2d");
      game.countChoose();
      event.ditu.onload = function () {
        if (event.isMine()) {
          event.dibeijing = ui.create.div(".th-dibeijing", document.body);
          var dialog = game.thunderDialog(player, "天算", event.dibeijing, 330);
          var qianBg = ui.create.div(".th-qianbg", dialog.container);
          var selIndex = null;
          event._result = {
            bool: false,
            index: null,
          };
          ui.create.div(
            ".th-qiuqiantip",
            dialog.container,
            "你可以复制一个签，增加其被抽中的机会"
          );
          for (let i = 0; i < 5; i++) {
            var qian = ui.create.div(".th-tiansuanqian", qianBg);
            qian.style.backgroundImage =
              "url(" +
              lib.assetURL +
              "extension/无名美化/image/tiansuan/mingyunqian_" +
              i +
              ".png)";
            qian.id = "th-tiansuanqian" + i;
            qian.style.left = 110 + i * 80 + "px";
            qian.listen(function () {
              if (this.classList.contains("sel")) return;
              for (var j = 0; j < 5; j++) {
                var temp = document.getElementById("th-tiansuanqian" + j);
                if (temp) temp.classList.remove("sel");
              }
              this.classList.add("sel");
              selIndex = parseInt(this.id.charAt(this.id.length - 1));
            });
          }
          event.control = ui.create.control("ok", "cancel2", function (link) {
            if (game.thunderHasExt("十周年")) {
              var con = document.getElementById("dui-controls");
              con.classList.remove("th-confirmdown");
            }
            if (link == "ok") {
              event._result = {
                bool: true,
                index: selIndex != null ? selIndex : null,
              };
            }
            game.resume(player);
          });
          if (game.thunderHasExt("十周年")) {
            var con = document.getElementById("dui-controls");
            con.classList.add("th-confirmdown");
          }
        } else {
          event._result = {
            bool: true,
            index: [0, 4].randomGet(),
          };
          game.resume(player);
        }
      };
      ("step 1");
      game.pause(player);
      console.log(result);
      function writeTip(str, x, y) {
        event.ctx.clearRect(x - 100, y - 100, 500, 300);
        event.ctx.font = '900 15px "shousha"';
        event.ctx.fillStyle = "#6e5e40";
        if (str.length > 20) {
          var str1 = str.substring(0, 20);
          var str2 = str.substring(20);
          event.ctx.fillText(str1, x, y);
          event.ctx.fillText(str2, x, y + 18);
        } else event.ctx.fillText(str, x + (20 - str.length) * 7.5, y + 8);
      }
      function nextStep() {
        event.bgcanvas.remove();
        if (event.isMine()) {
          dcdAnim.stopSpine(event.zhongqian);
          dcdAnim.stopSpine(event.qiuqianEnd);
          dcdAnim.stopSpine(event.qiuqianyan);
          event.hengfu.moveTo(null, document.body.offsetHeight * 0.5, 500);
          event.hengfu.onupdate = function () {
            this.speed = 0;
            writeTip(
              lib.skill["tiansuan2_" + num].intro.content,
              event.canvas.width * 0.5 - 150,
              document.body.offsetHeight - this.timestepMap.y.current
            );
            if (this.timestepMap.y.completed && !this.nextstep) {
              this.nextstep = true;
              game.resume(player);
            }
          };
        } else game.resume(player);
      }
      var list = [0, 1, 1, 2, 2, 2, 3, 3, 4];
      if (result.index) list.push(result.index);
      var num = list.randomGet();
      event.num = num;
      game.log(player, "抽取出了", "#g" + lib.skill["tiansuan2_" + num].name);
      if (event.dibeijing) event.dibeijing.remove();
      if (event.control) event.control.remove();
      var qianImg = new Image();
      qianImg.src =
        lib.assetURL +
        "extension/无名美化/image/tiansuan/jgqian" +
        num +
        ".png";
      event.bgctx.drawImage(
        event.ditu,
        event.bgcanvas.width * 0.5 - 400,
        event.bgcanvas.height * 0.5 - 213.3,
        800,
        426.6
      );
      game.playAudio("../extension/无名美化/audio/tiansuan/yaoqian.mp3");
      var qiuqian = dcdAnim.playSpine(window._ThunderTianSuan.qiuqian, {
        scale: 0.7,
      });
      event.qiuqianyan = dcdAnim.loopSpine(window._ThunderTianSuan.qiuqianyan, {
        scale: 0.65,
        x: event.bgcanvas.width * 0.5 - 177,
        y: event.bgcanvas.height * 0.5 - 35,
      });
      qiuqian.oncomplete = function () {
        game.playAudio("../extension/无名美化/audio/tiansuan/zhongqian.mp3");
        event.qiuqianEnd = dcdAnim.playSpine(
          {
            name: window._ThunderTianSuan.qiuqian.name,
            action: "play2",
          },
          { scale: 0.7, y: event.bgcanvas.height * 0.5 + 5 }
        );
        event.qiuqianEnd.onupdate = function () {
          var entry1 = this.skeleton.state.tracks[0];
          if (
            !this._animEnd &&
            entry1.trackTime >= 0.98 * entry1.animationEnd
          ) {
            this.speed = 0;
            this._animEnd = true;
          }
        };
        event.zhongqian = dcdAnim.loopSpine(window._ThunderTianSuan.zhongqian, {
          scale: 0.7,
          parent: document.body,
        });
        var skeletons = event.zhongqian.skeleton;
        var slots = skeletons.findSlot("jgqian3");
        var attachments = slots.getAttachment();
        var regions = decadeUI.animation.createTextureRegion(qianImg);
        var scaleQ = 1.17;
        attachments.width = (regions.width * scaleQ) / 1.15;
        attachments.height = (regions.height * scaleQ) / 1.15;
        attachments.setRegion(regions);
        attachments.updateOffset();
        event.zhongqian.onupdate = function () {
          var entry2 = this.skeleton.state.tracks[0];
          if (!this._animEnd && entry2.trackTime >= 0.7 * entry2.animationEnd) {
            this._animEnd = true;
            this.setAction("play2");
            event.hengfu = dcdAnim.playSpine(
              {
                name: window._ThunderTianSuan.hengfu.name,
                speed: 0.7,
              },
              {
                y: document.body.offsetHeight * 0.5 - 120,
                scale: 0.7,
              }
            );
            event.hengfu.onupdate = function () {
              var entry3 = this.skeleton.state.tracks[0];
              if (
                !this._tipLoad &&
                entry3.trackTime >= 0.9 * entry3.animationEnd
              ) {
                this._tipLoad = true;
                this.speed = 0;
                writeTip(
                  lib.skill["tiansuan2_" + num].intro.content,
                  event.canvas.width * 0.5 - 150,
                  document.body.offsetHeight * 0.5 + 120
                );
                setTimeout(nextStep, 100);
              }
            };
          }
        };
      };
      ("step 2");
      game.thunderAllowTouch();
      player.chooseTarget(
          true,
          "令一名角色获得“" + lib.skill["tiansuan2_" + num].name + "”"
        )
        .set("ai", lib.skill["tiansuan2_" + num].aiCheck);
      ("step 3");
      dcdAnim.stopSpineAll();
      event.canvas.remove();
      if (result.bool) {
        var target = result.targets[0];
        player.line(target, "green");
        game.log(player, "令", target, "获得了命运签");
        player.storage.tiansuan2 = target;
        player.storage.tiansuan3 = "tiansuan2_" + num;
        player.addTempSkill("tiansuan2", { player: "phaseBegin" });
        target.addSkill("tiansuan2_" + num);
        if (
          num < 2 &&
          target.countGainableCards(player, target == player ? "e" : "he") > 0
        ) {
          var next = player.gainPlayerCard(
            target,
            target == player ? "e" : "he",
            true
          );
          if (num == 0) next.visible = true;
        } else game.delayx();
      }
    },
  });
}
