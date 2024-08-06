
// Supabase configuration

const PAGE_SIZE = 1000;
const AUTO_SYNC_TIME_MINUTES = 60;

// Function to flatten the bookmark tree structure
function flattenBookmarks(bookmarkNodes) {
  let flatBookmarks = [];

  bookmarkNodes.forEach((bookmark) => {
    const flatBookmark = {
      id: bookmark.id,
      parent_id: (bookmark.parentId !== undefined && bookmark.parentId !== null) ? bookmark.parentId : null,  // Handle 0 as valid
      index: (bookmark.index !== undefined && bookmark.index !== null) ? bookmark.index : null, 
      title: bookmark.title,
      url: bookmark.url || null // here no need to handle 0
    };

    flatBookmarks.push(flatBookmark);

    // Recursively process children if they exist
    if (bookmark.children && bookmark.children.length > 0) {
      flatBookmarks = flatBookmarks.concat(flattenBookmarks(bookmark.children, bookmark.id));
    }
  });

  return flatBookmarks;
}

// Function to sanitize bookmark data
function sanitizeBookmarks(bookmarks) {
  return bookmarks.map(bookmark => ({
    id: bookmark.id,
    parent_id: bookmark.parent_id || null,
    index: bookmark.index || null,
    title: bookmark.title,
    url: bookmark.url || null
  }));
}

// Function to upload bookmarks data to Supabase
async function upsertBookmarks(bookmarkNodes) {
  try {
    // Send the sanitized data to Supabase
    const response = await fetch(`${SUPABASE_URL}?on_conflict=id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(bookmarkNodes),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase upload failed: ${response.statusText} - ${errorText}`);
    }
    
    console.log('Bookmarks uploaded successfully');
  } catch (error) {
    console.error('Failed to upload bookmarks:', error);
  }
}

// Function to fetch all bookmarks
async function fetchAllBookmarks() {
  let allBookmarks = [];
  let offset = 0;

  while (true) {
    const response = await fetch(`${SUPABASE_URL}?limit=${PAGE_SIZE}&offset=${offset}`, {
      headers: {
        'apikey': SUPABASE_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error('Error fetching bookmarks');
    }

    const bookmarks = await response.json();
    if (bookmarks.length === 0) {
      break; // No more data to fetch
    }

    allBookmarks = allBookmarks.concat(bookmarks);
    offset += PAGE_SIZE;
  }
  
  return allBookmarks;
}


async function deleteBookmarks(currentBookmarks) {
  try {
    const existingBookmarks = await fetchAllBookmarks();
    const currentBookmarkIds = new Set(currentBookmarks.map(b => b.id));
    const bookmarksToDelete = existingBookmarks.filter(b => !currentBookmarkIds.has(b.id));

    if (bookmarksToDelete.length === 0) {
      console.log('No bookmarks need to be deleted.');
      return;
    }

    // Prepare the list of IDs to delete
    const deleteIds = bookmarksToDelete.map(b => b.id);

    // Send the delete request to Supabase
    const deleteResponse = await fetch(`${SUPABASE_URL}?id=in.(${deleteIds.join(',')})`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation'
      },
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      throw new Error(`Supabase delete failed: ${deleteResponse.statusText} - ${errorText}`);
    }

    console.log(bookmarksToDelete.length + ' bookmarks deleted successfully');
  } catch (error) {
    console.error('Failed to delete bookmarks:', error);
  }
}


// The main function to update bookmarks using Chrome and Supabase APIs
async function updateBookmarks() {
  chrome.bookmarks.getTree(async (bookmarks) => {
    const processedBookmarks = sanitizeBookmarks(flattenBookmarks(bookmarks));
    await upsertBookmarks(processedBookmarks);
    await deleteBookmarks(processedBookmarks);
  });

  // Record the sync time
  const syncTime = new Date().toLocaleString(); 
  chrome.storage.local.set({ lastSyncTime: syncTime });
}



// Create alarm for periodic sync
chrome.runtime.onStartup.addListener(() => {
  updateBookmarks();
  chrome.alarms.create('syncBookmarks', { periodInMinutes: AUTO_SYNC_TIME_MINUTES });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncBookmarks') {
    updateBookmarks();
  }
});

// Sync on install
chrome.runtime.onInstalled.addListener(() => {
  updateBookmarks();
});

// Sync whenever there is a change to bookmarks
chrome.bookmarks.onChanged.addListener(() => {
  updateBookmarks();
})

chrome.bookmarks.onChildrenReordered.addListener(() => {
  updateBookmarks();
})

chrome.bookmarks.onCreated.addListener(() => {
  updateBookmarks();
})

chrome.bookmarks.onImportEnded.addListener(() => {
  updateBookmarks();
})

chrome.bookmarks.onImportEnded.addListener(() => {
  updateBookmarks();
})

chrome.bookmarks.onMoved.addListener(() => {
  updateBookmarks();
})

chrome.bookmarks.onRemoved.addListener(() => {
  updateBookmarks();
})

// Message listener for manual sync
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'syncNow') {
    updateBookmarks();
    sendResponse({ status: 'Sync started' });
  }
});
