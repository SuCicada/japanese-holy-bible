export function getHash() {
    return typeof window !== "undefined"
        ? decodeURIComponent(window.location.hash.replace("#", ""))
        : undefined;
}