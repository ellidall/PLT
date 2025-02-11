import { SyntaxAnalyzer } from './analyzer';
import { Lexer } from './lexer';
import { Rule, Token, Lexeme, Position } from './globalTypes';

// function runTest(tokens: Token[]): void {
//   const syntaxAnalyzer = new SyntaxAnalyzer();
//   const output = (message: string) => console.log(message);

//   console.log('Testing input tokens:', tokens);

//   syntaxAnalyzer.scanExpression(tokens, (message: string, position?: Position) => {
//     if (message.includes('Unexpected token')) {
//       output(`Debug: ERROR at ${position?.line}:${position?.column}: ${message}`);
//     } else {
//       output(`Debug: ${message}`);
//     }
//   });
// }

// // Тестовые случаи с токенами напрямую
// const testCases: Token[][] = [
//   [
//     { type: Rule.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 1 } },
//     { type: Rule.PLUSO, lexeme: '+', position: { line: 1, column: 3 } },
//     { type: Rule.IDENTIFIER, lexeme: 'y', position: { line: 1, column: 5 } },
//   ],
//   [
//     { type: Lexeme.IDENTIFIER, lexeme: 'a', position: { line: 1, column: 1 } },
//     { type: Lexeme.MULO, lexeme: '*', position: { line: 1, column: 3 } },
//     { type: Lexeme.LEFT_PAREN, lexeme: '(', position: { line: 1, column: 5 } },
//     { type: Lexeme.IDENTIFIER, lexeme: 'b', position: { line: 1, column: 6 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 8 } },
//     { type: Lexeme.IDENTIFIER, lexeme: 'c', position: { line: 1, column: 10 } },
//     { type: Lexeme.RIGHT_PAREN, lexeme: ')', position: { line: 1, column: 11 } },
//   ],
//   [
//     { type: Lexeme.NUMBER_LITERAL, lexeme: '5', position: { line: 1, column: 1 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 3 } },
//     { type: Lexeme.NUMBER_LITERAL, lexeme: '3', position: { line: 1, column: 5 } },
//     { type: Lexeme.MULO, lexeme: '*', position: { line: 1, column: 7 } },
//     { type: Lexeme.NUMBER_LITERAL, lexeme: '2', position: { line: 1, column: 9 } },
//   ],
//   [
//     { type: Lexeme.IDENTIFIER, lexeme: 'a', position: { line: 1, column: 1 } },
//     { type: Lexeme.RELATION_OPERATOR, lexeme: '<', position: { line: 1, column: 3 } },
//     { type: Lexeme.IDENTIFIER, lexeme: 'b', position: { line: 1, column: 5 } },
//   ],
//   [
//     { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 1 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 2 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 3 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 4 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 5 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 6 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 7 } },
//     { type: Lexeme.IDENTIFIER, lexeme: 'y', position: { line: 1, column: 8 } },
//   ],
//   [
//     { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 1 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 2 } },
//     { type: Lexeme.LEFT_PAREN, lexeme: '(', position: { line: 1, column: 3 } },
//     { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 4 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 5 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 6 } },
//     { type: Lexeme.IDENTIFIER, lexeme: 'y', position: { line: 1, column: 7 } },
//     { type: Lexeme.RIGHT_PAREN, lexeme: ')', position: { line: 1, column: 8 } },
//   ],
//   [
//     { type: Lexeme.LEFT_PAREN, lexeme: '(', position: { line: 1, column: 1 } },
//     { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 2 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 3 } },
//     { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 4 } },
//     { type: Lexeme.RIGHT_PAREN, lexeme: ')', position: { line: 1, column: 5 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 6 } },
//     { type: Lexeme.LEFT_PAREN, lexeme: '(', position: { line: 1, column: 7 } },
//     { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 8 } },
//     { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 9 } },
//     { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 10 } },
//     { type: Lexeme.RIGHT_PAREN, lexeme: ')', position: { line: 1, column: 11 } },
//   ],
// ];

function lexemeToRule(token: Token): Rule | null {
    switch (token.type) {
        case Lexeme.DOUBLE_EQ:
        case Lexeme.NOT_EQ:
        case Lexeme.LESS:
        case Lexeme.GREATER:
        case Lexeme.LESS_EQ:
        case Lexeme.GREATER_EQ:
            return Rule.RELATION_OPERATOR;

        case Lexeme.PLUS:
            return Rule.PLUS;
        case Lexeme.MINUS:
            return Rule.MINUS;
        case Lexeme.OR:
            return Rule.PLUS;

        case Lexeme.AND:
        case Lexeme.MULTIPLICATION:
        case Lexeme.DIVIDE:
        case Lexeme.MOD:
        case Lexeme.DIV:
            return Rule.MULO;

        case Lexeme.ASSIGN:
            return Rule.SUPO;
        case Lexeme.LEFT_PAREN:
            return Rule.LEFT_PAREN
        case Lexeme.RIGHT_PAREN:
            return Rule.RIGHT_PAREN

        case Lexeme.LEFT_BRACKET:
            return Rule.LEFT_BRACKET
        case Lexeme.RIGHT_BRACKET:
            return Rule.RIGHT_BRACKET

        case Lexeme.INTEGER:
        case Lexeme.FLOAT:
            return Rule.RULE_NUMBER_LITERAL;

        case Lexeme.IDENTIFIER:
            return Rule.RULE_IDENTIFIER;

        case Lexeme.LEFT_PAREN:
            return Rule.LEFT_PAREN;

        case Lexeme.RIGHT_PAREN:
            return Rule.RIGHT_PAREN;

        case Lexeme.COMMA:
            return Rule.COMMA;

        default:
            return Rule.ERROR; // Возвращаем null, если лексема не соответствует ни одному правилу
    }
}

const syntaxAnalyzer = new SyntaxAnalyzer();
const output = (message: string) => console.log(message);

const input = '.'
const lexer = new Lexer(input)
const tokens = lexer.tokenize()
const rules = tokens.filter(lexemeToRule => lexemeToRule.type != Lexeme.EOF).map(
    token => lexemeToRule(token)
);
console.log(tokens)
console.log(rules)

syntaxAnalyzer.scanExpression(rules, (message: string, position?: Position) => {
    if (message.includes('Unexpected token')) {
      output(`Debug: ERROR at ${position?.line}:${position?.column}: ${message}`);
    } else {
      output(`Debug: ${message}`);
    }
  });