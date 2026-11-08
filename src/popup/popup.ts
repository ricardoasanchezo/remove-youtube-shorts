console.log("Popup script loaded")

document.addEventListener('DOMContentLoaded', () => {
    console.log("Popup DOMContentLoaded fired")
    const counterEl = document.getElementById('counter') as HTMLElement

    if (!counterEl) {
        console.error("Counter element not found!")
        return
    }

    chrome.storage.local.get(['hiddenCount'], (result: { hiddenCount?: number }) => {
        console.log("Storage fetched hiddenCount:", result.hiddenCount)
        counterEl.textContent = (result.hiddenCount || 0).toLocaleString()
    })

    chrome.storage.onChanged.addListener((changes, area) => {
        console.log("Storage changed:", area, changes)
        if (area === 'local' && changes.hiddenCount) {
            counterEl.textContent = (changes.hiddenCount.newValue || 0).toLocaleString()
        }
    })
})
