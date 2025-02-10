import { SyntaxAnalizator } from './analyzer';
import { Token, Lexeme, Position } from './globalTypes';

function runTest(input: string): void {
  const syntaxAnalizator = new SyntaxAnalizator();
  const output = (message: string) => console.log(message);

  console.log(`Testing input: ${input}`);

  // Преобразуем строку во множество токенов
  const tokens = tokenize(input);
  syntaxAnalizator.scanExpression(tokens, output);
}

// Функция для токенизации входной строки
function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let column = 1;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === ' ') {
      column++;
      continue; // Пропускаем пробелы
    }

    let lexeme: string = char;
    let type: Lexeme | null = null;

    // Определяем тип токена
    if (/[a-zA-Z]/.test(char)) {
      type = Lexeme.IDENTIFIER;
    } else if (/\d/.test(char)) {
      type = Lexeme.NUMBER_LITERAL;
    } else if (char === '+') {
      type = Lexeme.PLUS;
    } else if (char === '*') {
      type = Lexeme.MULTIPLY;
    } else if (char === '(') {
      type = Lexeme.LEFT_PAREN;
    } else if (char === ')') {
      type = Lexeme.RIGHT_PAREN;
    } else if (char === '<') {
      type = Lexeme.RELATIONAL_OPERATOR;
    } else if (char === '&') {
      lexeme += input[++i];  // Обрабатываем `&&`
      type = Lexeme.RELATIONAL_OPERATOR;
    } else {
      throw new Error(`Unexpected character: ${char}`);
    }

    tokens.push({
      type: type!,
      lexeme: lexeme,
      position: { line: 1, column: column }
    });

    column++;
  }

  return tokens;
}

// Тесты
runTest('x + y');  // Простой пример с переменными
runTest('a * (b + c)');  // Пример с операторами и скобками
runTest('f(x, y)');  // Вызов функции
runTest('5 + 3 * 2');  // Операции с приоритетом
runTest('a < b && c > d');  // Сложные выражения с операторами
runTest('x+++++++y');  // Ошибка с множественными операторами
