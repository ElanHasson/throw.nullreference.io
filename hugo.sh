#!/bin/bash

killall -9 hugo
npm run build
hugo server --theme=hugo-theme-bootstrap -s=/workspaces/throw.nullreference.io --buildDrafts --watch --port=9081 --disableFastRender 
