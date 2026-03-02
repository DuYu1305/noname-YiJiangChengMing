import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function pangdegong() {
  window._ThunderPingCai = {
    pdgguang: {
      name: "../../../无名美化/animation/pangdegong/guangci/guangci",
    },
    fengchu_card: {
      name: "../../../无名美化/animation/pangdegong/niao/niao",
    },
    xuanjian_card: {
      name: "../../../无名美化/animation/pangdegong/jian/jian",
    },
    shuijing_card: {
      name: "../../../无名美化/animation/pangdegong/jingzi/jingzi",
    },
    wolong_card: {
      name: "../../../无名美化/animation/pangdegong/long/long",
    },
  }
  Object.assign(lib.skill.xinfu_pingcai,{
    chooseButton:undefined,
    contentx(){},
    filter: function (event, player) {
      return !player.hasSkill("xinfu_pingcai_used");
    },
    content: function () {
      "step 0";
      var list2 = [
        "wolong_card",
        "fengchu_card",
        "shuijing_card",
        "xuanjian_card",
      ];
      var result = event._result;
      if (_status.qhly_skillTest) {
        result.bool = true;
        result.index = Math.floor(Math.random() * 4);
        result.type = list2[result.index];
      } else if (event.isMine()) {
        game.pause(player);
        if (game.initJinDuTiao) game.initJinDuTiao(player);
        var chooseBg = ui.create.div(".th-pcchoosebg", document.body);
        if (game.thunderIsPhone()) chooseBg.classList.add("mobile");
        var leftBtn = ui.create.div(".th-pcleft", chooseBg);
        leftBtn.style.filter = "grayscale(100%)";
        var rightBtn = ui.create.div(".th-pcright", chooseBg);
        var chooseType = ui.create.div(".th-pcchoosetype", chooseBg);
        var index = 0;
        var list = ["卧龙", "凤雏", "水镜", "玄剑"];
        chooseType.innerHTML = list[index];
        leftBtn.listen(function () {
          if (index == 0) return;
          index--;
          if (index == 0) leftBtn.style.filter = "grayscale(100%)";
          else leftBtn.style.filter = "none";
          if (index == 3) rightBtn.style.filter = "grayscale(100%)";
          else rightBtn.style.filter = "none";
          chooseType.innerHTML = list[index];
        });
        rightBtn.listen(function () {
          if (index == 3) return;
          index++;
          if (index == 0) leftBtn.style.filter = "grayscale(100%)";
          else leftBtn.style.filter = "none";
          if (index == 3) rightBtn.style.filter = "grayscale(100%)";
          else rightBtn.style.filter = "none";
          chooseType.innerHTML = list[index];
        });
        event.control = ui.create.control(
          "ok",
          "cancel2",
          function (link) {
            if (link == "ok") {
              result.bool = true;
              result.index = index;
              result.type = list2[index];
            } else result.bool = false;
            chooseBg.remove();
            game.resume();
            if (game.initJinDuTiao) game.initJinDuTiao(player, true);
          }
        );
      } else {
        var aiIndex = Array(4).fill(0.6);
        if (
          game.hasPlayer(function (current) {
            return (
              get.damageEffect(current, player, player, "fire") > 0
            );
          })
        )
          aiIndex[0] = 1 + Math.random();
        else aiIndex[0] = 0.5;
        if (
          game.hasPlayer(function (current) {
            return (
              current.isDamaged() &&
              current.hp < 3 &&
              get.attitude(player, current) > 1
            );
          })
        )
          aiIndex[3] = 1.2 + Math.random();
        else aiIndex[3] = 1;
        if (
          game.hasPlayer(function (current) {
            var att = get.sgn(get.attitude(player, current));
            if (att != 0) {
              var es = current.getCards("e");
              for (var i = 0; i < es.length; i++) {
                if (
                  game.hasPlayer(function (current2) {
                    if (
                      get.sgn(get.value(es[i], current)) != -att ||
                      get.value(es[i], current) < 5
                    )
                      return false;
                    var att2 = get.sgn(
                      get.attitude(player, current2)
                    );
                    if (
                      att == att2 ||
                      att2 !=
                        get.sgn(
                          get.effect(
                            current2,
                            es[i],
                            player,
                            current2
                          )
                        )
                    )
                      return false;
                    return (
                      current != current2 &&
                      !current2.isMin() &&
                      current2.isEmpty(get.subtype(es[i]))
                    );
                  })
                ) {
                  return true;
                }
              }
            }
          })
        )
          aiIndex[2] = 1 + Math.random();
        else aiIndex[2] = 0.5;
        result.bool = true;
        result.index = aiIndex.indexOf(Math.max.apply(null, aiIndex));
        result.type = list2[result.index];
      }
      ("step 1");
      if (event.control) event.control.remove();
      if (result.bool) {
        game.thunderForbidTouch();
        player.addTempSkill("xinfu_pingcai_used", "phaseUseEnd");
        if (!_status.qhly_skillTest) player.logSkill("xinfu_pingcai");
        game.pause(player);
        var name = result.type;
        event.cardname = name;
        var imageList = [
          [38, 10, 277, 320],
          [50, 3, 272, 356],
          [22, 47, 318, 266],
          [100, 0, 164, 360],
        ];
        //var pixIndex = Array(4).fill([]);
        event.pingcai_delayed = true;
        event.thpingcaiFinished = false;
        var event = _status.event;
        _status.xinfu_pingcai_finished = false;
        event.dialog = ui.create.div(".th-pingcaiBg", document.body);
        event.switchToAuto = function () {
          if (event.cxTime) {
            game.thunderClearInterval(event.cxTime[1]);
            event.cxTime[0].remove();
          }
          event.tipTime.stop = true;
          canvas3.remove();
          canvas.remove();
          _status.thpingcaiTips = true;
          if (event.thpingcaiFinished || !event.isMine()) {
            event.thpingcaiFinished = true;
            game.playAudio(
              "..",
              "extension",
              "无名美化",
              "audio",
              "pingcai",
              "onwipesucess"
            );
            dcdAnim.loadSpine(
              window._ThunderPingCai.pdgguang.name,
              "skel",
              function () {
                dcdAnim.playSpine(window._ThunderPingCai.pdgguang, {
                  scale: 0.6,
                });
              }
            );
          } else {
            canvas2.remove();
            game.playAudio(
              "..",
              "extension",
              "无名美化",
              "audio",
              "pingcai",
              "onwipefail"
            );
            dcdAnim.loadSpine(
              window._ThunderPingCai[result.type].name,
              "skel",
              function () {
                dcdAnim.playSpine(
                  window._ThunderPingCai[result.type],
                  { scale: 0.8 }
                );
              }
            );
          }
          event._result = {
            bool: event.thpingcaiFinished,
          };
          setTimeout(function () {
            game.thunderAllowTouch();
            game.resume();
          }, 1000);
          _status.xinfu_pingcai_finished = true;
        };
        var canvas = document.createElement("canvas");
        var canvas2 = document.createElement("canvas");
        var canvas3 = document.createElement("canvas");

        event.dialog.appendChild(canvas2);
        if (event.isMine()) event.dialog.appendChild(canvas);
        event.dialog.appendChild(canvas3);

        canvas.style.cssText =
          "position:absolute;width:450px;height:450px;left:calc(50% - 225px);top:calc(50% - 225px);";
        canvas.width = 450;
        canvas.height = 450;

        canvas2.style.cssText =
          "pointer-events:none;position:absolute;width:360px;height:360px;left:calc(50% - 180px);top:calc(50% - 180px);";
        canvas2.width = 360;
        canvas2.height = 360;

        canvas3.style.cssText =
          "pointer-events:none;position:absolute;width:450px;height:450px;left:calc(50% - 225px);top:calc(50% - 225px);";
        canvas3.width = 450;
        canvas3.height = 450;

        var ctx = canvas.getContext("2d");
        var ctx2 = canvas2.getContext("2d");
        var ctx3 = canvas3.getContext("2d");

        event.tipTime = {};
        var tipFrame = 0;
        var tipImg = new Image();
        tipImg.src =
          lib.assetURL + "extension/无名美化/image/pingcai/shou.png";
        var tipX = 0,
          tipY = 0;
        event.tipTime = new game.thunderRAF(function () {
          var data1 = ctx.getImageData(
            imageList[result.index][0] + 45,
            imageList[result.index][1] + 45,
            imageList[result.index][2],
            imageList[result.index][3]
          ).data;
          var data2 = ctx2.getImageData(
            imageList[result.index][0],
            imageList[result.index][1],
            imageList[result.index][2],
            imageList[result.index][3]
          ).data;
          var sum = 0;
          for (var i = 3; i < data1.length; i += 40) {
            if (data1[i] == 0 && data2[i] != 0) {
              sum++;
            }
          }
          if (sum >= imageList[result.index][4] * 0.85) {
            event.thpingcaiFinished = true;
            if (!_status.xinfu_pingcai_finished) {
              _status.xinfu_pingcai_finished = true;
              event.switchToAuto();
            }
          }
          if (!_status.thpingcaiTips || _status.qhly_skillTest) {
            canvas3.height = canvas3.height;
            if (!event.tipUp) {
              tipX =
                140 + Math.sin(tipFrame) * 100 + Math.random() * 100;
              tipY = 20 + tipFrame * 3;
            } else {
              tipX -= 20;
              tipY -= 40;
            }
            ctx3.drawImage(tipImg, tipX, tipY, 50, 50);
            if (tipY >= 400 && tipX >= 260) {
              event.tipUp = true;
            }
            if (tipY <= 20) {
              event.tipUp = false;
              tipFrame = (tipY - 20) / 3;
            }
            tipFrame++;
          }
        });
        var img = new Image();

        if (event.isMine()) {
          var mouse = null;
          var lastMouse = null;
          var img2 = new Image();
          img2.src =
            lib.assetURL +
            "extension/无名美化/image/pingcai/cover.png";
          img2.onload = function () {
            ctx.drawImage(
              this,
              0,
              0,
              this.width,
              this.height,
              0,
              0,
              canvas.width,
              canvas.height
            );
            img.src =
              lib.assetURL +
              "extension/无名美化/image/pingcai/" +
              result.type +
              ".png";
            img.onload = function () {
              ctx2.drawImage(
                this,
                0,
                0,
                this.width,
                this.height,
                0,
                0,
                canvas2.width,
                canvas2.height
              );
              var data = ctx2.getImageData(
                imageList[result.index][0],
                imageList[result.index][1],
                imageList[result.index][2],
                imageList[result.index][3]
              ).data;
              var sum = 0;
              for (var i = 3; i < data.length; i += 40) {
                if (data[i] > 0) {
                  sum++;
                  //pixIndex[result.index].push(i);
                }
              }
              imageList[result.index].push(sum);
            };
          };
          function onMove(x, y) {
            if (mouse) {
              lastMouse = mouse;
            }
            mouse = {
              x: x,
              y: y,
            };
            drawLine();
          }
          function drawLine() {
            if (!mouse) return;
            if (lastMouse) {
              ctx.lineWidth = 48;
              ctx.lineCap = "round";
              ctx.moveTo(lastMouse.x, lastMouse.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            } else {
              ctx.arc(mouse.x, mouse.y, 24, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
          canvas.onmousedown = function (ev) {
            if (_status.xinfu_pingcai_finished) return;
            canvas.onmousemove = function (e) {
              if (_status.xinfu_pingcai_finished) return;
              ctx.beginPath();
              ctx.globalCompositeOperation = "destination-out";
              onMove(
                e.offsetX / game.documentZoom,
                e.offsetY / game.documentZoom
              );
            };
          };
          canvas.ontouchstart = function (ev) {
            if (_status.xinfu_pingcai_finished) return;
            canvas.ontouchmove = function (e) {
              if (_status.xinfu_pingcai_finished) return;
              ctx.beginPath();
              var rect = canvas.getBoundingClientRect();
              var X =
                ((e.touches[0].clientX / game.documentZoom -
                  rect.left) /
                  rect.width) *
                canvas.width;
              var Y =
                ((e.touches[0].clientY / game.documentZoom -
                  rect.top) /
                  rect.height) *
                canvas.height;
              ctx.globalCompositeOperation = "destination-out";
              onMove(X, Y);
            };
          };
          event.cxTime = game.thunderCreateTimer(
            200,
            event.switchToAuto,
            null,
            700,
            6,
            130
          );
          canvas.onmouseup = function (ev) {
            canvas.onmousemove = null;
          };
          canvas.ontouchend = function (ev) {
            canvas.ontouchmove = null;
          };
        } else {
          img.src =
            lib.assetURL +
            "extension/无名美化/image/pingcai/" +
            result.type +
            ".png";
          img.onload = function () {
            ctx2.drawImage(
              this,
              0,
              0,
              this.width,
              this.height,
              0,
              0,
              canvas2.width,
              canvas2.height
            );
            // var data = ctx2.getImageData(imageList[result.index][0], imageList[result.index][1], imageList[result.index][2], imageList[result.index][3]).data;
            // var sum = 0;
            // for (var i = 3; i < data.length; i += 40) {
            //     if (data[i] > 0) {
            //         sum++
            //         pixIndex[result.index].push(i);
            //     }
            // }
            // imageList[result.index].push(sum);
          };
          event.switchToAuto();
        }
      } else {
        if (game.initJinDuTiao) game.initJinDuTiao(player);
        event.finish();
      }

      ("step 2");
      if (game.initJinDuTiao) game.initJinDuTiao(player);
      if (_status.qhly_skillTest) {
        _status.qhly_skillTest = false;
        if (event.dialog) event.dialog.remove();
        event.finish();
        return;
      }
      var result = event.result || result;
      if (!result) result = { bool: false };
      event._result = result;
      _status.xinfu_pingcai_finished = true;
      if (event.dialog) event.dialog.remove();
      delete event.pingcai_delayed;
      game.delay(2);
      ("step 3");
      if (result.bool) {
        player.logSkill("th_pcaudio_" + event.cardname);
        event.insert(lib.skill.xinfu_pingcai[event.cardname], {
          player: player,
        });
      }
    },
    subSkill: {
      used: {},
    },
  })
  //没有语音可以在这自己加
  // Object.assign(lib.skill.xinfu_pdgyingshi,{
  //   audio:""
  // })
  lib.skill.pcaudio_wolong_card = {
    audio: "ext:无名美化/audio/skill:true",
  }
  lib.skill.pcaudio_fengchu_card = {
    audio: "ext:无名美化/audio/skill:true",
  }
  lib.skill.pcaudio_shuijing_card = {
    audio: "ext:无名美化/audio/skill:true",
  }
  lib.skill.pcaudio_xuanjian_card = {
    audio: "ext:无名美化/audio/skill:true",
  }
}
