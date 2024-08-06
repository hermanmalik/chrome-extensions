
const supabaseUrl = 'https://ewrbzfdnftpatucmaqnn.supabase.co';
// This key is safe to use in a browser if you have enabled Row Level Security (RLS) for your tables and configured policies. 
// You may also use the (secret) service key to bypass RLS.
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cmJ6ZmRuZnRwYXR1Y21hcW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwMjQwMzUsImV4cCI6MjAzNzYwMDAzNX0.bvMuU-dKxPEEcnaEnwJN4-ySLsgQcnLMGgmCt4tko8c";

import { createClient } from '@supabase/supabase-js'
// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey)


const fs = require('fs');
const path = require('path');

// File path to upload
const filePath = path.join(__dirname, 'your-file.txt');


// Upload the file
async function uploadFile() {
    const { data, error } = await supabase.storage
        .from('bookmarks')
        .upload('your-file.txt', fs.readFileSync(filePath));

    if (error) {
        console.error('Error uploading file:', error);
    } else {
        console.log('File uploaded successfully:', data);
    }
}

async function downloadFile() {
    const { data, error } = await supabase.storage
        .from('bookmarks')
        .download('your-file.txt');

    if (error) {
        console.error('Error downloading file:', error);
    } else {
        fs.writeFileSync(filePath, data);
        console.log('File downloaded successfully');
    }
}

// considerations: only have perms to add and update files, not delete
// maybe sync bookmarks file on disk instead?
// append month to data, effectively creating monthly backups? 
// since we're using node, api keys should go in env file
// maybe make different things their own extensions anyway?
// workflow:
// - on detected changes, upload to supabase
// - on browser launch and periodically, download from supabase
// - on install, prompt whether to use supabase copy or local copy
// - how to deal with merge conflicts? trust supabase maybe. so download before upload?
// ANswer: we have access to IDs. 
// would be nice to have a "trash" in supabase where deleted bookmarks are sent to
// before downloading, make a diff list of IDs (which ones removed or added), and check their names.
// notify user.
// problems: 1) can't access names of removed IDs? (nvm can). 2) what can user do? 
// 3) can't detect moves - also need to check parent changes. how do we know if it's a conflict or intentional?
// ans. we track which operation was meant to be done, and if the diff is different than that it's a conflict.
// 4) this should also be a backup system. maybe keep the last 30 changes?

// functions needed:
// chrome.bookmarks.getTree() - gets local bookmark tree.
// treeToMap(tree) - turns tree to map
// checkMergeConflict(localMap, remoteMap) - checks for IDs not shared, parents not shared
// uploadBookmarksMap(localMap, optional arg ID) - uploads to supabase with given ID (watch out for sql injection attacks) 
// downloadBookmarksMap(optional arg backupID) - downloads bookmarks with given backupID, or the most recent if no ID given
//     note: maybe backupID is not the best way to keep track of these?
// importBookmarks(remoteMap) - imports the given bookmark tree map into chrome
    // check if localMap = remoteMap. if so, abort.
    // overwrite local map with remote map
    // clear local bookmark tree
    // recursively import bookmarks from map

// functionality:
// popup for manual sync, naming backups, and merge conflict resolution
// on 


const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-supabase-key';
const SYNC_INTERVAL = 60 * 60 * 1000; // 1 hour

let localBookmarksMap = new Map(); // To keep track of local bookmarks

// Utility to fetch bookmarks from Supabase
async function fetchBookmarksFromSupabase() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/bookmarks`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bookmarks from Supabase: ' + await response.text());
  }

  return response.json();
}

// Utility to upload bookmarks to Supabase
async function uploadBookmarksToSupabase(bookmarks) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify(bookmarks)
  });

  if (!response.ok) {
    throw new Error('Failed to upload bookmarks to Supabase: ' + await response.text());
  }
}

// Utility to update local bookmarks map
function updateLocalBookmarksMap(bookmarks) {
  localBookmarksMap.clear();
  bookmarks.forEach(bookmark => {
    localBookmarksMap.set(bookmark.id, bookmark);
  });
}

// Sync local bookmarks to Supabase
async function syncLocalBookmarksToSupabase() {
  try {
    const bookmarks = await chrome.bookmarks.getTree();
    const flattenedBookmarks = flattenBookmarks(bookmarks);
    await uploadBookmarksToSupabase(flattenedBookmarks);
  } catch (error) {
    console.error('Error syncing local bookmarks:', error);
  }
}

// Flatten nested bookmarks structure
function flattenBookmarks(bookmarks) {
  let result = [];
  
  bookmarks.forEach(bookmark => {
    result.push({
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url || null,
      parent_id: bookmark.parentId || null
    });

    if (bookmark.children) {
      result = result.concat(flattenBookmarks(bookmark.children));
    }
  });
  
  return result;
}

// Import bookmarks from Supabase to Chrome
async function importBookmarksToChrome(bookmarks) {
  async function createBookmark(bookmark) {
    if (bookmark.url) {
      await chrome.bookmarks.create({
        parentId: bookmark.parent_id || undefined,
        title: bookmark.title,
        url: bookmark.url
      });
    } else {
      const folder = await chrome.bookmarks.create({
        parentId: bookmark.parent_id || undefined,
        title: bookmark.title
      });

      for (const child of bookmarks.filter(b => b.parent_id === bookmark.id)) {
        await createBookmark(child);
      }
    }
  }

  for (const bookmark of bookmarks.filter(b => !b.parent_id)) {
    await createBookmark(bookmark);
  }
}

// Handle changes in Chrome bookmarks
function handleBookmarkChange(changeInfo) {
  syncLocalBookmarksToSupabase();
}

// Initialize the extension
async function initialize() {
  try {
    const bookmarksFromSupabase = await fetchBookmarksFromSupabase();
    updateLocalBookmarksMap(bookmarksFromSupabase);
    await importBookmarksToChrome(bookmarksFromSupabase);
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Periodically check for remote changes
function schedulePeriodicSync() {
  setInterval(async () => {
    try {
      const bookmarksFromSupabase = await fetchBookmarksFromSupabase();
      const newLocalBookmarksMap = new Map();
      bookmarksFromSupabase.forEach(bookmark => newLocalBookmarksMap.set(bookmark.id, bookmark));

      // Check for changes
      localBookmarksMap.forEach((value, key) => {
        if (!newLocalBookmarksMap.has(key) || JSON.stringify(value) !== JSON.stringify(newLocalBookmarksMap.get(key))) {
          importBookmarksToChrome(bookmarksFromSupabase);
          return;
        }
      });

      updateLocalBookmarksMap(bookmarksFromSupabase);
    } catch (error) {
      console.error('Error checking for remote changes:', error);
    }
  }, SYNC_INTERVAL);
}

// Event listeners
chrome.bookmarks.onCreated.addListener(handleBookmarkChange);
chrome.bookmarks.onRemoved.addListener(handleBookmarkChange);
chrome.bookmarks.onChanged.addListener(handleBookmarkChange);

// Initialize on installation and start periodic sync
chrome.runtime.onInstalled.addListener(initialize);
schedulePeriodicSync();
