import path from 'path'
import fs from 'fs'
import {Analyzer} from './analyzer'

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

        const analyzer = new Analyzer('hello world 123')

        // fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2), 'utf8');
        // console.log(`Tokens written to ${outputPath}`);

        const formattedTokens = analyzer.process()
        fs.writeFileSync(outputFile, formattedTokens, 'utf8')
        console.log(`Formatted tokens written to ${outputFile}`)
    } catch (error) {
        console.error('Error:', error.message)
        process.exit(1)
    }
}

if (require.main === module) {
    main()
}
