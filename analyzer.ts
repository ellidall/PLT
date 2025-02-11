import { ErrorHandler } from './errorHandler';
import { ErrorCode } from './errorMessages';
import { Token, Rule } from './globalTypes';

class SyntaxAnalyzer {
  private rules: Rule[] = [];
  private currentIndex: number = 0;
  private errorHandler: ErrorHandler;

  constructor() {
    this.errorHandler = new ErrorHandler();
  }

  public scanExpression(rules: Rule[], output: (message: string) => void): void {
    this.rules = rules;
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

    while (this.match(Rule.PLUS) || this.match(Rule.MINUS)) {
      if (!this.parseTerm()) {
        return false;
      }
    }

    while (this.match(Rule.RELATION_OPERATOR)) {
      if (!this.parseTerm()) {
        return false;
      }
    }

    return true;
  }

  private parseTerm(): boolean {
    if (!this.parseFactor()) {
      return false;
    }

    while (this.match(Rule.MULO)) {
      if (!this.parseFactor()) {
        return false;
      }
    }

    return true;
  }

  private parseFactor(): boolean {
    const token = this.currentRule();
    if (!token) {
      return false;
    }

    // Обработка унарного минуса (-)
    if (this.match(Rule.MINUS)) {
      if (this.match(Rule.RULE_IDENTIFIER) || this.match(Rule.RULE_NUMBER_LITERAL) || this.match(Rule.LEFT_PAREN)) {
        return true;
      }
      return false;
    }

    // Унарный плюс (+) не должен проходить
    if (this.match(Rule.PLUS)) {
      return false;
    }

    if (token === Rule.RULE_NUMBER_LITERAL || token === Rule.RULE_IDENTIFIER) {
      this.advance();
      return true;
    }

    if (this.match(Rule.LEFT_PAREN)) {
      if (!this.parseExpression() || !this.match(Rule.RIGHT_PAREN)) {
        return false;
      }
      return true;
    }
    
    return false;
  }

  private match(...expectedTypes: Rule[]): boolean {
    if (this.isEnd()) {
      return false;
    }
    if (expectedTypes.includes(this.currentRule())) {
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

  private currentRule(): Rule | undefined {
    return this.rules[this.currentIndex];
  }

  private isEnd(): boolean {
    return this.currentIndex >= this.rules.length;
  }
}

export { SyntaxAnalyzer };
