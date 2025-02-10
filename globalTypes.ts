enum Lexeme {
    // Операторы
    PLUS = '+',
    MINUS = '-',
    MULTIPLY = '*',
    DIVIDE = '/',
  
    // Разделители
    LEFT_PAREN = '(',
    RIGHT_PAREN = ')',
  
    // Литералы и идентификаторы
    NUMBER_LITERAL = 'NUMBER_LITERAL',
    IDENTIFIER = 'IDENTIFIER',
  
    // Конец выражения
    EOF = 'EOF',
  
    // Дополнительные элементы для синтаксического анализа
    RELATIONAL_OPERATOR = 'RELATIONAL_OPERATOR',
    FUNCTION_CALL = 'FUNCTION_CALL',
    LIST_IND = 'LIST_IND',
    SIM_TERM = 'SIM_TERM',
    SIM_EXP = 'SIM_EXP',
    TERM = 'TERM'
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
  