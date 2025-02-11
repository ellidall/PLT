enum Lexeme {
    RELATION_OPERATOR = 'RELATION_OPERATOR',  // == | != | < | > | <= | >=
    PLUSO = 'PLUSO',  // + | - | OR
    MULO = 'MULO',  // AND | * | / | MOD | DIV
    SUPO = 'SUPO',  // = (унарное) | () | not
    NUMBER_LITERAL = 'NUMBER_LITERAL',
    IDENTIFIER = 'IDENTIFIER',
    LEFT_PAREN = 'LEFT_PAREN',
    RIGHT_PAREN = 'RIGHT_PAREN',
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

  export { Lexeme, Position, Token };
