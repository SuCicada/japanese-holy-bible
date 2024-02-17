export type Bible = {
    id: number
    // version?: string
    book: string
    chapter: number
    verse: number
    text: string
    furigana?: string
    hiragana?: string
}
