import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const common_site_config_path = path.resolve(__dirname, '../../../sites/common_site_config.json');
let webserver_port = 8000;

try {
    if (fs.existsSync(common_site_config_path)) {
        const common_site_config = JSON.parse(fs.readFileSync(common_site_config_path, 'utf-8'));
        webserver_port = common_site_config.webserver_port || 8000;
    }
} catch (e) {
    console.warn("Could not read common_site_config.json, defaulting to port 8000");
}

export default {
    '^/(app|api|assets|files|private)': {
        target: `http://127.0.0.1:${webserver_port}`,
        ws: true,
        changeOrigin: true,
    },
};
