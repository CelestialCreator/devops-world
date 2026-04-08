import { FAQ_DATA, DEFAULT_ANSWER } from './axonFaqData.js'

export default class AxonFallback
{
    constructor()
    {
        this.faqData = FAQ_DATA
    }

    getAnswer(input)
    {
        const tokens = input.toLowerCase().split(/\s+/)
        let bestScore = 0
        let bestAnswer = DEFAULT_ANSWER

        for(const entry of this.faqData)
        {
            let score = 0
            for(const keyword of entry.keywords)
            {
                for(const token of tokens)
                {
                    if(token.includes(keyword) || keyword.includes(token))
                    {
                        score++
                    }
                }
            }

            if(score > bestScore)
            {
                bestScore = score
                bestAnswer = entry.answer
            }
        }

        return bestAnswer
    }
}
