import {ErrorHandler} from './errorHandler'
import {Lexeme, Token} from '../globalTypes'
import {ErrorCode, errorMessages} from './errorMessages'

describe('ErrorHandler', () => {
    let handler: ErrorHandler
    const baseToken: Token = {
        type: Lexeme.BAD,
        lexeme: 'test',
        position: {line: 1, column: 1}
    }

    beforeEach(() => {
        handler = new ErrorHandler()
    })

    describe('Core functionality', () => {
        test('should initialize with empty errors', () => {
            expect(handler.hasErrors()).toBe(false)
            expect(handler.getErrors()).toHaveLength(0)
        })

        test('should add and clear errors', () => {
            handler.addError(ErrorCode.E001)
            expect(handler.hasErrors()).toBe(true)

            handler.clearErrors()
            expect(handler.hasErrors()).toBe(false)
        })
    })

    describe('Error formatting', () => {
        const testCases = [
            {
                code: ErrorCode.E001,
                token: {...baseToken, lexeme: '{unclosed'},
                expected: 'Unclosed block comment'
            },
            {
                code: ErrorCode.E002,
                token: {...baseToken, lexeme: '123.45.67'},
                expected: 'Invalid number: multiple dots'
            },
            {
                code: ErrorCode.E003,
                token: {...baseToken, lexeme: '12e'},
                expected: 'Invalid exponent format'
            },
            {
                code: ErrorCode.E004,
                token: {...baseToken, lexeme: '123abc'},
                expected: 'Invalid characters after number'
            },
            {
                code: ErrorCode.E005,
                token: {...baseToken, lexeme: 'переменная'},
                expected: 'Cyrillic letters in identifier'
            },
            {
                code: ErrorCode.E006,
                token: {...baseToken, lexeme: '"unclosed', type: Lexeme.STRING},
                expected: 'Unclosed string literal'
            },
            {
                code: ErrorCode.E007,
                token: {...baseToken, lexeme: '@'},
                expected: 'Invalid operator/symbol \'@\''
            },
            {
                code: ErrorCode.E008,
                token: {...baseToken, lexeme: '123.'},
                expected: 'Unexpected end of float number'
            },
            {
                code: 'E000' as ErrorCode,
                token: {...baseToken, lexeme: '???'},
                expected: 'Unrecognized token \'???\''
            }
        ]

        testCases.forEach(({code, token, expected}) => {
            test(`should format ${code} correctly`, () => {
                handler.addError(code, token)
                const error = handler.getErrors()[0]

                expect(error).toContain(expected)
                expect(error).toContain(`Line ${token.position.line}`)
                expect(error).toContain(`column ${token.position.column}`)
            })
        })
    })

    describe('Edge cases', () => {
        test('should handle token without lexeme', () => {
            const token: Token = {
                type: Lexeme.BAD,
                lexeme: '',
                position: {line: 0, column: 0}
            }

            handler.addError(ErrorCode.E000, token)
            expect(handler.getErrors()[0]).toContain('Unrecognized token')
        })

        test('should handle minimum position values', () => {
            const token: Token = {
                type: Lexeme.BAD,
                lexeme: '_',
                position: {line: 1, column: 1}
            }

            handler.addError(ErrorCode.E007, token)
            expect(handler.getErrors()[0]).toMatch(/Line 1, column 1/)
        })

        test('should handle multiple errors', () => {
            const tokens: Token[] = [
                {...baseToken, position: {line: 1, column: 5}},
                {...baseToken, position: {line: 2, column: 10}},
                {...baseToken, position: {line: 3, column: 15}}
            ]

            tokens.forEach(t => handler.addError(ErrorCode.E000, t))
            expect(handler.getErrors()).toHaveLength(3)
        })
    })

    describe('Special cases', () => {
        test('should handle errors without token', () => {
            handler.addError(ErrorCode.E001)
            expect(handler.getErrors()[0]).toBe(errorMessages.E001)
        })

        test('should not replace placeholder if no token', () => {
            handler.addError(ErrorCode.E007)
            expect(handler.getErrors()[0]).toBe('Invalid operator/symbol \'{token}\'')
        })

        test('should handle tokens with different types', () => {
            const token: Token = {
                type: Lexeme.IDENTIFIER,
                lexeme: 'bad-identifier',
                position: {line: 5, column: 5}
            }

            handler.addError(ErrorCode.E004, token)
            const error = handler.getErrors()[0]

            expect(error).toContain('Invalid characters')
            expect(error).toContain('Line 5')
        })
    })
})