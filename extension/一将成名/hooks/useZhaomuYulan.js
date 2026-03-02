import { ref, onMounted, useTemplateRef, watch, computed } from "../lib/vue.esm-browser.js";
import { zhaomuMap } from "../config/zhaomuJc.js";
import { throttle,debounce } from "../utils/index.js";

export function useZhaomuYulan() {
	let showGailv = ref(false);
	let wjsearchName = ref("");
	let showwjsearchName = ref("");
	let showZhaomuJc = ref(false);
	//所有招募将池武将
	let allWjList = ref([]);
	let dataList = ref([]);

	const pageNum = ref(1); // 当前页码，初始为1
	const pageSize = ref(25); // 每页加载10条，固定值
	const noMore = ref(false); // 是否加载完所有数据

	Object.entries(zhaomuMap).forEach(([level, wjList]) => {
		wjList.forEach(wj => {
			allWjList.value.push({
				id: wj.id,
				name: wj.name,
				level: level,
			});
		});
	});
	// 过滤出符合搜索条件的武将
	let showAllWjList = computed(() => {
		return allWjList.value.filter(item => item.name.includes(wjsearchName.value));
	});
	let searchWj = () => {
		pageNum.value = 1; // 搜索时重置页码为1
		dataList.value = []; // 搜索时清空已加载数据
		noMore.value = false; // 搜索时重置加载状态
		wjsearchName.value = showwjsearchName.value;
		getListData();
	};
	const isReachBottom = () => {
		let wjconRef = document.querySelector(".yjcm-jc-con-wj-main");
		// 文档滚动的垂直距离
		const scrollTop = wjconRef.scrollTop;
		// 浏览器可视区高度
		const clientHeight = wjconRef.clientHeight;
		// 文档总高度
		const scrollHeight = wjconRef.scrollHeight;
		// 滚动距离+可视高度 >= 文档总高度 - 自定义值 提前加载用
		const flag = scrollTop + clientHeight >= scrollHeight - 100;
		console.log("触底",flag);
		return flag
	};
	const getListData = async () => {
		const newList = showAllWjList.value.slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value);
		//追加数据
		dataList.value = [...dataList.value, ...newList];
		// 判断是否还有更多数据
		if (newList.length < pageSize.value) {
			noMore.value = true; // 数据不足一页，说明加载完了
		} else {
			pageNum.value++; // 数据充足，页码+1，准备加载下一页
		}
	};
	const scrollHandler = debounce(() => {
		console.log("滚动事件触发");
		// 滚动到底部 且 不在加载中 且 还有更多数据 → 加载数据
		if (isReachBottom() && !noMore.value) {
			getListData();
		}
	},200);
	onMounted(() => {
		getListData(); // 初始化加载第一页数据
		document.querySelector(".yjcm-jc-con-wj-main").addEventListener("scroll", scrollHandler); // 监听全局滚动事件
	});
	return {
		dataList,
		scrollHandler,
		showGailv,
		wjsearchName,
		showwjsearchName,
		showZhaomuJc,
		searchWj,
	};
}
