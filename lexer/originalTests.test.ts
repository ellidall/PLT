// import {Lexeme} from '../globalTypes'
// import {Lexer} from './lexer'
//
// describe('Custom Lexer Tests', () => {
//     describe('Positive cases', () => {
//         const positiveCases = [
//             {
//                 name: 'Single identifier',
//                 input: 'a',
//                 expected: [Lexeme.IDENTIFIER, Lexeme.EOF]
//             },
//             {
//                 name: 'Simple comparison',
//                 input: 'a > b',
//                 expected: [
//                     Lexeme.IDENTIFIER,
//                     Lexeme.GREATER,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.EOF
//                 ]
//             },
//             {
//                 name: 'Complex expression',
//                 input: '-a + 5.3E-15 * (-a + -b * (a * -b) -c) != abc',
//                 expected: [
//                     Lexeme.MINUS,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.PLUS,
//                     Lexeme.FLOAT,
//                     Lexeme.MULTIPLICATION,
//                     Lexeme.LEFT_PAREN,
//                     Lexeme.MINUS,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.PLUS,
//                     Lexeme.MINUS,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.MULTIPLICATION,
//                     Lexeme.LEFT_PAREN,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.MULTIPLICATION,
//                     Lexeme.MINUS,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.RIGHT_PAREN,
//                     Lexeme.MINUS,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.RIGHT_PAREN,
//                     Lexeme.NOT_EQ,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.EOF
//                 ]
//             },
//             {
//                 name: 'Complex structure with array and function calls',
//                 input: '!a[7][a+5][b(3.5, c.d[f * ab])] OR 15 * (r - br MOD 5) AND TRUE',
//                 expected: [
//                     Lexeme.NOT,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.LEFT_BRACKET,
//                     Lexeme.INTEGER,
//                     Lexeme.RIGHT_BRACKET,
//                     Lexeme.LEFT_BRACKET,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.PLUS,
//                     Lexeme.INTEGER,
//                     Lexeme.RIGHT_BRACKET,
//                     Lexeme.LEFT_BRACKET,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.LEFT_PAREN,
//                     Lexeme.FLOAT,
//                     Lexeme.COMMA,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.DOT,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.LEFT_BRACKET,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.MULTIPLICATION,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.RIGHT_BRACKET,
//                     Lexeme.RIGHT_PAREN,
//                     Lexeme.RIGHT_BRACKET,
//                     Lexeme.OR,
//                     Lexeme.INTEGER,
//                     Lexeme.MULTIPLICATION,
//                     Lexeme.LEFT_PAREN,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.MINUS,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.MOD,
//                     Lexeme.INTEGER,
//                     Lexeme.RIGHT_PAREN,
//                     Lexeme.AND,
//                     Lexeme.IDENTIFIER,
//                     Lexeme.EOF
//                 ]
//             }
//         ];
//
//         positiveCases.forEach(({ name, input, expected }) => {
//             test(name, () => {
//                 const lexer = new Lexer(input);
//                 const tokens = lexer.tokenize();
//                 expect(tokens.map(t => t.type)).toEqual(expected);
//             });
//         });
//     });
//
//     describe('Negative cases', () => {
//         const negativeCases = [
//             {
//                 input: ')(',
//                 description: 'Incorrect parentheses'
//             },
//             {
//                 input: 'ab.5',
//                 description: 'Invalid identifier with dot'
//             },
//             {
//                 input: 'ab.',
//                 description: 'Unfinished identifier'
//             },
//             {
//                 input: '5a',
//                 description: 'Number followed by letter'
//             },
//             {
//                 input: 'fn(a, )',
//                 description: 'Unfinished function call'
//             },
//             {
//                 input: '+-+-',
//                 description: 'Sequence of operators'
//             },
//             {
//                 input: '.',
//                 description: 'Single dot'
//             }
//         ];
//
//         negativeCases.forEach(({ input, description }) => {
//             test(description, () => {
//                 const lexer = new Lexer(input);
//                 const tokens = lexer.tokenize();
//
//                 // Expect at least one BAD token
//                 expect(tokens.some(t => t.type === Lexeme.BAD)).toBe(true);
//
//                 // Should still reach EOF
//                 expect(tokens[tokens.length - 1].type).toBe(Lexeme.EOF);
//             });
//         });
//     });
// });