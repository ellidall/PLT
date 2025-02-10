import {ErrorCode, errorMessages} from './errorMessages'
import {Token} from '../globalTypes'

class ErrorHandler {
    private errors: string[] = []

    addError(errorCode: ErrorCode, token?: Token) {
        let message = errorMessages[errorCode]

        if (token && message.includes('{token}')) {
            message = message.replace(/{token}/g, token.lexeme)
        }

        const errorLocation = token
            ? `Line ${token.position.line}, column ${token.position.column}: ${message}`
            : message

        this.errors.push(errorLocation)
    }

    hasErrors() {
        return this.errors.length > 0
    }

    getErrors() {
        return this.errors
    }

    clearErrors() {
        this.errors = []
    }
}

export {
    ErrorHandler,
}