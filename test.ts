import { SyntaxAnalyzer } from './analyzer';
import { Token, Lexeme, Position } from './globalTypes';

function runTest(tokens: Token[]): void {
  const syntaxAnalyzer = new SyntaxAnalyzer();
  const output = (message: string) => console.log(message);

  console.log('Testing input tokens:', tokens);

  syntaxAnalyzer.scanExpression(tokens, (message: string, position?: Position) => {
    if (message.includes('Unexpected token')) {
      output(`Debug: ERROR at ${position?.line}:${position?.column}: ${message}`);
    } else {
      output(`Debug: ${message}`);
    }
  });
}

// Тестовые случаи с токенами напрямую
const testCases: Token[][] = [
  [
    { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 1 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 3 } },
    { type: Lexeme.IDENTIFIER, lexeme: 'y', position: { line: 1, column: 5 } },
  ],
  [
    { type: Lexeme.IDENTIFIER, lexeme: 'a', position: { line: 1, column: 1 } },
    { type: Lexeme.MULO, lexeme: '*', position: { line: 1, column: 3 } },
    { type: Lexeme.LEFT_PAREN, lexeme: '(', position: { line: 1, column: 5 } },
    { type: Lexeme.IDENTIFIER, lexeme: 'b', position: { line: 1, column: 6 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 8 } },
    { type: Lexeme.IDENTIFIER, lexeme: 'c', position: { line: 1, column: 10 } },
    { type: Lexeme.RIGHT_PAREN, lexeme: ')', position: { line: 1, column: 11 } },
  ],
  [
    { type: Lexeme.NUMBER_LITERAL, lexeme: '5', position: { line: 1, column: 1 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 3 } },
    { type: Lexeme.NUMBER_LITERAL, lexeme: '3', position: { line: 1, column: 5 } },
    { type: Lexeme.MULO, lexeme: '*', position: { line: 1, column: 7 } },
    { type: Lexeme.NUMBER_LITERAL, lexeme: '2', position: { line: 1, column: 9 } },
  ],
  [
    { type: Lexeme.IDENTIFIER, lexeme: 'a', position: { line: 1, column: 1 } },
    { type: Lexeme.RELATION_OPERATOR, lexeme: '<', position: { line: 1, column: 3 } },
    { type: Lexeme.IDENTIFIER, lexeme: 'b', position: { line: 1, column: 5 } },
  ],
  [
    { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 1 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 2 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 3 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 4 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 5 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 6 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 7 } },
    { type: Lexeme.IDENTIFIER, lexeme: 'y', position: { line: 1, column: 8 } },
  ],
  [
    { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 1 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 2 } },
    { type: Lexeme.LEFT_PAREN, lexeme: '(', position: { line: 1, column: 3 } },
    { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 4 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 5 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 6 } },
    { type: Lexeme.IDENTIFIER, lexeme: 'y', position: { line: 1, column: 7 } },
    { type: Lexeme.RIGHT_PAREN, lexeme: ')', position: { line: 1, column: 8 } },
  ],
  [
    { type: Lexeme.LEFT_PAREN, lexeme: '(', position: { line: 1, column: 1 } },
    { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 2 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 3 } },
    { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 4 } },
    { type: Lexeme.RIGHT_PAREN, lexeme: ')', position: { line: 1, column: 5 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 6 } },
    { type: Lexeme.LEFT_PAREN, lexeme: '(', position: { line: 1, column: 7 } },
    { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 8 } },
    { type: Lexeme.PLUSO, lexeme: '+', position: { line: 1, column: 9 } },
    { type: Lexeme.IDENTIFIER, lexeme: 'x', position: { line: 1, column: 10 } },
    { type: Lexeme.RIGHT_PAREN, lexeme: ')', position: { line: 1, column: 11 } },
  ],
];

// Запуск тестов
for (const testCase of testCases) {
  runTest(testCase);
}
