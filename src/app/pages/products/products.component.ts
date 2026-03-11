import { Component } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';

interface Product {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  estado: 'Activo' | 'Bajo stock' | 'Agotado';
}

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  protected readonly products: Product[] = [
    { id: 101, nombre: 'Mouse Inalambrico', categoria: 'Accesorios', precio: 85000, stock: 24, estado: 'Activo' },
    { id: 102, nombre: 'Teclado Mecanico', categoria: 'Perifericos', precio: 185000, stock: 9, estado: 'Bajo stock' },
    { id: 103, nombre: 'Monitor 24 pulgadas', categoria: 'Pantallas', precio: 690000, stock: 6, estado: 'Bajo stock' },
    { id: 104, nombre: 'Base Refrigerante', categoria: 'Accesorios', precio: 120000, stock: 15, estado: 'Activo' },
    { id: 105, nombre: 'Diadema USB', categoria: 'Audio', precio: 98000, stock: 0, estado: 'Agotado' }
  ];
}
