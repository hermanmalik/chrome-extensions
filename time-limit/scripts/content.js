
const currentUrl = window.location.href;

if (currentUrl.search("youtube") != -1) {
    const timeLimit = 30 * 60;
} else if (currentUrl.search("reddit" != -1)) {
    const timeLimit = 20 * 60;
} else {
    const timeLimit = -1;
}

if (timeLimit > 0) {

console.log("timer up");
const interval = 10; // in secs
const timeLimit = 30 * 60 // also in secs
let seconds = 0;
let poppedUp = 0;
// https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
// this is not an accurate timer but whatever
// todo: make it active window only
setInterval(function() {
    seconds += interval;
    if (poppedUp > 0) {
        poppedUp -= interval;
    }
    if (seconds % timeLimit < 3 * interval && poppedUp <= 0) {
        poppedUp = 6 * interval;
        alert("pop up");
    }
    }, 1000 * interval); // update about every second

}