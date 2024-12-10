import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:8080/api/usuarios';
  const mockUsuarios = [
    { id: 1, userName: 'user1', passUser: 'password1', userRol: 'admin', userState: 'active' },
    { id: 2, userName: 'user2', passUser: 'password2', userRol: 'user', userState: 'inactive' }
  ];

  const mockUsuario = { id: 1, userName: 'user1', passUser: 'password1', userRol: 'admin', userState: 'active' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService],
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsuarios', () => {
    it('should fetch all users', () => {
      service.getUsuarios().subscribe((usuarios) => {
        expect(usuarios.length).toBe(2);
        expect(usuarios).toEqual(mockUsuarios);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuarios);
    });
  });

  describe('getUsuarioById', () => {
    it('should fetch a user by ID', () => {
      service.getUsuarioById(1).subscribe((usuario) => {
        expect(usuario).toEqual(mockUsuario);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuario);
    });

    it('should return an error if the user is not found', () => {
      service.getUsuarioById(7).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/7`);
      expect(req.request.method).toBe('GET');
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createUsuario', () => {
    const newUser = { id: 0, userName: 'newUser', passUser: 'newPassword', userRol: 'user', userState: 'active' };

    it('should create a new user', () => {
      const expectedUsuario = { ...newUser, id: 11 };

      service.createUsuario(newUser).subscribe((usuario) => {
        expect(usuario.id).toBe(expectedUsuario.id);
        expect(usuario.userName).toBe(expectedUsuario.userName);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(expectedUsuario);
    });

    it('should handle error when creating a user', () => {
      service.createUsuario(newUser).subscribe({
        next: () => fail('Expected request to fail with a 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        },
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      req.flush('Error al crear usuario', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('deleteUsuario', () => {
    it('should delete a user', () => {
      service.deleteUsuario(5).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${baseUrl}/5`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deleting a user', () => {
      service.deleteUsuario(999).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/999`);
      expect(req.request.method).toBe('DELETE');
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes HTTP pendientes después de todas las pruebas
  });
});
