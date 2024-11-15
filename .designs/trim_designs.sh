#!/bin/bash

for dir in ../*__fmri; do
    if [ -d "$dir" ]; then
        echo "Processing $dir"
        if [[ "$dir" == *"ax_cpt"* ]]; then
            # only keep first five designs 
            rm -rf "$dir/designs/design_6"
            rm -rf "$dir/designs/design_7"
            rm -rf "$dir/designs/design_8"
        fi
        if [[ "$dir" == *"go_nogo"* ]]; then
            # only keep first five designs 
            rm -rf "$dir/designs/design_6"
            rm -rf "$dir/designs/design_7"
            rm -rf "$dir/designs/design_8"
        fi
        if [[ "$dir" == *"n_back"* ]]; then
            # only keep first five designs 
            rm -rf "$dir/designs/design_6"
            rm -rf "$dir/designs/design_7"
            rm -rf "$dir/designs/design_8"
            rm -rf "$dir/designs/design_9"
            rm -rf "$dir/designs/design_10"
        fi
        if [[ "$dir" == *"flanker"* ]]; then
            # only keep first five designs 
            rm -rf "$dir/designs/design_6"
            rm -rf "$dir/designs/design_7"
            rm -rf "$dir/designs/design_8"
            rm -rf "$dir/designs/design_9"
            rm -rf "$dir/designs/design_10"
            rm -rf "$dir/designs/design_11"
            rm -rf "$dir/designs/design_12"
            rm -rf "$dir/designs/design_13"
            rm -rf "$dir/designs/design_14"
            rm -rf "$dir/designs/design_15"
        fi
        if [[ "$dir" == *"stroop"* ]]; then
            # only keep designs 6, 7, 8, 9, 10
            rm -rf "$dir/designs/design_1"
            rm -rf "$dir/designs/design_2"
            rm -rf "$dir/designs/design_3"
            rm -rf "$dir/designs/design_4"
            rm -rf "$dir/designs/design_5"
            rm -rf "$dir/designs/design_11"
            rm -rf "$dir/designs/design_12"
            rm -rf "$dir/designs/design_13"
            rm -rf "$dir/designs/design_14"
            rm -rf "$dir/designs/design_15"

            for i in {6..10}; do
                new_i=$((i - 5)) 
                mv "$dir/designs/design_$i" "$dir/designs/design_$new_i"
            done

        fi
        if [[ "$dir" == *"cued_task_switching"* ]]; then
            # only keep first five designs 
            rm -rf "$dir/designs/design_6"
            rm -rf "$dir/designs/design_7"
            rm -rf "$dir/designs/design_8"
            rm -rf "$dir/designs/design_9"
            rm -rf "$dir/designs/design_10"
            rm -rf "$dir/designs/design_11"
            rm -rf "$dir/designs/design_12"
            rm -rf "$dir/designs/design_13"
            rm -rf "$dir/designs/design_14"
            rm -rf "$dir/designs/design_15"
        fi
        if [[ "$dir" == *"spatial_task_switching"* ]]; then
            # only keep designs 6, 7, 8, 9, 10
            rm -rf "$dir/designs/design_1"
            rm -rf "$dir/designs/design_2"
            rm -rf "$dir/designs/design_3"
            rm -rf "$dir/designs/design_4"
            rm -rf "$dir/designs/design_5"
            rm -rf "$dir/designs/design_11"
            rm -rf "$dir/designs/design_12"
            rm -rf "$dir/designs/design_13"
            rm -rf "$dir/designs/design_14"
            rm -rf "$dir/designs/design_15"

            for i in {6..10}; do
                new_i=$((i - 5)) 
                mv "$dir/designs/design_$i" "$dir/designs/design_$new_i"
            done

        fi
        if [[ "$dir" == *"operation_only_span"* ]]; then
            # only keep first five designs
            rm -rf "$dir/designs/design_6"
            rm -rf "$dir/designs/design_7"
            rm -rf "$dir/designs/design_8"
            rm -rf "$dir/designs/design_9"
            rm -rf "$dir/designs/design_10"
            rm -rf "$dir/designs/design_11"
            rm -rf "$dir/designs/design_12"
            rm -rf "$dir/designs/design_13"
            rm -rf "$dir/designs/design_14"
            rm -rf "$dir/designs/design_15"
        fi
        if [[ "$dir" == *"operation_span"* ]]; then
            # only keep designs 6, 7, 8, 9, 10
            rm -rf "$dir/designs/design_1"
            rm -rf "$dir/designs/design_2"
            rm -rf "$dir/designs/design_3"
            rm -rf "$dir/designs/design_4"
            rm -rf "$dir/designs/design_5"
            rm -rf "$dir/designs/design_11"
            rm -rf "$dir/designs/design_12"
            rm -rf "$dir/designs/design_13"
            rm -rf "$dir/designs/design_14"
            rm -rf "$dir/designs/design_15"

            for i in {6..10}; do
                new_i=$((i - 5)) 
                mv "$dir/designs/design_$i" "$dir/designs/design_$new_i"
            done

        fi
        if [[ "$dir" == *"simple_span"* ]]; then
            # only keep designs 11, 12, 13, 14, 15
            rm -rf "$dir/designs/design_1"
            rm -rf "$dir/designs/design_2"
            rm -rf "$dir/designs/design_3"
            rm -rf "$dir/designs/design_4"
            rm -rf "$dir/designs/design_5"
            rm -rf "$dir/designs/design_6"
            rm -rf "$dir/designs/design_7"
            rm -rf "$dir/designs/design_8"
            rm -rf "$dir/designs/design_9"
            rm -rf "$dir/designs/design_10"

            for i in {11..15}; do
                new_i=$((i - 10)) 
                mv "$dir/designs/design_$i" "$dir/designs/design_$new_i"
            done

        fi
    fi
done