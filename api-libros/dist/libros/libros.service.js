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
exports.LibrosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const libro_entity_1 = require("./libro.entity");
let LibrosService = class LibrosService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async onModuleInit() {
        if ((await this.repo.count()) > 0)
            return;
        await this.repo.save([
            {
                titulo: 'Clean Code',
                autor: 'Robert C. Martin',
                descripcion: 'Guía de artesanía de software y código legible.',
                disponible: true,
                precio: 129.9,
            },
            {
                titulo: 'El Programador Pragmático',
                autor: 'Hunt & Thomas',
                descripcion: 'Clásico sobre oficio, herramientas y pragmatismo.',
                disponible: true,
                precio: 149.0,
            },
            {
                titulo: 'Refactoring',
                autor: 'Martin Fowler',
                descripcion: 'Cómo mejorar el diseño del código existente.',
                disponible: false,
                precio: 189.5,
            },
            {
                titulo: 'Domain-Driven Design',
                autor: 'Eric Evans',
                descripcion: 'Modelar software alrededor del dominio del negocio.',
                disponible: true,
                precio: 210.0,
            },
            {
                titulo: 'Angular en Profundidad',
                autor: 'New Horizons',
                descripcion: 'Material del curso de Desarrollo Web con Angular.',
                disponible: true,
                precio: 99.0,
            },
        ]);
    }
    async listar(titulo) {
        if (titulo?.trim()) {
            return this.repo.find({
                where: { titulo: (0, typeorm_2.Like)(`%${titulo.trim()}%`) },
                order: { id: 'ASC' },
            });
        }
        return this.repo.find({ order: { id: 'ASC' } });
    }
    async listarPaginado(page, size, titulo) {
        const where = titulo?.trim()
            ? { titulo: (0, typeorm_2.Like)(`%${titulo.trim()}%`) }
            : {};
        const [content, total] = await this.repo.findAndCount({
            where,
            order: { id: 'ASC' },
            skip: page * size,
            take: size,
        });
        return { content, total, page, size };
    }
    async obtener(id) {
        const libro = await this.repo.findOneBy({ id });
        if (!libro) {
            throw new common_1.NotFoundException(`No existe el libro con id ${id}`);
        }
        return libro;
    }
    crear(dto) {
        const libro = this.repo.create({
            titulo: dto.titulo,
            autor: dto.autor ?? null,
            descripcion: dto.descripcion ?? null,
            disponible: dto.disponible ?? true,
            precio: dto.precio ?? 0,
        });
        return this.repo.save(libro);
    }
    async reemplazar(id, dto) {
        await this.obtener(id);
        await this.repo.save({
            id,
            titulo: dto.titulo ?? '',
            autor: dto.autor ?? null,
            descripcion: dto.descripcion ?? null,
            disponible: dto.disponible ?? true,
            precio: dto.precio ?? 0,
        });
        return this.obtener(id);
    }
    async actualizarParcial(id, dto) {
        const libro = await this.obtener(id);
        Object.assign(libro, dto);
        return this.repo.save(libro);
    }
    async borrar(id) {
        const resultado = await this.repo.delete({ id });
        if (!resultado.affected) {
            throw new common_1.NotFoundException(`No existe el libro con id ${id}`);
        }
    }
};
exports.LibrosService = LibrosService;
exports.LibrosService = LibrosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(libro_entity_1.Libro)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LibrosService);
//# sourceMappingURL=libros.service.js.map