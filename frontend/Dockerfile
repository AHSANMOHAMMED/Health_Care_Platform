# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Build-time arguments for Azure deployment
ARG VITE_API_GATEWAY_URL=http://localhost:8080/api
ENV VITE_API_GATEWAY_URL=${VITE_API_GATEWAY_URL}
# Compile the React application for production deployment
RUN npm run build

# Production Stage
FROM nginx:alpine
# Copy the compiled bundled code from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Inject the dynamic inter-Docker network reverse-proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
