export type Word = {
    version?: string
    book: string
    chapter: number
    verse: number
    text: string
}

export const TEXT_DATA:Word[] = [
    {book: "フィリピの信徒への手紙", chapter: 4,verse:6, text: "どんなことでも、思い煩うのはやめなさい。何事につけ、感謝を込めて祈りと願いをささげ、求めているものを神に打ち明けなさい。"},
    {book: "フィリピの信徒への手紙", chapter: 4,verse:7, text: "そうすれば、あらゆる人知を超える神の平和が、あなたがたの心と考えとをキリスト・イエスによって守るでしょう。"},

    {book:"マタイによる福音書",chapter:6,verse:9,text:"『天におられるわたしたちの父よ、御名が崇められますように。"},
    {book:"マタイによる福音書",chapter:6,verse:10,text:"御国が来ますように。\n" +
            "御心が行われますように、\n" +
            "天におけるように地の上にも。\n"},
    {book:"マタイによる福音書",chapter:6,verse:11,text:"わたしたちに必要な糧を今日与えてください。"},
    {book:"マタイによる福音書",chapter:6,verse:12,text:"わたしたちの負い目を赦してください、\n" +
            "わたしたちも自分に負い目のある人を\n" +
            "赦しましたように。"},
    {book:"マタイによる福音書",chapter:6,verse:13,text:"わたしたちを誘惑に遭わせず、\n" +
            "悪い者から救ってください。』"},
]
