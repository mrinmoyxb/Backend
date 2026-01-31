### Checklist:

### Phase 1 ###
* Auth (JWT + refresh tokens)
* Upload file → S3
* Save metadata in DB
* List files/folders
* Download via signed URL

### Phase 2 ###
* Folder nesting
* Rename / move files
* Trash & restore
* File size limits
* MIME type validation 

### Phase 3  ### 
* Multipart upload (large files)
* Versioning
* Sharing (read/write)
* Activity logs
* Rate limiting
* Background jobs (BullMQ)

---------------------------------------------------------------------------------------------------------------------------------------

### File Structure ###
gdrive-backend/
│
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server bootstrap
│.  |
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.middleware.js
│   │
│   │   ├── users/
│   │   │   ├── user.model.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   └── user.routes.js
│   │
│   │   ├── files/
│   │   │   ├── file.model.js          # metadata only
│   │   │   ├── file.controller.js     # upload/download APIs
│   │   │   ├── file.service.js        # business logic
│   │   │   ├── file.routes.js
│   │   │   └── file.permissions.js
│   │
│   │   ├── folders/
│   │   │   ├── folder.model.js
│   │   │   ├── folder.controller.js
│   │   │   ├── folder.service.js
│   │   │   └── folder.routes.js
│   │
│   │   ├── sharing/
│   │   │   ├── share.model.js
│   │   │   ├── share.controller.js
│   │   │   ├── share.service.js
│   │   │   └── share.routes.js
│
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── rateLimiter.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js       # multer / multipart
│
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── hash.js
│   │   ├── logger.js
│   │   ├── asyncHandler.js
│   │   └── response.js
│
│   ├── jobs/
│   │   ├── cleanup.job.js              # orphan files
│   │   └── virusScan.job.js
│
│   ├── events/
│   │   ├── socket.js                   # WebSocket / Socket.IO
│   │   └── file.events.js
│
│   └── routes.js                       # Combine all routes
│
├── prisma/ or migrations/              # DB migrations
│
├── tests/
│   ├── auth.test.js
│   ├── files.test.js
│   └── folders.test.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── docker-compose.yml
