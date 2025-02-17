// analyzer.ts
import {Token, Lexeme} from './globalTypes'
import {ErrorHandler} from './errorHandler/errorHandler'
import {ErrorCode} from './errorHandler/errorMessages'

class SyntaxAnalyzer {
    private tokens: Token[] = []
    private currentIndex: number = 0
    private errorHandler: ErrorHandler

    constructor() {
        this.errorHandler = new ErrorHandler()
    }

    public scanExpression(tokens: Token[], output: (message: string) => void): void {
        this.tokens = tokens
        this.currentIndex = 0
        this.errorHandler.clearErrors()

        const isValid = this.parseExpression()

        // Если текущий токен — EOF, съедаем его
        if (this.currentToken()?.type === Lexeme.EOF) {
            this.advance()
        }

        const hasErrors = this.errorHandler.hasErrors()

        if (isValid && !hasErrors && this.isEnd()) {
            output('OK')
        } else {
            output('ERROR')
            console.log(this.errorHandler.getErrors().join('\n'))
        }
    }


    private parseExpression(): boolean {
        if (!this.parseTerm()) {
            this.errorHandler.addError(ErrorCode.E009, this.currentToken())
            return false
        }

        while (this.match(Lexeme.PLUS) || this.match(Lexeme.MINUS)) {
            if (!this.parseTerm()) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
        }

        // Дополнительная проверка для операторов сравнения
        while (
            this.match(Lexeme.LESS, Lexeme.GREATER, Lexeme.LESS_EQ,
                Lexeme.GREATER_EQ, Lexeme.DOUBLE_EQ, Lexeme.NOT_EQ)
            ) {
            if (!this.parseTerm()) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
        }

        return true
    }

    private parseTerm(): boolean {
        if (!this.parseFactor()) {
            return false
        }

        while (this.match(Lexeme.MULTIPLICATION, Lexeme.DIVIDE)) {
            if (!this.parseFactor()) {
                return false
            }
        }

        return true
    }

    private parseFactor(): boolean {
        const token = this.currentToken()
        if (!token) {
            return false
        }

        // Обработка унарных операторов (например, NOT, MINUS)
        if (this.match(Lexeme.NOT)) {
            if (this.match(Lexeme.LEFT_PAREN)) {
                if (!this.parseExpression() || !this.match(Lexeme.RIGHT_PAREN)) {
                    return false
                }
                return true
            }
            if (this.match(Lexeme.IDENTIFIER) || this.match(Lexeme.INTEGER) || this.match(Lexeme.FLOAT)) {
                return true
            }
            return false
        }

        if (this.match(Lexeme.MINUS)) {
            if (this.match(Lexeme.LEFT_PAREN)) {
                if (!this.parseExpression() || !this.match(Lexeme.RIGHT_PAREN)) {
                    return false
                }
                return true
            }
            if (this.match(Lexeme.IDENTIFIER) || this.match(Lexeme.INTEGER) || this.match(Lexeme.FLOAT)) {
                return true
            }
            return false
        }

        // Унарный плюс не разрешён
        if (this.match(Lexeme.PLUS)) {
            this.errorHandler.addError(ErrorCode.E009, token)
            return false
        }

        // Если токен – число или идентификатор
        if (token.type === Lexeme.INTEGER || token.type === Lexeme.FLOAT || token.type === Lexeme.IDENTIFIER) {
            this.advance()

            // Обработка индексации массива: [expr]
            while (this.match(Lexeme.LEFT_BRACKET)) {
                if (!this.parseExpression() || !this.match(Lexeme.RIGHT_BRACKET)) {
                    this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                    return false
                }
            }

            // Обработка вызова функции: (arg1, arg2, ...)
            if (this.match(Lexeme.LEFT_PAREN)) {
                if (!this.parseArgumentList() || !this.match(Lexeme.RIGHT_PAREN)) {
                    this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                    return false
                }
            }

            // Обработка доступа к свойству: .identifier или вызов метода
            while (this.match(Lexeme.DOT)) {
                if (!this.match(Lexeme.IDENTIFIER)) {
                    this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                    return false
                }
                if (this.match(Lexeme.LEFT_PAREN)) {
                    if (!this.parseArgumentList() || !this.match(Lexeme.RIGHT_PAREN)) {
                        this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                        return false
                    }
                }
            }

            return true
        }

        // Группа с круглых скобок
        if (this.match(Lexeme.LEFT_PAREN)) {
            if (!this.parseExpression() || !this.match(Lexeme.RIGHT_PAREN)) {
                this.errorHandler.addError(ErrorCode.E009, this.currentToken())
                return false
            }
            return true
        }

        this.errorHandler.addError(ErrorCode.E009, token)
        return false
    }

    private parseArgumentList(): boolean {
        // Если сразу встречается закрывающая скобка, аргументов нет
        if (this.peek()?.type === Lexeme.RIGHT_PAREN) {
            return true
        }

        do {
            if (!this.parseExpression()) {
                return false
            }
        } while (this.match(Lexeme.COMMA))

        return true
    }

    private match(...expectedTypes: Lexeme[]): boolean {
        if (this.isEnd()) {
            return false
        }
        if (expectedTypes.includes(this.currentToken()!.type)) {
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

    private peek(): Token | undefined {
        return this.tokens[this.currentIndex + 1]
    }

    private isEnd(): boolean {
        return this.currentIndex >= this.tokens.length
    }
}

export {SyntaxAnalyzer}
