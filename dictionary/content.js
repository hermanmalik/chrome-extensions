const url_basic = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const url_dict = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/"
const url_thes = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"
const url_translate = 'https://655.mtis.workers.dev/translate';
const CORSbypass = `https://api.allorigins.win/get`;



// 1000 most common words; excluded from dictionary search
// source: https://github.com/first20hours/google-10000-english/blob/master/google-10000-english-usa.txt
const _1000mostcommon = ["the", "of", "and", "to", "a", "in", "for", "is", "on", "that", "by", "this", "with", "i", "you", "it", "not", "or", "be", "are", "from", "at", "as", "your", "all", "have", "new", "more", "an", "was", "we", "will", "home", "can", "us", "about", "if", "page", "my", "has", "search", "free", "but", "our", "one", "other", "do", "no", "information", "time", "they", "site", "he", "up", "may", "what", "which", "their", "news", "out", "use", "any", "there", "see", "only", "so", "his", "when", "contact", "here", "business", "who", "web", "also", "now", "help", "get", "pm", "view", "online", "c", "e", "first", "am", "been", "would", "how", "were", "me", "s", "services", "some", "these", "click", "its", "like", "service", "x", "than", "find", "price", "date", "back", "top", "people", "had", "list", "name", "just", "over", "state", "year", "day", "into", "email", "two", "health", "n", "world", "re", "next", "used", "go", "b", "work", "last", "most", "products", "music", "buy", "data", "make", "them", "should", "product", "system", "post", "her", "city", "t", "add", "policy", "number", "such", "please", "available", "copyright", "support", "message", "after", "best", "software", "then", "jan", "good", "video", "well", "d", "where", "info", "rights", "public", "books", "high", "school", "through", "m", "each", "links", "she", "review", "years", "order", "very", "privacy", "book", "items", "company", "r", "read", "group", "sex", "need", "many", "user", "said", "de", "does", "set", "under", "general", "research", "university", "january", "mail", "full", "map", "reviews", "program", "life", "know", "games", "way", "days", "management", "p", "part", "could", "great", "united", "hotel", "real", "f", "item", "international", "center", "ebay", "must", "store", "travel", "comments", "made", "development", "report", "off", "member", "details", "line", "terms", "before", "hotels", "did", "send", "right", "type", "because", "local", "those", "using", "results", "office", "education", "national", "car", "design", "take", "posted", "internet", "address", "community", "within", "states", "area", "want", "phone", "dvd", "shipping", "reserved", "subject", "between", "forum", "family", "l", "long", "based", "w", "code", "show", "o", "even", "black", "check", "special", "prices", "website", "index", "being", "women", "much", "sign", "file", "link", "open", "today", "technology", "south", "case", "project", "same", "pages", "uk", "version", "section", "own", "found", "sports", "house", "related", "security", "both", "g", "county", "american", "photo", "game", "members", "power", "while", "care", "network", "down", "computer", "systems", "three", "total", "place", "end", "following", "download", "h", "him", "without", "per", "access", "think", "north", "resources", "current", "posts", "big", "media", "law", "control", "water", "history", "pictures", "size", "art", "personal", "since", "including", "guide", "shop", "directory", "board", "location", "change", "white", "text", "small", "rating", "rate", "government", "children", "during", "usa", "return", "students", "v", "shopping", "account", "times", "sites", "level", "digital", "profile", "previous", "form", "events", "love", "old", "john", "main", "call", "hours", "image", "department", "title", "description", "non", "k", "y", "insurance", "another", "why", "shall", "property", "class", "cd", "still", "money", "quality", "every", "listing", "content", "country", "private", "little", "visit", "save", "tools", "low", "reply", "customer", "december", "compare", "movies", "include", "college", "value", "article", "york", "man", "card", "jobs", "provide", "j", "food", "source", "author", "different", "press", "u", "learn", "sale", "around", "print", "course", "job", "canada", "process", "teen", "room", "stock", "training", "too", "credit", "point", "join", "science", "men", "categories", "advanced", "west", "sales", "look", "english", "left", "team", "estate", "box", "conditions", "select", "windows", "photos", "gay", "thread", "week", "category", "note", "live", "large", "gallery", "table", "register", "however", "june", "october", "november", "market", "library", "really", "action", "start", "series", "model", "features", "air", "industry", "plan", "human", "provided", "tv", "yes", "required", "second", "hot", "accessories", "cost", "movie", "forums", "march", "la", "september", "better", "say", "questions", "july", "yahoo", "going", "medical", "test", "friend", "come", "dec", "server", "pc", "study", "application", "cart", "staff", "articles", "san", "feedback", "again", "play", "looking", "issues", "april", "never", "users", "complete", "street", "topic", "comment", "financial", "things", "working", "against", "standard", "tax", "person", "below", "mobile", "less", "got", "blog", "party", "payment", "equipment", "login", "student", "let", "programs", "offers", "legal", "above", "recent", "park", "stores", "side", "act", "problem", "red", "give", "memory", "performance", "social", "q", "august", "quote", "language", "story", "sell", "options", "experience", "rates", "create", "key", "body", "young", "america", "important", "field", "few", "east", "paper", "single", "ii", "age", "activities", "club", "example", "girls", "additional", "password", "z", "latest", "something", "road", "gift", "question", "changes", "night", "ca", "hard", "texas", "oct", "pay", "four", "poker", "status", "browse", "issue", "range", "building", "seller", "court", "february", "always", "result", "audio", "light", "write", "war", "nov", "offer", "blue", "groups", "al", "easy", "given", "files", "event", "release", "analysis", "request", "fax", "china", "making", "picture", "needs", "possible", "might", "professional", "yet", "month", "major", "star", "areas", "future", "space", "committee", "hand", "sun", "cards", "problems", "london", "washington", "meeting", "rss", "become", "interest", "id", "child", "keep", "enter", "california", "porn", "share", "similar", "garden", "schools", "million", "added", "reference", "companies", "listed", "baby", "learning", "energy", "run", "delivery", "net", "popular", "term", "film", "stories", "put", "computers", "journal", "reports", "co", "try", "welcome", "central", "images", "president", "notice", "god", "original", "head", "radio", "until", "cell", "color", "self", "council", "away", "includes", "track", "australia", "discussion", "archive", "once", "others", "entertainment", "agreement", "format", "least", "society", "months", "log", "safety", "friends", "sure", "faq", "trade", "edition", "cars", "messages", "marketing", "tell", "further", "updated", "association", "able", "having", "provides", "david", "fun", "already", "green", "studies", "close", "common", "drive", "specific", "several", "gold", "feb", "living", "sep", "collection", "called", "short", "arts", "lot", "ask", "display", "limited", "powered", "solutions", "means", "director", "daily", "beach", "past", "natural", "whether", "due", "et", "electronics", "five", "upon", "period", "planning", "database", "says", "official", "weather", "mar", "land", "average", "done", "technical", "window", "france", "pro", "region", "island", "record", "direct", "microsoft", "conference", "environment", "records", "st", "district", "calendar", "costs", "style", "url", "front", "statement", "update", "parts", "aug", "ever", "downloads", "early", "miles", "sound", "resource", "present", "applications", "either", "ago", "document", "word", "works", "material", "bill", "apr", "written", "talk", "federal", "hosting", "rules", "final", "adult", "tickets", "thing", "centre", "requirements", "via", "cheap", "nude", "kids", "finance", "true", "minutes", "else", "mark", "third", "rock", "gifts", "europe", "reading", "topics", "bad", "individual", "tips", "plus", "auto", "cover", "usually", "edit", "together", "videos", "percent", "fast", "function", "fact", "unit", "getting", "global", "tech", "meet", "far", "economic", "en", "player", "projects", "lyrics", "often", "subscribe", "submit", "germany", "amount", "watch", "included", "feel", "though", "bank", "risk", "thanks", "everything", "deals", "various", "words", "linux", "jul", "production", "commercial", "james", "weight", "town", "heart", "advertising", "received", "choose", "treatment", "newsletter", "archives", "points", "knowledge", "magazine", "error", "camera", "jun", "girl", "currently", "construction", "toys", "registered", "clear", "golf", "receive", "domain", "methods", "chapter", "makes", "protection", "policies", "loan", "wide", "beauty", "manager", "india", "position", "taken", "sort", "listings", "models", "michael", "known", "half", "cases", "step", "engineering", "florida", "simple", "quick", "none", "wireless", "license", "paul", "friday", "lake", "whole", "annual", "published", "later", "basic", "sony", "shows", "corporate", "google", "church", "method", "purchase", "customers", "active", "response", "practice", "hardware", "figure", "materials", "fire", "holiday", "chat", "enough", "designed", "along", "among", "death", "writing", "speed", "html", "countries", "loss", "face", "brand", "discount", "higher", "effects", "created", "remember", "standards", "oil", "bit", "yellow", "political", "increase", "advertise", "kingdom", "base", "near", "environmental", "thought", "stuff", "french", "storage", "oh", "japan", "doing", "loans", "shoes", "entry"];

