enum ErrorCode {
    E001 =  'E001',
    E002 = 'E002',
    E003 = 'E003',
    E004 = 'E004',
    E005 = 'E005',
    E006 = 'E006',
    E007 = 'E007',
    E008 = 'E008',
    E000 = 'E000',
}

const errorMessages = {
    'E001': "Unclosed block comment",
    'E002': "Invalid number: multiple dots",
    'E003': "Invalid exponent format",
    'E004': "Invalid characters after number",
    'E005': "Cyrillic letters in identifier",
    'E006': "Unclosed string literal",
    'E007': "Invalid operator/symbol '{token}'",
    'E008': "Unexpected end of float number",

    // Общая ошибка для непредвиденных случаев
    'E000': "Unrecognized token '{token}'"
}

export {
    ErrorCode,
    errorMessages
}