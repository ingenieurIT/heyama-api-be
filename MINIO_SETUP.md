# MinIO Setup Guide

## Public Access Configuration

This project automatically configures MinIO buckets for **public read access**. Here's what happens when you start the application:

### Automatic Setup

1. **Bucket Creation**: The `heyama-objects` bucket is automatically created if it doesn't exist
2. **Public Policy**: A public read policy is automatically applied to the bucket
3. **Image URLs**: All uploaded images are accessible via public URLs

### Bucket Policy

The following policy is automatically applied:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": ["*"] },
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::heyama-objects/*"]
    }
  ]
}
```

This allows anyone (`*`) to read (`GetObject`) any file in the bucket.

### Accessing Images

After uploading an image, you'll receive a URL like:
```
http://localhost:9000/heyama-objects/objects/abc123-uuid.jpg
```

This URL can be:
- Used directly in `<img src="..." />` tags
- Accessed in a browser without authentication
- Embedded in any frontend application

### Manual MinIO Console Access

If you need to manually configure MinIO:

1. Open MinIO Console: `http://localhost:9001`
2. Login with:
   - Username: `minioadmin`
   - Password: `minioadmin`
3. Navigate to "Buckets" → `heyama-objects`
4. Go to "Access" tab
5. Set "Access Policy" to "Public" or "Custom"

### Verifying Public Access

Test image access with curl:
```bash
# Upload an image first
curl -X POST http://localhost:3001/objects \
  -F "title=Test" \
  -F "description=Test" \
  -F "image=@test.jpg"

# Copy the imageUrl from response

# Access the image directly
curl -I <imageUrl>
# Should return 200 OK
```

Or simply paste the URL in your browser - the image should load without any authentication!

### Production Considerations

For production deployments:

1. **Use HTTPS**: Configure SSL/TLS for MinIO
2. **Custom Domain**: Set up a custom domain for your MinIO instance
3. **CDN**: Consider using a CDN in front of MinIO for better performance
4. **Environment Variables**: Update `MINIO_PUBLIC_URL` to your production URL

Example production configuration:
```env
MINIO_ENDPOINT=minio.yourdomain.com
MINIO_USE_SSL=true
MINIO_PUBLIC_URL=https://minio.yourdomain.com
```

### Troubleshooting

**Images not loading?**
1. Check MinIO is running: `docker ps | grep minio`
2. Verify bucket policy: Check MinIO Console
3. Check firewall: Ensure port 9000 is accessible
4. Verify URL format: Should be `http://localhost:9000/heyama-objects/...`

**CORS issues?**
The backend is configured with CORS enabled (`origin: '*'`), but if you still have issues:
- Check browser console for specific errors
- Verify MinIO CORS settings in the console
- Ensure your frontend is using the correct API URL
