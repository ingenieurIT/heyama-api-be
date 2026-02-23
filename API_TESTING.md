# API Testing Guide

## Prerequisites

Make sure the backend is running:
```bash
npm run start:dev
```

And Docker services are running:
```bash
docker-compose up -d
```

## Testing with cURL

### 1. Create an Object

```bash
curl -X POST http://localhost:3001/objects \
  -F "title=My First Object" \
  -F "description=This is a test object with an image" \
  -F "image=@/path/to/your/image.jpg"
```

**Windows PowerShell:**
```powershell
curl.exe -X POST http://localhost:3001/objects `
  -F "title=My First Object" `
  -F "description=This is a test object" `
  -F "image=@C:\path\to\image.jpg"
```

**Expected Response:**
```json
{
  "id": "65f1234567890abcdef12345",
  "title": "My First Object",
  "description": "This is a test object with an image",
  "imageUrl": "http://localhost:9000/heyama-objects/objects/uuid-here.jpg",
  "createdAt": "2026-02-23T10:30:00.000Z"
}
```

### 2. Get All Objects

```bash
curl http://localhost:3001/objects
```

**Expected Response:**
```json
[
  {
    "id": "65f1234567890abcdef12345",
    "title": "My First Object",
    "description": "This is a test object",
    "imageUrl": "http://localhost:9000/heyama-objects/objects/uuid-here.jpg",
    "createdAt": "2026-02-23T10:30:00.000Z"
  }
]
```

### 3. Get Single Object

```bash
curl http://localhost:3001/objects/65f1234567890abcdef12345
```

### 4. Delete Object

```bash
curl -X DELETE http://localhost:3001/objects/65f1234567890abcdef12345
```

**Expected Response:**
```json
{
  "message": "Object deleted successfully"
}
```

## Testing Image Access

After creating an object, copy the `imageUrl` from the response and:

1. **Open in Browser**: Paste the URL directly in your browser
2. **Test with cURL**:
   ```bash
   curl -I http://localhost:9000/heyama-objects/objects/uuid-here.jpg
   ```
   Should return `200 OK`

## Testing Real-time Updates with Socket.IO

### Using HTML & JavaScript

Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Socket.IO Test</title>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <h1>Real-time Updates Test</h1>
  <div id="events"></div>
  
  <script>
    const socket = io('http://localhost:3001');
    
    socket.on('connect', () => {
      console.log('Connected to server');
      document.getElementById('events').innerHTML += '<p>✅ Connected to WebSocket</p>';
    });
    
    socket.on('objectCreated', (data) => {
      console.log('Object created:', data);
      document.getElementById('events').innerHTML += 
        `<p>📦 New object: ${data.title}</p>`;
    });
    
    socket.on('objectDeleted', (id) => {
      console.log('Object deleted:', id);
      document.getElementById('events').innerHTML += 
        `<p>🗑️ Object deleted: ${id}</p>`;
    });
  </script>
</body>
</html>
```

Open this file in a browser, then create/delete objects via the API - you should see real-time updates!

## Testing with Postman

### 1. Create Object
- Method: `POST`
- URL: `http://localhost:3001/objects`
- Body: `form-data`
  - `title`: `Test Object` (text)
  - `description`: `Test Description` (text)
  - `image`: Select file

### 2. Get All Objects
- Method: `GET`
- URL: `http://localhost:3001/objects`

### 3. Get Single Object
- Method: `GET`
- URL: `http://localhost:3001/objects/{id}`

### 4. Delete Object
- Method: `DELETE`
- URL: `http://localhost:3001/objects/{id}`

## Common Issues

### Issue: "Cannot upload file"
- Check that you're sending the file as `multipart/form-data`
- Verify the field name is `image`
- Ensure the file exists at the specified path

### Issue: "Image URL not accessible"
- Verify MinIO is running: `docker ps | grep minio`
- Check bucket policy is public (see MINIO_SETUP.md)
- Try accessing MinIO console: http://localhost:9001

### Issue: "Connection refused"
- Ensure backend is running: `npm run start:dev`
- Check the correct port (3001) is being used
- Verify no other service is using port 3001

### Issue: "MongooseError"
- Ensure MongoDB is running: `docker ps | grep mongo`
- Check MongoDB connection string in `.env`
- Verify MongoDB is accessible: `docker exec -it heyama-mongodb mongosh`

## Verifying Everything Works

Run this complete test flow:

```bash
# 1. Check services
docker ps

# 2. Create an object with cURL (Windows)
curl.exe -X POST http://localhost:3001/objects `
  -F "title=Complete Test" `
  -F "description=Testing all features" `
  -F "image=@C:\path\to\test.jpg"

# 3. Get all objects
curl http://localhost:3001/objects

# 4. Copy the imageUrl from response and open in browser
# Should display the image without any authentication!

# 5. Copy the object ID and delete it
curl -X DELETE http://localhost:3001/objects/{paste-id-here}

# 6. Verify deletion
curl http://localhost:3001/objects
```

If all steps work, your backend is fully functional! 🎉
