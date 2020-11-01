
import serve from 'rollup-plugin-serve';

const serveProject = {
    input: 'src/index.js',
    plugins: [ serve({ open: true }) ]
}

export default serveProject
