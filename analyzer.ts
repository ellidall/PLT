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
     * Точка входа. Принимает массив токенов и возвращает true,
     * если синтаксический разбор прошёл успешно (и остался только EOF).
     */
    public parse(tokens: Token[]): boolean {
        this.tokens = tokens
        this.currentIndex = 0
        this.errorHandler.clearErrors()

        const success = this.parseLogicalOr()

        // После разбора ожидаем EOF
        if (this.currentToken()?.type !== Lexeme.EOF) {
            this.errorHandler.addError(ErrorCode.E009, this.currentToken())
            return false
        }

        return success && !this.errorHandler.hasErrors()
    }

    /**
     * LogicalOr → LogicalAnd { OR LogicalAnd }
     */
    private parseLogicalOr(): boolean {
        if (!this.parseLogicalAnd()) {
            this.errorHandler.addError(ErrorCode.E009, this.currentToken())
            return false
        }
        while (this.currentToken()?.type === Lexeme.OR) {
            this.advance() // съедаем OR
            if (!this.parseLogicalAnd()) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
        }
        return true
    }

    /**
     * LogicalAnd → Relational { AND Relational }
     */
    private parseLogicalAnd(): boolean {
        if (!this.parseRelational()) {
            this.errorHandler.addError(ErrorCode.E009, this.currentToken())
            return false
        }
        while (this.currentToken()?.type === Lexeme.AND) {
            this.advance() // съедаем AND
            if (!this.parseRelational()) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
        }
        return true
    }

    /**
     * Relational → Additive { (LESS | GREATER | LESS_EQ | GREATER_EQ | DOUBLE_EQ | NOT_EQ) Additive }
     */
    private parseRelational(): boolean {
        if (!this.parseAdditive()) {
            this.errorHandler.addError(ErrorCode.E009, this.currentToken())
            return false
        }
        while (
            this.currentToken()?.type === Lexeme.LESS ||
            this.currentToken()?.type === Lexeme.GREATER ||
            this.currentToken()?.type === Lexeme.LESS_EQ ||
            this.currentToken()?.type === Lexeme.GREATER_EQ ||
            this.currentToken()?.type === Lexeme.DOUBLE_EQ ||
            this.currentToken()?.type === Lexeme.NOT_EQ
            ) {
            this.advance() // съедаем реляционный оператор
            if (!this.parseAdditive()) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
        }
        return true
    }

    /**
     * Additive → Term { (PLUS | MINUS) Term }
     */
    private parseAdditive(): boolean {
        if (!this.parseTerm()) {
            this.errorHandler.addError(ErrorCode.E009, this.currentToken())
            return false
        }
        while (
            this.currentToken()?.type === Lexeme.PLUS ||
            this.currentToken()?.type === Lexeme.MINUS
            ) {
            this.advance() // съедаем + или -
            if (!this.parseTerm()) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
        }
        return true
    }

    /**
     * Term → Factor { (MULTIPLICATION | DIVIDE | MOD) Factor }
     */
    private parseTerm(): boolean {
        if (!this.parseFactor()) {
            this.errorHandler.addError(ErrorCode.E009, this.currentToken())
            return false
        }
        while (
            this.currentToken()?.type === Lexeme.MULTIPLICATION ||
            this.currentToken()?.type === Lexeme.DIVIDE ||
            this.currentToken()?.type === Lexeme.MOD
            ) {
            this.advance() // съедаем *, / или MOD
            if (!this.parseFactor()) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
        }
        return true
    }

    /**
     * Factor → [NOT | MINUS | PLUS] Factor | Primary
     *
     * Теперь разрешаем унарный плюс. Все три оператора обрабатываются одинаково.
     */
    private parseFactor(): boolean {
        const token = this.currentToken()
        if (!token) {
            this.errorHandler.addError(ErrorCode.E009, token)
            return false
        }
        if (
            token.type === Lexeme.NOT ||
            token.type === Lexeme.MINUS ||
            token.type === Lexeme.PLUS
        ) {
            this.advance() // съедаем унарный оператор
            return this.parseFactor()
        }
        return this.parsePrimary()
    }

    /**
     * Primary → IDENTIFIER | INTEGER | FLOAT | TRUE | FALSE { Suffix } | ( LogicalOr )
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
            token.type === Lexeme.FLOAT ||
            token.type === Lexeme.TRUE ||
            token.type === Lexeme.FALSE
        ) {
            this.advance() // съедаем базовый токен

            // Обрабатываем возможные суффиксы: индексирование, вызов функции, обращение к свойствам
            while (true) {
                // Индексация: [ Expression ]
                if (this.currentToken()?.type === Lexeme.LEFT_BRACKET) {
                    this.advance() // съедаем '['
                    if (!this.parseLogicalOr()) {
                        this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                        return false
                    }
                    if (!this.match(Lexeme.RIGHT_BRACKET)) {
                        this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                        return false
                    }
                    continue
                }
                // Вызов функции: ( ArgumentList )
                if (this.currentToken()?.type === Lexeme.LEFT_PAREN) {
                    this.advance() // съедаем '('
                    if (!this.parseArgumentList()) {
                        this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                        return false
                    }
                    if (!this.match(Lexeme.RIGHT_PAREN)) {
                        this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                        return false
                    }
                    continue
                }
                // Обращение к полю: .IDENTIFIER [ ( ArgumentList ) ]
                if (this.currentToken()?.type === Lexeme.DOT) {
                    this.advance() // съедаем '.'
                    if (!this.match(Lexeme.IDENTIFIER)) {
                        this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                        return false
                    }
                    if (this.currentToken()?.type === Lexeme.LEFT_PAREN) {
                        this.advance() // съедаем '('
                        if (!this.parseArgumentList()) {
                            this.errorHandler.addError(ErrorCode.E009, this.currentToken())
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

        // Группировка: ( LogicalOr )
        if (token.type === Lexeme.LEFT_PAREN) {
            this.advance() // съедаем '('
            if (!this.parseLogicalOr()) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
            if (!this.match(Lexeme.RIGHT_PAREN)) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
            return true
        }

        this.errorHandler.addError(ErrorCode.E009, token)
        return false
    }

    /**
     * ArgumentList → [ LogicalOr { , LogicalOr } ]
     */
    private parseArgumentList(): boolean {
        if (this.currentToken()?.type === Lexeme.RIGHT_PAREN) {
            return true // пустой список аргументов
        }
        if (!this.parseLogicalOr()) {
            this.errorHandler.addError(ErrorCode.E009, this.currentToken())
            return false
        }
        while (this.currentToken()?.type === Lexeme.COMMA) {
            this.advance() // съедаем запятую
            if (!this.parseLogicalOr()) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
        }
        return true
    }

    /**
     * match проверяет, соответствует ли текущий токен ожидаемому типу.
     * Если соответствует — съедает его и возвращает true.
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
