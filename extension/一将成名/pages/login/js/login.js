import { createApp, ref, onMounted, computed } from "../../../lib/vue.esm-browser.js";
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
createApp({
	setup() {
		// const loading = ref(true);
		let random = ()=>{
			return Math.floor(Math.random() * 2) + 1;
		}
		let classList = ref([]);
		let loading = ref(true);
		let autoLogin = ref(true);
		let yinsi = ref(true);
		let username = ref("");
		let password = ref("");
		let errorMsg = ref("");
		let userInfo = localStorage.getItem("rzuserInfo");
		if (userInfo) {
			userInfo = JSON.parse(userInfo);
			username.value = userInfo.username;
			password.value = userInfo.password;
		}
		let canLogin = computed(() => {
			return username.value.length > 0 && password.value.length > 0 && yinsi.value;
		});
		onMounted(() => {
			setTimeout(() => {
				loading.value = false;
				classList.value.push("show");
			}, 1000);
			// setTimeout(() => {
			// 	let autoLoginStatus = localStorage.getItem("autoLogin");
			// 	if (autoLoginStatus && autoLoginStatus === "1" && canLogin.value) {
			// 		login();
			// 	}
			// }, 2000);
		});
		const login = () => {
			document.getElementById("ksgame").play();
			if (!canLogin.value) {
				errorMsg.value = "请填写用户名和密码，并同意隐私政策";
				return;
			}
			// loading.value = true;
			let msg = JSON.stringify({
				username: username.value,
				password: password.value,
			});
			if (autoLogin.value) {
				localStorage.setItem("rzuserInfo", msg);
				localStorage.setItem("autoLogin", "1");
			} else {
				localStorage.removeItem("rzuserInfo");
				localStorage.removeItem("autoLogin");
			}
			sessionStorage.setItem("userInfo", msg);
			// setTimeout(() => {
				if (isMobile) {
					window.location.href = "/index.html";
				} else {
					window.location.href = "/app.html";
				}
			// }, 800);
		};
		const autoLoginClick = () => {
			autoLogin.value = !autoLogin.value;
		};
		const yinsiClick = () => {
			yinsi.value = !yinsi.value;
		};
		return {
			classList,
			random,
			errorMsg,
			username,
			password,
			login,
			canLogin,
			loading,
			autoLogin,
			yinsi,
			autoLoginClick,
			yinsiClick,
			// login,
		};
	},
}).mount("#app");
