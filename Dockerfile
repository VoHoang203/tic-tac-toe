# Sử dụng image Node.js chính thức để xây dựng ứng dụng
FROM node:18.18.0-alpine  AS build

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build project Vite
RUN npm run build


# Expose cổng 5173
EXPOSE 3000

# Lệnh chạy Nginx
CMD ["npm", "run", "dev"]
