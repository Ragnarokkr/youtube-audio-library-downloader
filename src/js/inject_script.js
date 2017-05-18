/**
 * inject_script.js - front-end logic for extension
 *
 */

// Element references
let elAudioLibraryContent = document.querySelector('#audio-library-content');
let elAudioLibraryBrowser = elAudioLibraryContent.querySelector('.audio-library-browser');
let elAudioLibraryTrackList = elAudioLibraryBrowser.querySelector('.track-list');
let elAudioLibraryTrackFooter = elAudioLibraryContent.querySelector('#audio-library-track-footer');

// Generating "Download All Tracks" link and its container
let elYTALContainer = document.createElement('span');
elYTALContainer.classList.add('ytal-download');
let elYTALLink = document.createElement('a');
elYTALLink.href = 'javascript:void(0)';
elYTALLink.innerText = chrome.i18n.getMessage('lblDownloadAllTracks');
elYTALLink.title = chrome.i18n.getMessage('lblDownloadAllTracksNote');
elYTALContainer.appendChild(elYTALLink);
elAudioLibraryTrackFooter.appendChild(elYTALContainer);

// Registering the click action for generated link
elYTALLink.addEventListener('click', onClickDownloadTracks);

/**
 * Send download message to the eventPage.
 *
 * @param {Event} e
 * @returns {boolean}
 *
 * @callback
 *
 */
function onClickDownloadTracks(e) {
    let audioTracks = Array
        .from(elAudioLibraryTrackList.querySelectorAll('div.audiolibrary-column.audiolibrary-column-download a'))
        .map(function (link) { return link.href; })
        .filter(function (link, i, a) { return i === a.lastIndexOf(link); });

    e.preventDefault();

    if (audioTracks.length === 0) {
        chrome.runtime.sendMessage({
            command: Commands.Notify,
            message: chrome.i18n.getMessage('msgAudioTracksNotFound')
        });
        return false;
    }
    if (audioTracks.length === 1) {
        chrome.runtime.sendMessage({
            command: Commands.Notify,
            message: chrome.i18n.getMessage('msgAudioTrackFound')
        });
    }
    else {
        chrome.runtime.sendMessage({
            command: Commands.Notify,
            message: chrome.i18n.getMessage('msgAudioTracksFound', [audioTracks.length])
        });
    }
    chrome.runtime.sendMessage({
        command: Commands.Download,
        data: audioTracks
    });
    return false;
}
