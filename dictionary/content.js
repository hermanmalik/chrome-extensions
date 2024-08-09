const BASIC_DICT_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const DICT_URL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/"
const THES_URL = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"
const TRANSLATE_URL = 'https://655.mtis.workers.dev/translate';
const GPT_URL = 'https://api.openai.com/v1/chat/completions'; // GPT-4 API endpoint
const CORSbypass = "https://api.allorigins.win/get";



// 1000 most common words; excluded from dictionary search
// source: https://github.com/first20hours/google-10000-english/blob/master/google-10000-english-usa.txt
const _1000mostcommon = ["the", "of", "and", "to", "a", "in", "for", "is", "on", "that", "by", "this", "with", "i", "you", "it", "not", "or", "be", "are", "from", "at", "as", "your", "all", "have", "new", "more", "an", "was", "we", "will", "home", "can", "us", "about", "if", "page", "my", "has", "search", "free", "but", "our", "one", "other", "do", "no", "information", "time", "they", "site", "he", "up", "may", "what", "which", "their", "news", "out", "use", "any", "there", "see", "only", "so", "his", "when", "contact", "here", "business", "who", "web", "also", "now", "help", "get", "pm", "view", "online", "c", "e", "first", "am", "been", "would", "how", "were", "me", "s", "services", "some", "these", "click", "its", "like", "service", "x", "than", "find", "price", "date", "back", "top", "people", "had", "list", "name", "just", "over", "state", "year", "day", "into", "email", "two", "health", "n", "world", "re", "next", "used", "go", "b", "work", "last", "most", "products", "music", "buy", "data", "make", "them", "should", "product", "system", "post", "her", "city", "t", "add", "policy", "number", "such", "please", "available", "copyright", "support", "message", "after", "best", "software", "then", "jan", "good", "video", "well", "d", "where", "info", "rights", "public", "books", "high", "school", "through", "m", "each", "links", "she", "review", "years", "order", "very", "privacy", "book", "items", "company", "r", "read", "group", "sex", "need", "many", "user", "said", "de", "does", "set", "under", "general", "research", "university", "january", "mail", "full", "map", "reviews", "program", "life", "know", "games", "way", "days", "management", "p", "part", "could", "great", "united", "hotel", "real", "f", "item", "international", "center", "ebay", "must", "store", "travel", "comments", "made", "development", "report", "off", "member", "details", "line", "terms", "before", "hotels", "did", "send", "right", "type", "because", "local", "those", "using", "results", "office", "education", "national", "car", "design", "take", "posted", "internet", "address", "community", "within", "states", "area", "want", "phone", "dvd", "shipping", "reserved", "subject", "between", "forum", "family", "l", "long", "based", "w", "code", "show", "o", "even", "black", "check", "special", "prices", "website", "index", "being", "women", "much", "sign", "file", "link", "open", "today", "technology", "south", "case", "project", "same", "pages", "uk", "version", "section", "own", "found", "sports", "house", "related", "security", "both", "g", "county", "american", "photo", "game", "members", "power", "while", "care", "network", "down", "computer", "systems", "three", "total", "place", "end", "following", "download", "h", "him", "without", "per", "access", "think", "north", "resources", "current", "posts", "big", "media", "law", "control", "water", "history", "pictures", "size", "art", "personal", "since", "including", "guide", "shop", "directory", "board", "location", "change", "white", "text", "small", "rating", "rate", "government", "children", "during", "usa", "return", "students", "v", "shopping", "account", "times", "sites", "level", "digital", "profile", "previous", "form", "events", "love", "old", "john", "main", "call", "hours", "image", "department", "title", "description", "non", "k", "y", "insurance", "another", "why", "shall", "property", "class", "cd", "still", "money", "quality", "every", "listing", "content", "country", "private", "little", "visit", "save", "tools", "low", "reply", "customer", "december", "compare", "movies", "include", "college", "value", "article", "york", "man", "card", "jobs", "provide", "j", "food", "source", "author", "different", "press", "u", "learn", "sale", "around", "print", "course", "job", "canada", "process", "teen", "room", "stock", "training", "too", "credit", "point", "join", "science", "men", "categories", "advanced", "west", "sales", "look", "english", "left", "team", "estate", "box", "conditions", "select", "windows", "photos", "gay", "thread", "week", "category", "note", "live", "large", "gallery", "table", "register", "however", "june", "october", "november", "market", "library", "really", "action", "start", "series", "model", "features", "air", "industry", "plan", "human", "provided", "tv", "yes", "required", "second", "hot", "accessories", "cost", "movie", "forums", "march", "la", "september", "better", "say", "questions", "july", "yahoo", "going", "medical", "test", "friend", "come", "dec", "server", "pc", "study", "application", "cart", "staff", "articles", "san", "feedback", "again", "play", "looking", "issues", "april", "never", "users", "complete", "street", "topic", "comment", "financial", "things", "working", "against", "standard", "tax", "person", "below", "mobile", "less", "got", "blog", "party", "payment", "equipment", "login", "student", "let", "programs", "offers", "legal", "above", "recent", "park", "stores", "side", "act", "problem", "red", "give", "memory", "performance", "social", "q", "august", "quote", "language", "story", "sell", "options", "experience", "rates", "create", "key", "body", "young", "america", "important", "field", "few", "east", "paper", "single", "ii", "age", "activities", "club", "example", "girls", "additional", "password", "z", "latest", "something", "road", "gift", "question", "changes", "night", "ca", "hard", "texas", "oct", "pay", "four", "poker", "status", "browse", "issue", "range", "building", "seller", "court", "february", "always", "result", "audio", "light", "write", "war", "nov", "offer", "blue", "groups", "al", "easy", "given", "files", "event", "release", "analysis", "request", "fax", "china", "making", "picture", "needs", "possible", "might", "professional", "yet", "month", "major", "star", "areas", "future", "space", "committee", "hand", "sun", "cards", "problems", "london", "washington", "meeting", "rss", "become", "interest", "id", "child", "keep", "enter", "california", "porn", "share", "similar", "garden", "schools", "million", "added", "reference", "companies", "listed", "baby", "learning", "energy", "run", "delivery", "net", "popular", "term", "film", "stories", "put", "computers", "journal", "reports", "co", "try", "welcome", "central", "images", "president", "notice", "god", "original", "head", "radio", "until", "cell", "color", "self", "council", "away", "includes", "track", "australia", "discussion", "archive", "once", "others", "entertainment", "agreement", "format", "least", "society", "months", "log", "safety", "friends", "sure", "faq", "trade", "edition", "cars", "messages", "marketing", "tell", "further", "updated", "association", "able", "having", "provides", "david", "fun", "already", "green", "studies", "close", "common", "drive", "specific", "several", "gold", "feb", "living", "sep", "collection", "called", "short", "arts", "lot", "ask", "display", "limited", "powered", "solutions", "means", "director", "daily", "beach", "past", "natural", "whether", "due", "et", "electronics", "five", "upon", "period", "planning", "database", "says", "official", "weather", "mar", "land", "average", "done", "technical", "window", "france", "pro", "region", "island", "record", "direct", "microsoft", "conference", "environment", "records", "st", "district", "calendar", "costs", "style", "url", "front", "statement", "update", "parts", "aug", "ever", "downloads", "early", "miles", "sound", "resource", "present", "applications", "either", "ago", "document", "word", "works", "material", "bill", "apr", "written", "talk", "federal", "hosting", "rules", "final", "adult", "tickets", "thing", "centre", "requirements", "via", "cheap", "nude", "kids", "finance", "true", "minutes", "else", "mark", "third", "rock", "gifts", "europe", "reading", "topics", "bad", "individual", "tips", "plus", "auto", "cover", "usually", "edit", "together", "videos", "percent", "fast", "function", "fact", "unit", "getting", "global", "tech", "meet", "far", "economic", "en", "player", "projects", "lyrics", "often", "subscribe", "submit", "germany", "amount", "watch", "included", "feel", "though", "bank", "risk", "thanks", "everything", "deals", "various", "words", "linux", "jul", "production", "commercial", "james", "weight", "town", "heart", "advertising", "received", "choose", "treatment", "newsletter", "archives", "points", "knowledge", "magazine", "error", "camera", "jun", "girl", "currently", "construction", "toys", "registered", "clear", "golf", "receive", "domain", "methods", "chapter", "makes", "protection", "policies", "loan", "wide", "beauty", "manager", "india", "position", "taken", "sort", "listings", "models", "michael", "known", "half", "cases", "step", "engineering", "florida", "simple", "quick", "none", "wireless", "license", "paul", "friday", "lake", "whole", "annual", "published", "later", "basic", "sony", "shows", "corporate", "google", "church", "method", "purchase", "customers", "active", "response", "practice", "hardware", "figure", "materials", "fire", "holiday", "chat", "enough", "designed", "along", "among", "death", "writing", "speed", "html", "countries", "loss", "face", "brand", "discount", "higher", "effects", "created", "remember", "standards", "oil", "bit", "yellow", "political", "increase", "advertise", "kingdom", "base", "near", "environmental", "thought", "stuff", "french", "storage", "oh", "japan", "doing", "loans", "shoes", "entry"];

