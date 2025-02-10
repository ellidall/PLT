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

export { Lexeme, Position, Token };
