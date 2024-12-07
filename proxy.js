import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Proxy middleware configuration
app.use('/', createProxyMiddleware({
    target: 'https://rpc-testnet.supra.com',
    changeOrigin: true,
    // Remove pathRewrite since we're handling all routes
    onProxyReq: (proxyReq, req) => {
        console.log(`[${new Date().toISOString()}] Proxying request to: ${req.method} ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req) => {
        console.log(`[${new Date().toISOString()}] Response status: ${proxyRes.statusCode} for ${req.method} ${req.path}`);
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
    onError: (err, req, res) => {
        console.error(`[${new Date().toISOString()}] Proxy error:`, err);
        res.status(500).send('Proxy Error');
    }
}));

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});