import { ErrorHandler } from './errorHandler';
import { ErrorCode } from './errorMessages';
import { Token, Lexeme } from './globalTypes';

class SyntaxAnalizator {
  private m_tokenList: Token[] = [];
  private m_tokenIterator: Token[];
  private m_errorHandler: ErrorHandler;

  constructor() {
    this.m_tokenIterator = this.m_tokenList;
    this.m_errorHandler = new ErrorHandler();
  }

  public scanExpression(tokens: Token[], output: (message: string) => void): void {
    // Используем переданный список токенов
    this.m_tokenList = tokens;
    this.m_tokenIterator = this.m_tokenList;

    if (this.isExpression() && !this.m_errorHandler.hasErrors()) {
      output('OK');
    } else {
      output('ERROR');
      // Вывод ошибок
      console.log(this.m_errorHandler.getErrors().join('\n'));
    }
  }

  private isExpression(): boolean {
    // Начинаем анализ выражения, только если оно действительно выражение
    if (this.isSimExp()) {
      if (this.isRel()) {
        // Анализируем дальнейшие части выражения
        if (this.isExpression()) {
          return true;
        }
        this.m_errorHandler.addError(ErrorCode.E009, this.currentToken());
        return false;
      }
      return true;
    }
    return false;
  }

  private isSimExp(): boolean {
    const token = this.currentToken();
    if (!token) {
      return false; // Если токенов нет, сразу возвращаем false
    }
    if (token.type === Lexeme.NUMBER_LITERAL || token.type === Lexeme.IDENTIFIER) {
      this.m_tokenIterator.shift(); // Пропускаем текущий токен
      return true;
    }
    if (this.isPluso()) {
      if (this.isSimTerm()) {
        return true;
      }
    }
    if (this.isMulo()) {
      if (this.isSimTerm()) {
        return true;
      }
    }
    return false;
  }

  private isRel(): boolean {
    const token = this.currentToken();
    if (!token) {
      return false;
    }
    if (token.type === Lexeme.RELATIONAL_OPERATOR) {
      this.m_tokenIterator.shift();
      return true;
    }
    return false;
  }

  private isPluso(): boolean {
    const token = this.currentToken();
    if (!token) {
      return false;
    }
    if (token.type === Lexeme.PLUS) {
      this.m_tokenIterator.shift();
      return true;
    }
    return false;
  }

  private isMulo(): boolean {
    const token = this.currentToken();
    if (!token) {
      return false;
    }
    if (token.type === Lexeme.MULTIPLY) {
      this.m_tokenIterator.shift();
      return true;
    }
    return false;
  }

  private isSimTerm(): boolean {
    // Мы считаем, что для простых терминов достаточно просто проверить на идентификаторы или литералы
    return this.isIdentifier() || this.isNumberLiteral();
  }

  private isTerm(): boolean {
    if (this.isCallFunc()) {
      return true;
    }
    if (this.isListInd()) {
      return true;
    }
    return this.isSimTerm(); // Если это простой термин
  }

  private isCallFunc(): boolean {
    const token = this.currentToken();
    if (!token) {
      return false;
    }
    if (token.type === Lexeme.IDENTIFIER) {
      this.m_tokenIterator.shift(); // Пропускаем идентификатор функции
      if (this.isPluso() || this.isMulo()) {
        return true;
      }
    }
    return false;
  }

  private isListInd(): boolean {
    const token = this.currentToken();
    if (!token) {
      return false;
    }
    if (token.type === Lexeme.LEFT_PAREN) {
      this.m_tokenIterator.shift();
      if (this.isExpression()) {
        const nextToken = this.currentToken();
        if (nextToken && nextToken.type === Lexeme.RIGHT_PAREN) {
          this.m_tokenIterator.shift(); // Закрывающая скобка
          return true;
        }
      }
    }
    return false;
  }

  private isIdentifier(): boolean {
    const token = this.currentToken();
    if (!token) {
      return false;
    }
    if (token.type === Lexeme.IDENTIFIER) {
      this.m_tokenIterator.shift();
      return true;
    }
    return false;
  }

  private isNumberLiteral(): boolean {
    const token = this.currentToken();
    if (!token) {
      return false;
    }
    if (token.type === Lexeme.NUMBER_LITERAL) {
      this.m_tokenIterator.shift();
      return true;
    }
    return false;
  }

  private isTokensEnd(): boolean {
    return this.m_tokenIterator.length === 0;
  }

  private currentToken(): Token | undefined {
    return this.m_tokenIterator[0];
  }
}

export { SyntaxAnalizator };
