# Heyama API Backend

A NestJS backend with MinIO for image storage, MongoDB for data persistence, and Socket.IO for real-time updates.

## Features

- 🚀 RESTful API with NestJS
- 📦 MinIO for S3-compatible image storage with **PUBLIC ACCESS**
- 🗄️ MongoDB for data persistence
- ⚡ Real-time updates with Socket.IO
- 🌐 CORS enabled for frontend integration

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB and MinIO using Docker:
```bash
docker-compose up -d
```

3. The services will be available at:
   - MongoDB: `mongodb://localhost:27017`
   - MinIO Console: `http://localhost:9001` (username: minioadmin, password: minioadmin)
   - MinIO API: `http://localhost:9000`

## Running the Application

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:3001`

## API Endpoints

### Create Object
```http
POST /objects
Content-Type: multipart/form-data

title: string
description: string
image: file
```

### Get All Objects
```http
GET /objects
```

### Get Single Object
```http
GET /objects/:id
```

### Delete Object
```http
DELETE /objects/:id
```

## WebSocket Events

Connect to: `http://localhost:3001`

### Events:
- `objectCreated` - Emitted when a new object is created
- `objectDeleted` - Emitted when an object is deleted

## MinIO Public Access

This backend is configured to **automatically set MinIO bucket to public**. This means:
- All uploaded images are publicly accessible via their URLs
- No authentication required to view images
- URLs can be directly used in `<img>` tags in your frontend

Example image URL:
```
http://localhost:9000/heyama-objects/objects/uuid-here.jpg
```

## Environment Variables

See `.env` file for configuration options:
- `PORT`: API server port (default: 3001)
- `MONGODB_URI`: MongoDB connection string
- `MINIO_ENDPOINT`: MinIO server endpoint
- `MINIO_PORT`: MinIO server port
- `MINIO_ACCESS_KEY`: MinIO access key
- `MINIO_SECRET_KEY`: MinIO secret key
- `MINIO_BUCKET_NAME`: MinIO bucket name
- `MINIO_PUBLIC_URL`: Public URL for accessing images

## License

MIT
