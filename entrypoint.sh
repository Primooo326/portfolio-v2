#!/bin/sh
serve /app -l 4200 --single &
nginx -g "daemon off;"
