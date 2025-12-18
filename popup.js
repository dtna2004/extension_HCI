// Apply theme and font when popup loads
document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings or use defaults
  chrome.storage.local.get([
    'reader-theme', 'reader-font', 'reader-voice', 'extension-enabled', 
    'focus-mode', 'font-size'
  ], function(result) {
    const savedTheme = result['reader-theme'] || 'default';
    const savedFont = result['reader-font'] || 'default';
    const savedVoice = result['reader-voice'] || 'vi-VN-HoaiMyNeural';
    const savedFontSize = result['font-size'] || 16;
    const extensionEnabled = result['extension-enabled'] !== false; // default to true
    const focusModeEnabled = result['focus-mode'] === true;
    
    document.getElementById('theme-selector').value = savedTheme;
    document.getElementById('font-selector').value = savedFont;
    document.getElementById('voice-selector').value = savedVoice;
    document.getElementById('font-size-slider').value = savedFontSize;
    
    // Set toggle button state
    const toggleButton = document.getElementById('toggle-extension');
    if (extensionEnabled) {
      toggleButton.textContent = 'Tắt Extension';
      toggleButton.classList.remove('disabled');
    } else {
      toggleButton.textContent = 'Bật Extension';
      toggleButton.classList.add('disabled');
    }
    
    // Set focus mode button state
    const focusButton = document.getElementById('focus-mode-toggle');
    if (focusModeEnabled) {
      focusButton.textContent = 'Tắt Chế độ Tập trung';
      focusButton.classList.add('active');
    } else {
      focusButton.textContent = 'Bật Chế độ Tập trung';
      focusButton.classList.remove('active');
    }
    
    // Apply theme and font to popup only (not affecting web page)
    applyThemeToPopup(savedTheme);
    applyFontToPopup(savedFont);
  });
  
  // Set up audio player controls
  document.getElementById('play-btn').addEventListener('click', function() {
    const audio = document.getElementById('audio-element');
    audio.play();
  });
  
  // Set up pause button
  document.getElementById('pause-btn').addEventListener('click', function() {
    const audio = document.getElementById('audio-element');
    audio.pause();
  });
  
  // Set up extension toggle
  document.getElementById('toggle-extension').addEventListener('click', function() {
    chrome.storage.local.get(['extension-enabled'], function(result) {
      const isEnabled = result['extension-enabled'] !== false;
      const newStatus = !isEnabled;
      
      chrome.storage.local.set({'extension-enabled': newStatus}, function() {
        console.log('Extension status saved: ' + newStatus);
      });
      
      const toggleButton = document.getElementById('toggle-extension');
      if (newStatus) {
        toggleButton.textContent = 'Tất Extension';
        toggleButton.classList.remove('disabled');
        // Apply current styles to the page
        chrome.storage.local.get(['reader-theme', 'reader-font', 'font-size'], function(result) {
          const theme = result['reader-theme'] || 'default';
          const font = result['reader-font'] || 'default';
          const fontSize = result['font-size'] || 16;
          applyThemeToPage(theme);
          applyFontToPage(font);
          applyFontSizeToPage(fontSize);
        });
      } else {
        toggleButton.textContent = 'Bật Extension';
        toggleButton.classList.add('disabled');
        // Reset page styles to default
        resetPageStyles();
      }
    });
  });
  
  // Set up focus mode toggle
  document.getElementById('focus-mode-toggle').addEventListener('click', function() {
    chrome.storage.local.get(['focus-mode'], function(result) {
      const isFocusMode = result['focus-mode'] === true;
      const newStatus = !isFocusMode;
      
      chrome.storage.local.set({'focus-mode': newStatus}, function() {
        console.log('Focus mode status saved: ' + newStatus);
      });
      
      const focusButton = document.getElementById('focus-mode-toggle');
      if (newStatus) {
        focusButton.textContent = 'Tắt Chế độ Tập trung';
        focusButton.classList.add('active');
        // Enable focus mode on the page
        enableFocusMode();
      } else {
        focusButton.textContent = 'Bật Chế độ Tập trung';
        focusButton.classList.remove('active');
        // Disable focus mode on the page
        disableFocusMode();
      }
    });
  });
  
  // Set up font size slider
  document.getElementById('font-size-slider').addEventListener('input', function() {
    const fontSize = this.value;
    chrome.storage.local.set({'font-size': fontSize}, function() {
      console.log('Font size saved: ' + fontSize);
    });
    
    // Apply font size to page if extension is enabled
    chrome.storage.local.get(['extension-enabled'], function(result) {
      const isEnabled = result['extension-enabled'] !== false;
      if (isEnabled) {
        applyFontSizeToPage(fontSize);
      }
    });
  });
});

