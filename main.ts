// main.ts
import path from 'path'
import fs from 'fs'
import {SyntaxAnalyzer} from './analyzer'
import {Lexer} from './lexer/lexer'

function main() {
    const args = process.argv.slice(2)

    if (args.length < 2) {
        console.error('Usage: npm run lab6 <input_file> <output_file>')
        process.exit(1)
    }

    const inputFile = args[0]
    const outputFile = args[1]

    try {
        const inputPath = path.resolve(inputFile)
        const outputPath = path.resolve(outputFile)

        const inputText = fs.readFileSync(inputPath, 'utf8')

        const lexer = new Lexer(inputText)
        const tokens = lexer.tokenize()

        const analyzer = new SyntaxAnalyzer()

        const result = analyzer.parse(tokens)
        if (result) {
            console.log('Успех!')
        }
        else {
            console.log(analyzer.getErrors())
        }
    } catch (error: any) {
        console.error('Error:', error.message)
        process.exit(1)
    }
}

if (require.main === module) {
    main()
}
