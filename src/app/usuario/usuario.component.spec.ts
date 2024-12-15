import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { UsuarioComponent } from './usuario.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Importar HttpClientTestingModule

describe('UsuarioComponent', () => {
  let component: UsuarioComponent;
  let fixture: ComponentFixture<UsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, UsuarioComponent, HttpClientTestingModule], // Para soportar [(ngModel)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Crear Usuario', () => {
    it('debería llamar a createUsuario con los datos correctos', () => {
      spyOn(component, 'createUsuario');
      component.newUsuarioName = 'PruebaUsuario';
      component.newPassUser = '12345';
      component.newUserRol = 'Admin';
      component.newUserState = 'Activo';

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(component.createUsuario).toHaveBeenCalledWith({
        id: 0,
        userName: 'PruebaUsuario',
        passUser: '12345',
        userRol: 'Admin',
        userState: 'Activo',
      });
    });
  });

  describe('Actualizar Usuario', () => {
    it('debería llamar a updateUsuario con los datos correctos', () => {
      spyOn(component, 'updateUsuario');
      component.updateId = 1;
      component.updateName = 'UsuarioActualizado';
      component.updatePass = '54321';
      component.updateRol = 'User';
      component.updateState = 'Inactivo';

      const updateButton = fixture.nativeElement.querySelector('button.btn-warning');
      updateButton.click();

      expect(component.updateUsuario).toHaveBeenCalledWith(1, {
        id: 1,
        userName: 'UsuarioActualizado',
        passUser: '54321',
        userRol: 'User',
        userState: 'Inactivo',
      });
    });
  });

  describe('Eliminar Usuario', () => {
    it('debería llamar a deleteUsuario con el ID correcto', () => {
      spyOn(component, 'deleteUsuario');
      component.deleteId = 2;

      const deleteButton = fixture.nativeElement.querySelector('button.btn-danger');
      deleteButton.click();

      expect(component.deleteUsuario).toHaveBeenCalledWith(2);
    });
  });

  describe('Obtener Usuario por ID', () => {
    it('debería llamar a getUsuariosById con el ID correcto', () => {
      spyOn(component, 'getUsuariosById');
      component.searchId = 3;
      
      const searchButton = fixture.nativeElement.querySelector('button.btn-info');
      searchButton.click();

      fixture.whenStable().then(() => {  // Espera a que se resuelvan las operaciones asincrónicas
        expect(component.getUsuariosById).toHaveBeenCalledWith(3);
      });
    });

    it('debería mostrar los detalles del usuario encontrado', () => {
      component.foundUsuario = {
        id: 3,
        userName: 'UsuarioEncontrado',
        passUser: '12345',
        userRol: 'Admin',
        userState: 'Activo',
      };
      fixture.detectChanges();

      const userDetails = fixture.nativeElement.querySelector('.alert-success');
      expect(userDetails.textContent).toContain('UsuarioEncontrado');
    });
  });

  describe('Lista de Usuarios', () => {
    it('debería renderizar la lista de usuarios correctamente', () => {
      component.usuarios = [
        { id: 1, userName: 'User1', passUser: 'pass1', userRol: 'Admin', userState: 'Activo' },
        { id: 2, userName: 'User2', passUser: 'pass2', userRol: 'User', userState: 'Inactivo' },
      ];
      fixture.detectChanges();

      const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(tableRows.length).toBe(2);
      expect(tableRows[0].textContent).toContain('User1');
      expect(tableRows[1].textContent).toContain('User2');
    });
  });
});
