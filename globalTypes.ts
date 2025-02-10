enum Lexeme {
    // Ключевые слова
    ARRAY = 'ARRAY',
    BEGIN = 'BEGIN',
    ELSE = 'ELSE',
    END = 'END',
    IF = 'IF',
    OF = 'OF',
    OR = 'OR',
    PROGRAM = 'PROGRAM',
    PROCEDURE = 'PROCEDURE',
    THEN = 'THEN',
    TYPE = 'TYPE',
    VAR = 'VAR',

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
    EQ = '=',
    GREATER = '>',
    LESS = '<',
    LESS_EQ = '<=',
    GREATER_EQ = '>=',
    NOT_EQ = '<>',
    COLON = ':',
    ASSIGN = ':=',
    DOT = '.',
    DOUBLE_EQ = '==',

    // Литералы и идентификаторы
    IDENTIFIER = 'IDENTIFIER',
    STRING = 'STRING',
    INTEGER = 'INTEGER',
    FLOAT = 'FLOAT',

    // Комментарии
    LINE_COMMENT = 'LINE_COMMENT',
    BLOCK_COMMENT = 'BLOCK_COMMENT',

    // Специальные
    BAD = 'BAD',
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

export {
    Lexeme,
    Position,
    Token,
}
