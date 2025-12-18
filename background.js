// Background script for AI Reader & Summarizer Pro
console.log('AI Reader & Summarizer Pro background script loaded');

// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarizeText",
    title: "Summarize with AI Reader",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarizeText") {
    // Check if extension is enabled
    chrome.storage.local.get(['extension-enabled'], function(result) {
      const isEnabled = result['extension-enabled'] !== false;
      if (isEnabled) {
        // Send message to content script or handle summarization
        console.log("Summarize text:", info.selectionText);
      }
    });
  }
});

// Listen for tab updates to apply saved theme and font (only if extension is enabled)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Check if extension is enabled
    chrome.storage.local.get([
      'extension-enabled', 'reader-theme', 'reader-font', 'focus-mode', 
      'font-size'
    ], function(result) {
      const isEnabled = result['extension-enabled'] !== false;
      if (!isEnabled) return;
      
      const theme = result['reader-theme'] || 'default';
      const font = result['reader-font'] || 'default';
      const focusMode = result['focus-mode'] === true;
      const fontSize = result['font-size'] || 16;
      
      // Apply theme only if not default
      if (theme !== 'default') {
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
        
        chrome.scripting.insertCSS({
          target: { tabId: tabId },
          css: css
        });
      }
      
      // Apply font only if not default
      if (font !== 'default') {
        let fontCss = '';
        switch(font) {
          case 'serif':
            fontCss = '* { font-family: Georgia, serif !important; }';
            break;
          case 'mono':
            fontCss = '* { font-family: "Courier New", monospace !important; }';
            break;
          case 'comic':
            fontCss = '* { font-family: "Comic Sans MS", cursive !important; }';
            break;
          case 'open-dyslexic':
            fontCss = '* { font-family: "OpenDyslexic", Arial, sans-serif !important; }';
            break;
          case 'verdana':
            fontCss = '* { font-family: Verdana, sans-serif !important; }';
            break;
          case 'tahoma':
            fontCss = '* { font-family: Tahoma, sans-serif !important; }';
            break;
          default: // default
            fontCss = '* { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif !important; }';
        }
        
        chrome.scripting.insertCSS({
          target: { tabId: tabId },
          css: fontCss
        });
      }
      
      // Apply font size
      if (fontSize !== 16) {
        const fontSizeCss = `
          * {
            font-size: ${fontSize}px !important;
          }
        `;
        
        chrome.scripting.insertCSS({
          target: { tabId: tabId },
          css: fontSizeCss
        });
      }
      
      // Apply focus mode if enabled
      if (focusMode) {
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
          target: { tabId: tabId },
          css: focusModeCss
        });
      }
    });
  }
});

// Listen for changes to extension settings
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes['extension-enabled']) {
    const isEnabled = changes['extension-enabled'].newValue;
    
    // If extension is disabled, reset styles on all tabs
    if (!isEnabled) {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          // Reset styles on each tab
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
            
            /* Restore hidden elements */
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
          
          try {
            chrome.scripting.insertCSS({
              target: { tabId: tab.id },
              css: resetCss
            });
          } catch (e) {
            // Tab might not be accessible, ignore
          }
        });
      });
    }
  }
});