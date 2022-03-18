export const fittingString = (string, len) => {
    if (!string || string.length < len) return string
    return string.slice(0, len-1)  + "..."
}