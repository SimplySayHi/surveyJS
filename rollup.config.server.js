
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';

const serveProject = {
    input: 'src/index.js',
    plugins: [ json(), serve({ open: true }) ]
}

export default serveProject
