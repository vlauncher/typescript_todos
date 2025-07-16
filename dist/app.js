"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const todos_1 = __importDefault(require("./routes/todos"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const redoc_express_1 = __importDefault(require("redoc-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const swaggerDocument = yamljs_1.default.load('swagger.yaml');
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/docs', express_1.default.static(path_1.default.join(process.cwd())));
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.get('/redoc', (0, redoc_express_1.default)({
    title: 'Express Todos API Docs',
    specUrl: '/docs/swagger.yaml',
}));
app.get('/docs/swagger.yaml', (req, res) => {
    res.setHeader('Content-Type', 'application/x-yaml');
    res.sendFile(path_1.default.join(process.cwd(), 'swagger.yaml'));
});
app.get('/', (req, res) => {
    res.redirect('/redoc');
});
app.use('/api/auth', auth_1.default);
app.use('/api/todos', todos_1.default);
exports.default = app;
