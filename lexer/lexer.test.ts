import {Lexer} from './lexer'
import {Lexeme} from '../globalTypes'

describe('Lexer', () => {
    describe('Basic tokens', () => {
        test('should tokenize keywords', () => {
            const input = 'BEGIN END IF THEN VAR';
            const lexer = new Lexer(input);
            const tokens = lexer.tokenize();

            expect(tokens.map(t => t.type)).toEqual([
                Lexeme.BEGIN,
                Lexeme.END,
                Lexeme.IF,
                Lexeme.THEN,
                Lexeme.VAR,
                Lexeme.EOF
            ]);
        });

        test('should handle operators', () => {
            const input = '+ - * / := == <> <= >=';
            const lexer = new Lexer(input);
            const tokens = lexer.tokenize();

            expect(tokens.map(t => t.type)).toEqual([
                Lexeme.PLUS,
                Lexeme.MINUS,
                Lexeme.MULTIPLICATION,
                Lexeme.DIVIDE,
                Lexeme.ASSIGN,
                Lexeme.DOUBLE_EQ,
                Lexeme.NOT_EQ,
                Lexeme.LESS_EQ,
                Lexeme.GREATER_EQ,
                Lexeme.EOF
            ]);
        });
    });

    describe('Numbers', () => {
        const testCases = [
            { input: '123', type: Lexeme.INTEGER },
            { input: '123.45', type: Lexeme.FLOAT },
            { input: '123e5', type: Lexeme.FLOAT },
            { input: '12.34e-6', type: Lexeme.FLOAT },
            { input: '123..45', type: Lexeme.BAD },
            { input: '123.45.67', type: Lexeme.BAD },
            { input: '12e', type: Lexeme.BAD },
            { input: '12e+', type: Lexeme.BAD },
            { input: '123abc', type: Lexeme.BAD }
        ];

        testCases.forEach(({ input, type }) => {
            test(`should handle ${input} as ${type}`, () => {
                const lexer = new Lexer(input);
                const tokens = lexer.tokenize();
                expect(tokens[0].type).toBe(type);
            });
        });
    });

    describe('Strings', () => {
        test('should handle valid strings', () => {
            const input = '"Hello, World!"';
            const lexer = new Lexer(input);
            const tokens = lexer.tokenize();

            expect(tokens[0].type).toBe(Lexeme.STRING);
            expect(tokens[0].lexeme).toBe('Hello, World!');
        });

        test('should handle unclosed strings', () => {
            const input = '"Unclosed string';
            const lexer = new Lexer(input);
            const tokens = lexer.tokenize();

            expect(tokens[0].type).toBe(Lexeme.BAD);
        });
    });

    describe('Identifiers', () => {
        const testCases = [
            { input: 'variable', type: Lexeme.IDENTIFIER },
            { input: 'var123', type: Lexeme.IDENTIFIER },
            { input: 'переменная', type: Lexeme.BAD },
            { input: '_var', type: Lexeme.IDENTIFIER },
            { input: 'VAR', type: Lexeme.VAR }
        ];

        testCases.forEach(({ input, type }) => {
            test(`should handle ${input} as ${type}`, () => {
                const lexer = new Lexer(input);
                const tokens = lexer.tokenize();
                expect(tokens[0].type).toBe(type);
            });
        });
    });

    describe('Comments', () => {
        test('should handle line comments', () => {
            const input = '// This is a comment\nBEGIN';
            const lexer = new Lexer(input);
            const tokens = lexer.tokenize();

            expect(tokens[0].type).toBe(Lexeme.LINE_COMMENT);
            expect(tokens[1].type).toBe(Lexeme.BEGIN);
        });

        test('should handle block comments', () => {
            const input = '{ This is a block comment } BEGIN';
            const lexer = new Lexer(input);
            const tokens = lexer.tokenize();

            expect(tokens[0].type).toBe(Lexeme.BLOCK_COMMENT);
            expect(tokens[1].type).toBe(Lexeme.BEGIN);
        });

        test('should handle unclosed block comments', () => {
            const input = '{ Unclosed comment';
            const lexer = new Lexer(input);
            const tokens = lexer.tokenize();

            expect(tokens[0].type).toBe(Lexeme.BAD);
        });
    });

    describe('Positions', () => {
        test('should track line and column numbers', () => {
            const input = `BEGIN
  x := 42;
END.`;
            const lexer = new Lexer(input);
            const tokens = lexer.tokenize();

            expect(tokens[0].position).toEqual({ line: 1, column: 0 });
            expect(tokens[1].position).toEqual({ line: 2, column: 2 });
            expect(tokens[4].position).toEqual({ line: 3, column: 0 });
        });

        test('should handle empty input', () => {
            const lexer = new Lexer('');
            const tokens = lexer.tokenize();
            expect(tokens).toEqual([{
                type: Lexeme.EOF,
                lexeme: '',
                position: { line: 1, column: 0 }
            }]);
        });
    });

    describe('Error recovery', () => {
        test('should continue after errors', () => {
            const input = '123abc "unclosed # ~';
            const lexer = new Lexer(input);
            const tokens = lexer.tokenize();

            const types = tokens.map(t => t.type);
            expect(types).toEqual([
                Lexeme.BAD,
                Lexeme.BAD,
                Lexeme.BAD,
                Lexeme.EOF
            ]);
        });
    });

    describe('Complex programs', () => {
        test('should tokenize sample program', () => {
            const input = `
        PROGRAM HelloWorld;
        BEGIN
          x := 42;
          y := 3.14e-2;
          IF x > y THEN
            WriteString("Hello");
        END.
      `;

            const lexer = new Lexer(input);
            const tokens = lexer.tokenize().filter(t => t.type !== Lexeme.LINE_COMMENT);

            expect(tokens.map(t => t.type)).toEqual([
                Lexeme.PROGRAM,
                Lexeme.IDENTIFIER,
                Lexeme.SEMICOLON,
                Lexeme.BEGIN,
                Lexeme.IDENTIFIER,
                Lexeme.ASSIGN,
                Lexeme.INTEGER,
                Lexeme.SEMICOLON,
                Lexeme.IDENTIFIER,
                Lexeme.ASSIGN,
                Lexeme.FLOAT,
                Lexeme.SEMICOLON,
                Lexeme.IF,
                Lexeme.IDENTIFIER,
                Lexeme.GREATER,
                Lexeme.IDENTIFIER,
                Lexeme.THEN,
                Lexeme.IDENTIFIER,
                Lexeme.LEFT_PAREN,
                Lexeme.STRING,
                Lexeme.RIGHT_PAREN,
                Lexeme.SEMICOLON,
                Lexeme.END,
                Lexeme.DOT,
                Lexeme.EOF
            ]);
        });
    });
});