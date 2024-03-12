import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    base: '',
    plugins: [react(), viteTsconfigPaths()],
    server: {    
        // makes browser open upon server start
        open: true,
        port: 3000, 
    },
})