export function agreement(extensionInfo) {
	let msg = "%E5%85%B3%E6%B3%A8%5B%E6%97%A0%E5%90%8D%E6%9D%80%E8%B5%84%E6%BA%90%E5%BA%93%5D%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E8%8E%B7%E5%8F%96%E6%9C%AC%E6%89%A9%E5%B1%95%E6%9C%80%E6%96%B0%E7%89%88%E6%9C%AC%EF%BC%8C%E6%9C%AA%E7%BB%8F%E6%9C%AC%E4%BA%BA%E5%90%8C%E6%84%8F%E7%A6%81%E6%AD%A2%E6%95%B4%E5%90%88%E8%BF%9B%E4%BB%96%E4%BA%BA%E6%87%92%E4%BA%BA%E5%8C%85%EF%BC%8C%E7%A6%81%E6%AD%A2%E5%80%92%E5%8D%96%E3%80%81%E4%BF%AE%E6%94%B9%E5%BC%B9%E7%AA%97%E5%8F%8A%E5%BC%B9%E7%AA%97%E5%86%85%E5%AE%B9%EF%BC%81";
	let version = localStorage.getItem("无名美化_version");
	let currentVersion = extensionInfo.version;
	if (!version || version != currentVersion) {
	// if (!version ) {
		localStorage.setItem("无名美化_version", currentVersion);
		alert(decodeURIComponent(msg));
	}
}