// Theme selector
document.getElementById('theme-selector').addEventListener('change', function() {
  const theme = this.value;
  chrome.storage.local.set({'reader-theme': theme}, function() {
    console.log('Theme saved: ' + theme);
  });
  applyThemeToPopup(theme); // Apply to popup only
  
  // Only apply to page if extension is enabled
  chrome.storage.local.get(['extension-enabled'], function(result) {
    const isEnabled = result['extension-enabled'] !== false;
    if (isEnabled) {
      applyThemeToPage(theme);
    }
  });
});

// Font selector
document.getElementById('font-selector').addEventListener('change', function() {
  const font = this.value;
  chrome.storage.local.set({'reader-font': font}, function() {
    console.log('Font saved: ' + font);
  });
  applyFontToPopup(font); // Apply to popup only
  
  // Only apply to page if extension is enabled
  chrome.storage.local.get(['extension-enabled'], function(result) {
    const isEnabled = result['extension-enabled'] !== false;
    if (isEnabled) {
      applyFontToPage(font);
    }
  });
});

// Voice selector
document.getElementById('voice-selector').addEventListener('change', function() {
  const voice = this.value;
  chrome.storage.local.set({'reader-voice': voice}, function() {
    console.log('Voice saved: ' + voice);
  });
});

// Apply theme function (for popup only)
function applyThemeToPopup(theme) {
  const container = document.querySelector('.container');
  container.className = 'container'; // Reset classes
  
  switch(theme) {
    case 'dark':
      container.classList.add('theme-dark');
      break;
    case 'blue':
      container.classList.add('theme-blue');
      break;
    case 'green':
      container.classList.add('theme-green');
      break;
    case 'high-contrast':
      container.classList.add('theme-dark');
      break;
    default:
      container.classList.add('theme-light');
  }
}

// Apply font function (for popup only)
function applyFontToPopup(font) {
  const body = document.body;
  body.className = ''; // Reset classes
  
  switch(font) {
    case 'serif':
      body.classList.add('font-serif');
      break;
    case 'mono':
      body.classList.add('font-mono');
      break;
    case 'comic':
      body.classList.add('font-comic');
      break;
    case 'open-dyslexic':
      body.classList.add('font-open-dyslexic');
      break;
    case 'verdana':
      body.classList.add('font-verdana');
      break;
    case 'tahoma':
      body.classList.add('font-tahoma');
      break;
    default:
      body.classList.add('font-default');
  }
}

// Apply theme to the web page
async function applyThemeToPage(theme) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // For default theme, don't apply any background or color changes
  if (theme === 'default') {
    // Only apply font changes, not background/color changes
    return;
  }
  
  let css = '';
  switch(theme) {
    case 'dark':
      css = `
        body {
          background-color: #2c3e50 !important;
          color: #ecf0f1 !important;
        }
        * {
          background-color: inherit !important;
          color: inherit !important;
        }
      `;
      break;
    case 'blue':
      css = `
        body {
          background-color: #e3f2fd !important;
          color: #0d47a1 !important;
        }
        * {
          background-color: inherit !important;
          color: inherit !important;
        }
      `;
      break;
    case 'green':
      css = `
        body {
          background-color: #e8f5e9 !important;
          color: #1b5e20 !important;
        }
        * {
          background-color: inherit !important;
          color: inherit !important;
        }
      `;
      break;
    case 'high-contrast':
      css = `
        body {
          background-color: #000000 !important;
          color: #ffff00 !important;
        }
        * {
          background-color: inherit !important;
          color: inherit !important;
        }
        a {
          color: #00ffff !important;
        }
      `;
      break;
    default: // light or any other theme
      css = `
        body {
          background-color: #ffffff !important;
          color: #333333 !important;
        }
        * {
          background-color: inherit !important;
          color: inherit !important;
        }
      `;
  }
  
  // Inject CSS into the page
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    css: css
  });
}

