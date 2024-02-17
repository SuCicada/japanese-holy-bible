import {Bible} from "@/app/bible/data";

export async function getJapaneseFurigana(str: string) {
    const data = await fetch(process.env.NEXT_PUBLIC_JAPANESE_FURIGANA_API as string,
        {
            method: "POST",
            // url: 'http://localhost:41401/convert',
            headers: {"content-type": "application/json"},
            body: JSON.stringify({text: str}),
        })
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            throw error
        })
    return data
}

/*
    どんなことでも、{{思|おも}}い
*/
export function decodeJapaneseFurigana(text: string) {
    const pattern = /{{(.*?)}}/g;
    let lastIndex = 0
    let res: any[] = []

    function pushHira(hira: string) {
        hira.split("").forEach((item) => {
            res.push([item, 2, item])
        })
    }

    text.replace(pattern, function (match, p1, offset) {
        let hira = text.slice(lastIndex, offset)
        pushHira(hira)
        let [kanji, hira2] = p1.split("|")
        res.push([kanji, 1, hira2])
        lastIndex = offset + match.length
        return ""
    });
    pushHira(text.slice(lastIndex))
    return res
}

export function getHiragana(bible:Bible){
    return decodeJapaneseFurigana(bible.furigana??"").map(item=>item[2]).join("")
}
