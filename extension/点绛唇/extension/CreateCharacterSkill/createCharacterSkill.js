    import {lib,game,ui,get,ai,_status} from '../../../../noname.js'
    import {characterData} from '../../character/characterData.js'
    import {characterSubstitute} from '../../character/characterSubstitute.js'
    
    lib.init.css(lib.assetURL + 'extension/点绛唇/extension/CreateCharacterSkill', 'createCharacterSkill');
    
    game.createCharacterSkill=function(character) { //简略信息（技能，分包）
        let allPackList = lib.config.all.characters.slice(0);
	    allPackList.addArray(Object.keys(lib.characterPack));
        var node = ui.create.div('.popup-container', ui.window, function(e) {
            node.delete();
            node = null;
        });
        let nodeBg = ui.create.div('.skillsDialog', node);
        var leftPane = ui.create.div('.left', nodeBg);
        var rightPane = ui.create.div('.right', nodeBg);
        var group;
        if (lib.character[character]) group = lib.character[character].group;
        else {
            for (let name of allPackList) { //每个武将包
                if (lib.characterPack[name][character]) group = lib.characterPack[name][character].group;
            }
        };
        let groupImg=new Image();
	    groupImg.src=lib.assetURL + 'extension/点绛唇/extension/CreateCharacterSkill/image/' + group + '.png';
	    groupImg.onload = function() {
            nodeBg.style.backgroundImage='url("'+groupImg.src+'")'
        };
        groupImg.onerror = function() {
            nodeBg.style.backgroundImage = 'url("' + lib.assetURL + 'extension/点绛唇/extension/CreateCharacterSkill/image/default.png'; + '")';
        };
        var image = ui.create.div('.charImage', nodeBg);
        if(characterData[character]){
            image.setBackgroundImage('extension/点绛唇/image/character/lihui/'+character+'.jpg');
            image.style.webkitMask='none';
            image.style.backgroundRepeat='none';
            if(characterSubstitute[character]){
                var skins='_shadow';
                const skinChange=ui.create.div('.skinChange',nodeBg,function(e){
                    e.stopPropagation();
                    image.setBackgroundImage('extension/点绛唇/image/character/lihui/'+character+skins+'.jpg');
                    skinChange.setBackgroundImage('extension/点绛唇/extension/CreateCharacterSkill/image/skin'+skins+'.png');
                    skins=skins=='_shadow'?'':'_shadow';
                });
            };
        }else{
            game.getFileList('image/lihui', function(folders, files) {
                if(files.includes(character+'.jpg')){
                    image.setBackgroundImage('image/lihui/'+character+'.jpg');
                    image.style.webkitMask='none';
                    image.style.backgroundRepeat='none';
                }else image.setBackground(character, 'character');
            },function(){
                image.setBackground(character, 'character');
            });
        };
        const name = get.slimName(character);

        var rarity = game.getRarity(character);
        if (!rarity) rarity = 'junk';
        var pe = ui.create.div('.skinType', nodeBg);
        var url = lib.assetURL + 'extension/点绛唇/image/level/pe_' + rarity + '.png';
        pe.style.backgroundImage = 'url("' + url + '")';
        let value = '';
        let value2 = lib.config.skin[character]&&lib.config.skin[character][0]?lib.config.skin[character][0].slice(0, -4):'经典形象';
        value += value2 + '*' + name;
        var skintype = ui.create.div('.skinTypeText', value);
        pe.appendChild(skintype);
        //武将姓名
        var namestyle = ui.create.div('.name', name, nodeBg);
        namestyle.dataset.camp = group;
        //等阶图标
        var head = ui.create.node('img');
        head.src = lib.assetURL + 'extension/点绛唇/image/level/rarity_' + rarity + '.png';
        head.style.cssText = 'display:inline-block;width:61.6px;height:53.2px;top:-13px; position:absolute;background-color: transparent;z-index:1;margin-left:5px;';
        namestyle.appendChild(head);
        //分包
        var getPack = function(name) {
            const pack = Object.keys(lib.characterPack).find(pack => lib.characterPack[pack][name]);
            if (pack) {
                if (lib.characterSort[pack]) {
                    const sort = Object.keys(lib.characterSort[pack]).find(sort => lib.characterSort[pack][sort].includes(name));
                    if (sort) return lib.translate[sort];
                }
                return lib.translate[pack + '_character_config'] || lib.translate[pack];
            }
            return '暂无分包';
        };
        ui.create.div('.pack', getPack(character), nodeBg);
        leftPane.innerHTML = '<div></div>';
        rightPane.innerHTML = '<div></div>';
        let skillBg=ui.create.div('.skillBg',rightPane);
        lib.setScroll(rightPane.firstChild);
        let oSkills=[];
        if (lib.character[character]) oSkills = lib.character[character].skills;
        else {
            for (let name of allPackList) { //每个武将包
                if (lib.characterPack[name][character]) oSkills = lib.characterPack[name][character].skills;
            }
        };
        if (oSkills.length) {
            let bool=false;
            oSkills.forEach(function(skill) {
                var translation = lib.translate[skill];
                if (translation && lib.translate[skill + '_info'] && translation != '' && lib.translate[skill + '_info'] != '') {
                    ui.create.div('.xskill', '<div data-color>' + translation + '</div>' + '<div>' + get.skillInfoTranslation(skill) + '</div>', skillBg);
                };
                if(get.info(skill).derivation)bool=true;
            });
            if(bool){
                const yanshengBg=ui.create.div('.yanshengBg',nodeBg);
                yanshengBg.innerHTML = '<div></div>';
                ui.create.div('.yanshengName','衍生技',yanshengBg);
                const skillsBg=ui.create.div('.skillsBg',yanshengBg);
                function createYanshengSkill(skill){
                    ui.create.div('.xskill', '<div data-color>' + get.translation(skill) + '</div>' + '<div>' + get.skillInfoTranslation(skill) + '</div>', skillsBg);
                //衍生技添加，先摆
                };
                for(let name of oSkills){
	                let info =get.info(name);
	                if (info.derivation) {
						if (Array.isArray(info.derivation)) {
							for (let skill of info.derivation) {
								createYanshengSkill(skill);
							}
						} else {
							createYanshengSkill(info.derivation);
						}
					}
	            }
            }
        }
        return node;
    };