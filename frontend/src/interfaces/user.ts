export interface User {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo_electronico: string;
  fecha_registro: string; // o Date si lo manejas así
  tipo_usuario: string;
}
