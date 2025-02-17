enum ErrorCode {
    E001 = 'E001', // Unclosed block comment
    E002 = 'E002', // Invalid number: multiple dots
    E003 = 'E003', // Invalid exponent format
    E004 = 'E004', // Invalid characters after number
    E005 = 'E005', // Cyrillic letters in identifier
    E006 = 'E006', // Unclosed string literal
    E007 = 'E007', // Invalid operator/symbol '{token}'
    E008 = 'E008', // Unexpected end of float number
    E009 = 'E009', // Unexpected token '{token}'
}

const errorMessages: Record<ErrorCode, string> = {
    [ErrorCode.E001]: 'Unclosed block comment',
    [ErrorCode.E002]: 'Invalid number: multiple dots',
    [ErrorCode.E003]: 'Invalid exponent format',
    [ErrorCode.E004]: 'Invalid characters after number',
    [ErrorCode.E005]: 'Cyrillic letters in identifier',
    [ErrorCode.E006]: 'Unclosed string literal',
    [ErrorCode.E007]: 'Invalid operator/symbol \'{token}\'',
    [ErrorCode.E008]: 'Unexpected end of float number',
    [ErrorCode.E009]: 'Unexpected token \'{token}\'',
}

export {
    ErrorCode,
    errorMessages,
}
