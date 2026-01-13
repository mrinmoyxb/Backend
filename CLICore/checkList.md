## CLI Logic:

### process.argv: 
`process.argv` is a built-in global property that returns an array containing all command-line arguments passed when the Node.js process was launched. It is the simplest, native way to receive user input directly from the terminal without using external libraries. 

`node app.js Hello 123`

[
  '/usr/bin/node',       // process.argv[0]
  '/path/to/app.js',     // process.argv[1]
  'Hello',               // process.argv[2] (First user argument)
  '123'                  // process.argv[3] (Second user argument)
]

So, our goal is to fetch `HTTP method` and `URL`

### File Structure:
cli-core/
│
├── index.js                 # Entry point (temporary)
│
├── core/
│   ├── commandResolver.js   # Decides GET / POST / etc.
│   └── requestContext.js    # Normalized request object
│
├── handlers/
│   └── getHandler.js        # GET logic only
│
├── http/
│   └── httpClient.js        # axios / fetch wrapper
│
└── utils/
    ├── parseArgs.js         # reads process.argv
    └── validateUrl.js
