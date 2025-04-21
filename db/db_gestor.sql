-- Eliminar la base de datos si existe
DROP DATABASE IF EXISTS gestor_claves_2;

-- Crear la base de datos
CREATE DATABASE gestor_claves_2;

-- Usar la base de datos
USE gestor_claves_2;

-- 1. Tabla de roles
CREATE TABLE roles (
  id_rol bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre_rol varchar(500) NOT NULL
);

-- Insertar roles de ejemplo
INSERT INTO roles (nombre_rol) VALUES 
('Administrador'),
('Usuario');

-- 2. Tabla de usuarios (con id_familia nullable)
CREATE TABLE usuarios (
  id_usuario bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre varchar(500) NOT NULL,
  email varchar(500) NOT NULL,
  clave varchar(500) NOT NULL,
  id_rol bigint NOT NULL,
  id_familia bigint NULL,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Insertar usuarios de ejemplo (sin familia aún)
INSERT INTO usuarios (nombre, email, clave, id_rol) VALUES
('Erik Caballero', 'erik.caballero@gmail.com', '$2a$10$aKr31cB4IqH1IH2aLznM.Oie/thAuj7OvD03vilogZeg6myeti1Xi', 1),
('María García', 'maria@email.com', '$2a$10$aKr31cB4IqH1IH2aLznM.Oie/thAuj7OvD03vilogZeg6myeti1Xi', 2),
('Carlos López', 'carlos@email.com', '$2a$10$aKr31cB4IqH1IH2aLznM.Oie/thAuj7OvD03vilogZeg6myeti1Xi', 2),
('Ana Martínez', 'ana@email.com', '$2a$10$aKr31cB4IqH1IH2aLznM.Oie/thAuj7OvD03vilogZeg6myeti1Xi', 2),
('Luisa Fernández', 'luisa@email.com', '$2a$10$aKr31cB4IqH1IH2aLznM.Oie/thAuj7OvD03vilogZeg6myeti1Xi', 2);

-- 3. Tabla de familias
CREATE TABLE familias (
  id_familia bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre_familia varchar(500) NOT NULL,
  id_jefe bigint NOT NULL,
  FOREIGN KEY (id_jefe) REFERENCES usuarios(id_usuario)
);

-- Insertar familias de ejemplo
INSERT INTO familias (nombre_familia, id_jefe) VALUES
('Familia Pérez', 1),
('Familia García', 2),
('Familia Digital', 3),
('Familia Segura', 4),
('Familia Tech', 5);

-- Actualizar usuarios con sus familias
UPDATE usuarios SET id_familia = 1 WHERE id_usuario = 1;
UPDATE usuarios SET id_familia = 2 WHERE id_usuario = 2;
UPDATE usuarios SET id_familia = 3 WHERE id_usuario = 3;
UPDATE usuarios SET id_familia = 4 WHERE id_usuario = 4;
UPDATE usuarios SET id_familia = 5 WHERE id_usuario = 5;

-- Añadir la relación de usuarios a familias
ALTER TABLE usuarios
ADD CONSTRAINT usuarios_id_familia_fk 
FOREIGN KEY (id_familia) REFERENCES familias(id_familia);

-- 4. Tabla de invitaciones
CREATE TABLE invitaciones (
  id_invitacion bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_familia bigint NOT NULL,
  token varchar(500) NOT NULL,
  fecha_vencimiento date NOT NULL,
  FOREIGN KEY (id_familia) REFERENCES familias(id_familia)
);

-- Insertar invitaciones de ejemplo
INSERT INTO invitaciones (id_familia, token, fecha_vencimiento) VALUES
(1, 'abc123xyz456', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(1, 'def456uvw789', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(2, 'ghi789rst012', DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
(3, 'jkl012mno345', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
(5, 'pqr678stu901', DATE_ADD(CURDATE(), INTERVAL 14 DAY));

-- 5. Tabla de categorías
CREATE TABLE categorias (
  id_categoria bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre_categoria varchar(500) NOT NULL
);

-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre_categoria) VALUES
('Redes Sociales'),
('Bancos'),
('Correos Electrónicos'),
('Streaming'),
('Trabajo');

-- 6. Tabla de claves
CREATE TABLE claves (
  id_clave bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre_clave varchar(500) NOT NULL,
  sitio varchar(500) NOT NULL,
  usuario varchar(500) NOT NULL,
  clave varchar(500) NOT NULL,
  id_categoria bigint NOT NULL,
  compartir bigint NOT NULL,
  id_usuario bigint NOT NULL,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Insertar claves de ejemplo
INSERT INTO claves (nombre_clave, sitio, usuario, clave, id_categoria, compartir, id_usuario) VALUES
('Facebook Personal', 'facebook.com', 'usuario_fb', 'fb123pass', 1, 1, 1),
('Banco Principal', 'bancoprincipal.com', 'usuario_banco', 'banco456', 2, 0, 2),
('Correo Trabajo', 'mail.empresa.com', 'usuario_work', 'workmail789', 3, 1, 3),
('Netflix Familiar', 'netflix.com', 'usuario_netflix', 'familyStream1', 4, 1, 4),
('VPN Empresa', 'vpn.empresa.com', 'usuario_vpn', 'secureVpn123', 5, 0, 5),
('Instagram Negocio', 'instagram.com', 'usuario_insta', 'instaBiz456', 1, 1, 2),
('Cuenta Ahorros', 'bancoahorros.com', 'usuario_ahorros', 'savings789', 2, 0, 3);

-- Mensaje de confirmación
SELECT 'Base de datos gestor_claves_2 recreada con datos de ejemplo' AS Mensaje;