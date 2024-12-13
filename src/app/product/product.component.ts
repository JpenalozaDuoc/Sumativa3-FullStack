import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  
  title="tienda-app";
  productos: {idProd:number, nomProducto:string, precioCompra:number}[]=[];
  
  //Variables para los Formularios

  newNameProduct:string="";
  newPrecio:number=0;
  updateId:number | null = null;
  updateName: string="";
  updatePrecio:number=0;
  deleteId:number | null = null;
  searchID:number | null = null;
  foudProduct: {idProd: number, nomProducto: string, precioCompra: number} | null = null;

  private apiUrl = 'http://localhost:8080/api/productos';
  constructor(private http:HttpClient){}
  ngOnInit(): void {
    this.getProducts();
  }
  //Función para obtener los productos ordenadamente
  sortProducts():void{
    this.productos.sort((a,b) => a.idProd - b.idProd);
  }
 //Función para obtener los productos
  getProducts():void {
    this.http.get<{idProd:number, nomProducto: string, precioCompra:number}[] > (this.apiUrl).subscribe({
        next:(data)=>{
          this.productos=data;
          this.sortProducts();

        }
      }
    )
  }

  //Funcion pata obtener un producto por id
  getProductoById(idProd:number):void{
    if(idProd!== null && !isNaN(idProd)){
      this.http.get<{idProd:number, nomProducto: string, precioCompra:number}>(`${this.apiUrl}/${idProd}`).subscribe({
        next:(data)=>{
          this.foudProduct = data;
          //this.clearFields(); // Limpiar los campos después de eliminar el producto
        },
        error:(err) =>{
          console.error('Error al obtener el Producto por id:',err);
          this.foudProduct = null;
        }
      });
    }else{
      console.error('Id incorrecto:');
      this.foudProduct = null;
    }
  }

  //Crea Producto
  createProducto(newProduct:{idProd:number,nomProducto:string, precioCompra: number}):void{
    if(newProduct && newProduct.nomProducto){
      this.http.post<{idProd:number,nomProducto:string, precioCompra: number}>(this.apiUrl,newProduct).subscribe({
        next:(data)=>{
          this.getProducts();
          this.clearFields(); // Limpiar los campos después de eliminar el producto
        },
        error:(err) =>{
          console.error('Error al crear Producto:',err);
        }
      });
    }else{
      console.error('Datos del Producto Incorrectos:');
    }
  }

  //Actualizar
  updateProducto(idProd:number,updateProducto:{idProd:number,nomProducto:string,precioCompra:number}):void{
    if(idProd!== null && !isNaN(idProd) && updateProducto){
      this.http.put<{idProd:number,nomProducto:string}>(`${this.apiUrl}/${idProd}`,updateProducto).subscribe({
        next:(data)=>{
          this.getProducts();
          this.clearFields(); // Limpiar los campos después de eliminar el producto
        },
        error:(err) =>{
        }
      });
    }else{
      console.error('Datos del Producto no correctos:');
    }
  }
  //eliminar
  deleteProducto(idProd:number):void{
    if(idProd!== null && !isNaN(idProd)){
      this.http.delete<void>(`${this.apiUrl}/${idProd}`).subscribe({
        next:()=>{
          this.getProducts();
          this.clearFields(); // Limpiar los campos después de eliminar el producto
        },
        error:(err) =>{
        }
      });
    }else{
      console.error('id incorrecto para eliminación:');
    }
  }

  // Función para limpiar los campos después de cada acción
  clearFields(): void {
    this.newNameProduct = '';
    this.newPrecio = 0;
    this.updateId = null;
    this.updateName = '';
    this.updatePrecio = 0;
    this.deleteId = null;
    this.searchID = null;
    this.foudProduct = null;
  }


  
}
