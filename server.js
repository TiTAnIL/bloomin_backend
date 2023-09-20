const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()
const http = require('http').createServer(app)
const logger = require('./services/logger.service')


// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')));

if (process.env.NODE_ENV === 'production') {
  console.log('production')
  app.use(express.static(path.resolve(__dirname, 'public', 'index.html')))
} else {
  console.log('development')
  const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true
  }
  app.use(cors(corsOptions))
}

const plantRoutes = require('./api/plant/plant.routes')
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const { setupSocketAPI } = require('./services/socket.service')

// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)


app.use((req, res, next) => {
  // res.setHeader('Content-Security-Policy', "default-src *");
  res.setHeader('Content-Security-Policy', "default-src 'self' http://localhost:3030");
  next();
});

app.use('/api/plants', plantRoutes)
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
setupSocketAPI(http)

// Make every server-side-route to match the index.html
app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Specify the full path
});



const port = process.env.PORT || 3030
http.listen(port, () => {
  logger.info('Server is running on port: ' + port)
})