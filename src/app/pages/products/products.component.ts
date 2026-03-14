import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe} from '@angular/common';
import { Product } from '../../interfaces/catalog/product.interface';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit{

  private readonly catalogService = inject(CatalogService);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.catalogService.getProducts().subscribe({
      next: (products) => {
        console.log('Productos recibidos:', products);
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(this.resolveErrorMessage(error));
        console.error(error);
      }
    });
  }

  private resolveErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null) {
      const maybeError = error as { status?: number };

      if (maybeError.status === 0) {
        return 'No fue posible conectar con el servicio de catalogo.';
      }

      if (maybeError.status === 401 || maybeError.status === 403) {
        return 'La sesion no tiene permisos para consultar el catalogo.';
      }
    }

    return 'No fue posible cargar los productos.';
  }
}
