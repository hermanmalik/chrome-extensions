
const GESTURE_CONFIG = {
    "UP": { action: 'createTab', url: 'chrome://newtab' },
    "DOWN": { action: 'minimizeWindow' },
    "LEFT": { action: 'navigateBack' },
    "RIGHT": { action: 'navigateForward' },
    "DOWN_LEFT": { action: 'zoomIn' },
    "LEFT_DOWN": { action: 'zoomOut' },
    "DOWN_RIGHT": { action: 'closeCurrentTab' },
    "LEFT_UP": { action: 'reopenLastClosedTab' },
    "UP_DOWN": { action: 'reload' },
    "UP_LEFT": { action: 'goTabLeft' },
    "UP_RIGHT": { action: 'goTabRight' },
    "RIGHT_UP": { action: 'scrollTop' },
    "RIGHT_DOWN": { action: 'scrollBottom' }
};

let startX, startY; // gesture start position
let gestureSegments = []; // stores segments of the gesture
let recording = false; // turns on when we want to look at the gesture
let gestureDiv;
let hideContextMenu = false;


const MIN_DISTANCE_THRESHOLD = 50; // Minimum distance to consider as a gesture segment
const MIN_VERTICAL_MOVEMENT = 20; // Minimum vertical movement to distinguish up/down
const MIN_HORIZONTAL_MOVEMENT = 20; // Minimum horizontal movement to distinguish left/right
const debug = false;

// To convert from GestureDirection to cardinal direction use getDirectionName
const GestureDirection = {
    NONE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};
let currentDirection = GestureDirection.NONE;


// mouseDown handler begins listening for mouse gestures
function handleMouseDown(event) {
    // only listen to right clicks
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
    // don't actually do anything if not recording
    if (recording) {        
        // displacement of current segment
        const distanceX = event.clientX - startX;
        const distanceY = event.clientY - startY;
        
        // Determine the predominant direction of the current segment 
        let direction;
        // When a threshold is passed in a new direction, push the segment to gestureSegments and reset
        if (Math.abs(distanceX) >= MIN_DISTANCE_THRESHOLD || Math.abs(distanceY) >= MIN_DISTANCE_THRESHOLD) {
            if (Math.abs(distanceX) >= Math.abs(distanceY)) {
                direction = distanceX > 0 ? GestureDirection.RIGHT : GestureDirection.LEFT;
            } else {
                direction = distanceY > 0 ? GestureDirection.DOWN : GestureDirection.UP;
            }
            
            // Check if this segment of the gesture continues the current direction
            if (direction !== currentDirection || gestureSegments.length === 0) {
                // If direction changes or no previous segment, start a new segment
                gestureSegments.push(direction);
                gestureDiv.textContent += getDirectionName(direction) + " ";
                currentDirection = direction;
            }
            
            // Reset start positions for the next segment
            startX = event.clientX;
            startY = event.clientY;
        }
    }
}

// mouseUp hander processes the gesture and does cleanup
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

// If a full gesture segment is recorded, don't show right-click menu
function handleContextMenu(event) {
    if (hideContextMenu) {
        event.preventDefault();
        hideContextMenu = false; // Reset the flag
    }
}

// takes the array of recorded gestureSegments and asks the background service worker to do something
function processGesture(segments) {
      if (debug) console.log("Detected Gesture:", segments.map(dir => getDirectionName(dir)).join(' -> '));
    
      // Convert the segments array to a string key
      const key = segments.map(dir => getDirectionName(dir)).join('_');
      // Lookup action based on the gesture pattern
      const gesture_action = GESTURE_CONFIG[key];  
      if (debug) console.log("Detected Action: ", gesture_action);
      // If the action is invalid just return
      if (!gesture_action) return; 
      
      // scrolling to top and bottom need to be handled in content script
      if (gesture_action.action === 'scrollTop') {
          window.scrollTo(0,0);
          return;
      }
      if (gesture_action.action === 'scrollBottom') {
          window.scrollTo(0,document.body.scrollHeight);
          return;
      }
      // send all other gestures to the background worker 
      chrome.runtime.sendMessage({ action: gesture_action.action, url: gesture_action.url});
}

// perhaps self explanatory
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

// creates overlay showing to the user the current state of the gesture segments tracked
function createGestureDiv() {
    const newDiv = document.createElement('div');
    newDiv.style.position = "fixed"; // center on screen
    newDiv.style.background = "rgba(0.4,0.4,0.4,0.6)"; // somehwat transparent
    newDiv.style.padding = "5px";
    newDiv.style.maxHeight = "30px";
    newDiv.style.borderRadius = "2px";
    newDiv.style.color = "white";
    newDiv.style.textAlign = "center"; // center on screen
    newDiv.style.font = "normal normal bold 14px/1 sans-serif";
    newDiv.style.whiteSpace = "nowrap" // want it to expand horizontally
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

