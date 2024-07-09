#!/bin/sh

function Test() {
echo ""
echo "GET all TODOs"
curl \
-H "Content-Type: application/json" \
-X GET http://localhost:8888/todo
echo ""
echo "GET TODO 1"
curl \
-H "Content-Type: application/json" \
-X GET http://localhost:8888/todo/1
echo ""
}

Test

echo "POST a TODO"
curl \
-H "Content-Type: application/json" \
-X POST http://localhost:8888/todo \
-d '{"title": "smhmayboudi", "completed": 1}'

Test

echo "PUT TODO 1"
curl \
-H "Content-Type: application/json" \
-X PUT http://localhost:8888/todo/1 \
-d '{"title": "smhmayboudi", "completed": 0}'

Test

echo "DELETE TODO 1"
curl \
-H "Content-Type: application/json" \
-X DELETE http://localhost:8888/todo/1

Test
