
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import myPackage from './package.json';

const initialComment = `/* ${myPackage.title} Lite v${myPackage.version} | ${myPackage.author.name} (@${myPackage.customData.repository.accountName}) | ${myPackage.homepage} | ${myPackage.customData.repository.homepage} | ${myPackage.license} license */`;

const libraryFileName = myPackage.customData.libraryFileName;
const libraryNamespace = myPackage.customData.libraryNamespace;

const

optionsESM = {
    input: 'src/index-lite.js',
    output: [

        // ES MODULE
        {
            file: `dist/lite/${libraryFileName}-esm.js`,
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
            file: `dist/lite/${libraryFileName}-esm.min.js`,
            format: 'es',
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

    ]
},

optionsSYS = {
    input: 'src/index-lite.js',
    output: [

        // SYSTEMJS TRANSPILED SCRIPT
        {
            file: `dist/lite/${libraryFileName}-systemjs.js`,
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
            file: `dist/lite/${libraryFileName}-systemjs.min.js`,
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
    plugins: [ resolve(), babel({babelHelpers: 'bundled'}) ]
},

optionsUMD = {
    input: 'src/index-lite.js',
    output: [

        // UMD TRANSPILED SCRIPT
        {
            file: `dist/lite/${libraryFileName}.js`,
            format: 'umd',
            name: libraryNamespace,
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

        // UMD TRANSPILED SCRIPT MINIFIED
        {
            file: `dist/lite/${libraryFileName}.min.js`,
            format: 'umd',
            name: libraryNamespace,
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
    plugins: [ resolve(), babel({babelHelpers: 'bundled'}) ]
}

;

export default [ optionsESM, optionsSYS, optionsUMD ]
