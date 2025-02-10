import {Lexer} from './lexer/lexer'
import {Lexeme, Token} from './globalTypes'

function getEnumName(value: string): string | undefined {
    for (const key in Lexeme) {
        if (Lexeme[key as keyof typeof Lexeme] === value) {
            return key;
        }
    }

    return undefined
}

function formatTokens(tokens: Token[]): string {
    return tokens
        .map(token => {
            const {type, lexeme, position} = token;

            return `${getEnumName(type)} (${position.line}, ${position.column + 1}) "${lexeme}"`;
        })
        .join('\n');
}

class Analyzer {
    private input: string
    private errors: string[] = []

    constructor(input: string) {
        this.input = input
    }

    process(): string {
        const lexer = new Lexer(this.input)
        const tokens = lexer.tokenize()
        return formatTokens(tokens);
    }
}

export {
    Analyzer,
}