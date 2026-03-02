export function createChukuangWorkerApi(lib, ui, game, _status) {
    return {
        chukuangWorkerApi: {
            _elementIdCounter: 0,
            _followUpdateMap: new Map(),
            _startFollowUpdate: function(worker, elementId, originalParent, canvasId) {
                if (!this._followUpdateMap) this._followUpdateMap = new Map()
                let canvas = document.getElementById(canvasId)
                let updateLoop = () => {
                    if (!this._followUpdateMap.has(elementId)) return
                    try {
                        let parentRect = originalParent.getBoundingClientRect()
                        if (canvas) {
                            let canvasRect = canvas.getBoundingClientRect()
                            let bodySize = decadeUI.get.bodySize()
                            let boundRectInCanvas = {
                                left: parentRect.left - canvasRect.left,
                                top: parentRect.top - canvasRect.top,
                                right: parentRect.right - canvasRect.left,
                                bottom: parentRect.bottom - canvasRect.top,
                                width: parentRect.width,
                                height: parentRect.height,
                                x: parentRect.left - canvasRect.left,
                                y: parentRect.top - canvasRect.top,
                                bottomInBody: bodySize.height - parentRect.bottom,
                                canvasBottomInBody: bodySize.height - canvasRect.bottom
                            }
                            worker.postMessage({
                                message: "UPDATE_ELEMENT_BOUNDS",
                                elementId: elementId,
                                boundRect: boundRectInCanvas
                            })
                        } else {
                            worker.postMessage({
                                message: "UPDATE_ELEMENT_BOUNDS",
                                elementId: elementId,
                                boundRect: parentRect
                            })
                        }
                        requestAnimationFrame(updateLoop)
                    } catch (e) {
                        this._followUpdateMap.delete(elementId)
                    }
                }
                this._followUpdateMap.set(elementId, { element: originalParent, loop: updateLoop })
                requestAnimationFrame(updateLoop)
            },
            create: function () {
                let canvas = document.createElement('canvas')
                canvas.className = 'chukuang-canvas'
                canvas.style = `position: fixed; left: 0px; top: 0px; pointer-events:none; width:100%;height:100%;`
                canvas.height = decadeUI.get.bodySize().height
                canvas.width = decadeUI.get.bodySize().width
                let div = ui.create.div('.chukuang-canvas-wraper', document.body)
                div.appendChild(canvas)
                div.id = 'chukuang-canvas-wraper'
                canvas.id = 'chukuang-canvas'
                if (self.ResizeObserver) {
                    let ro = new ResizeObserver(entries => {
                        for (let entry of entries) {
                            if (skinSwitch.chukuangWorker) {
                                const cr = entry.contentRect
                                skinSwitch.chukuangWorker.postMessage({
                                    message: 'UPDATE',
                                    width: cr.width,
                                    height: cr.height,
                                })
                            }
                        }
                    });
                    ro.observe(document.body);
                }

                let offsetCanvas = canvas.transferControlToOffscreen();
                skinSwitch.chukuangWorker.postMessage({
                    message: 'CREATE',
                    canvas: offsetCanvas,
                    pathPrefix: '../十周年UI/assets/dynamic/',
                    isMobile: skinSwitch.isMobile(),
                    dpr: Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1),
                    isAttackFlipX: lib.config[skinSwitch.configKey.isAttackFlipX]
                }, [offsetCanvas]);
            },
            create2: function () {
                let canvas = document.createElement('canvas')
                canvas.className = 'chukuang-canvas2'
                canvas.style = `position: fixed; left: 0px; top: 0px; pointer-events:none; width:100%;height:100%; z-index: 4;`
                canvas.height = decadeUI.get.bodySize().height
                canvas.width = decadeUI.get.bodySize().width
                let div = ui.create.div('.chukuang-canvas-wraper2', document.body)
                div.style.zIndex = '4'
                div.appendChild(canvas)
                div.id = 'chukuang-canvas-wraper2'
                canvas.id = 'chukuang-canvas2'
                if (self.ResizeObserver) {
                    let ro = new ResizeObserver(entries => {
                        for (let entry of entries) {
                            if (skinSwitch.chukuangWorker2) {
                                const cr = entry.contentRect
                                skinSwitch.chukuangWorker2.postMessage({
                                    message: 'UPDATE',
                                    width: cr.width,
                                    height: cr.height,
                                })
                            }
                        }
                    });
                    ro.observe(document.body);
                }

                let offsetCanvas = canvas.transferControlToOffscreen();
                skinSwitch.chukuangWorker2.postMessage({
                    message: 'CREATE',
                    canvas: offsetCanvas,
                    pathPrefix: '../十周年UI/assets/dynamic/',
                    isMobile: skinSwitch.isMobile(),
                    dpr: Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1),
                    isAttackFlipX: lib.config[skinSwitch.configKey.isAttackFlipX]
                }, [offsetCanvas]);
            },
            preLoad: function (id, skinId, skinPlayer) {
                skinSwitch.chukuangWorker.postMessage({
                    message: 'PRELOAD',
                    player: skinPlayer,
                    id: id,
                    skinId: skinId
                })
            },
            action: function (player, action) {
                let res = skinSwitch.dynamic.checkCanBeAction(player)
                let pp = skinSwitch.getCoordinate(player, true)
                let me = player === game.me
                if (res && res.dynamic) {
                    if (!player.dynamic.renderer.postMessage) {
                        skinSwitchMessage.show({
                            type: 'warning',
                            text: '当前动皮过多',
                            duration: 1500,
                            closeable: false,
                        })
                        clearInterval(_status.texiaoTimer);
                        clearTimeout(_status.texiaoTimer2);
                        return
                    }
                    skinSwitch.chukuangWorkerInit()
                    skinSwitch.chukuangWorker.postMessage({
                        message: 'ACTION',
                        id: player.dynamic.id,
                        action: action,
                        skinId: res.dynamic.id,
                        isDouble: res.isDouble,
                        deputy: res.deputy,
                        needHide: res.needHide,
                        me: me,
                        direction: me ? false : skinSwitch.getDirection(player),
                        player: pp,
                        selfPhase: _status.currentPhase === player
                    })
                } else {
                    player.GongJi = false
                }
                return res
            },
            chukuangAction: function (player, action, extraParams) {
                let dynamic = player.dynamic
                if (!dynamic || (!dynamic.primary && !dynamic.deputy)) {
                    return
                }
                skinSwitch.chukuangWorkerInit()
                skinSwitch.chukuangWorker.postMessage({
                    message: 'isChuKuang',
                    id: dynamic.id,
                    primarySkinId: (!player.isUnseen || !player.isUnseen(0)) && dynamic.primary && dynamic.primary.id,
                    deputySkinId: (!player.isUnseen || !player.isUnseen(1)) && dynamic.deputy && dynamic.deputy.id,
                    action: action,
                    extraParams: extraParams,
                })
            },
            adjust: function (player, posData, action) {
                skinSwitch.chukuangWorkerInit()
                skinSwitch.chukuangWorker.postMessage({
                    message: "ADJUST",
                    id: player.dynamic.id,
                    skinId: player.dynamic.primary.id,
                    action: action,
                    xyPos: posData.xyPos,
                    x: posData.x,
                    y: posData.y,
                    scale: posData.scale,
                    angle: posData.angle
                })
            },
            playEffect: function (sprite, position) {
                skinSwitch.chukuangWorkerInit()
                let originalParent = null
                let elementId = null
                if (position && position.parent) {
                    if (position.parent instanceof Element || position.parent instanceof HTMLElement || position.parent.getBoundingClientRect) {
                        originalParent = position.parent
                        elementId = this._elementIdCounter++
                        position.elementId = elementId
                        let canvas = document.getElementById('chukuang-canvas')
                        let parentRect = position.parent.getBoundingClientRect()

                        if (canvas) {
                            let canvasRect = canvas.getBoundingClientRect()
                            let bodySize = decadeUI.get.bodySize()

                            let boundRectInCanvas = {
                                left: parentRect.left - canvasRect.left,
                                top: parentRect.top - canvasRect.top,
                                right: parentRect.right - canvasRect.left,
                                bottom: parentRect.bottom - canvasRect.top,
                                width: parentRect.width,
                                height: parentRect.height,
                                x: parentRect.left - canvasRect.left,
                                y: parentRect.top - canvasRect.top,
                            }

                            let parentBottomInBody = bodySize.height - parentRect.bottom
                            let canvasBottomInBody = bodySize.height - canvasRect.bottom
                            boundRectInCanvas.bottomInBody = parentBottomInBody
                            boundRectInCanvas.canvasBottomInBody = canvasBottomInBody

                            position.parent = {
                                boundRect: boundRectInCanvas,
                                bodySize: {
                                    bodyWidth: Math.round(canvasRect.width),
                                    bodyHeight: Math.round(canvasRect.height)
                                }
                            }
                        } else {
                            position.parent = {
                                boundRect: parentRect,
                                bodySize: {
                                    bodyWidth: decadeUI.get.bodySize().width,
                                    bodyHeight: decadeUI.get.bodySize().height
                                }
                            }
                        }
                    }
                }
                if (!position) position = {}
                skinSwitch.chukuangWorker.postMessage({
                    message: "PLAY_EFFECT",
                    sprite,
                    position: position,
                })
                if (position.follow && originalParent && elementId !== null) {
                    this._startFollowUpdate(skinSwitch.chukuangWorker, elementId, originalParent, 'chukuang-canvas')
                }
            },
            playEffect2: function (sprite, position) {
                skinSwitch.chukuangWorkerInit2()
                let originalParent = null
                let elementId = null
                if (position && position.parent) {
                    originalParent = position.parent
                    elementId = this._elementIdCounter++
                    position.elementId = elementId
                    let canvas = document.getElementById('chukuang-canvas2')
                    let parentRect = position.parent.getBoundingClientRect()

                    if (canvas) {
                        let canvasRect = canvas.getBoundingClientRect()
                        let bodySize = decadeUI.get.bodySize()

                        let boundRectInCanvas = {
                            left: parentRect.left - canvasRect.left,
                            top: parentRect.top - canvasRect.top,
                            right: parentRect.right - canvasRect.left,
                            bottom: parentRect.bottom - canvasRect.top,
                            width: parentRect.width,
                            height: parentRect.height,
                            x: parentRect.left - canvasRect.left,
                            y: parentRect.top - canvasRect.top,
                        }

                        let parentBottomInBody = bodySize.height - parentRect.bottom
                        let canvasBottomInBody = bodySize.height - canvasRect.bottom
                        boundRectInCanvas.bottomInBody = parentBottomInBody
                        boundRectInCanvas.canvasBottomInBody = canvasBottomInBody

                        position.parent = {
                            boundRect: boundRectInCanvas,
                            bodySize: {
                                bodyWidth: Math.round(canvasRect.width),
                                bodyHeight: Math.round(canvasRect.height)
                            }
                        }
                    } else {
                        position.parent = {
                            boundRect: parentRect,
                            bodySize: {
                                bodyWidth: decadeUI.get.bodySize().width,
                                bodyHeight: decadeUI.get.bodySize().height
                            }
                        }
                    }
                }
                if (!position) position = {}
                skinSwitch.chukuangWorker2.postMessage({
                    message: "PLAY_EFFECT2",
                    sprite,
                    position: position,
                })
                if (position.follow && originalParent && elementId !== null) {
                    this._startFollowUpdate(skinSwitch.chukuangWorker2, elementId, originalParent, 'chukuang-canvas2')
                }
            },
            stopEffect: function (sprite) {
                if (skinSwitch.chukuangWorker) {
                    let spriteData = typeof sprite === 'string' ? { name: sprite } : sprite
                    skinSwitch.chukuangWorker.postMessage({
                        message: "STOP_EFFECT",
                        sprite: spriteData,
                    })
                }
            },
            stopEffect2: function (sprite) {
                if (skinSwitch.chukuangWorker2) {
                    let spriteData = typeof sprite === 'string' ? { name: sprite } : sprite
                    skinSwitch.chukuangWorker2.postMessage({
                        message: "STOP_EFFECT2",
                        sprite: spriteData,
                    })
                }
            },
            clearEffect2: function (sprite) {
                skinSwitch.chukuangWorkerInit2()
                skinSwitch.chukuangWorker2.postMessage({
                    message: "CLEAR_EFFECT2",
                    sprite: sprite,
                })
            },
            clearEffect: function (sprite) {
                skinSwitch.chukuangWorkerInit()
                skinSwitch.chukuangWorker.postMessage({
                    message: "CLEAR_EFFECT",
                    sprite: sprite,
                })
            },
            clearAllEffects2: function () {
                skinSwitch.chukuangWorkerInit2()
                skinSwitch.chukuangWorker2.postMessage({
                    message: "CLEAR_ALL_EFFECTS2"
                })
            },
            clearAllEffects: function () {
                skinSwitch.chukuangWorkerInit()
                skinSwitch.chukuangWorker.postMessage({
                    message: "CLEAR_ALL_EFFECTS"
                })
            },
            loadResources: function (players, skels) {
                skinSwitch.chukuangWorkerInit()
                skinSwitch.chukuangWorker.postMessage({
                    message: "LOAD_RESOURCES",
                    players,
                    skels,
                })
            },
            preloadEffect: function (sprite) {
                skinSwitch.chukuangWorkerInit()
                let spriteData = typeof sprite === 'string' ? { name: sprite } : sprite
                skinSwitch.chukuangWorker.postMessage({
                    message: "LOAD_RESOURCES",
                    players: null,
                    skels: [spriteData]
                })
            },
            preloadEffect2: function (sprite) {
                skinSwitch.chukuangWorkerInit2()
                let spriteData = typeof sprite === 'string' ? { name: sprite } : sprite
                skinSwitch.chukuangWorker2.postMessage({
                    message: "LOAD_RESOURCES",
                    players: null,
                    skels: [spriteData]
                })
            },
            preloadEffects: function (sprites) {
                skinSwitch.chukuangWorkerInit()
                let skels = sprites.map(sprite => typeof sprite === 'string' ? { name: sprite } : sprite)
                skinSwitch.chukuangWorker.postMessage({
                    message: "LOAD_RESOURCES",
                    players: null,
                    skels: skels
                })
            },
            preloadEffects2: function (sprites) {
                skinSwitch.chukuangWorkerInit2()
                let skels = sprites.map(sprite => typeof sprite === 'string' ? { name: sprite } : sprite)
                skinSwitch.chukuangWorker2.postMessage({
                    message: "LOAD_RESOURCES",
                    players: null,
                    skels: skels
                })
            }
        },
        chukuangWorkerOnMessage: {
            init: function () {
                skinSwitch.chukuangWorker.onmessage = e => {
                    let data = e.data
                    switch (data.message) {
                        case "chukuangPrepare":
                            this.chukuangStart(data)
                            break
                        case "recoverDaiJi":
                            this.recoverDaiJi(data)
                            break
                        case 'noActionChuKuang':
                            this.noActionChuKuang(data)
                            break
                    }
                }
            },
            getPlayerById: function (id, isQhlx) {
                for (let p of game.players) {
                    if (p.dynamic && p.dynamic.id === id) {
                        return p
                    }
                }
                let p = document.getElementById('mainView')
                if (p) {
                    let _canvas = p.getElementsByClassName('animation-player')
                    if (_canvas.length) {
                        return _canvas[0].parentNode.parentNode
                    }
                }
                return null
            },
            chukuangStart: function (data) {
                let player = this.getPlayerById(data.id, data.qhlxBigAvatar)
                if (!player || !player.dynamic) return
                let dynamic = player.dynamic
                let avatar = data.isPrimary ? dynamic.primary : dynamic.deputy
                if (!avatar) {
                    return
                }
                if (_status.currentPhase !== player && data.action === 'TeShu' && !avatar.player.shizhounian) {
                    return
                }
                player.dynamic.renderer.postMessage({
                    message: 'hideAllNode',
                    id: dynamic.id,
                    isPrimary: data.isPrimary,
                    skinId: data.skinId
                })
                skinSwitch.rendererOnMessage.addListener(player, 'hideAllNodeEnd', function () {
                    let pp = skinSwitch.getCoordinate(player, true)
                    let me = player === game.me
                    skinSwitch.chukuangWorker.postMessage({
                        id: data.id,
                        skinId: data.skinId,
                        message: 'chukuangStart',
                        action: data.action,
                        me: me,
                        direction: me ? false : skinSwitch.getDirection(player),
                        player: pp,
                    })
                    player.chukuangState = {
                        status: true,
                        action: data.action
                    }

                    if (data.action === 'GongJi' || data.action === 'TeShu') {
                        let playName = avatar.player.name
                        let path = 'extension/十周年UI/assets/dynamic/' + playName + '.mp3'
                        skinSwitch.qhly_checkFileExist(path, exists => {
                            if (exists) {
                                game.playAudio("..", path)
                            } else {
                                game.playAudio("..", "extension", "皮肤切换/audio/effect", playName + ".mp3")
                            }
                        })
                    }
                    if (data.action === 'GongJi') {
                        let playName = avatar.player.name
                        let path = 'extension/十周年UI/assets/dynamic/' + playName + '_1.mp3'
                        skinSwitch.qhly_checkFileExist(path, exists => {
                            if (exists) {
                                game.playAudio("..", path)
                            } else {
                                game.playAudio("..", "extension", "皮肤切换/audio/effect", playName + "_1.mp3")
                            }
                        })
                    }
                    if (data.action === 'TeShu') {
                        let playName = avatar.player.name
                        let path = 'extension/十周年UI/assets/dynamic/' + playName + '_2.mp3'
                        skinSwitch.qhly_checkFileExist(path, exists => {
                            if (exists) {
                                game.playAudio("..", path)
                            } else {
                                game.playAudio("..", "extension", "皮肤切换/audio/effect", playName + "_2.mp3")
                            }
                        })
                    }
                })
            },
            recoverDaiJi: function (data) {
                let player = this.getPlayerById(data.id, data.qhlxBigAvatar)
                if (!player || !player.dynamic) return
                let dynamic = player.dynamic
                player.chukuangState = {
                    status: false,
                }
                if (!dynamic.primary && !dynamic.deputy) {
                    return
                }
                player.dynamic.renderer.postMessage({
                    message: 'recoverDaiJi',
                    id: data.id,
                    skinId: data.skinId,
                })
                player.GongJi = false
            },
            noActionChuKuang: function (data) {
                let player = this.getPlayerById(data.id, data.qhlxBigAvatar)
                if (!player || !player.dynamic) return
                let dynamic = player.dynamic
                if (!dynamic.primary && !dynamic.deputy) {
                    return
                }
                if (data.action === 'GongJi') {
                    if (dynamic.primary && dynamic.primary.player) {
                        let playerP = dynamic.primary.player;
                        if (playerP.gongji && playerP.gongji.ck === false) {
                            return skinSwitch.postMsgApi.action(player, playerP.gongji.action, dynamic.primary)
                        }
                    }
                    if (dynamic.deputy && dynamic.deputy.player) {
                        let playerP = dynamic.deputy.player
                        if (playerP.gongji && playerP.gongji.ck === false) {
                            return skinSwitch.postMsgApi.action(player, playerP.gongji.action, dynamic.deputy)
                        }
                    }
                }
                if (data.action === 'TeShu') {
                    skinSwitch.postMsgApi.actionTeShu(player)
                }
            },
            debugChuKuang: function (data) {
                let player = this.getPlayerById(data.id, data.qhlxBigAvatar)
                if (!player || !player.dynamic) return
                let dynamic = player.dynamic
                let avatar = data.isPrimary ? dynamic.primary : dynamic.deputy
                if (!avatar) {
                    return
                }
                player.dynamic.renderer.postMessage({
                    message: 'hideAllNode',
                    id: dynamic.id,
                })
                skinSwitch.rendererOnMessage.addListener(player, 'hideAllNodeEnd', function () { })
            }
        },
        chukuangWorkerOnMessage2: {
            init: function () {
                skinSwitch.chukuangWorker2.onmessage = e => {
                    let data = e.data
                    switch (data.message) {
                        case "chukuangPrepare":
                            this.chukuangStart(data)
                            break
                        case "recoverDaiJi":
                            this.recoverDaiJi(data)
                            break
                        case 'noActionChuKuang':
                            this.noActionChuKuang(data)
                            break
                    }
                }
            },
            getPlayerById: function (id, isQhlx) {
                for (let p of game.players) {
                    if (p.dynamic && p.dynamic.id === id) {
                        return p
                    }
                }
                let p = document.getElementById('mainView')
                if (p) {
                    let _canvas = p.getElementsByClassName('animation-player')
                    if (_canvas.length) {
                        return _canvas[0].parentNode.parentNode
                    }
                }
                return null
            },
            chukuangStart: function (data) {
                let player = this.getPlayerById(data.id, data.qhlxBigAvatar)
                if (!player || !player.dynamic) return
                let dynamic = player.dynamic
                let avatar = data.isPrimary ? dynamic.primary : dynamic.deputy
                if (!avatar) {
                    return
                }
                if (_status.currentPhase !== player && data.action === 'TeShu' && !avatar.player.shizhounian) {
                    return
                }
                player.dynamic.renderer.postMessage({
                    message: 'hideAllNode',
                    id: dynamic.id,
                    isPrimary: data.isPrimary,
                    skinId: data.skinId
                })
                skinSwitch.rendererOnMessage.addListener(player, 'hideAllNodeEnd', function () {
                    let pp = skinSwitch.getCoordinate(player, true)
                    let me = player === game.me
                    skinSwitch.chukuangWorker2.postMessage({
                        id: data.id,
                        skinId: data.skinId,
                        message: 'chukuangStart',
                        action: data.action,
                        me: me,
                        direction: me ? false : skinSwitch.getDirection(player),
                        player: pp,
                    })
                    player.chukuangState2 = {
                        status: true,
                        action: data.action
                    }

                    if (data.action === 'GongJi' || data.action === 'TeShu') {
                        let playName = avatar.player.name
                        let path = 'extension/十周年UI/assets/dynamic/' + playName + '.mp3'
                        skinSwitch.qhly_checkFileExist(path, exists => {
                            if (exists) {
                                game.playAudio("..", path)
                            } else {
                                game.playAudio("..", "extension", "皮肤切换/audio/effect", playName + ".mp3")
                            }
                        })
                    }
                    if (data.action === 'GongJi') {
                        let playName = avatar.player.name
                        let path = 'extension/十周年UI/assets/dynamic/' + playName + '_1.mp3'
                        skinSwitch.qhly_checkFileExist(path, exists => {
                            if (exists) {
                                game.playAudio("..", path)
                            } else {
                                game.playAudio("..", "extension", "皮肤切换/audio/effect", playName + "_1.mp3")
                            }
                        })
                    }
                    if (data.action === 'TeShu') {
                        let playName = avatar.player.name
                        let path = 'extension/十周年UI/assets/dynamic/' + playName + '_2.mp3'
                        skinSwitch.qhly_checkFileExist(path, exists => {
                            if (exists) {
                                game.playAudio("..", path)
                            } else {
                                game.playAudio("..", "extension", "皮肤切换/audio/effect", playName + "_2.mp3")
                            }
                        })
                    }
                })
            },
            recoverDaiJi: function (data) {
                let player = this.getPlayerById(data.id, data.qhlxBigAvatar)
                if (!player || !player.dynamic) return
                let dynamic = player.dynamic
                player.chukuangState2 = {
                    status: false,
                }
                if (!dynamic.primary && !dynamic.deputy) {
                    return
                }
                player.dynamic.renderer.postMessage({
                    message: 'recoverDaiJi',
                    id: data.id,
                    skinId: data.skinId,
                })
                player.GongJi2 = false
            },
            noActionChuKuang: function (data) {
                let player = this.getPlayerById(data.id, data.qhlxBigAvatar)
                if (!player || !player.dynamic) return
                let dynamic = player.dynamic
                if (!dynamic.primary && !dynamic.deputy) {
                    return
                }
                if (data.action === 'GongJi') {
                    if (dynamic.primary && dynamic.primary.player) {
                        let playerP = dynamic.primary.player;
                        if (playerP.gongji && playerP.gongji.ck === false) {
                            return skinSwitch.postMsgApi.action(player, playerP.gongji.action, dynamic.primary)
                        }
                    }
                    if (dynamic.deputy && dynamic.deputy.player) {
                        let playerP = dynamic.deputy.player
                        if (playerP.gongji && playerP.gongji.ck === false) {
                            return skinSwitch.postMsgApi.action(player, playerP.gongji.action, dynamic.deputy)
                        }
                    }
                }
                if (data.action === 'TeShu') {
                    skinSwitch.postMsgApi.actionTeShu(player)
                }
            },
            debugChuKuang: function (data) {
                let player = this.getPlayerById(data.id, data.qhlxBigAvatar)
                if (!player || !player.dynamic) return
                let dynamic = player.dynamic
                let avatar = data.isPrimary ? dynamic.primary : dynamic.deputy
                if (!avatar) {
                    return
                }
                player.dynamic.renderer.postMessage({
                    message: 'hideAllNode',
                    id: dynamic.id,
                })
                skinSwitch.rendererOnMessage.addListener(player, 'hideAllNodeEnd', function () { })
            }
        },
        chukuangWorker: null,
        chukuangWorker2: null,
        chukuangWorkerInit: function () {
            if (!skinSwitch.chukuangWorker) {
                skinSwitch.chukuangWorker = new Worker(skinSwitch.url + 'chukuangWorker.js')
                skinSwitch.chukuangWorkerApi.create()
                skinSwitch.chukuangWorkerOnMessage.init()
            }
        },
        chukuangWorkerInit2: function () {
            if (!skinSwitch.chukuangWorker2) {
                skinSwitch.chukuangWorker2 = new Worker(skinSwitch.url + 'chukuangWorker.js')
                skinSwitch.chukuangWorkerApi.create2()
                skinSwitch.chukuangWorkerOnMessage2.init()
            }
        }
    };
}

