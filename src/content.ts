import { logger } from './logger'

logger.log("Loaded Remove YouTube Shorts")

let hiddenCount = 0

// Initialize count from storage
chrome.storage.local.get(['hiddenCount'], (result: { hiddenCount?: number }) => {
    if (typeof result.hiddenCount === 'number') {
        hiddenCount = result.hiddenCount
    }
})

function incrementCount(amount: number) {
    hiddenCount += amount
    chrome.storage.local.set({ hiddenCount })
    logger.log(`Hidden shorts/shelves total: ${hiddenCount}`)
}

function processNode(node: Element) {
    const tag = node.tagName.toLowerCase()

    if (tag === 'grid-shelf-view-model' || tag === 'ytd-rich-shelf-renderer' || tag === 'ytd-reel-shelf-renderer') {
        node.remove()
        incrementCount(1)
    }
}

// Recursive helper to pierce Shadow DOMs if elements are encapsulated
function searchTree(root: ParentNode | ShadowRoot) {
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

// 1. Polling interval to catch initial load & SPA page changes reliably
setInterval(() => {
    searchTree(document)
}, 300)

// 2. MutationObserver for dynamic additions (infinite scroll)
const observer = new MutationObserver((mutations) => {
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