// Apply font to the web page
async function applyFontToPage(font) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  let css = '';
  switch(font) {
    case 'serif':
      css = '* { font-family: Georgia, serif !important; }';
      break;
    case 'mono':
      css = '* { font-family: "Courier New", monospace !important; }';
      break;
    case 'comic':
      css = '* { font-family: "Comic Sans MS", cursive !important; }';
      break;
    case 'open-dyslexic':
      css = '* { font-family: "OpenDyslexic", Arial, sans-serif !important; }';
      break;
    case 'verdana':
      css = '* { font-family: Verdana, sans-serif !important; }';
      break;
    case 'tahoma':
      css = '* { font-family: Tahoma, sans-serif !important; }';
      break;
    default: // default - don't apply any font changes
      return;
  }
  
  // Inject CSS into the page
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    css: css
  });
}

// Apply font size to the web page
async function applyFontSizeToPage(fontSize) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  const css = `
    * {
      font-size: ${fontSize}px !important;
    }
  `;
  
  // Inject CSS into the page
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    css: css
  });
}

// Reset page styles to default
async function resetPageStyles() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Remove all injected CSS
  const resetCss = `
    body {
      background-color: inherit !important;
      color: inherit !important;
    }
    * {
      font-family: inherit !important;
      background-color: inherit !important;
      color: inherit !important;
      font-size: inherit !important;
    }
  `;
  
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    css: resetCss
  });
}

// Enable focus mode - removes distractions and centers content
async function enableFocusMode() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // CSS to enable focus mode
  const focusModeCss = `
    /* Hide common distracting elements */
    aside, nav, .sidebar, .side-bar, .widget, .advertisement, .ads, .banner,
    .header, .footer, .breadcrumb, .pagination, .comment, .comments,
    .social-media, .share-buttons, .related-posts, .tags, .category,
    .author-box, .newsletter, .subscribe, .popup, .modal, .overlay,
    .cookie-banner, .gdpr, .notification, .alert {
      display: none !important;
    }
    
    /* Center and maximize main content */
    main, article, .content, .post, .entry, .story, .article-body,
    .main-content, .primary-content, .content-area {
      max-width: 800px !important;
      margin: 20px auto !important;
      padding: 20px !important;
      width: auto !important;
      float: none !important;
      position: relative !important;
    }
    
    /* Increase font size for better readability */
    p, div, span, li {
      font-size: 18px !important;
      line-height: 1.6 !important;
    }
    
    /* Hide images that aren't part of the main content */
    img:not(.content-image):not(.main-image) {
      opacity: 0.1 !important;
    }
    
    /* Reduce visual clutter */
    * {
      background-image: none !important;
      box-shadow: none !important;
      border: none !important;
    }
  `;
  
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    css: focusModeCss
  });
}

// Disable focus mode - restore original layout
async function disableFocusMode() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // CSS to disable focus mode (remove the focus mode styles)
  const disableFocusModeCss = `
    aside, nav, .sidebar, .side-bar, .widget, .advertisement, .ads, .banner,
    .header, .footer, .breadcrumb, .pagination, .comment, .comments,
    .social-media, .share-buttons, .related-posts, .tags, .category,
    .author-box, .newsletter, .subscribe, .popup, .modal, .overlay,
    .cookie-banner, .gdpr, .notification, .alert {
      display: initial !important;
    }
    
    main, article, .content, .post, .entry, .story, .article-body,
    .main-content, .primary-content, .content-area {
      max-width: initial !important;
      margin: initial !important;
      padding: initial !important;
      width: initial !important;
      float: initial !important;
      position: initial !important;
    }
    
    p, div, span, li {
      font-size: inherit !important;
      line-height: inherit !important;
    }
    
    img:not(.content-image):not(.main-image) {
      opacity: 1 !important;
    }
  `;
  
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    css: disableFocusModeCss
  });
}

