/**
 * eventPage.js - background logics for front end extension.
 */

(function (Queue, Commands) {
    "use strict";

    /**
     * Buffer for URLs to download
     * @type {string[]}
     */
    let dlList;
    /**
     * Amount of concurrent downloads (and size of the used mutex queue).
     * @type {number}
     */
    let dlRange = 10;
    /**
     * Index used to retrieve the URLs to download.
     * @type {number}
     */
    let dlCounter = 0;
    /**
     * Timer handle for async downloading
     * @type {Timer|object}
     */
    let dlTimeout;
    /**
     * Mutex Queue used to keep track of downloading states.
     * @type {Queue}
     */
    let qDownload = new Queue(dlRange);
    /**
     * Callback function called on download state change, which checks if the
     * passed download has completed.
     *
     * @callback chrome.downloads.onChanged~onStateChangeCheck
     * @param {downloadDelta} downloadDelta data retrieved from the current download
     */
    function onStateChangeCheck(downloadDelta) {
        if (downloadDelta.hasOwnProperty('state') &&
			downloadDelta.state.hasOwnProperty('current') &&
			downloadDelta.state.current === 'complete')
            qDownload.remove(downloadDelta.id);
    }
    /**
     * Downloads retrieved URLs using a mutex limited queue do handle the amount of
     * concurrent downloads to prevent the bandwidth saturation.
     */
    function downloadManager() {
        clearTimeout(dlTimeout);
        if (dlCounter === dlList.length)
            return;
        if (!qDownload.isWorking() && !qDownload.isFull())
            chrome.downloads.download({ url: dlList[dlCounter++], saveAs: false }, function (id) { qDownload.add(id); });
        dlTimeout = setTimeout(downloadManager, 1000);
    }
	
    // Listen for a messages coming from the injected script on web the web page
    chrome.runtime.onMessage.addListener(function (msg) {
        switch (msg.command) {
            case Commands.Download:
                // Start to download the URLs
                if (msg.data.length) {
                    dlList = msg.data;
                    chrome.downloads.onChanged.addListener(onStateChangeCheck);
                    downloadManager();
                }
                break;
            case Commands.Notify:
                // Shows a notifications
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'img/info-icon.png',
                    title: 'YouTube Audio Library Downloader',
                    message: msg.message
                });
                break;
        }
    });
})(Queue, Commands);
