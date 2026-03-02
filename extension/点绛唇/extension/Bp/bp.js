import { lib, game, ui, get, ai, _status } from '../../../../noname.js'

lib.init.css(lib.assetURL + 'extension/点绛唇/extension/Bp', 'bp');

get.bpCharacter = function (bool, extension, plan, flag) {
	let characters = [];
	let allPackList = lib.config.all.characters.slice(0);
	let libcharacter = flag ? lib._cust_character : lib.character
	let libcharacterPack = flag ? lib._cust_characterPack : lib.characterPack
	allPackList.addArray(Object.keys(libcharacterPack));

	if (!extension || extension == '全部武将') {
		for (let packName of allPackList) {
			if (libcharacterPack[packName]) {
				for (let character in libcharacterPack[packName]) {
					if (!libcharacter[character]) continue;
					if (libcharacter[character].isUnseen) continue;
					const target = plan ? plan : lib.config['extension_点绛唇_plans_' + lib.config['extension_点绛唇_modePlans_' + lib.config.mode]];
					if (!lib.config[lib.config.mode + '_banned']) game.saveConfig(lib.config.mode + '_banned', []);
					if (!lib.config[lib.config.mode + '_banned']) game.saveConfig(lib.config.mode + '_banned', []);
					if (!bool && (lib.config[lib.config.mode + '_banned'].includes(character) || target.includes(character))) continue;
					characters.push(character);
				};
			};
		};
	} else {
		for (let character in libcharacterPack[extension]) {
			if (libcharacter[character] && libcharacter[character][4] && libcharacter[character][4].includes('unseen')) continue;
			const target = plan ? plan : lib.config['extension_点绛唇_plans_' + lib.config['extension_点绛唇_modePlans_' + lib.config.mode]];
			if (!lib.config[lib.config.mode + '_banned']) game.saveConfig(lib.config.mode + '_banned', []);
			if (!bool && (lib.config[lib.config.mode + '_banned'].includes(character) || target.includes(character))) continue;
			characters.push(character);
		};
	};
	return characters;
};

game.saveBpConfig = function () {//保存禁将设置
	game.saveConfig('forbidai_user', lib.config['extension_点绛唇_plans_仅点将可用']);
	for (let mode of lib.config.all.mode) {
		game.saveConfig('connect_' + mode + '_banned', lib.config['extension_点绛唇_plans_' + lib.config['extension_点绛唇_modePlans_connect']]);
		game.saveConfig(mode + '_banned', lib.config['extension_点绛唇_plans_' + lib.config['extension_点绛唇_modePlans_' + mode]]);
	}
};

game.bpInit = function () {//初始化
	let plans = ['方案一', '仅点将可用', 'AI禁用'];
	game.saveConfig('extension_点绛唇_plans', plans);
	for (let name of plans) {
		game.saveConfig('extension_点绛唇_plans_' + name, []);
	};
	const url = 'extension/点绛唇/extension/Bp/files';
	for (let mode of lib.config.all.mode) {
		if (!lib.config[mode + '_banned']) game.saveConfig(mode + '_banned', []);
		if (!lib.config['connect_' + mode + '_banned']) game.saveConfig('connect_' + mode + '_banned', []);
		const single = `['` + lib.config[mode + '_banned'].join("','") + `']`;
		const online = `['` + lib.config['connect_' + mode + '_banned'].join("','") + `']`;
		game.writeFile(single, url, lib.config.connect_nickname + '的单机' + lib.translate[mode] + '模式禁将.js', () => { });
		game.writeFile(online, url, lib.config.connect_nickname + '的联机' + lib.translate[mode] + '模式禁将.js', () => { });
		game.saveConfig('extension_点绛唇_modePlans_' + mode, plans[0]);
	};
	const only = `['` + lib.config.forbidai_user.join("','") + `']`;
	game.writeFile(only, url, lib.config.connect_nickname + '的仅点将可用设置.js', () => { });
	alert('初始化完成，原始禁将数据已保存，可在点绛唇扩展禁将界面导入对应数据');
};

