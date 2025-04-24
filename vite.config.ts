import { defineConfig } from 'vite'

export default defineConfig({
    base: process.env["BASE"],
    publicDir: "public",
});