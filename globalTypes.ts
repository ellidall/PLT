enum Rule {
    RELATION_OPERATOR = 'RELATION_OPERATOR',  // == | != | < | > | <= | >=
    PLUS = '+',  // + | - | OR
    MINUS = '-',
    MULO = 'MULO',  // AND | * | / | MOD | DIV
    SUPO = 'SUPO',  // = (унарное) | () | not
    RULE_NUMBER_LITERAL = 'NUMBER_LITERAL',
    RULE_IDENTIFIER = 'IDENTIFIER',
    LEFT_PAREN = 'LEFT_PAREN',
    RIGHT_PAREN = 'RIGHT_PAREN',
    LEFT_BRACKET = '[',
    RIGHT_BRACKET = ']',
    COMMA = ',',
    DOT = '.',
    NOT = 'NOT',
    ERROR = "ERROR_RULE",
  }

  enum Lexeme {
    // Ключевые слова
    IF = 'IF',
    THEN = 'THEN',
    ELSE = 'ELSE',
    OR = 'OR',
    AND = 'AND',
    DIV = 'DIV',
    MOD = 'MOD',
    NOT = 'NOT',
    TRUE = 'TRUE',
    FALSE = 'FALSE',

    // Операторы и знаки пунктуации
    MULTIPLICATION = '*',
    PLUS = '+',
    MINUS = '-',
    DIVIDE = '/',
    SEMICOLON = ';',
    COMMA = ',',
    LEFT_PAREN = '(',
    RIGHT_PAREN = ')',
    LEFT_BRACKET = '[',
    RIGHT_BRACKET = ']',
    GREATER = '>',
    LESS = '<',
    LESS_EQ = '<=',
    GREATER_EQ = '>=',
    NOT_EQ = '!=',
    COLON = ':',
    ASSIGN = '=',
    DOT = '.',
    DOUBLE_EQ = '==',
    NEGATION = '!',

    // Литералы и идентификаторы
    IDENTIFIER = 'IDENTIFIER',
    STRING = 'STRING',
    INTEGER = 'INTEGER',
    FLOAT = 'FLOAT',

    // Комментарии
    LINE_COMMENT = 'LINE_COMMENT',
    BLOCK_COMMENT = 'BLOCK_COMMENT',

    // Специальные
    ERROR = 'ERROR',
    EOF = 'EOF'
}

  type Position = {
    line: number;
    column: number;
  };

  type Token = {
    type: Lexeme;
    lexeme: string;
    position: Position;
};

  export { Rule, Lexeme, Position, Token };
