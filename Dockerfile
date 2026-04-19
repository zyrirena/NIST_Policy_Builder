FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package.json ./

# Copy backend and frontend source
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Install root dependencies
RUN --mount=type=cache,id=s/79a8518d-c050-4f65-bcff-62140ce5f050-/root/npm,target=/root/.npm npm install

# Install backend dependencies
RUN --mount=type=cache,id=s/79a8518d-c050-4f65-bcff-62140ce5f050-/root/npm,target=/root/.npm cd backend && npm install

# Install frontend dependencies
RUN --mount=type=cache,id=s/79a8518d-c050-4f65-bcff-62140ce5f050-/root/npm,target=/root/.npm cd frontend && npm install

# Build frontend
RUN cd frontend && npm run build

EXPOSE 3001

CMD ["sh", "-c", "cd backend && npm run db:migrate && npm run db:seed && npm start"]
