"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: ['http://localhost:4200'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const puerto = Number(process.env.PORT) || 8083;
    await app.listen(puerto);
    console.log(`\n  API de libros lista en http://localhost:${puerto}/api/libros`);
    console.log('  Persistencia: SQLite en memoria (se reinicia con el proceso)\n');
}
void bootstrap();
//# sourceMappingURL=main.js.map