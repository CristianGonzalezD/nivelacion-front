import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { Product } from '../interfaces/catalog/product.interface';

const CATALOG_URL = `${environment.apiCatalogUrl}${environment.catalog.productPath}`;

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(CATALOG_URL).pipe(
      map((response) => this.normalizeProductsResponse(response))
    );
  }

  private normalizeProductsResponse(response: Product[] | null): Product[] {
    if (!response) {
      throw new Error('Error en consumo de servicio.');
    }

    
    if (response.length === 0) {
      throw new Error('No existen productos en el sistema.');
    }

    return response;
  }
}
