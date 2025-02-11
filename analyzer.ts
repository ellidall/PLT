import { ErrorHandler } from './errorHandler';
import { ErrorCode } from './errorMessages';
import { Token, Lexeme } from './globalTypes';

class SyntaxAnalyzer {
  private tokens: Token[] = [];
  private currentIndex: number = 0;
  private errorHandler: ErrorHandler;

  constructor() {
    this.errorHandler = new ErrorHandler();
  }

  public scanExpression(tokens: Token[], output: (message: string) => void): void {
    this.tokens = tokens;
    this.currentIndex = 0;
    this.errorHandler.clearErrors();

    const isValid = this.parseExpression();
    const hasErrors = this.errorHandler.hasErrors();

    if (isValid && !hasErrors && this.isEnd()) {
      output('OK');
    } else {
      output('ERROR');
      console.log(this.errorHandler.getErrors().join('\n'));
    }
  }

  private parseExpression(): boolean {
    if (!this.parseTerm()) {
      return false;
    }

    // Обработка операндов типа PLUSO (+, -, OR)
    while (this.match(Lexeme.PLUSO)) {
      if (!this.parseTerm()) {
        this.errorHandler.addError(ErrorCode.E009, this.currentToken());
        return false;
      }
    }

    // Обработка операторов типа RELATION_OPERATOR (==, !=, <, >, <=, >=)
    while (this.match(Lexeme.RELATION_OPERATOR)) {
      if (!this.parseTerm()) {
        this.errorHandler.addError(ErrorCode.E009, this.currentToken());
        return false;
      }
    }

    return true;
  }

  private parseTerm(): boolean {
    if (!this.parseFactor()) {
      return false;
    }

    // Обработка операторов типа MULO (*, /, %)
    while (this.match(Lexeme.MULO)) {
      if (!this.parseFactor()) {
        this.errorHandler.addError(ErrorCode.E009, this.currentToken());
        return false;
      }
    }

    return true;
  }

  private parseFactor(): boolean {
    const token = this.currentToken();

    if (!token) {
      return false;
    }

    // Обработка токенов типа NUMBER_LITERAL и IDENTIFIER
    if (token.type === Lexeme.NUMBER_LITERAL || token.type === Lexeme.IDENTIFIER) {
      this.advance();
      return true;
    }

    // Обработка выражений в скобках
    if (this.match(Lexeme.LEFT_PAREN)) {
      if (!this.parseExpression() || !this.match(Lexeme.RIGHT_PAREN)) {
        this.errorHandler.addError(ErrorCode.E009, this.currentToken());
        return false;
      }
      return true;
    }

    this.errorHandler.addError(ErrorCode.E009, token);
    return false;
  }

  private match(...expectedTypes: Lexeme[]): boolean {
    if (this.isEnd()) {
      return false;
    }

    if (expectedTypes.includes(this.currentToken()?.type!)) {
      this.advance();
      return true;
    }

    return false;
  }

  private advance(): void {
    if (!this.isEnd()) {
      this.currentIndex++;
    }
  }

  private currentToken(): Token | undefined {
    return this.tokens[this.currentIndex];
  }

  private isEnd(): boolean {
    return this.currentIndex >= this.tokens.length;
  }
}

export { SyntaxAnalyzer };
