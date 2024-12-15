import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from './product.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Importar HttpClientTestingModule

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, ProductComponent],  // Asegúrate de que ProductComponent esté solo en imports
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render header with correct title and logo', () => {
    const headerTitle = fixture.debugElement.query(By.css('header h1')).nativeElement;
    expect(headerTitle.textContent).toContain('Gestor de Productos en Angular');

    const headerLogo = fixture.debugElement.query(By.css('header img')).nativeElement;
    expect(headerLogo.src).toContain('assets/iconoproductos.png');
  });

  it('should bind inputs correctly for creating a product', () => {
    const nameInput = fixture.debugElement.query(By.css('input[placeholder="Nombre del Producto"]')).nativeElement;
    const priceInput = fixture.debugElement.query(By.css('input[placeholder="Precio"]')).nativeElement;

    nameInput.value = 'Producto 1';
    nameInput.dispatchEvent(new Event('input'));

    priceInput.value = 100;  // El valor sigue siendo una cadena
    priceInput.dispatchEvent(new Event('input'));

    // Convertir el valor del precio a número para la comparación
    expect(component.newNameProduct).toBe('Producto 1');
    expect(component.newPrecio).toBe(100);  // El valor esperado es un número
  });

  it('should call createProducto on button click', async () => {  // Usar async/await si hay operaciones asíncronas
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

  it('should display error message when no product is found', () => {
    component.foudProduct = null;
    component.searchID = 99;
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css('.alert-danger')).nativeElement;
    expect(alert.textContent).toContain('No se encontró ningún Producto con ese ID.');
  });

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

  it('should render back button with correct link', () => {
    const backButton = fixture.debugElement.query(By.css('.btn-secondary a')).nativeElement;
    expect(backButton.getAttribute('href')).toBe('/home');
    expect(backButton.textContent.trim()).toBe('Volver');
  });


});