const debug = false;
let popups_alive; // hacky solution to deal with triple clicks since setTimeout doesn't work.

document.addEventListener('dblclick', function (event) {
    if (dict_key == "" || thes_key == "") {
        alert("please add dictionary and thesaurus keys (or remove this alert)");
    }
    const selectedText = window.getSelection().toString();
    if (selectedText.length > 3) {
        if (debug) console.log("Selected text: ", selectedText);


        // first step is to make 3 small popup buttons
        const dictionary_button = document.createElement('div');
        dictionary_button.innerText = "d";
        const thesaurus_button = document.createElement('div');
        thesaurus_button.innerText = "t";
        const translation_button = document.createElement('div');
        const popup = document.createElement('div');
        popups_alive = true;

        // then async load the contents of each lookup
        // remove error catching to debug
        // on fulfillment, append the popup button to the document below the selection, and store lookup in a variable 
        if (!(selectedText in _1000mostcommon)) {
        let dictionaryResult;
        dictionaryLookup(selectedText).then(
            result => {
                dictionaryResult = result;
                if(popups_alive) document.body.appendChild(dictionary_button);
                dictionary_button.classList.add('popup-class');
                dictionary_button.style.top = event.pageY + 'px';
                dictionary_button.style.left = event.pageX - 10 + 'px';
                dictionary_button.addEventListener('click', activatePopup(dictionaryResult));
            }
        ).catch(() => console.log("dictionary error")); // shitty error handling 101: ignore the error
        }
        let thesaurusResult;
        thesaurusLookup(selectedText).then(
            result => {
                thesaurusResult = result;
                if(popups_alive) document.body.appendChild(thesaurus_button);
                thesaurus_button.classList.add('popup-class');
                thesaurus_button.style.top = event.pageY + 'px';
                thesaurus_button.style.left = event.pageX + 10 + 'px';
                thesaurus_button.addEventListener('click', activatePopup(thesaurusResult));
            }
        ).catch(() => console.log("thesaurus error"));
        let translationResult;
        translateText(selectedText).then(
            result => {
                translationResult = result;
                // if(popups_alive) document.body.appendChild(translation_button);
                translation_button.classList.add('popup-class');
                translation_button.style.top = event.pageY + 'px';
                translation_button.style.left = event.pageX + 'px';
                translation_button.addEventListener('click', activatePopup(translationResult));
            }
        ).catch(() => console.log("translate error"));

        // When the button is clicked, make a popup
        function activatePopup(content) {
            return function (e) {
                if (debug) console.log("popup activated");
                popup.innerHTML = content;
                document.body.appendChild(popup);
                e.stopPropagation(); // Don't remove button when clicked on 
            }
        }
        // Don't remove popup when clicked on 
        popup.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        // OLD WORKFLOW
        // priority for popup fills: dictionary > translation > thesaurus
        // if none load, don't display popup. 
        // otherwise fill the main popup with the highest priority one and the others become mini popups
        // all popups should know their type; when a mini popup is clicked it switches its type with the main popup 


        // Style popup
        popup.classList.add('popup-class');
        // TODO - center on the highlighted text
        popup.style.top = event.pageY + 20 + 'px';
        popup.style.left = event.pageX + 'px';
        // // Position popover relative to the button
        // const rect = triggerButton.getBoundingClientRect();
        // popover.style.top = rect.bottom + 'px';
        // popover.style.left = rect.left + 'px';

        document.addEventListener('click', function removePopup(e) {
            popup.remove();
            dictionary_button.remove();
            thesaurus_button.remove();
            translation_button.remove();
            document.removeEventListener('click', removePopup); // Remove the event listener after removing the popup
            // I really would rather add the event listener after a settimeout instead of using popups_alive,
            // but that doesn't work when the background page doesn't have JS enabled. WTF? 
            popups_alive = false;
            if (debug) console.log("removed");
        })
    }
});

