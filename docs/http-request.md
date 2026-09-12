# HTTP Request

## Pengertian

HTTP (HyperText Transfer Protocol) Request adalah metode yang digunakan oleh klien (browser, mobile app, dll) untuk mengirim data ke server. Request berisi informasi yang dibutuhkan server untuk memproses permintaan dan mengembalikan response.

## Struktur HTTP Request

```
┌─────────────────────────────────────┐
│           HTTP Request              │
├─────────────────────────────────────┤
│ 1. Request Line                     │
│    - Method (GET, POST, dll)        │
│    - URI (URL path)                 │
│    - HTTP Version                   │
├─────────────────────────────────────┤
│ 2. Headers                          │
│    - Content-Type                   │
│    - Authorization                  │
│    - Accept                         │
│    - dll                            │
├─────────────────────────────────────┤
│ 3. Body (opsional)                  │
│    - JSON, XML, Form Data, dll      │
└─────────────────────────────────────┘
```

## HTTP Methods

| Method   | Fungsi                              | Idempotent | Has Body |
|----------|-------------------------------------|------------|----------|
| GET      | Mengambil data                      | Ya         | Tidak    |
| POST     | Mengirim data / Create resource     | Tidak      | Ya       |
| PUT      | Update data (replace seluruhnya)    | Ya         | Ya       |
| PATCH    | Update data (sebagian)              | Tidak      | Ya       |
| DELETE   | Menghapus data                      | Ya         | Opsional |
| HEAD     | Sama seperti GET tapi tanpa body    | Ya         | Tidak    |
| OPTIONS  | Info supported methods              | Ya         | Tidak    |

## Status Code

### 1xx - Informational
- `100 Continue` - Server menerima request, klien boleh lanjut
- `101 Switching Protocols` - Server switch protocol (misal WebSocket)

### 2xx - Success
- `200 OK` - Request berhasil
- `201 Created` - Resource berhasil dibuat
- `204 No Content` - Berhasil tapi tidak ada content dikembalikan

### 3xx - Redirection
- `301 Moved Permanently` - URL permanent pindah
- `302 Found` - URL temporary pindah
- `304 Not Modified` - Resource belum berubah (cache valid)

### 4xx - Client Error
- `400 Bad Request` - Request tidak valid
- `401 Unauthorized` - Tidak ada autentikasi
- `403 Forbidden` - Tidak ada akses
- `404 Not Found` - Resource tidak ditemukan
- `405 Method Not Allowed` - Method tidak diizinkan
- `422 Unprocessable Entity` - Validasi gagal
- `429 Too Many Requests` - Rate limit terlalu banyak

### 5xx - Server Error
- `500 Internal Server Error` - Error di server
- `502 Bad Gateway` - Gateway/proxy error
- `503 Service Unavailable` - Server sedang down/maintenance

## Contoh Request

### GET Request
```http
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer <token>
```

### POST Request
```http
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### PUT Request
```http
PUT /api/users/1 HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

### DELETE Request
```http
DELETE /api/users/1 HTTP/1.1
Host: api.example.com
Authorization: Bearer <token>
```

## Common Headers

| Header            | Fungsi                                    |
|-------------------|-------------------------------------------|
| Content-Type      | Tipe data yang dikirim (JSON, XML, dll)   |
| Authorization     | Token/key untuk autentikasi               |
| Accept            | Tipe data yang diharapkan dari server     |
| Cache-Control     | Instruksi caching                         |
| User-Agent        | Info client yang mengirim request         |
| X-Request-ID      | ID unik untuk tracking request            |

## Contoh di JavaScript

### Menggunakan Fetch API
```javascript
// GET
const response = await fetch('https://api.example.com/users', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer <token>'
  }
});
const data = await response.json();

// POST
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
});
```

### Menggunakan Axios
```javascript
import axios from 'axios';

// GET
const { data } = await axios.get('/api/users');

// POST
const { data } = await axios.post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// DELETE
await axios.delete('/api/users/1');
```

## Error Handling

```javascript
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
}
```

## Best Practices

1. **Gunakan HTTPS** - Selalu gunakan HTTP untuk keamanan
2. **Handle Error** - Selalu handle error response
3. **Gunakan Status Code yang benar** - Jangan semua return 200
4. **Validate Input** - Validasi data sebelum dikirim
5. **Rate Limiting** - Batasi jumlah request dari klien
6. **Timeout** - Set timeout untuk mencegah hanging
7. **Logging** - Log request untuk debugging

## Referensi

- [MDN HTTP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [HTTP/1.1 Specification (RFC 7230)](https://tools.ietf.org/html/rfc7230)
- [HTTP/2 Specification (RFC 7540)](https://tools.ietf.org/html/rfc7540)
