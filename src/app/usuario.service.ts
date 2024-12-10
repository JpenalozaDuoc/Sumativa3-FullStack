import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, Observable } from 'rxjs';


interface Usuario{
  id: number;
  userName: string;
  passUser: string;
  userRol: string;
  userState: string;
}
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = "http://localhost:8080/api/usuarios"
  constructor( private http: HttpClient) { }
  
  getUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuarioById(id:number):Observable<Usuario>{
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Usuario>(url);
  }

  /*
  createUsuario(usuario: Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(this.apiUrl, usuario);

  }
  */

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario).pipe(
      catchError((error) => {
        console.error('Error al crear usuario:', error);
        throw error;  // Esto lanzará el error para que pueda ser manejado en el componente.
      })
    );
  }


  deleteUsuario(id:number):Observable<void>{
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