// returns HTML for definition
async function dictionaryLookup(input_text) {
    const response = await fetch(`${url_basic}${input_text}`);
    const data = await response.json();
    // propagates error to be handled later - TODO make it work

    return `
        <div class="word">
            <h3>${input_text}</h3>
        </div>
        <div class="details">
            <p>${data[0].meanings[0].partOfSpeech}</p>
            <p>/${data[0].phonetic}/</p>
        </div>
        <p class="word-meaning">
            ${data[0].meanings[0].definitions[0].definition}
        </p>
        <p class="word-example">
            <i>${data[0].meanings[0].definitions[0].example || ""}</i>
        </p>`;

    // if you want sound, add 
    // const sound = document.getElementById("sound");                      // AT TOP
    // <button onclick="sound.play()">                                      // IN DIV
    //     <i class="fas fa-volume-up"></i>
    // </button>
    // sound.setAttribute("src", `https:${data[0].findTheSoundInTheJson}`); // ABOVE THE RETURN
    // (requires font awesome icons)
}

// returns HTML with synonyms and antonyms
async function thesaurusLookup(input_text) {
    // TODO fill in
    const response = await fetch(`${url_thes}${input_text}?key=${thes_key}`);
    const data = await response.json();

    return `
        <div class="word">
            <h3>${input_text}</h3>
        </div>
        <div class="details">
            <p><strong>Synonyms</strong>: ${data[0].meta.syns.flat().join(", ")}</p>
            <p><strong>Antonyms</strong>: ${data[0].meta.ants.flat().join(", ")}</p>
        </div>
    `;
}

async function translateWord(input_text) {
    return;
}

// returns HTML with translation
async function translateText(input_text) {

    // Parameters for translation
    const params = {
        text: input_text,  // Text to translate
        source_lang: 'es',  // Source language code
        target_lang: 'en'   // Target language code
    };

    // Construct URL with query parameters
    const url = new URL(url_translate);
    url.search = new URLSearchParams(params).toString();
    const encodedUrl = encodeURIComponent(url.toString());
    const totalURL = `${CORSbypass}?url=${encodedUrl}`;

    // if(debug) console.log(totalURL);

    try {
        const response = await fetch(totalURL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse JSON response
        const data = await response.json();
        // if (debug) console.log(data);
        return "ooba";
    } catch (error) {
        console.error('Translation error:', error);
    }
}