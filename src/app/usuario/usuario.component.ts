import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit{
  title = 'tienda-app';
  usuarios: {id: number,userName: string, passUser: string, userRol: string, userState: string}[]=[];

  //Variables para los Formularios

  newUsuarioName:string="";
  newPassUser: string="";
  newUserRol: string="";
  newUserState: string="";
  updateId: number | null = null;
  updateName: string = "";
  updatePass: string = "";
  updateRol: string = "";
  updateState: string = "";
  deleteId: number | null = null;
  searchId: number | null = null;
  foundUsuario:{id:number, userName: string,passUser: string, userRol: string, userState: string} | null = null;

  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http:HttpClient){}
  ngOnInit():void{
    this.getUsuarios();
  }

  //Función para obtener los usuarios ordenadamente
  sortUsuarios():void{
    this.usuarios.sort((a,b) => a.id - b.id);
  }

  //Función para obtener las usuarios
  getUsuarios():void{
    this.http.get<{id: number,userName: string, passUser: string, userRol: string, userState: string}[] > (this.apiUrl).subscribe({
        next:(data)=>{
          this.usuarios=data;
          this.sortUsuarios();
        }
      }
    )
  }

  //función para obtener un usuario por id
  getUsuariosById(id:number):void{
    if(id!== null && !isNaN(id)){
      this.http.get<{id:number,userName:string,passUser: string, userRol: string, userState: string}>(`${this.apiUrl}/${id}`).subscribe({
        next:(data)=>{
          console.log('Usuario Obtenido',data);
          this.foundUsuario = data;
          //this.resetFields(); // Limpiar los campos
        },
        error:(err) =>{
          console.error('Error al obtener el Usuario por id:',err);
          this.foundUsuario = null;
        }
      });
    }else{
      console.error('Id incorrecto:');
      this.foundUsuario = null;
    }
  }
  //Crea Usuario
  createUsuario(newUsuario:{id:number,userName:string,passUser: string, userRol: string, userState: string}):void{
    if(newUsuario && newUsuario.userName){
      this.http.post<{id:number,userName:string,passUser: string, userRol: string, userState: string}>(this.apiUrl,newUsuario).subscribe({
        next:(data)=>{
          console.log('Usuario Creado',data);
          this.getUsuarios();
          this.resetFields(); // Limpiar los campos
        },
        error:(err) =>{
          console.error('Error al crear Usuario:',err);
        }
      });
    }else{
      console.error('Datos del Usuario no correctos:');
    }
  }
  //Actualizar
  updateUsuario(id:number,updateUsuario:{id:number,userName:string,passUser:string,userRol:string,userState:string}):void{
    if(id!== null && !isNaN(id) && updateUsuario){
      this.http.put<{id:number,userName:string}>(`${this.apiUrl}/${id}`,updateUsuario).subscribe({
        next:(data)=>{
          console.log('Usuario Actualizado',data);
          this.getUsuarios();
          this.resetFields(); // Limpiar los campos
        },
        error:(err) =>{
          console.error('Error al actualizar Usuario:',err);
        }
      });
    }else{
      console.error('Datos del Usuario no correctos:');
    }
  }
  //eliminar
  deleteUsuario(id:number):void{
    if(id!== null && !isNaN(id)){
      this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
        next:()=>{
          console.log('Usuario Eliminado');
          this.getUsuarios();
          this.resetFields(); // Limpiar los campos
        },
        error:(err) =>{
          console.error('Error al eliminar al Usuario:',err);
        }
      });
    }else{
      console.error('id incorrecto para eliminación:');
    }
  }

  //Resetea los camos

  resetFields() {
    // Restablecer todos los campos del formulario a sus valores iniciales
    this.newUsuarioName = '';
    this.newPassUser = '';
    this.newUserRol = '';
    this.newUserState = '';
  
    this.updateId = null;
    this.updateName = '';
    this.updatePass = '';
    this.updateRol = '';
    this.updateState = '';
  
    this.deleteId = null;
    this.searchId = null;
    this.foundUsuario = null;
  }



}
