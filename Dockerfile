# Usar una imagen base de Node.js
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar el archivo package.json desde la carpeta backend al contenedor
COPY backend/package*.json ./

# Instalar las dependencias de Node.js
RUN npm install

# Copiar el resto del código fuente desde la carpeta backend al contenedor
COPY backend/ ./

# Exponer el puerto en el que corre tu aplicación (ajústalo si es necesario)
EXPOSE 3000

# Comando para ejecutar la aplicación cuando el contenedor se inicie
CMD ["npm", "start"]
