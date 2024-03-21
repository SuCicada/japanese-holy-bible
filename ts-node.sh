#!/bin/bash
ts-node \
  -r tsconfig-paths/register \
  --emit \
  --swc \
  --project tsconfig.scripts.json \
  $@
