import { logger } from './logger'

logger.log("Loaded Remove YouTube Shorts")

let hiddenCount = 0
let isEnabled = true

// Check enabled state on startup
chrome.storage.local.get(['hiddenCount', 'enabled'], (result: { hiddenCount?: number; enabled?: boolean }) => {
    if (typeof result.hiddenCount === 'number') {
        hiddenCount = result.hiddenCount
    }
    if (result.enabled === false) {
        isEnabled = false
        logger.log("Extension is currently disabled.")
    }
})

// Listen for toggle changes
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enabled) {
        isEnabled = Boolean(changes.enabled.newValue)
        logger.log("Extension enabled state changed to:", isEnabled)
    }
})

function incrementCount(amount: number) {
    if (!isEnabled) return
    hiddenCount += amount
    chrome.storage.local.set({ hiddenCount })
    logger.log(`Hidden shorts/shelves total: ${hiddenCount}`)
}

function processNode(node: Element) {
    if (!isEnabled) return
    const tag = node.tagName.toLowerCase()

    if (tag === 'grid-shelf-view-model' || tag === 'ytd-rich-shelf-renderer' || tag === 'ytd-reel-shelf-renderer') {
        node.remove()
        incrementCount(1)
    }
}

// Recursive helper to pierce Shadow DOMs if elements are encapsulated
function searchTree(root: ParentNode | ShadowRoot) {
    if (!isEnabled) return
    const selector = 'grid-shelf-view-model, ytd-rich-shelf-renderer, ytd-reel-shelf-renderer'
    root.querySelectorAll(selector).forEach(el => {
        el.remove()
        incrementCount(1)
    })

    // Search inside shadow roots of children
    root.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) {
            searchTree(el.shadowRoot)
        }
    })
}

// Polling interval to catch initial load & SPA page changes reliably
setInterval(() => {
    if (!isEnabled) return
    searchTree(document)
}, 300)

// MutationObserver for dynamic additions (infinite scroll)
const observer = new MutationObserver((mutations) => {
    if (!isEnabled) return
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                processNode(node as Element)
                if ((node as Element).shadowRoot) {
                    searchTree((node as Element).shadowRoot!)
                }
                searchTree(node as Element)
            }
        }
    }
})

observer.observe(document.body, {
    subtree: true,
    childList: true
})
