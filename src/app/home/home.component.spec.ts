import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';  // Para simular la navegación de rutas

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],  // Importamos RouterTestingModule para pruebas de navegación
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the "Usuarios" card with correct details', () => {
    const usuarioCardTitle = fixture.debugElement.query(By.css('.card-title')).nativeElement;
    expect(usuarioCardTitle.textContent).toContain('Usuarios');

    const usuarioCardText = fixture.debugElement.query(By.css('.card-text')).nativeElement;
    expect(usuarioCardText.textContent).toContain('Gestiona los usuarios del sistema');

    const usuarioButton = fixture.debugElement.query(By.css('.btn-primary a[href="/usuario"]')).nativeElement;
    expect(usuarioButton.textContent.trim()).toBe('Ir a Usuarios');
  });

  it('should render the "Productos" card with correct details', () => {
    const productCardTitle = fixture.debugElement.queryAll(By.css('.card-title'))[1].nativeElement;
    expect(productCardTitle.textContent).toContain('Productos');

    const productCardText = fixture.debugElement.queryAll(By.css('.card-text'))[1].nativeElement;
    expect(productCardText.textContent).toContain('Gestiona los productos del sistema');

    const productButton = fixture.debugElement.query(By.css('.btn-primary a[href="/product"]')).nativeElement;
    expect(productButton.textContent.trim()).toBe('Ir a Productos');
  });

  // Prueba para la navegación: verificar si se redirige a /usuario
  it('should navigate to the Usuario page when the "Usuarios" button is clicked', async () => {
    const usuarioButton = fixture.debugElement.query(By.css('.btn-primary a[href="/usuario"]')).nativeElement;
    usuarioButton.click();
    
    fixture.whenStable().then(() => {
      expect(window.location.pathname).toBe('/usuario');  // Requiere que simules la navegación
    });
  });

  // Prueba para la navegación: verificar si se redirige a /product
  it('should navigate to the Product page when the "Productos" button is clicked', async () => {
    const productButton = fixture.debugElement.query(By.css('.btn-primary a[href="/product"]')).nativeElement;
    productButton.click();
    
    fixture.whenStable().then(() => {
      expect(window.location.pathname).toBe('/product');  // Requiere que simules la navegación
    });
  });
});
