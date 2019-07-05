function onError(error) {
	console.log(`Error: ${error}`);
}

function getTabURLs(tabs) {
	var urls = {};
	for (let tab of tabs) {
		urls[tab.url] = tab.title;
	}
	return urls;
}

function storeURLs(tab_urls) {
	browser.storage.local.set(tab_urls).then(() => {
		console.log("")
	})
}

function downloadURLs(tab_urls) {
	// console.log(tab_urls);
	var blob = new Blob([JSON.stringify(tab_urls)], { type: "application/json" });
	var downloadUrl = URL.createObjectURL(blob);
	browser.downloads.download({
		url: downloadUrl,
		filename: 'tor_urls.json',
		conflictAction: 'overwrite'
	});
}

function createTabs(loaded_urls) {
	if (!loaded_urls) {
		return
	}
	urls = Object.keys(loaded_urls)
	for (const index in urls) {
		browser.tabs.create({
			url: urls[index]
		});
	}
}

function saveTabs() {
	var querying = browser.tabs.query({});
	querying.then(getTabURLs, onError).then(storeURLs, onError);
}

function loadTabs() {
	browser.storage.local.get().then(createTabs);
}

// browser.browserAction.onClicked.addListener(saveTabs);
var btn_save = document.getElementById("save");
var btn_load = document.getElementById("load");
btn_save.addEventListener("click", (e) => {
	saveTabs();
});
btn_load.addEventListener("click", (e) => {
	loadTabs();
});