
# Chrome Extensions
This is a collection of my personal extensions for Ungoogled Chromium. (They will also work in Google Chrome or any Chromium-based browser.) Currently, this includes a dictionary and thesaurus extension, a mouse gestures extension, and a bookmark syncing extension.

Features in the works are customizable mouse gestures, adding tabs and other data to the bookmarks sync, and translation features for the dictionary extension.

Note that 

## Dictionary, Thesaurus, and Translation Extension
This is a browser extension which provides a dictionary, thesaurus, and translation service for web browsing.

To use it, double click a word or larger selection. If the selection is in English, buttons will appear for dictionary and thesaurus. 

### How it works
The extension is possibly as simple as it can get. Upon double clicking a word, it makes an API call to Merriam Webster and if there is a result, you get the option to look at it.

Translation by its nature involves some sort of machine intelligence, and is correspondingly more difficult. I am using GPT-4o for this, so you'll need to get an API key for that. It's not free, but it's pretty cheap (like this extension is for sure less than a dollar a month for personal use).

### How to install
1) Download the folder "dictionary".
2) I'm using Merriam-Webster's collegiate dictionary and thesaurus APIs, and OpenAI's model API. YOU NEED TO GO INTO CONTENT.JS AND REPLACE THE KEY VARIABLES WITH YOUR OWN API KEYS! (You can get API keys for free for personal use on the Merriam-Webster website, and API keys *not* for free on the OpenAI website.)
3) Enter your API keys as `const DICT_KEY = [key]`, and likewise for `THES_KEY` and `GPT_KEY` at the top of `dictionary/content.js`. If you want to change the GPT model or prompt, those variables are also in `content.js`.
4) Load the unpacked extension by going to chrome://extensions, turning on developer mode, selecting load unpacked, and pointing it to the downloaded folder containing manifest.json.

### Features in the works
This extension is essentially done. The only likely changes would be cosmetic and possibly making the installation process easier (e.g. env file for keys, packed crx for you to download, more steps / pictures here, or just put it on the chrome web store). Let me know if you are an actual human who likes this extension and I'll make it look and feel a little nicer.

## Mouse Gestures Extension
This extension allows one to hold down right click and draw gestures to do things. It's like keyboard shortcuts, but instead of hating mice you hate keyboards. It replaces "CRXMouse", which I'm fairly positive was spyware.

### How it works
When you hold right click, an event listener tracks your up/down/right/left gestures and interprets the sequence as one of the following: create a tab, maximize or minimize the window, navigate back or forwards, zoom in or out, close the tab, reopen the last closed tab, reload, go to the left or right tab, or scroll to the top or bottom. It sends a message to a background script which executes the desired action.

### How to install
1) Download the folder "mouse-gestures".
2) If you want to modify the gestures or add more, currently you'll have to go in the source code. The pages linked on [[https://developer.chrome.com/docs/extensions/reference/api/]] contain everything you could do, but you may have to add permissions in the manifest.json.
To modify a gesture, add a name and directions for it at the top of `gestures.js`, then add code to `background.js` calling the desired chrome API.
3) Load the unpacked extension by going to chrome://extensions, turning on developer mode, selecting load unpacked, and pointing it to the downloaded folder containing manifest.json.

### Features in the works
The major missing functionality is adding and reprogramming gestures without modifying the source code. This will probably be done via a popup of some sort. There's lots of possible features in the Chrome API, but I'll probably implement a subset.

## Bookmarks sync extension
I'm not using a browser which syncs tabs and bookmarks to its own server, so I have to do it locally. Currently I sync between computers using SyncThing, but I use Safari on my phone. This extension lets me access my ~2000 bookmarks (and in the future hopefully my open tabs) from my phone.

### How it works
The sync occurs on changing the bookmarks, manually syncing, or an automatic periodic sync. The background script gets all the bookmarks, and uses Supabase's PostgREST HTTP API to upload the flattened bookmark JSON to a database.  Then on my phone, when I navigate to the website to access my bookmarks (whose code I copied into the folder "remote"), it makes an API call to fetch the bookmarks.

For authentication, the website script stores the API keys after AES encryption and asks the user for the decryption key. This allows accessing my bookmarks from anywhere.

### How to install
1) Download the folder "bookmark-sync".
2) You'll need to set up a Supabase account and run the following SQL to create the table:
`
CREATE TABLE bookmarks (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id TEXT,
  index INTEGER,
  title TEXT NOT NULL,
  url TEXT
);
`
3) Find your API url (https://[project-id-thing].supabase.co/rest/v1/bookmarks) and key on the Supabase website. Put them in background.js, then encrypt them with Crypto.JS's AES implementation and put them in the /remote/script.js.
4) Host the website files found in /remote/ using whatever you want. Github pages is an easy solution.
5) Load the unpacked extension by going to chrome://extensions, turning on developer mode, selecting load unpacked, and pointing it to the downloaded folder containing manifest.json.

### Features in the works
I'm planning to sync the tabs I have open on each device, and a synced index of the archive of books, papers, and textbooks I have downloaded. I might use an API to get download links for the books, papers, and textbooks, or work out some solution to download from one of my devices.

## Other Extensions maybe coming soon
- New Tab Art - replaces the new tab page with a random daily artwork, hopefully with some feature to save it.
- Time Limit - helpful reminders to take a break every 20 minutes + configurable time limits for websites and browser
- AI Assistant - since I'm already using the API for translation might as well add GPT to the context menu. Maybe save cconversations in local storage and give options for multiple models?

## PSA: Dangers of Chrome Web Store Extensions
One might ask why I'm doing all this when I can easily download these features from the Chrome web store?

I used to use the Google Dictionary, Google Translate, and Power Thesaurus extensions. These extensions were collecting a lot of data, including possibly my browsing history, and sending it to Google, or in the case of Power Thesaurus, Russia. 

The source code of all three was obfuscated and and it seemed overly invasive for such basic functionality. It's a simple enough feature that I felt that I shouldn't need to inject tracking scripts onto every website I visit to have that functionality. 

Similarly, my old mouse gestures and video downloading extensions turned out to be spyware, and I had been bitten even earlier by an *open-source* tab discarding extension (the great suspender) which got sold and turned into adware, before browsers had built-in tab discarding.

In general, you should be careful which extensions you download. There's a lot of shady extensions on the Chrome Web Store, and years before I ever thought about internet privacy I had downloaded extensions which are very invasive.

I highly encourage you to not let your extensions have access to all sites (except an adblocker), and to look at the source code of your downloaded extensions. The only web store extension I use without having looked at the source code is uBlock origin. If you're on Windows, you will probably find source code in %userprofile%\AppData\Local\Google\Chrome\User Data\Default\Extensions. Make sure you trust the extensions you have - they might have more power over you than you'd expect.

Finally, choose your browser carefully. I chose Ungoogled Chromium because chromium-based browsers are better for security, and browsers like Chrome, Edge, and Opera tend to track a lot of info about you. Ungoogled Chromium comes at a small expense of usability, but it's fine for me. If you're thinking about switching browsers, other good choices (in no particular order) are hardened Firefox, Librewolf, Vivaldi, Brave, and Waterfox.
