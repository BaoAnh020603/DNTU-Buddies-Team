import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import ViteSitemap from 'vite-plugin-sitemap'
import { createHtmlPlugin } from 'vite-plugin-html'
// https://vite.dev/config/

const routes = [
    { path: '/', name: 'Home' },
    { path: '/topic', name: 'Topic' },
]

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        ViteSitemap({
            hostname: 'https://opic.io.vn',
            dynamicRoutes: routes.map((route) => route.path),
            generateRobotsTxt: true,
        }),
        createHtmlPlugin({
            minify: true,
            inject: {
                data: {
                    title: 'Default Title',
                    description: 'Default Description',
                },
            },
        }),
    ],
    assetsInclude: ['**/*.glb'],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        // Optimize build for better performance
        target: 'es2015',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.log in production
                drop_debugger: true,
            },
        },
        // Chunk size optimization
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                // Manual chunks for better code splitting
                manualChunks: {
                    // Core React libraries
                    react: ['react', 'react-dom', 'react-router-dom'],
                    // Animation libraries (lazy load)
                    animations: ['framer-motion', 'gsap', 'aos'],
                    // UI components
                    icons: ['lucide-react'],
                    // Utilities
                    utils: ['axios'],
                },
                // Optimize asset file names
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name?.split('.')
                    const ext = info?.[info.length - 1]
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
                        return `assets/images/[name]-[hash][extname]`
                    } else if (/woff|woff2|eot|ttf|otf/i.test(ext || '')) {
                        return `assets/fonts/[name]-[hash][extname]`
                    }
                    return `assets/[name]-[hash][extname]`
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
            },
        },
        // Enable CSS code splitting
        cssCodeSplit: true,
        // Source map for production debugging (optional, disable for smaller build)
        sourcemap: false,
    },
    // Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
        exclude: ['@vite/client', '@vite/env'],
    },
    // Server configuration for development
    server: {
        hmr: {
            overlay: false, // Disable error overlay for better performance
        },
    },
})
