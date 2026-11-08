// function removeShortsAsVideos() {
//     let shortsOverlays = [...document.querySelectorAll('[overlay-style="SHORTS"]')]
//     if (shortsOverlays.length === 0)
//         return
//
//     for (let node of shortsOverlays) {
//         while (node.tagName.toLowerCase() !== 'ytd-video-renderer')
//             node = node.parentNode
//
//         node.remove()
//     }
// }

function handleShelves(shelf: HTMLElement) {
    const titleEl = shelf.querySelector('#title')
    if (!titleEl || !(titleEl instanceof HTMLElement))
        return

    let title = titleEl.innerText

    if (title === 'People also watched')
        shelf.remove()
    else if (title === 'Channels new to you')
        shelf.remove()
    else if (title === 'Previously watched')
        shelf.remove()
    else if (title === 'For you')
        shelf.remove()
    else
        console.log(`Found title without condition: ${title}`)
}

function handleNode(node: Node) {
    if (!(node instanceof HTMLElement))
        return

    const tag = node.tagName.toLowerCase()

    if (tag === 'ytd-reel-shelf-renderer')  { // Remove Shorts
        node.remove()
    }
    else if (tag === 'ytd-shelf-renderer')  { // Remove Shelves like 'Previously Watched', 'People also watched' and the like
        handleShelves(node)
    }
    else if (node.id.toLowerCase() === 'text' && node.innerText.includes('SHORTS')) { // Remove shorts presented as video results
        let current: HTMLElement = node
        while (current && current.tagName.toLowerCase() !== 'ytd-video-renderer') {
            if (!current.parentElement) break
            current = current.parentElement
        }
        if (current && current.tagName.toLowerCase() === 'ytd-video-renderer') {
            current.remove()
        }
    }
}


function main(){
    const callback = (mutations: MutationRecord[]) => {
        // removeShortsAsVideos()

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE)
                    continue

                handleNode(node)
            }
        }
    }

    const observer = new MutationObserver(callback)

    let options = {
        subtree: true,
        childList: true
    }

    observer.observe(document.body, options)

    document.querySelectorAll('body *').forEach(node => handleNode(node))
}

main()
