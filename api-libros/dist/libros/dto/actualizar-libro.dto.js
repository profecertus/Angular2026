"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarLibroDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const crear_libro_dto_1 = require("./crear-libro.dto");
class ActualizarLibroDto extends (0, mapped_types_1.PartialType)(crear_libro_dto_1.CrearLibroDto) {
}
exports.ActualizarLibroDto = ActualizarLibroDto;
//# sourceMappingURL=actualizar-libro.dto.js.map