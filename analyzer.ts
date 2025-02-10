import { Lexeme, Token } from './globalTypes';

class ExpressionParser {
    private tokens: Token[];
    private position: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parseExpression(): boolean {
        try {
            this.parseTerm();
            while (this.match(Lexeme.PLUS, Lexeme.MINUS)) {
                this.consume(this.previous().type);
                this.parseTerm();
            }
            return this.check(Lexeme.EOF);
        } catch (error) {
            console.error(`❌ Ошибка: ${error}`);
            return false;
        }
    }

    private parseTerm(): void {
        this.parseFactor();
        while (this.match(Lexeme.MULTIPLY, Lexeme.DIVIDE)) {
            this.consume(this.previous().type);
            this.parseFactor();
        }
    }

    private parseFactor(): void {
        if (this.match(Lexeme.NUMBER_LITERAL, Lexeme.IDENTIFIER)) {
            this.consume(this.previous().type);
        } else if (this.match(Lexeme.LEFT_PAREN)) {
            this.consume(Lexeme.LEFT_PAREN);
            this.parseExpression();
            this.consume(Lexeme.RIGHT_PAREN);
        } else {
            throw `Ожидалось число, идентификатор или '(', найдено '${this.peek()?.lexeme}'`;
        }
    }

    private match(...types: Lexeme[]): boolean {
        if (this.check(...types)) {
            this.position++;
            return true;
        }
        return false;
    }

    private check(...types: Lexeme[]): boolean {
        return types.includes(this.peek()?.type!);
    }

    private consume(type: Lexeme): Token {
        if (this.check(type)) {
            return this.tokens[this.position++];
        }
        throw `Ожидался '${type}', найдено '${this.peek()?.lexeme}'`;
    }

    private peek(): Token | null {
        return this.tokens[this.position] ?? null;
    }

    private previous(): Token {
        return this.tokens[this.position - 1];
    }
}

class Analyzer {
    private tokens: Token[];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    process(): string {
        const parser = new ExpressionParser(this.tokens);
        return parser.parseExpression()
            ? "✅ Выражение синтаксически корректно!"
            : "❌ Выражение содержит ошибки!";
    }
}

export { ExpressionParser, Analyzer };
