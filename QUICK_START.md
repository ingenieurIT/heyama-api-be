# Quick Start Guide

## Get Started in 3 Steps

### Step 1: Start Services

Open PowerShell in the project directory and run:

```powershell
docker-compose up -d
```

This starts MongoDB and MinIO in Docker containers.

### Step 2: Install & Run

```powershell
npm install
npm run start:dev
```

The API will be available at: **http://localhost:3001**

### Step 3: Test It!

Create an object:
```powershell
curl.exe -X POST http://localhost:3001/objects `
  -F "title=Test Object" `
  -F "description=My first object" `
  -F "image=@C:\path\to\image.jpg"
```

Get all objects:
```powershell
curl http://localhost:3001/objects
```

---

## What's Running?

After starting, you'll have:

- ✅ **NestJS API**: http://localhost:3001
- ✅ **MongoDB**: mongodb://localhost:27017
- ✅ **MinIO Console**: http://localhost:9001
- ✅ **MinIO API**: http://localhost:9000
- ✅ **WebSocket**: ws://localhost:3001

---

## For Your Frontend

Your frontend can connect to:

### REST API Endpoints
```
POST   /objects       - Create object (with image)
GET    /objects       - Get all objects
GET    /objects/:id   - Get single object
DELETE /objects/:id   - Delete object
```

### WebSocket Events
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('objectCreated', (object) => {
  console.log('New object:', object);
});

socket.on('objectDeleted', (id) => {
  console.log('Deleted:', id);
});
```

### Images
All image URLs are **publicly accessible**. Just use them directly in `<img>` tags:

```jsx
<img src={object.imageUrl} alt={object.title} />
```

Example URL: `http://localhost:9000/heyama-objects/objects/uuid.jpg`

---

## Using the API from Next.js

```typescript
// Create object with image
const formData = new FormData();
formData.append('title', 'My Object');
formData.append('description', 'Description here');
formData.append('image', imageFile);

const response = await fetch('http://localhost:3001/objects', {
  method: 'POST',
  body: formData,
});

const object = await response.json();
```

---

## Need Help?

- **API Testing**: See [API_TESTING.md](./API_TESTING.md)
- **MinIO Setup**: See [MINIO_SETUP.md](./MINIO_SETUP.md)
- **Full Documentation**: See [README.md](./README.md)

---

## Stopping Services

```powershell
# Stop the API (Ctrl+C in the terminal)

# Stop Docker services
docker-compose down
```

---

That's it! Your backend is ready to use. 🚀
