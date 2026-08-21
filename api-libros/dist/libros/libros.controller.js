"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibrosController = void 0;
const common_1 = require("@nestjs/common");
const libros_service_1 = require("./libros.service");
const crear_libro_dto_1 = require("./dto/crear-libro.dto");
const actualizar_libro_dto_1 = require("./dto/actualizar-libro.dto");
let LibrosController = class LibrosController {
    srv;
    constructor(srv) {
        this.srv = srv;
    }
    listar(titulo, page, size) {
        if (page !== undefined) {
            return this.srv.listarPaginado(Math.max(0, Number(page) || 0), Math.max(1, Number(size) || 5), titulo);
        }
        return this.srv.listar(titulo);
    }
    obtener(id) {
        return this.srv.obtener(id);
    }
    crear(dto) {
        return this.srv.crear(dto);
    }
    reemplazar(id, dto) {
        return this.srv.reemplazar(id, dto);
    }
    actualizarParcial(id, dto) {
        return this.srv.actualizarParcial(id, dto);
    }
    borrar(id) {
        return this.srv.borrar(id);
    }
};
exports.LibrosController = LibrosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('titulo')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size', new common_1.DefaultValuePipe('5'))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "obtener", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_libro_dto_1.CrearLibroDto]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "crear", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, actualizar_libro_dto_1.ActualizarLibroDto]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "reemplazar", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, actualizar_libro_dto_1.ActualizarLibroDto]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "actualizarParcial", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "borrar", null);
exports.LibrosController = LibrosController = __decorate([
    (0, common_1.Controller)('libros'),
    __metadata("design:paramtypes", [libros_service_1.LibrosService])
], LibrosController);
//# sourceMappingURL=libros.controller.js.map