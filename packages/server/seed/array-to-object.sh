#!/bin/bash

jq "reduce .$1[] as \$i ({}; .[\$i.id] = \$i)" -
