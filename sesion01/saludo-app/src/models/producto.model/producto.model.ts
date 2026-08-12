export interface Producto{
  id:number;
  nombre:string;
  descripcion:string;
  precio:number;
  emoji:string;
}

export interface ItemCarrito{
  producto:Producto;
  cantidad:number;
}