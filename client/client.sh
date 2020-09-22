#!/bin/sh

IP=127.0.0.1
PORT=5500

python -m http.server $PORT --bind $IP
