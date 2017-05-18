#YouTube Audio Library Downloader

This extension helps to batch download audio and effect tracks from YouTube Audio Library.
 
### How it works?

The extensions looks for matching `https://www.youtube.com/audiolibrary/*` links and injects
a script which adds a link to the bottom of the track list manager.
 
The new link (`Download All Tracks`) will add all detected audio tracks into the browser's 
download manager which will immediately starts downloading the tracks.

### What to do before the download?

Since this extension looks for available links into the track list manager, all that it's 
 needed to do is to set the track manager filters for the kind of music/effect you are 
 interested into, scroll down the list until no more tracks are loaded, then finally click
 on the new added link. Waiting for the downloads are done, enjoy them!
 
### WTF... Another downloader?

I've searched for something able to do that on Chrome/Opera and didn't found anything simple
and immediate for it. I didn't want to install some big download manger extension, so I've 
decided to develop something easy as this, good to accomplish this job and nothing else.

### Hey! I've decided to download a gazillion of soudtracks! What about my bandwidth?

True. The first time I've tested the extension I did forget about concurrent downloads and 
finally saturated my bandwidth. That's why in this first version I've used a simple queue to
manage the downloads, and limit them to a restricted number until previous downloads not
finished yet.

### Should I really use this crap?

Well. It's a project I did for my personal use and for what I needed it works!

Feel free to use it and try it.
