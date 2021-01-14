
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import myPackage from './package.json';

const initialComment = `/* ${myPackage.title} v${myPackage.version} | ${myPackage.author.name} (@${myPackage.customData.repository.accountName}) | ${myPackage.homepage} | ${myPackage.customData.repository.homepage} | ${myPackage.license} license */`;

const libraryFileName = myPackage.customData.libraryFileName;
const libraryNamespace = myPackage.customData.libraryNamespace;

const

optionsESM = {
    input: 'src/index.js',
    external: ['formjs-plugin'],
    output: [

        // ES MODULE
        {
            file: `dist/${libraryFileName}-esm.js`,
            assetFileNames: '/dist/[name].[ext]',
            format: 'es',
            sourcemap: false,
            plugins: [
                terser({
                    mangle: false,
                    output: {
                        beautify: true,
                        preamble: initialComment
                    }
                })
            ]
        },

        // ES MODULE MINIFIED
        {
            file: `dist/${libraryFileName}-esm.min.js`,
            format: 'es',
            sourcemap: true,
            plugins: [
                terser({
                    output: {
                        beautify: false,
                        preamble: initialComment
                    }
                })
            ],
        }

    ]
},

optionsSYS = {
    input: 'src/index.js',
    external: ['formjs-plugin'],
    output: [

        // SYSTEMJS TRANSPILED SCRIPT
        {
            file: `dist/${libraryFileName}-systemjs.js`,
            format: 'system',
            sourcemap: false,
            plugins: [
                terser({
                    mangle: false,
                    output: {
                        beautify: true,
                        preamble: initialComment
                    }
                })
            ]
        },

        // SYSTEMJS TRANSPILED SCRIPT MINIFIED
        {
            file: `dist/${libraryFileName}-systemjs.min.js`,
            format: 'system',
            sourcemap: true,
            plugins: [
                terser({
                    output: {
                        beautify: false,
                        preamble: initialComment
                    }
                })
            ]
        }

    ],
    plugins: [ nodeResolve(), babel({babelHelpers: 'bundled'}) ]
},

optionsUMD = {
    input: 'src/index.js',
    external: ['formjs-plugin'],
    output: [

        // UMD TRANSPILED SCRIPT
        {
            file: `dist/${libraryFileName}.js`,
            format: 'umd',
            name: libraryNamespace,
            sourcemap: false,
            globals: {
                'formjs-plugin': 'Form'
            },
            plugins: [
                terser({
                    mangle: false,
                    output: {
                        beautify: true,
                        preamble: initialComment
                    }
                })
            ]
        },

        // UMD TRANSPILED SCRIPT MINIFIED
        {
            file: `dist/${libraryFileName}.min.js`,
            format: 'umd',
            name: libraryNamespace,
            sourcemap: true,
            globals: {
                'formjs-plugin': 'Form'
            },
            plugins: [
                terser({
                    output: {
                        beautify: false,
                        preamble: initialComment
                    }
                })
            ]
        }

    ],
    plugins: [ nodeResolve(), babel({babelHelpers: 'bundled'}) ]
}

;

export default [ optionsESM, optionsSYS, optionsUMD ]
