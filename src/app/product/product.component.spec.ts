import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from './product.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // Importar HttpClientTestingModule y HttpTestingController
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let httpMock: HttpTestingController;  // Inyectar HttpTestingController
  let httpClient: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, ProductComponent],  // Asegúrate de que ProductComponent esté solo en imports
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);  // Obtener el HttpTestingController
    httpClient = TestBed.inject(HttpClient);  // Obtener el HttpClient
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Verifica que el formulario de creación de productos funciona al hacer clic en el botón
  it('should call createProducto on button click', async () => {
    spyOn(component, 'createProducto');

    component.newNameProduct = 'Producto 1';
    component.newPrecio = 100;
    fixture.detectChanges();

    const createButton = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;
    createButton.click();

    await fixture.whenStable();  // Espera a que se resuelvan las operaciones asincrónicas

    expect(component.createProducto).toHaveBeenCalledWith({
      idProd: 0,
      nomProducto: 'Producto 1',
      precioCompra: 100,
    });
  });

  // Verifica que los detalles del producto encontrado se muestran correctamente
  it('should display the found product details correctly', () => {
    component.foudProduct = {
      idProd: 1,
      nomProducto: 'Producto 1',
      precioCompra: 100,
    };
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css('.alert-success')).nativeElement;
    expect(alert.textContent).toContain('Producto Encontrado');
    expect(alert.textContent).toContain('ID: 1');
    expect(alert.textContent).toContain('Nombre: Producto 1');
    expect(alert.textContent).toContain('Precio: 100');
  });

  // Verifica que se muestra el mensaje de error cuando no se encuentra un producto
  it('should display error message when no product is found', () => {
    component.foudProduct = null;
    component.searchID = 99;
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css('.alert-danger')).nativeElement;
    expect(alert.textContent).toContain('No se encontró ningún Producto con ese ID.');
  });

  // Verifica que la tabla de productos se renderiza correctamente
  it('should render product table correctly', () => {
    component.productos = [
      { idProd: 1, nomProducto: 'Producto 1', precioCompra: 100 },
      { idProd: 2, nomProducto: 'Producto 2', precioCompra: 200 },
    ];
    fixture.detectChanges();

    const tableRows = fixture.debugElement.queryAll(By.css('table tbody tr'));
    expect(tableRows.length).toBe(2);

    const firstRowCells = tableRows[0].queryAll(By.css('td'));
    expect(firstRowCells[0].nativeElement.textContent).toBe('1');
    expect(firstRowCells[1].nativeElement.textContent).toBe('Producto 1');
    expect(firstRowCells[2].nativeElement.textContent).toBe('100');
  });

  // Verifica que el botón de "Volver" tenga el enlace correcto
  it('should render back button with correct link', () => {
    const backButton = fixture.debugElement.query(By.css('.btn-secondary a')).nativeElement;
    expect(backButton.getAttribute('href')).toBe('/home');
    expect(backButton.textContent.trim()).toBe('Volver');
  });

  // Pruebas de interacción con el API

  it('should get products and sort them', () => {
    const mockProducts = [
      { idProd: 2, nomProducto: 'Producto 2', precioCompra: 200 },
      { idProd: 1, nomProducto: 'Producto 1', precioCompra: 100 },
    ];

    spyOn(component, 'sortProducts');  // Espiar la función sortProducts

    component.getProducts();  // Llamar la función getProducts

    const req = httpMock.expectOne('http://localhost:8080/api/productos');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);  // Simular la respuesta con los productos mockeados

    expect(component.productos.length).toBe(2);  // Verificar que se han cargado los productos
    expect(component.sortProducts).toHaveBeenCalled();  // Verificar si sortProducts fue llamada
  });

  it('should get product by id', () => {
    const mockProduct = { idProd: 1, nomProducto: 'Producto 1', precioCompra: 100 };
    const id = 1;

    component.getProductoById(id);

    const req = httpMock.expectOne(`http://localhost:8080/api/productos/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);

    expect(component.foudProduct).toEqual(mockProduct);  // Verificar que el producto se asigna correctamente
  });

  it('should handle error when getting product by id', () => {
    const id = 999;  // ID no válido

    component.getProductoById(id);

    const req = httpMock.expectOne(`http://localhost:8080/api/productos/${id}`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Not Found'));  // Simular un error

    expect(component.foudProduct).toBeNull();  // Verificar que foudProduct es null al haber error
  });

  it('should create a new product', () => {
    const newProduct = { idProd: 1, nomProducto: 'Producto 1', precioCompra: 100 };

    component.createProducto(newProduct);

    const req = httpMock.expectOne('http://localhost:8080/api/productos');
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);  // Simular respuesta exitosa con el producto creado

    expect(component.productos.length).toBeGreaterThan(0);  // Verificar que los productos se actualizaron
    expect(component.productos[0]).toEqual(newProduct);  // Verificar que el producto fue añadido
  });

  it('should update a product', () => {
    const updatedProduct = { idProd: 1, nomProducto: 'Producto Actualizado', precioCompra: 150 };
    const id = 1;

    component.updateProducto(id, updatedProduct);

    const req = httpMock.expectOne(`http://localhost:8080/api/productos/${id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);  // Simular respuesta exitosa con el producto actualizado

    expect(component.productos.length).toBeGreaterThan(0);  // Verificar que los productos se actualizaron
  });

  it('should delete a product', () => {
    const id = 1;

    component.deleteProducto(id);

    const req = httpMock.expectOne(`http://localhost:8080/api/productos/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);  // Simular respuesta exitosa de eliminación

    expect(component.productos.length).toBe(0);  // Verificar que los productos se actualizaron
  });

  it('should clear all fields', () => {
    component.newNameProduct = 'Producto 1';
    component.newPrecio = 100;
    component.updateId = 1;
    component.updateName = 'Producto Actualizado';
    component.updatePrecio = 150;
    component.deleteId = 1;
    component.searchID = 1;
    component.foudProduct = { idProd: 1, nomProducto: 'Producto 1', precioCompra: 100 };

    component.clearFields();

    expect(component.newNameProduct).toBe('');
    expect(component.newPrecio).toBe(0);
    expect(component.updateId).toBeNull();
    expect(component.updateName).toBe('');
    expect(component.updatePrecio).toBe(0);
    expect(component.deleteId).toBeNull();
    expect(component.searchID).toBeNull();
    expect(component.foudProduct).toBeNull();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
