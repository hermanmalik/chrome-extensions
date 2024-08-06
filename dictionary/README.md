# Dictionary, Thesaurus, and Translation Extension
This is a Chrome browser extension which provides a dictionary, thesaurus, and translation service for web browsing.

To use it, double click a word or larger selection. If the selection is in English, buttons will appear for dictionary and thesaurus. The translation feature is not done yet. 

## How it works
The extension is possibly as simple as you can get. Upon double clicking a word, it makes an API call to Merriam Webster and if there is a result, you get the option to look at it.

Translation by its nature involves some sort of machine intelligence, and is correspondingly more difficult. The current issue is that I'd need to self-host a translation model or pay for an API, since there doesn't seem to be a good free one. The one I did find ran into CORS trouble. Will work on it eventually. 

## How to install
1) Download the repository.
2) I'm using Merriam-Webster's collegiate dictionary and thesaurus APIs. YOU NEED TO GO INTO CONTENT.JS AND REPLACE THE KEY VARIABLES WITH YOUR OWN API KEYS! (You can get API keys for free for personal use on the Merriam-Webster website.) 
3) Load the unpacked extension by going to chrome://extensions, turning on developer mode, selecting load unpacked, and pointing it to the downloaded folder containing manifest.json.

In the future I will maybe make this process easier (e.g. env file for keys, packed crx for you to download, more steps / pictures here). At the current stage I don't really see other people preferring this extension because the UI is so minimal but if you are a human that uses this code lmk and I'll make it good. 

## Why not use a more standard extension?
I used to use the Google Dictionary, Google Translate, and Power Thesaurus extensions. In addition to the convenience of having all three in a single extension, there's also privacy and security problems with a lot of Chrome extensions.

In this case, all three extensions were logging my data and sending it back to their own servers. The source code of all three was obfuscated and and it seemed overly invasive for such basic functionality. It's a simple enough feature that I felt that I shouldn't need to inject tracking scripts onto every website I visit to have that functionality. (Of course, by using Chrome, one probably doesn't win much in terms of privacy anyway, but that's besides the point.)

In general, you should be careful which extensions you download. There's a lot of shady extensions on the Chrome Web Store, and years before I ever thought about internet privacy I had downloaded extensions which are very invasive. For me personally, I downloaded malware extensions off the Web Store with useful features like mouse gestures, tab suspending (before Chrome did it by default), and video downloading.

As an aside, the tab suspending was particularly surprising, because the extension I used (The Great Suspender) was a trustworthy, open-source extension until the developer sold it to a third party, who then went on to upload a malware update.  (Perhaps a parallel to the infamous xz supply chain attack could be drawn.) 

I highly encourage you to not let your extensions have access to all sites (except an adblocker), and to look at the source code of your downloaded extensions. If you're on Windows, you will probably find source code in %userprofile%\AppData\Local\Google\Chrome\User Data\Default\Extensions. Make sure you trust the extensions you have - they might have more power over you than you'd expect.