import { Lexeme, Token } from './globalTypes';
import { ExpressionParser, Analyzer } from './analyzer';

// Пример тестов для проверки корректности работы парсера

function runTest(tokens: Token[], expected: boolean): void {
    const parser = new ExpressionParser(tokens);
    const result = parser.parseExpression();
    if (result === expected) {
        console.log(`✅ Тест прошел успешно!`);
    } else {
        console.log(`❌ Тест не прошел.`);
    }
}

// Тест 1: Простое сложение
const tokens1: Token[] = [
    { type: Lexeme.NUMBER_LITERAL, lexeme: '5', position: { line: 1, column: 1 } },
    { type: Lexeme.PLUS, lexeme: '+', position: { line: 1, column: 2 } },
    { type: Lexeme.NUMBER_LITERAL, lexeme: '3', position: { line: 1, column: 3 } },
    { type: Lexeme.EOF, lexeme: '', position: { line: 1, column: 4 } }
];
runTest(tokens1, true);  // Ожидаем успешный результат

// Тест 2: Выражение с умножением
const tokens2: Token[] = [
    { type: Lexeme.NUMBER_LITERAL, lexeme: '2', position: { line: 1, column: 1 } },
    { type: Lexeme.MULTIPLY, lexeme: '*', position: { line: 1, column: 2 } },
    { type: Lexeme.NUMBER_LITERAL, lexeme: '3', position: { line: 1, column: 3 } },
    { type: Lexeme.EOF, lexeme: '', position: { line: 1, column: 4 } }
];
runTest(tokens2, true);  // Ожидаем успешный результат

// Тест 3: Выражение с операциями разного приоритета
const tokens3: Token[] = [
    { type: Lexeme.NUMBER_LITERAL, lexeme: '2', position: { line: 1, column: 1 } },
    { type: Lexeme.PLUS, lexeme: '+', position: { line: 1, column: 2 } },
    { type: Lexeme.NUMBER_LITERAL, lexeme: '3', position: { line: 1, column: 3 } },
    { type: Lexeme.MULTIPLY, lexeme: '*', position: { line: 1, column: 4 } },
    { type: Lexeme.NUMBER_LITERAL, lexeme: '4', position: { line: 1, column: 5 } },
    { type: Lexeme.EOF, lexeme: '', position: { line: 1, column: 6 } }
];
runTest(tokens3, true);  // Ожидаем успешный результат

// Тест 4: Выражение с скобками
const tokens4: Token[] = [
    { type: Lexeme.LEFT_PAREN, lexeme: '(', position: { line: 1, column: 1 } },
    { type: Lexeme.NUMBER_LITERAL, lexeme: '5', position: { line: 1, column: 2 } },
    { type: Lexeme.PLUS, lexeme: '+', position: { line: 1, column: 3 } },
    { type: Lexeme.NUMBER_LITERAL, lexeme: '3', position: { line: 1, column: 4 } },
    { type: Lexeme.RIGHT_PAREN, lexeme: ')', position: { line: 1, column: 5 } },
    { type: Lexeme.EOF, lexeme: '', position: { line: 1, column: 6 } }
];
runTest(tokens4, true);  // Ожидаем успешный результат

// Тест 5: Ошибка (неправильная последовательность)
const tokens5: Token[] = [
    { type: Lexeme.NUMBER_LITERAL, lexeme: '5', position: { line: 1, column: 1 } },
    { type: Lexeme.PLUS, lexeme: '+', position: { line: 1, column: 2 } },
    { type: Lexeme.MULTIPLY, lexeme: '*', position: { line: 1, column: 3 } },
    { type: Lexeme.NUMBER_LITERAL, lexeme: '3', position: { line: 1, column: 4 } },
    { type: Lexeme.EOF, lexeme: '', position: { line: 1, column: 5 } }
];
runTest(tokens5, false);  // Ожидаем ошибку, так как операторы неправильно расположены

// Тест 6: Скобки, умножение и деление
const tokens6: Token[] = [
    { type: Lexeme.LEFT_PAREN, lexeme: '(', position: { line: 1, column: 1 } },
    { type: Lexeme.NUMBER_LITERAL, lexeme: '2', position: { line: 1, column: 2 } },
    { type: Lexeme.PLUS, lexeme: '+', position: { line: 1, column: 3 } },
    { type: Lexeme.NUMBER_LITERAL, lexeme: '3', position: { line: 1, column: 4 } },
    { type: Lexeme.RIGHT_PAREN, lexeme: ')', position: { line: 1, column: 5 } },
    { type: Lexeme.MULTIPLY, lexeme: '*', position: { line: 1, column: 6 } },
    { type: Lexeme.NUMBER_LITERAL, lexeme: '4', position: { line: 1, column: 7 } },
    { type: Lexeme.EOF, lexeme: '', position: { line: 1, column: 8 } }
];
runTest(tokens6, true);  // Ожидаем успешный результат
