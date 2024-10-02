# Gunakan image Node.js yang minimal dan aman
FROM node:22-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install --production

# Salin kode sumber aplikasi
COPY . .

# Tentukan variabel lingkungan yang aman
ENV NODE_ENV=production

# Jalankan aplikasi
CMD ["node", "index.js"]

# Tentukan port yang akan digunakan
EXPOSE 3001