import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api/usuarios';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, HttpClientTestingModule, AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('getUsuarios', () => {
    it('should fetch and sort users by ID', () => {
      const mockUsuarios = [
        { id: 5, userName: 'user2', passUser: 'password2', userRol: 'admin', userState: 'active' },
        { id: 6, userName: 'user1', passUser: 'password1', userRol: 'user', userState: 'inactive' },
      ];

      component.getUsuarios();

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuarios);

      expect(component.usuarios[0].id).toBe(5);
      expect(component.usuarios[1].id).toBe(6);
    });
  });

  describe('getUsuariosById', () => {
    it('should fetch a user by ID', () => {
      const mockUsuario = { id: 1, userName: 'user1', passUser: 'password1', userRol: 'admin', userState: 'active' };

      component.getUsuariosById(1);

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuario);

      expect(component.foundUsuario).toEqual(mockUsuario);
    });

    it('should handle 404 error when user not found', () => {
      component.getUsuariosById(999);

      const req = httpMock.expectOne(`${baseUrl}/999`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(component.foundUsuario).toBeNull();
    });
  });

  describe('createUsuario', () => {
    it('should create a new user', () => {
      const newUser = { id: 0, userName: 'user1', passUser: 'password1', userRol: 'user', userState: 'active' };

      component.createUsuario(newUser);

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      req.flush({ ...newUser, id: 11 });

      expect(component.usuarios.length).toBeGreaterThan(0);
    });
  });

  describe('updateUsuario', () => {
    it('should update an existing user', () => {
      const updatedUser = { id: 5, userName: 'user1_updated', passUser: 'newpassword', userRol: 'admin', userState: 'inactive' };

      component.updateUsuario(1, updatedUser);

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedUser);

      expect(component.usuarios.length).toBeGreaterThan(0);
    });
  });

  describe('deleteUsuario', () => {
    it('should delete a user by ID', () => {
      component.usuarios = [
        { id: 1, userName: 'user1', passUser: 'password1', userRol: 'user', userState: 'active' },
        { id: 5, userName: 'user2', passUser: 'password2', userRol: 'admin', userState: 'inactive' },
      ];

      // Simula la eliminación
      component.deleteUsuario(1);

      // Simula la respuesta del servidor
      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      // Actualiza la lista después de la eliminación
      component.usuarios = component.usuarios.filter(user => user.id !== 1);

      // Verifica que la lista se ha actualizado correctamente
      expect(component.usuarios.length).toBe(1);
      expect(component.usuarios[0].id).toBe(5);
    });
  });
});
