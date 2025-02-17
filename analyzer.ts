// analyzer.ts
import { Token, Lexeme } from './globalTypes'
import { ErrorHandler } from './errorHandler/errorHandler'
import { ErrorCode } from './errorHandler/errorMessages'

class SyntaxAnalyzer {
    private tokens: Token[] = []
    private currentIndex: number = 0
    private errorHandler: ErrorHandler

    constructor() {
        this.errorHandler = new ErrorHandler()
    }

    /**
     * Основной метод разбора.
     * Принимает массив токенов и возвращает true, если выражение разобрано корректно.
     */
    public parse(tokens: Token[]): boolean {
        this.tokens = tokens
        this.currentIndex = 0
        this.errorHandler.clearErrors()

        // Начинаем разбор с выражения
        const success = this.parseExpression()

        // Если остались токены, отличные от EOF, это ошибка
        if (this.currentToken()?.type !== Lexeme.EOF) {
            this.errorHandler.addError(ErrorCode.E009, this.currentToken())
            return false
        }

        return success && !this.errorHandler.hasErrors()
    }

    /**
     * parseExpression → parseTerm { (PLUS | MINUS) parseTerm }
     */
    private parseExpression(): boolean {
        if (!this.parseTerm()) {
            this.errorHandler.addError(ErrorCode.E009, this.currentToken())
            return false
        }
        while (this.currentToken()?.type === Lexeme.PLUS || this.currentToken()?.type === Lexeme.MINUS) {
            this.advance() // съедаем оператор
            if (!this.parseTerm()) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
        }
        return true
    }

    /**
     * parseTerm → parseFactor { (MULTIPLICATION | DIVIDE) parseFactor }
     */
    private parseTerm(): boolean {
        if (!this.parseFactor()) {
            return false
        }
        while (this.currentToken()?.type === Lexeme.MULTIPLICATION || this.currentToken()?.type === Lexeme.DIVIDE) {
            this.advance() // съедаем оператор
            if (!this.parseFactor()) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
        }
        return true
    }

    /**
     * parseFactor → [NOT | MINUS] parsePrimary
     * (Унарный плюс не разрешён)
     */
    private parseFactor(): boolean {
        const token = this.currentToken()
        if (!token) {
            this.errorHandler.addError(ErrorCode.E009, token)
            return false
        }

        if (token.type === Lexeme.NOT || token.type === Lexeme.MINUS) {
            // Унарный оператор
            this.advance()
            return this.parsePrimary()
        }

        if (token.type === Lexeme.PLUS) {
            // Унарный плюс не разрешён
            this.errorHandler.addError(ErrorCode.E009, token)
            return false
        }

        return this.parsePrimary()
    }

    /**
     * parsePrimary →
     *    IDENTIFIER | INTEGER | FLOAT { suffix }
     *  | LEFT_PAREN parseExpression RIGHT_PAREN
     *
     * suffix → ( arrayIndex | functionCall | propertyAccess )*
     */
    private parsePrimary(): boolean {
        const token = this.currentToken()
        if (!token) {
            this.errorHandler.addError(ErrorCode.E009, token)
            return false
        }

        if (
            token.type === Lexeme.IDENTIFIER ||
            token.type === Lexeme.INTEGER ||
            token.type === Lexeme.FLOAT
        ) {
            this.advance() // съедаем идентификатор или число

            // Обработка суффиксов (индексация, вызов функции, обращение к полю)
            while (true) {
                // Индексация: [expression]
                if (this.currentToken()?.type === Lexeme.LEFT_BRACKET) {
                    this.advance() // съедаем '['
                    if (!this.parseExpression()) {
                        this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                        return false
                    }
                    if (!this.match(Lexeme.RIGHT_BRACKET)) {
                        this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                        return false
                    }
                    continue
                }
                // Вызов функции: (argumentList)
                if (this.currentToken()?.type === Lexeme.LEFT_PAREN) {
                    this.advance() // съедаем '('
                    if (!this.parseArgumentList()) {
                        return false
                    }
                    if (!this.match(Lexeme.RIGHT_PAREN)) {
                        this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                        return false
                    }
                    continue
                }
                // Обращение к полю или вызов метода: .IDENTIFIER [ (argumentList) ]
                if (this.currentToken()?.type === Lexeme.DOT) {
                    this.advance() // съедаем '.'
                    if (!this.match(Lexeme.IDENTIFIER)) {
                        this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                        return false
                    }
                    // Возможен вызов метода после точки
                    if (this.currentToken()?.type === Lexeme.LEFT_PAREN) {
                        this.advance() // съедаем '('
                        if (!this.parseArgumentList()) {
                            return false
                        }
                        if (!this.match(Lexeme.RIGHT_PAREN)) {
                            this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                            return false
                        }
                    }
                    continue
                }
                break
            }
            return true
        }

        // Разбор группировки: (expression)
        if (token.type === Lexeme.LEFT_PAREN) {
            this.advance() // съедаем '('
            if (!this.parseExpression()) {
                return false
            }
            if (!this.match(Lexeme.RIGHT_PAREN)) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
            return true
        }

        // Если ни один из вариантов не подошёл, это ошибка
        this.errorHandler.addError(ErrorCode.E009, token)
        return false
    }

    /**
     * parseArgumentList → [ expression { COMMA expression } ]
     */
    private parseArgumentList(): boolean {
        // Если сразу встречается RIGHT_PAREN, аргументов нет
        if (this.currentToken()?.type === Lexeme.RIGHT_PAREN) {
            return true
        }
        if (!this.parseExpression()) {
            return false
        }
        while (this.currentToken()?.type === Lexeme.COMMA) {
            this.advance() // съедаем ','
            if (!this.parseExpression()) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
        }
        return true
    }

    /**
     * match проверяет, соответствует ли текущий токен ожидаемому типу.
     * Если соответствует — съедает его (advance) и возвращает true.
     */
    private match(expected: Lexeme): boolean {
        if (this.currentToken()?.type === expected) {
            this.advance()
            return true
        }
        return false
    }

    private advance(): void {
        if (!this.isEnd()) {
            this.currentIndex++
        }
    }

    private currentToken(): Token | undefined {
        return this.tokens[this.currentIndex]
    }

    private isEnd(): boolean {
        return this.currentIndex >= this.tokens.length
    }

    public getErrors(): string[] {
        return this.errorHandler.getErrors()
    }
}

export { SyntaxAnalyzer }
