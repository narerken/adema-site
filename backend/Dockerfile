FROM golang:1.24-alpine AS build
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o /adema-backend .

FROM alpine:3.20
WORKDIR /app
COPY --from=build /adema-backend /app/adema-backend
RUN mkdir -p /app/uploads/photos /app/uploads/music /app/data
ENV PORT=8080
ENV UPLOADS_DIR=/app/uploads
ENV DATA_FILE=/app/data/db.json
EXPOSE 8080
CMD ["/app/adema-backend"]
