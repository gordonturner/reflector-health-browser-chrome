

// Saves options to chrome.storage
const saveOptions = () => {
    const installId = document.getElementById('installIdInput').value;
    const enableDarkMode = document.getElementById('enableDarkModeCheck').checked;
  
    chrome.storage.sync.set(
      { installId: installId, enableDarkMode: enableDarkMode },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Configuration saved';
        setTimeout(() => {
          status.textContent = '';
        }, 2000);
      }
    );
};
  
// Restores select box and checkbox state using the preferences stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.sync.get(
      { installId: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', enableDarkMode: false },
      (items) => {
        document.getElementById('installIdInput').value = items.installId;
        document.getElementById('enableDarkModeCheck').checked = items.enableDarkMode;
      }
    );
  };
  
  const close = () => {  
    window.close();
  };

  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
  document.getElementById('close').addEventListener('click', close);