game.openBpDialog = function (flag = false) {//打开禁将菜单


	// console.log('打开点绛唇禁将菜单imported.character', lib.imported.character);
	// console.log('打开点绛唇禁将菜单lib.character', lib.character);
	// console.log('打开点绛唇禁将菜单characterPack', lib.characterPack);
	// console.log('打开点绛唇禁将菜单translate', lib.translate);
	// console.log('打开点绛唇禁将菜单lib.config.characters', lib.config.characters);


	
	let libcharacter = flag ? lib._cust_character : lib.character
	let libcharacterPack = flag ? lib._cust_characterPack : lib.characterPack
	let libtranslate = flag ? lib._cust_translate : lib.translate

	// if (!ui.window) {
	// 	ui.window = document.body;
	// }
	// if (!ui.menuContainer) {
	// 	ui.menuContainer = ui.create.div('', ui.window);
	// }
	// if (!ui.arena) {
	// 	ui.arena = ui.create.div('', ui.window);
	// }
	// if (!ui.system) {
	// 	ui.system = ui.create.div('', ui.window);
	// }



	let allPackList = lib.config.all.characters.slice(0);
	allPackList.addArray(Object.keys(libcharacterPack));

	let defaultPack = '全部武将';
	for (let packName of allPackList) {
		if (packName && lib.config.characters && lib.config.characters.includes(packName)) {
			defaultPack = packName;
			break;
		};
	}

	_status.bpPlanClick = lib.config['extension_点绛唇_modePlans_' + lib.config.mode];
	_status.bpCharacters = get.bpCharacter(true, defaultPack, _status.bpPlanClick, flag);
	_status.bpPackClick = defaultPack;

	game.pause2();

	const bpBg = ui.create.div(document.body, '.bpBg'); //整个页面的大背景

	const bpDialog = ui.create.div('.bpDialogHide', bpBg); //禁将框（不显示），直接调节整个面板的大小位置

	const bpJiangchiBg = ui.create.div('.bpJiangchiBg', bpDialog); //左侧将池底图
	const bpClose = ui.create.div('.bpClose', bpJiangchiBg, function (event) { //关闭按钮
		bpBg.remove();
		game.resume2();
	});

	let shuru = null;
	const bpSousuo = ui.create.div('.bpSousuo', bpJiangchiBg, function (event) { //搜索按钮
		event.stopPropagation();
		if (!shuru) {
			shuru = document.createElement('input');
			shuru.type = 'text';
			shuru.className = 'bpSousuoInput';
			shuru.placeholder = '';
			if (ui.window) {
				ui.window.appendChild(shuru);
			} else {
				document.body.appendChild(shuru);
			}

			const closeInput = function (e) {
				if (!shuru.contains(e.target) && e.target !== bpSousuo) {
					shuru.style.display = 'none';
					document.removeEventListener('click', closeInput);
				}
			};
			setTimeout(() => document.addEventListener('click', closeInput), 100);
		}
		shuru.style.display = 'block';
		shuru.focus();
	});

	document.addEventListener('keydown', function (event) {
		if (shuru && shuru.style.display === 'block' && event.key === 'Enter') {
			let inputValue = shuru.value.trim();
			if (inputValue) charUpdate(false, inputValue)
			shuru.value = '';
			shuru.style.display = 'none';
		};
	});

	const bpChoosePackBg = ui.create.div('.bpChoosePackBg', bpJiangchiBg); //选项的背景图

	const length = ui.create.div('.bpCharacterPackLength', '禁用武将数量:' + get.bpCharacter(false, false, _status.bpPlanClick, flag).length + '/' + get.bpCharacter(true, false, _status.bpPlanClick, flag).length, bpJiangchiBg);

	function packUpdate() { //武将包初始化
		bpChoosePackBg.innerHTML = '';
		let hasActive = false;
		const currentPack = _status.bpPackClick;

		if (currentPack && currentPack !== '全部武将') {
			if (!lib.config.characters.includes(currentPack)) {
				_status.bpPackClick = '全部武将';
			}
		}

		//全部武将
		const bpAllPack = ui.create.div('.bpCharacterPack', '全部武将', bpChoosePackBg, function (event) {
			if (_status.bpPackClick == '全部武将') {
				charUpdate(_status.bpCharacters, false, _status.bpPackClick);
				return;
			}
			const allPacks = bpChoosePackBg.querySelectorAll('.bpCharacterPack');
			allPacks.forEach(pack => pack.classList.remove('active'));
			_status.bpPackClick = '全部武将';
			_status.bpCharacters = get.bpCharacter(true, false, _status.bpPlanClick, flag);
			charUpdate(_status.bpCharacters, false, _status.bpPackClick);
			bpAllPack.classList.add('active');
		});

		// 初始化默认激活状态
		if (!currentPack || currentPack === '全部武将') {
			bpAllPack.classList.add('active');
			hasActive = true;
		}
		for (let name of allPackList) {
			const packName = lib.translate[name + '_character_config'] ? lib.translate[name + '_character_config'] : name;
			const pack = ui.create.div('.bpCharacterPack', packName, bpChoosePackBg);

			// 状态初始化
			if (name === currentPack && lib.config.characters.includes(name)) {
				pack.classList.add('active');
				hasActive = true;
			}

			if (!lib.config.characters.includes(name)) {
				pack.style.opacity = '0.5';
			}
			// 其他武将包
			let clickTimeout = null;

			pack.addEventListener('click', function (e) {
				if (clickTimeout) {
					clearTimeout(clickTimeout); // 如果已经设置了单击延时，则取消它
				}

				clickTimeout = setTimeout(() => {
					if (_status.bpPackClick == name) {
						charUpdate(_status.bpCharacters, false, _status.bpPackClick);
						return;
					}
					// 这里是单击事件的逻辑
					if (!lib.config.characters.includes(name)) {
						if (confirm('武将包：' + packName + ' 未开启，是否开启？')) {
							lib.config.characters.add(name);
							game.saveConfig('characters', lib.config.characters);
							_status.bpPackClick = name;
							_status.bpCharacters = get.bpCharacter(true, name, _status.bpPlanClick, flag);
							charUpdate(_status.bpCharacters, false, _status.bpPackClick);
							packUpdate();
						}
						return;
					}

					const allPacks = bpChoosePackBg.querySelectorAll('.bpCharacterPack');
					allPacks.forEach(p => p.classList.remove('active'));

					if (_status.bpPackClick === name) {
						_status.bpPackClick = '全部武将';
						bpAllPack.classList.add('active');
					} else {
						_status.bpPackClick = name;
						pack.classList.add('active');
					}

					_status.bpCharacters = get.bpCharacter(true, name, _status.bpPlanClick, flag);
					charUpdate(_status.bpCharacters, false, _status.bpPackClick);
				}, 200); // 设置200毫秒的延迟，根据实际情况可以调整
			});

			// 双击事件处理
			pack.addEventListener('dblclick', function (e) {
				if (clickTimeout) {
					clearTimeout(clickTimeout); // 如果存在单击延时，则取消它
				}
				// 这里是双击事件的逻辑
				if (lib.config.characters.includes(name)) {
					if (confirm('确定要关闭武将包：' + packName + ' 吗？')) {
						lib.config.characters.remove(name);
						game.saveConfig('characters', lib.config.characters);

						// 如果关闭的是当前选中包
						if (_status.bpPackClick === name) {
							_status.bpPackClick = '全部武将';
							bpAllPack.classList.add('active');
							_status.bpCharacters = get.bpCharacter(true, false, _status.bpPlanClick, flag);
							charUpdate(_status.bpCharacters, false, _status.bpPackClick);
						}

						packUpdate();
					}
				}
			});
		}

		// 兜底逻辑：确保至少有一个激活项
		if (!hasActive) {
			_status.bpPackClick = '全部武将';
			bpAllPack.classList.add('active');
			_status.bpCharacters = get.bpCharacter(true, false, _status.bpPlanClick, flag);
			charUpdate(_status.bpCharacters, false, _status.bpPackClick);
		}
	}

	packUpdate();

	//武将范围底图，这个会调整所有武将的选区
	const bpChooseCharacterBg = ui.create.div('.bpChooseCharacterBg', bpJiangchiBg);

	
	//为选将池添加武将的函数
	function addChar(character) {
		let rank = {
			junk: 2,
			common: 4,
			rare: 6,
			epic: 8,
			legend: 10,
		};
		// 每个武将的边框
		const characterBiankuang = ui.create.div('.bpCharacterBiankuang', bpChooseCharacterBg);



		// 武将星级数字
		if (!flag) {
			// 星星
			const bpStart = ui.create.div('.bpStart', characterBiankuang);
			const num = ui.create.div('.startText', bpStart);
			num.innerHTML = rank[game.getRarity(character)];
		}

		// 初始化禁用底图
		const target = _status.bpPlanClick;
		const active = ui.create.div('.bpActive', characterBiankuang);
		if (!lib.config['extension_点绛唇_plans_' + target].includes(character)) {
			active.classList.remove('bpActive');
		}

		// 武将底图
		const characterImage = ui.create.div('.bpCharacterImage', characterBiankuang);

		// 武将名
		let name = get.slimName(character);
		if (flag) {
			// name
			name = lib._cust_translate[character]
		}


		const bpCharacterName = ui.create.div('.bpCharacterName', name, characterBiankuang);

		// 武将图懒加载
		characterImage.dataset.char = character;
		characterImage.style.minHeight = '80px';
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.setBackground(entry.target.dataset.char, 'character');
					observer.unobserve(entry.target);
				}
			});
		}, {
			rootMargin: '200px'
		});
		observer.observe(characterImage);

		// 点击事件处理逻辑
		let longPressTimeout = null;
		let shouldPreventClick = false;
		const longPressTime = 600;
		let lastTap = 0;
		const doubleTapDelay = 200; //双击延迟
		let tapTimeout = null;

		// 通用点击处理函数
		const handleClick = (e) => {
			console.log('点击事件触发',character);
			if (shouldPreventClick) {
				shouldPreventClick = false;
				return;
			}
			if ('button' in e && e.button !== 0) return;

			const characterList = lib.config['extension_点绛唇_plans_' + target];
			if (!characterList.includes(character)) {
				characterList.add(character);
				active.classList.add('bpActive');
			} else {
				characterList.remove(character);
				active.classList.remove('bpActive');
			}
			game.saveConfig('extension_点绛唇_plans_' + target, characterList);

			let num = 0;
			const banCharacters = lib.config['extension_点绛唇_plans_' + _status.bpPlanClick];
			for (let char of _status.bpCharacters) {
				if (banCharacters.includes(char)) num++;
			}
			const str = num == _status.bpCharacters.length ? '<span style="color:red;">' + num + '</span>' : num;
			length.innerHTML = '禁用武将数量:' + str + '/' + _status.bpCharacters.length;
			game.saveBpConfig();
		};

		// 电脑端事件处理
		if (!('ontouchstart' in window)) {
			let hoverTimeout;
			let popupHovering = false;
			let skillBgHovering = false;
			var skillBg = null;
			// 鼠标悬停
			// characterImage.addEventListener('mouseenter', () => {
			//     clearTimeout(hoverTimeout);
			//     hoverTimeout = setTimeout(() => {
			//         if (skillBg) skillBg.delete();

			//         skillBg=game.createCharacterSkill(character);

			//         if (!skillBg || !_status.skilldialog) return;

			//         skillBgHovering = false;
			//         popupHovering = false;
			//         skillBg.addEventListener('mouseenter', () => {
			//             skillBgHovering = true;
			//         });

			//         skillBg.addEventListener('mouseleave', (e) => {
			//             skillBgHovering = false;
			//             checkPopupClose();
			//         });

			//         _status.skilldialog.addEventListener('mouseenter', () => {
			//             popupHovering = true;
			//         });

			//         _status.skilldialog.addEventListener('mouseleave', (e) => {
			//             popupHovering = false;
			//             checkPopupClose();
			//         });

			//         function checkPopupClose() {
			//             setTimeout(() => {
			//                 if (!popupHovering && !skillBgHovering && skillBg) {
			//                     skillBg.delete();
			//                     skillBg = null;
			//                 }
			//             }, 100);
			//         }
			//     }, 1000); // 800ms后显示技能弹窗
			// });

			// 鼠标离开
			// characterImage.addEventListener('mouseleave', (e) => {
			//     clearTimeout(hoverTimeout);
			//     checkPopupClose();
			// });

			// 鼠标右键
			characterImage.addEventListener('contextmenu', function (e) {
				e.preventDefault();
				if (skillBg) {
					skillBg.delete();
					skillBg = null;
				}
				if (flag) {
					lib._yjcm_wj_preview(character, characterImage);
					return
				}
				window.zyile_charactercard ?
					window.zyile_charactercard(character, characterImage, false) :
					ui.click.charactercard(character, characterImage, lib.config.mode == 'guozhan' ? 'guozhan' : true);
			});

			// 鼠标左键
			characterImage.addEventListener('click', function (e) {
				if (skillBg && skillBg.contains(e.target)) {
					return;
				}
				clearTimeout(hoverTimeout);
				handleClick(e);
			});

			// 防止事件冒泡
			characterImage.addEventListener('mousedown', (e) => {
				if (e.button === 0) {
					// 左键点击时暂时禁用悬停
					clearTimeout(hoverTimeout);
				}
			});

			// 统一的弹窗关闭检查
			function checkPopupClose() {
				setTimeout(() => {
					if (skillBg && !skillBgHovering && !popupHovering) {
						skillBg.delete();
						skillBg = null;
					}
				}, 200);
			}
		}
		// 移动端逻辑
		else {
			let tapCount = 0;
			let tapTimeout = null;
			let startX = 0;
			let startY = 0;
			let isScrolling = false;

			//长按
			characterImage.addEventListener('touchstart', (e) => {
				const touch = e.touches[0];
				startX = touch.clientX;
				startY = touch.clientY;
				isScrolling = false;

				// 开始长按计时
				longPressTimeout = setTimeout(() => {
					if (flag) {
						lib._yjcm_wj_preview(character, characterImage);
					} else {
						var skillBg = game.createCharacterSkill(character);
					}
					shouldPreventClick = true;
					tapCount = 0; // 长按后重置点击计数
				}, longPressTime);
			});

			characterImage.addEventListener('touchmove', (e) => {
				if (!isScrolling) {
					const touch = e.touches[0];
					const deltaX = Math.abs(touch.clientX - startX);
					const deltaY = Math.abs(touch.clientY - startY);

					if (deltaX > 10 || deltaY > 10) {
						isScrolling = true;
						clearTimeout(longPressTimeout); // 取消长按计时
						longPressTimeout = null;
						shouldPreventClick = true; // 阻止点击事件
					}
				}
			});

			characterImage.addEventListener('touchend', (e) => {
				// 清除长按计时
				clearTimeout(longPressTimeout);
				longPressTimeout = null;

				if (isScrolling) {
					shouldPreventClick = true;
					tapCount = 0; // 重置点击计数
					clearTimeout(tapTimeout);
					return;
				}

				// 如果不是长按，处理点击
				if (!shouldPreventClick) {
					tapCount++;
					if (tapCount === 1) {
						// 第一次点击，设置定时器等待第二次点击
						tapTimeout = setTimeout(() => {
							handleClick(e);
							tapCount = 0;
						}, doubleTapDelay);
					} else if (tapCount === 2) {
						// 第二次点击，执行双击
						clearTimeout(tapTimeout);
						if (flag) {
							lib._yjcm_wj_preview(character, characterImage);

						} else {
							window.zyile_charactercard ? window.zyile_charactercard(character, characterImage, false) : ui.click.charactercard(character, characterImage, lib.config.mode == 'guozhan' ? 'guozhan' : true);
						}
						tapCount = 0;
					}
				}
				shouldPreventClick = false;
				isScrolling = false;
			});

			characterImage.addEventListener('touchcancel', () => {
				clearTimeout(longPressTimeout);
				clearTimeout(tapTimeout);
				longPressTimeout = null;
				tapCount = 0;
				shouldPreventClick = false;
				isScrolling = false;
			});
		}

		// 通用防误触处理
		characterImage.addEventListener('mousedown', (e) => {
			if (e.button === 0) shouldPreventClick = false;
		});
	}

	function charUpdate(characters, name, clickd, isAwait) { //初始化左侧菜单栏目禁将内容的函数（核心）
		if (clickd && !lib.config.characters.includes(clickd)) {
			clickd = '全部武将';
			_status.bpPackClick = clickd;
		}

		if (!isAwait) bpChooseCharacterBg.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
		bpChooseCharacterBg.innerHTML = '';
		let num = 0;
		let maxNum = 0;
		const characterList = lib.config['extension_点绛唇_plans_' + _status.bpPlanClick];
		let bancharacters = [];
		let unbancharacters = [];
		if (name) {
			let characters = [];
			for (let character in libcharacter) {
				if (libcharacter[character] && libcharacter[character][4] && libcharacter[character][4].includes('unseen')) continue;
				if (libtranslate[character] && libtranslate[character].includes(name) || character.includes(name)) {
					if (characterList.includes(character)) {
						num++;
						bancharacters.push(character);
					} else unbancharacters.push(character);
					maxNum++;
					characters.add(character);
					if (isAwait) addChar(character);
				}
			}
			_status.bpCharacters = characters;
		} else if (characters) {
			for (let character of characters) {
				if (characterList.includes(character)) {
					num++;
					bancharacters.push(character);
				} else unbancharacters.push(character);
				maxNum++;
				if (isAwait) addChar(character);
			}
			_status.bpCharacters = characters;
		}
		if (!isAwait) {
			for (let character of unbancharacters) {
				addChar(character);
			}
			for (let character of bancharacters) {
				addChar(character);
			}
		}
		const str = num == maxNum ? '<span style="color:red;">' + num + '</span>' : num;
		length.innerHTML = '禁用武将数量:' + str + '/' + maxNum;
		if (clickd) _status.bpPackClick = clickd;
		game.saveBpConfig();
	}

	const bpPlansBg = ui.create.div('.bpPlansBg', bpDialog); //右侧方案底图
	const bpPlans = ui.create.div('.bpPlans', bpPlansBg); //方案按钮的内容总体位置（滚动条）

	function removeActiveFromClass() {
		const plans = bpPlans.querySelectorAll('.bpPlan');
		plans.forEach(plan => plan.classList.remove('active'));
		const texts = bpPlans.querySelectorAll('.bpPlanText');
		texts.forEach(text => text.classList.remove('active'));
	}

	function planUpdate() { //初始化右侧方案按钮的函数（非常重要）
		if (bpPlans) bpPlans.innerHTML = '';
		const regularPlans = [];
		const specialPlans = [];
		for (let plan of lib.config.extension_点绛唇_plans) {
			if (['仅点将可用', 'AI禁用'].includes(plan)) {
				specialPlans.push(plan);
			} else {
				regularPlans.push(plan);
			}
		}
		for (let plan of regularPlans) {
			createPlanNode(plan);
		}
		for (let plan of specialPlans) {
			createPlanNode(plan);
		}

		// 新建方案部分
		let newPlanInput = null;
		const newPlan = ui.create.div('.bpPlan', bpPlans);
		ui.create.div('.bpPlanText.active', '新建方案', newPlan);
		newPlan.addEventListener('click', function (event) {
			event.stopPropagation();
			if (!newPlanInput) {
				newPlanInput = document.createElement('input');
				newPlanInput.type = 'text';
				newPlanInput.className = 'bpSousuoInput';
				const num = lib.config.extension_点绛唇_plans.filter(i => !['仅点将可用', 'AI禁用'].includes(i)).length + 1;
				const str = num == 2 ? '二' : get.cnNumber(num);
				newPlanInput.value = '方案' + str;
				newPlanInput.placeholder = '方案' + str;
				if (ui.window) {
					ui.window.appendChild(newPlanInput);
				} else {
					document.body.appendChild(newPlanInput);
				}


				// 添加点击外部关闭的处理
				const closeInput = function (e) {
					if (!newPlanInput.contains(e.target) && e.target !== newPlan) {
						newPlanInput.style.display = 'none';
						document.removeEventListener('click', closeInput);
					}
				};
				setTimeout(() => document.addEventListener('click', closeInput), 100);
			}
			newPlanInput.style.display = 'block';
			newPlanInput.focus();
		});
		document.addEventListener('keydown', function (event) {
			if (newPlanInput && newPlanInput.style.display === 'block' && event.key === 'Enter') {
				let inputValue = newPlanInput.value.trim();
				if (inputValue && !lib.config['extension_点绛唇_plans'].includes(inputValue)) {
					lib.config.extension_点绛唇_plans.add(inputValue);
					game.saveConfig('extension_点绛唇_plans', lib.config.extension_点绛唇_plans);
					lib.config['extension_点绛唇_plans_' + inputValue] = [];
					game.saveConfig('extension_点绛唇_plans_' + inputValue, []);
					_status.bpPlanClick = inputValue;
					charUpdate(_status.bpCharacters, false, _status.bpPackClick);
					planUpdate();
				};
				newPlanInput.value = '';
				newPlanInput.style.display = 'none';
			};
		});

		function removePlanUpdate() { //初始化删除方案面板函数
			const planBg = ui.create.div(document.body, '.planBg', function (event) {
				if (event.target === planBg) planBg.delete();
			});
			const planChooseBg = ui.create.div('.planChooseBg', planBg);
			ui.create.div('.text', '选择你要删除的方案', planChooseBg);
			const removePlanBg = ui.create.div('.planBigBg', planChooseBg);
			for (let plan of lib.config['extension_点绛唇_plans']) {
				if (['仅点将可用', 'AI禁用'].includes(plan)) continue;
				const node = ui.create.div('.planBtn', removePlanBg, function (event) {
					if (lib.config.extension_点绛唇_plans.filter(i => !['仅点将可用', 'AI禁用'].includes(i)).length <= 1) {
						alert('至少保留一个方案');
						return;
					};
					if (confirm('是否删除方案：' + plan)) {
						lib.config.extension_点绛唇_plans.remove(plan);
						game.saveConfig('extension_点绛唇_plans', lib.config.extension_点绛唇_plans);
						if (plan == _status.bpPlanClick) _status.bpPlanClick = lib.config.extension_点绛唇_plans[0];
						for (let mode of lib.config.all.mode) {
							if (lib.config['extension_点绛唇_modePlans_' + mode] == plan) game.saveConfig('extension_点绛唇_modePlans_' + mode, lib.config.extension_点绛唇_plans[0]);
						};
						game.saveConfig('extension_点绛唇_plans_' + plan, []);
						removePlanUpdate();
						charUpdate(_status.bpCharacters, false, _status.bpPackClick);
						planUpdate();
						planBg.delete();
					};
				});
				ui.create.div('.text', plan, node);
			};
		}
		const removePlan = ui.create.div('.bpPlan', bpPlans);
		ui.create.div('.bpPlanText.active', '删除方案', removePlan);
		removePlan.addEventListener('click', function (event) {
			removePlanUpdate();
		});

		function createPlanNode(plan) {
			const node = ui.create.div('.bpPlan', bpPlans);
			const bpPlanText = ui.create.div('.bpPlanText', plan, node);
			if (plan == _status.bpPlanClick) {
				node.classList.add('active');
				bpPlanText.classList.add('active');
			}
			if (plan == lib.config['extension_点绛唇_modePlans_' + lib.config.mode]) ui.create.div('.bpYingyong', node);
			node.addEventListener('click', function (event) {
				removeActiveFromClass();
				_status.bpPlanClick = plan;
				node.classList.add('active');
				bpPlanText.classList.add('active');
				charUpdate(_status.bpCharacters, false, _status.bpPackClick);
			});
			if (['仅点将可用', 'AI禁用'].includes(plan)) return;

			// 方案重命名部分
			let shuru = null;
			const changeName = ui.create.div('.bpPlanNameChange', node, function (event) {
				event.stopPropagation();
				if (!shuru) {
					shuru = document.createElement('input');
					shuru.type = 'text';
					shuru.className = 'bpSousuoInput';
					shuru.value = plan;
					shuru.placeholder = '';
					if (ui.window) {
						ui.window.appendChild(shuru);
					} else {
						document.body.appendChild(shuru);
					}


					// 添加点击外部关闭的处理
					const closeInput = function (e) {
						if (!shuru.contains(e.target) && e.target !== changeName) {
							shuru.style.display = 'none';
							document.removeEventListener('click', closeInput);
						}
					};
					setTimeout(() => document.addEventListener('click', closeInput), 100);
				}
				shuru.style.display = 'block';
				shuru.focus();
				shuru.setSelectionRange(0, shuru.value.length);
			});

			document.addEventListener('keydown', function (event) {
				if (shuru && shuru.style.display === 'block' && event.key === 'Enter') {
					let inputValue = shuru.value.trim();
					if (inputValue && !lib.config['extension_点绛唇_plans'].includes(inputValue)) {
						const newPlanKey = 'extension_点绛唇_plans_' + inputValue;
						const oldPlanKey = 'extension_点绛唇_plans_' + plan;
						lib.config[newPlanKey] = lib.config[oldPlanKey];
						delete lib.config[oldPlanKey];
						game.saveConfig(newPlanKey, lib.config[newPlanKey]);
						bpPlanText.textContent = inputValue;
						let planIndex = lib.config.extension_点绛唇_plans.indexOf(plan);
						if (planIndex !== -1) {
							lib.config.extension_点绛唇_plans[planIndex] = inputValue;
							game.saveConfig('extension_点绛唇_plans', lib.config.extension_点绛唇_plans);
						};
						for (let mode of lib.config.all.mode) {
							if (lib.config['extension_点绛唇_modePlans_' + mode] == plan) game.saveConfig('extension_点绛唇_modePlans_' + mode, inputValue);
						};
						_status.bpPlanClick = inputValue;
						planUpdate();
					};
					shuru.value = '';
					shuru.style.display = 'none';
				};
			});
		}
	}

	const bpChangePlan = ui.create.div('.bpChangePlan', bpPlansBg, function (event) {
		const planBg = ui.create.div(document.body, '.planBg', function (event) {
			if (event.target === planBg) planBg.delete();
		});

		function useUpdate(mode) { //初始化应用方案界面的函数
			_status.planMode = mode;
			planRightBg.innerHTML = '';
			let statusPlanMode = ui.create.div('.planModeText', '当前' + lib.translate[mode] + '模式应用方案:' + lib.config['extension_点绛唇_modePlans_' + mode], planRightBg);
			let choosePlanBg = ui.create.div('.choosePlanBg', planRightBg);
			const regularPlans = [];
			const specialPlans = [];
			for (let plan of lib.config.extension_点绛唇_plans.filter(i => !['仅点将可用', 'AI禁用'].includes(i))) {
				createPlanChoice(plan, mode, choosePlanBg);
			}
		}

		function createPlanChoice(plan, mode, parent) {
			const choosePlan = ui.create.div('.choosePlan', parent, function (event) {
				game.saveConfig('extension_点绛唇_modePlans_' + _status.planMode, plan);
				useUpdate(_status.planMode);
				planUpdate();
				game.saveBpConfig();
			});
			ui.create.div('.chooseText', plan, choosePlan);
			if (plan == lib.config['extension_点绛唇_modePlans_' + mode]) ui.create.div('.planYingyong', choosePlan);
		}
		const planChooseBg = ui.create.div('.planChooseBg', planBg);
		ui.create.div('.text', '选择你要应用的方案', planChooseBg);
		const planRightBg = ui.create.div('.planRightBg', planChooseBg);
		const planModeBg = ui.create.div('.planModeBg', planChooseBg);
		for (let mode of lib.config.all.mode) {
			const modeBg = ui.create.div('.planMode', lib.translate[mode], planModeBg, function (event) {
				useUpdate(mode);
				const modeBgs = planModeBg.querySelectorAll('.planMode');
				modeBgs.forEach(function (modeBg) {
					modeBg.classList.remove('active');
				});
				modeBg.classList.add('active');
			});
			if (mode == lib.config.mode) modeBg.classList.add('active');
			const planPlansBg = ui.create.div('.planPlansBg', modeBg);
		};
		useUpdate(lib.config.mode);
	});

	const bpBottom = ui.create.div('.bpBottom', bpJiangchiBg); //将池下方功能按钮的总位置

	const bpAll = ui.create.div('.bpLbtn', bpBottom, function (event) {
		const characterList = lib.config['extension_点绛唇_plans_' + _status.bpPlanClick];
		for (let character of _status.bpCharacters) {
			characterList.add(character);
		};
		game.saveConfig('extension_点绛唇_plans_' + _status.bpPlanClick, characterList);
		charUpdate(_status.bpCharacters, false, _status.bpPackClick);
	});
	ui.create.div('.bpLbtnText', '全部禁用', bpAll);

	const openAll = ui.create.div('.bpLbtn', bpBottom, function (event) {
		const characterList = lib.config['extension_点绛唇_plans_' + _status.bpPlanClick];
		for (let character of _status.bpCharacters) {
			characterList.remove(character);
		};
		game.saveConfig('extension_点绛唇_plans_' + _status.bpPlanClick, characterList);
		charUpdate(_status.bpCharacters, false, _status.bpPackClick);
	});
	ui.create.div('.bpLbtnText', '全部开启', openAll);

	const exportFile = ui.create.div('.bpLbtn', bpBottom, function (event) {
		const url = 'extension/点绛唇/extension/Bp/files';
		if (confirm('是否导出方案：' + _status.bpPlanClick + '   至路径：' + url + '/')) {
			let str = `['`;
			str += lib.config['extension_点绛唇_plans_' + _status.bpPlanClick].join("','");
			str += `']`;
			let num = 1;
			game.writeFile(str, url, _status.bpPlanClick + '.js', () => {
				if (num == 1) alert('操作完成');
				num++;
			});
		}
	});
	ui.create.div('.bpLbtnText', '导出数据', exportFile);

	const importFile = ui.create.div('.bpLbtn', bpBottom, function (event) {
		const url = 'extension/点绛唇/extension/Bp/files';
		const planBg = ui.create.div(document.body, '.planBg', function (event) {
			if (event.target === planBg) planBg.delete();
		});
		const planChooseBg = ui.create.div('.planChooseBg', planBg);
		ui.create.div('.text', '选择你要导入的方案', planChooseBg);
		const removePlanBg = ui.create.div('.planBigBg', planChooseBg);
		let num = 1;
		game.getFileList(url, function (folders, files) {
			if (!files.length) {
				alert('extension/点绛唇/Bp/files/  路径下无文件');
				planBg.delete();
				return;
			};
			for (let name of files) {
				const fileName = name.split('.')[0];
				const node = ui.create.div('.planBtn', removePlanBg, function (event) {
					if (confirm('是否导入：' + fileName + '  的数据至' + _status.bpPlanClick)) game.readFileAsText('extension/点绛唇/extension/Bp/files/' + name, function (data) {
						let list;
						try {
							list = eval(data);
						} catch (e) {
							alert('该文件数据错误');
						}
						if (Array.isArray(list)) {
							game.saveConfig('extension_点绛唇_plans_' + _status.bpPlanClick, list);
							planBg.delete();
							charUpdate(_status.bpCharacters, false, _status.bpPackClick);
							alert('导入成功！');
						} else alert('读取失败，文件格式必须是数组');
					});
				});
				ui.create.div('.text', fileName, node);
			};
		}, function () {
			if (num == 1) alert('请检查文件夹extension/点绛唇/extension/Bp/files  是否存在');
			num++;
			planBg.delete();
		});
	});
	ui.create.div('.bpLbtnText', '导入数据', importFile);

	//初始化界面
	charUpdate(_status.bpCharacters, false, _status.bpPackClick);
	planUpdate();
};
//ai禁将
lib.skill._AI禁用 = {
	trigger: {
		global: 'gameStart',
	},
	silent: true,
	unique: true,
	priority: 1024,
	charlotte: true,
	superCharlotte: true,
	ruleSkill: true,
	direct: true,
	filter(event, player) {
		if (player == game.me || player.isOnline2()) return false;
		for (let name of get.nameList(player)) {
			if (lib.config['extension_点绛唇_plans_AI禁用'].includes(name)) return true;
		};
		return false;
	},
	async content(event, trigger, player) {
		game.broadcastAll((event, trigger, player) => {
			let characters = get.bpCharacter().filter(i => !lib.config['extension_点绛唇_plans_AI禁用'].includes(i));
			game.filterPlayer(current => {
				for (let name of get.nameList(current)) {
					characters.remove(name);
				};
			});

			function getCharacter(characters) {
				if (!characters.length) {
					alert(lib.translate[player.name] + '：没有不为AI禁用的武将，更换失败！');
					return;
				};
				const character = characters.randomGet();
				characters.remove(character);
				return character;
			};
			if (player.name2) player.init(getCharacter(characters), getCharacter(characters));
			else player.init(getCharacter(characters));
			let newGroups = [];
			if (!player.isUnseen(1)) {
				newGroups = get.is.double(player.name1, true) || [get.character(player.name1, 1)];
			} else if (player.name2 && !player.isUnseen(2)) {
				newGroups = get.is.double(player.name2, true) || [get.character(player.name2, 1)];
			}
			if ((newGroups.includes('shen') || newGroups.includes('western')) && get.config('choose_group')) {
				newGroups.addArray(lib.group);
				newGroups.removeArray(['shen', 'western']);
			}
			if (newGroups.length) player.changeGroup(newGroups.randomGet(), false);
			if (player == game.zhu) {
				player.maxHp++;
				player.hp++;
			};
			player.$update();
			setTimeout(() => {
				player.node.avatar.setBackground(player.name1, 'character');
				if (player.name2) {
					player.node.avatar2.setBackground(player.name2, 'character');
				}
			}, 1000)
		}, event, trigger, player);
	},
};

lib.arenaReady.push(function () {

	//监听菜单页面的[武将]点击，将其效果替换为打开禁将页面
	if (lib.config['extension_点绛唇_coverCharacter']) {
		const checkForCharacterButton = setInterval(() => {
			const characterTab = Array.from(document.querySelectorAll('.menu-tab > div')).find(el => el.innerText === '武将');
			if (characterTab) {
				clearInterval(checkForCharacterButton);
				const oldNode = characterTab;
				const newNode = oldNode.cloneNode(true);
				oldNode.parentNode.replaceChild(newNode, oldNode);
				newNode.addEventListener('click', function (e) {
					e.preventDefault();
					e.stopPropagation();
					ui.click.configMenu();
					game.openBpDialog();
				});
			}
		}, 100);
	}

	//初始化设置
	if (!lib.config.extension_点绛唇_plans) {
		game.bpInit();
	};

	//添加禁将按钮
	ui.create.system('禁将', () => {
		game.openBpDialog()
	});

})
