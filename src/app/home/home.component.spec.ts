import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [HomeComponent],
      imports: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render Usuarios section with correct title, description, and button', () => {
    const usuariosCard = fixture.debugElement.query(By.css('.col-md-6:nth-child(1)'));
    const usuariosImg = usuariosCard.query(By.css('img')).nativeElement;
    const usuariosTitle = usuariosCard.query(By.css('h4')).nativeElement;
    const usuariosText = usuariosCard.query(By.css('p')).nativeElement;
    const usuariosButton = usuariosCard.query(By.css('a')).nativeElement;

    expect(usuariosImg.src).toContain('assets/usuario.png');
    expect(usuariosTitle.textContent).toBe('Usuarios');
    expect(usuariosText.textContent).toBe('Gestiona los usuarios del sistema');
    expect(usuariosButton.getAttribute('href')).toBe('/usuario');
    expect(usuariosButton.textContent).toBe('Ir a Usuarios');
  });

  it('should render Productos section with correct title, description, and button', () => {
    const productosCard = fixture.debugElement.query(By.css('.col-md-6:nth-child(2)'));
    const productosImg = productosCard.query(By.css('img')).nativeElement;
    const productosTitle = productosCard.query(By.css('h4')).nativeElement;
    const productosText = productosCard.query(By.css('p')).nativeElement;
    const productosButton = productosCard.query(By.css('a')).nativeElement;

    expect(productosImg.src).toContain('assets/products.png');
    expect(productosTitle.textContent).toBe('Productos');
    expect(productosText.textContent).toBe('Gestiona los productos del sistema');
    expect(productosButton.getAttribute('href')).toBe('/product');
    expect(productosButton.textContent).toBe('Ir a Productos');
  });

  it('should render three additional images below the sections', () => {
    const images = fixture.debugElement.queryAll(By.css('.row.mt-4 img'));

    expect(images.length).toBe(3);
    expect(images[0].nativeElement.src).toContain('assets/pig_iron.jpeg');
    expect(images[0].nativeElement.alt).toBe('Imagen uno');
    expect(images[1].nativeElement.src).toContain('assets/pig_thor.jpeg');
    expect(images[1].nativeElement.alt).toBe('Imagen dos');
    expect(images[2].nativeElement.src).toContain('assets/pig_hammer.jpeg');
    expect(images[2].nativeElement.alt).toBe('Imagen tres');
  });
});
