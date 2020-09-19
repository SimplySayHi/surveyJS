
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import myPackage from './package.json';
import path from 'path';

const initialComment = `/* ${myPackage.title} v${myPackage.version} | ${myPackage.author.name} (@${myPackage.customData.repository.accountName}) | ${myPackage.homepage} | ${myPackage.customData.repository.homepage} | ${myPackage.license} license */`;

const libraryFileName = myPackage.customData.libraryFileName;
const libraryNamespace = myPackage.customData.libraryNamespace;

const postCssOptions = {
    extract: path.resolve('dist/survey.css')
};

const

optionsESM = {
    input: 'src/index.js',
    external: ['formjs-plugin'],
    plugins: [postcss(postCssOptions)],
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

optionsIIFE = {
    input: 'src/index.js',
    external: ['formjs-plugin'],
    output: [

        // IIFE TRANSPILED SCRIPT
        {
            file: `dist/${libraryFileName}.js`,
            format: 'iife',
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

        // IIFE TRANSPILED SCRIPT MINIFIED
        {
            file: `dist/${libraryFileName}.min.js`,
            format: 'iife',
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
    plugins: [ nodeResolve(), babel({babelHelpers: 'bundled'}), postcss(postCssOptions) ]
}

;

export default [ optionsESM, optionsIIFE ]
