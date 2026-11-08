import { logger } from '../logger'

logger.log("Popup script loaded")

document.addEventListener('DOMContentLoaded', () => {
    logger.log("Popup DOMContentLoaded fired")
    const counterEl = document.getElementById('counter') as HTMLElement

    if (!counterEl) {
        logger.error("Counter element not found!")
        return
    }

    chrome.storage.local.get(['hiddenCount'], (result: { hiddenCount?: number }) => {
        logger.log("Storage fetched hiddenCount:", result.hiddenCount)
        counterEl.textContent = (result.hiddenCount || 0).toLocaleString()
    })

    chrome.storage.onChanged.addListener((changes, area) => {
        logger.log("Storage changed:", area, changes)
        if (area === 'local' && changes.hiddenCount) {
            counterEl.textContent = (changes.hiddenCount.newValue || 0).toLocaleString()
        }
    })
})