const debug = true;

if (DICT_KEY == "" || THES_KEY == "" || GPT_KEY=="") {
    alert("You are missing an API key. Please modify dictionary/content.js.");
}

document.addEventListener('dblclick', function (event) {
    loadPopups(event);
});
document.addEventListener('mouseup', function (event) {
    loadPopups(event);
});

// Makes main popup and mini popup buttons
function loadPopups(event) {

    const selectedText = window.getSelection().toString();
    // Trim to remove leading and trailing spaces; split by whitespace and filter out empty strings; return length of the array
    const numWords = selectedText.trim().split(/\s+/).length

    if (debug) console.log("Selected text: ", selectedText);

    // Make and style main popup
    const main_popup = document.createElement('div');
    main_popup.classList.add('popup-class');
    main_popup.style.top = event.pageY + 20 + 'px';
    main_popup.style.left = event.pageX + 'px';
    // TODO - center on the highlighted text
    // // Position popover relative to the button
    // const rect = triggerButton.getBoundingClientRect();
    // popover.style.top = rect.bottom + 'px';
    // popover.style.left = rect.left + 'px';

    // Make mini popups
    const mini_popups = [];
    if (selectedText.length > 3 && numWords === 1 && !(selectedText in _1000mostcommon)) {
        dictionary_button = makeMiniPopup(dictionaryLookup, "d", -20);
    }
    if (selectedText.length > 3 && numWords === 1) {
        thesaurus_button = makeMiniPopup(thesaurusLookup, "th", 0);
    }
    if (selectedText.length > 3) {
        translateButton = makeMiniPopup(translateText, "tr", 20);
    }


    // Remove popup buttons when clicking elsewhere
    document.addEventListener('mousedown', function removePopup(e) {
        // Check if the click is outside all mini popups and the main popup
        const isClickOutside = !mini_popups.some(popup => popup.contains(e.target)) &&
            !main_popup.contains(e.target);

        if (isClickOutside) {
            // Remove all mini popups and main popup
            mini_popups.forEach(popup => popup.remove());
            mini_popups.length = 0; // Clear the array
            main_popup.remove();
            document.removeEventListener('mousedown', removePopup);
            if (debug) console.log("removed popups");
        }
    });


    ////////// HELPER FUNCTIONS //////////

    // Load the contents of each lookup
    // on fulfillment, append the popup button to the document below the selection, and store lookup in a variable 
    async function makeMiniPopup(lookupFunction, innerText, xOffset, shouldBackgroundLoad = true) {
        // make popup button and append it to document
        const mini_popup = document.createElement('div');
        mini_popup.innerText = innerText;
        mini_popup.classList.add('popup-class');
        mini_popup.style.top = event.pageY + 'px';
        mini_popup.style.left = (event.pageX + xOffset) + 'px';
        mini_popups.push(mini_popup);
        document.body.appendChild(mini_popup);

        // new - load only when clicked to save on API usage
        mini_popup.addEventListener('click', (e) => {
            main_popup.innerHTML = "<p>Loading...</p>";
            activateMainPopup(lookupFunction);
        });

        return mini_popup;
    }

    // Activate main popup
    async function activateMainPopup(lookupFunction) {
        // async load the contents of each lookup
        let lookupResult;
        try {
            // Call the lookup function with the selected text
            lookupResult = await lookupFunction(selectedText);
        } catch (error) {
            console.log("Error with lookup function: ", error);
            lookupResult = '<p>No result found.</p>';
        } // TODO fix shitty error handling

        main_popup.innerHTML = lookupResult;
        document.body.appendChild(main_popup);
        if (debug) console.log("popup activated");
    }
};

/////////////// LOOKUP FUNCTIONS ///////////////

// returns HTML for definition
async function dictionaryLookup(input_text) {
    // TODO switch over to Merriam's API lol
    const response = await fetch(`${BASIC_DICT_URL}${input_text}`);
    const data = await response.json();

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
    const response = await fetch(`${THES_URL}${input_text}?key=${THES_KEY}`);
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

// Function to translate text using OpenAI's API
async function translateText(input_text) {
    // Define the prompt for translation
    const prompt = `Translate the following text to English: ${input_text}`;

    // Define the API request body
    const requestBody = {
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'Translate the user text to English if it is in Spanish, and Spanish if it is in English. Output ONLY the translated text.' },
            { role: 'user', content: prompt }
        ],
        max_tokens: 100 // TODO adjust? 
    };

    try {
        // Make the API request
        const response = await fetch(GPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the response JSON
        const data = await response.json();

        // Extract the translated text
        const translatedText = data.choices[0].message.content.trim();

        // Return the HTML for the translated text
        return `<div class="translation-result"><p>${translatedText}</p></div>`;
    } catch (error) {
        console.error('Error translating text:', error);
        return `<div class="translation-error"><p>Translation failed.</p></div>`;
    }
}
