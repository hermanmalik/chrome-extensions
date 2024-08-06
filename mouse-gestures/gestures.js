let startX, startY; // gesture start position
let gestureSegments = []; // stores segments of the gesture
let recording = false; // turns on when we want to look at the gesture
let gestureDiv;
let hideContextMenu = false;


const MIN_DISTANCE_THRESHOLD = 50; // Minimum distance to consider as a gesture segment
const MIN_VERTICAL_MOVEMENT = 20; // Minimum vertical movement to distinguish up/down
const MIN_HORIZONTAL_MOVEMENT = 20; // Minimum horizontal movement to distinguish left/right
const debug = false;

const GestureDirection = {
    NONE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};
let currentDirection = GestureDirection.NONE;




function handleMouseDown(event) {
    if (event.button === 2) {
        if (debug) console.log("mouse down");
        // Reset trackers
        currentDirection = GestureDirection.NONE;
        gestureSegments = [];
        startX = event.clientX;
        startY = event.clientY;
        // Start recording
        gestureDiv = createGestureDiv();
        document.body.appendChild(gestureDiv);
        recording = true;
    }
}

function handleMouseMove(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    const distanceX = mouseX - startX;
    const distanceY = mouseY - startY;
    
    // Determine the predominant direction of movement
    let direction;
    if (Math.abs(distanceX) >= MIN_DISTANCE_THRESHOLD || Math.abs(distanceY) >= MIN_DISTANCE_THRESHOLD) {
        if (Math.abs(distanceX) >= Math.abs(distanceY)) {
            direction = distanceX > 0 ? GestureDirection.RIGHT : GestureDirection.LEFT;
        } else {
            direction = distanceY > 0 ? GestureDirection.DOWN : GestureDirection.UP;
        }
        
        // Check if this segment of the gesture continues the current direction
        if (direction !== currentDirection || gestureSegments.length === 0) {
            // If direction changes or no previous segment, start a new segment
            if (recording) gestureSegments.push(direction);
            gestureDiv.textContent += getDirectionName(direction) + " ";
            currentDirection = direction;
        }
        
        // Reset start positions for the next segment
        startX = mouseX;
        startY = mouseY;
    }
}

function handleMouseUp(event) {
    if (debug) console.log("mouse up");
    // Stop recording
    recording = false;
    if (gestureDiv) gestureDiv.remove();
    // Process the complete gesture
    processGesture(gestureSegments);
    // Prevent context menu if necessary
    hideContextMenu = gestureSegments.length > 0;
    // Reset trackers
    currentDirection = GestureDirection.NONE;
    gestureSegments = [];
    startX = event.clientX;
    startY = event.clientY;
}

function handleContextMenu(event) {
    if (hideContextMenu) {
        event.preventDefault();
        hideContextMenu = false; // Reset the flag
    }
}

function processGesture(segments) {
    if (debug) console.log("Detected Gesture:", segments.map(dir => getDirectionName(dir)).join(' -> '));
    let gesture_action;
    switch (segments.length) {
        case 1:
            if (segments[0] == GestureDirection.UP) {
                chrome.runtime.sendMessage({
                    action: 'createTab',
                    url: 'chrome://newtab'
                });
            }
            if (segments[0] == GestureDirection.DOWN) gesture_action = 'minimizeWindow';
            if (segments[0] == GestureDirection.LEFT) gesture_action = 'navigateBack';
            if (segments[0] == GestureDirection.RIGHT) gesture_action = 'navigateForward';
            break;
        case 2:
            if (segments[0] == GestureDirection.DOWN && segments[1] == GestureDirection.LEFT) gesture_action = 'zoomIn';
            if (segments[0] == GestureDirection.LEFT && segments[1] == GestureDirection.DOWN) gesture_action ='zoomOut';
            if (segments[0] == GestureDirection.DOWN && segments[1] == GestureDirection.RIGHT) gesture_action = 'closeCurrentTab';
            if (segments[0] == GestureDirection.LEFT && segments[1] == GestureDirection.UP) gesture_action = 'reopenLastClosedTab';
            if (segments[0] == GestureDirection.UP && segments[1] == GestureDirection.DOWN) gesture_action = 'reload';
            if (segments[0] == GestureDirection.UP && segments[1] == GestureDirection.LEFT) gesture_action = 'goTabLeft';
            if (segments[0] == GestureDirection.UP && segments[1] == GestureDirection.RIGHT) gesture_action = 'goTabRight';
            if (segments[0] == GestureDirection.RIGHT && segments[1] == GestureDirection.UP) window.scrollTo(0, 0); // scroll to top
            if (segments[0] == GestureDirection.RIGHT && segments[1] == GestureDirection.DOWN) window.scrollTo(0, document.body.scrollHeight); // scroll to bottom
            break;
        default:
            break;
    }
    if (gesture_action) chrome.runtime.sendMessage({ action: gesture_action });
}

function getDirectionName(direction) {
    switch (direction) {
        case GestureDirection.UP:
            return "UP";
        case GestureDirection.DOWN:
            return "DOWN";
        case GestureDirection.LEFT:
            return "LEFT";
        case GestureDirection.RIGHT:
            return "RIGHT";
        default:
            return "UNKNOWN";
    }
}

function createGestureDiv() {
    const newDiv = document.createElement('div');
    newDiv.style.position = "fixed";
    newDiv.style.background = "rgba(0.4,0.4,0.4,0.6)";
    newDiv.style.padding = "5px";
    newDiv.style.maxHeight = "30px";
    newDiv.style.borderRadius = "2px";
    newDiv.style.color = "white";
    newDiv.style.textAlign = "center";
    newDiv.style.font = "normal normal bold 14px/1 sans-serif";
    newDiv.style.whiteSpace = "nowrap"
    newDiv.style.top = "50%";
    newDiv.style.left = "50%";
    newDiv.style.transform = "translate(-50%, -50%)"; // Center by adjusting for element's own size
    newDiv.innerText = "";
    if (debug) console.log("made div");
    return newDiv;
}

document.addEventListener('mousemove', handleMouseMove); 
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('contextmenu', handleContextMenu);