document.getElementById('btn-sum').addEventListener('click', async () => {
  // Check if extension is enabled
  chrome.storage.local.get(['extension-enabled'], function(result) {
    const isEnabled = result['extension-enabled'] !== false;
    if (!isEnabled) {
      alert("Vui lòng bật extension trước khi sử dụng!");
      return;
    }
  });
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString()
  }, async (results) => {
    const text = results[0].result;
    if (!text) return alert("Vui lòng bôi đen văn bản!");

    // Show loading animation
    document.getElementById('loading').style.display = 'block';
    document.getElementById('original-text-box').style.display = 'none';
    document.getElementById('summary-box').style.display = 'none';
    document.getElementById('audio-player').style.display = 'none';
    
    try {
      const response = await fetch('http://localhost:5000/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
      });
      
      const data = await response.json();
      console.log("Received data:", data); // Log the received data
      
      // Display original text
      const originalTextBox = document.getElementById('original-text-box');
      const originalTextContent = document.getElementById('original-text-content');
      originalTextContent.innerText = data.original_text || text;
      originalTextBox.style.display = 'block';
      
      // Display summary
      const summaryBox = document.getElementById('summary-box');
      const summaryContent = document.getElementById('summary-content');
      summaryContent.innerText = data.summary;
      summaryBox.style.display = 'block';
      
      // Hide loading animation
      document.getElementById('loading').style.display = 'none';
      
      // Hide audio player when showing summary
      document.getElementById('audio-player').style.display = 'none';
      
      // Apply current font and theme to text boxes (popup only)
      chrome.storage.local.get(['reader-theme', 'reader-font'], function(result) {
        const currentTheme = result['reader-theme'] || 'default';
        const currentFont = result['reader-font'] || 'default';
        applyThemeToPopup(currentTheme);
        applyFontToPopup(currentFont);
      });
    } catch (error) {
      // Hide loading animation
      document.getElementById('loading').style.display = 'none';
      alert("Có lỗi xảy ra khi xử lý văn bản. Vui lòng thử lại.");
      console.error(error);
    }
  });
});

document.getElementById('btn-read').addEventListener('click', async () => {
  // Check if extension is enabled
  chrome.storage.local.get(['extension-enabled'], function(result) {
    const isEnabled = result['extension-enabled'] !== false;
    if (!isEnabled) {
      alert("Vui lòng bật extension trước khi sử dụng!");
      return;
    }
  });
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Get selected voice
  let selectedVoice = 'vi-VN-HoaiMyNeural';
  chrome.storage.local.get(['reader-voice'], function(result) {
    selectedVoice = result['reader-voice'] || 'vi-VN-HoaiMyNeural';
  });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString()
  }, async (results) => {
    const text = results[0].result;
    if (!text) return alert("Vui lòng bôi đen văn bản!");

    // Show loading animation
    document.getElementById('loading').style.display = 'block';
    document.getElementById('original-text-box').style.display = 'none';
    document.getElementById('summary-box').style.display = 'none';
    document.getElementById('audio-player').style.display = 'none';
    
    try {
      const response = await fetch('http://localhost:5000/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: text, 
          voice: selectedVoice 
        })
      });
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Hide loading animation
      document.getElementById('loading').style.display = 'none';
      
      // Show audio player and set source
      const audioElement = document.getElementById('audio-element');
      audioElement.src = url;
      document.getElementById('audio-player').style.display = 'block';
      
      // Hide text boxes when showing audio player
      document.getElementById('original-text-box').style.display = 'none';
      document.getElementById('summary-box').style.display = 'none';
    } catch (error) {
      // Hide loading animation
      document.getElementById('loading').style.display = 'none';
      alert("Có lỗi xảy ra khi tạo âm thanh. Vui lòng thử lại.");
      console.error(error);
    }
  });
});