import { logger } from '../logger'

logger.log("Popup script loaded")

document.addEventListener('DOMContentLoaded', () => {
    logger.log("Popup DOMContentLoaded fired")
    const counterEl = document.getElementById('counter') as HTMLElement
    const toggleEl = document.getElementById('active-toggle') as HTMLInputElement

    if (!counterEl || !toggleEl) {
        logger.error("Popup elements not found!")
        return
    }

    // Load initial state
    chrome.storage.local.get(['hiddenCount', 'enabled'], (result: { hiddenCount?: number; enabled?: boolean }) => {
        logger.log("Storage fetched:", result)
        counterEl.textContent = (result.hiddenCount || 0).toLocaleString()
        toggleEl.checked = result.enabled !== false
    })

    // Handle toggle change
    toggleEl.addEventListener('change', () => {
        const enabled = toggleEl.checked
        chrome.storage.local.set({ enabled }, () => {
            logger.log("Extension enabled state updated:", enabled)
        })
    })

    // Listen for storage updates
    chrome.storage.onChanged.addListener((changes, area) => {
        logger.log("Storage changed:", area, changes)
        if (area === 'local' && changes.hiddenCount && counterEl) {
            counterEl.textContent = (changes.hiddenCount.newValue || 0).toLocaleString()
        }
    })
})
