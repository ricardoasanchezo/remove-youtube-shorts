const PREFIX = "[Remove YouTube Shorts]"

export const logger = {
    log: (...args: any[]) => console.log(PREFIX, ...args),
    warn: (...args: any[]) => console.warn(PREFIX, ...args),
    error: (...args: any[]) => console.error(PREFIX, ...args),
}
