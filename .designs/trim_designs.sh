#!/bin/bash

# Function to rename designs sequentially
rename_designs() {
    local dir="$1"
    local original_designs=("${@:2}")
    
    # Create a temporary directory for the moves
    local temp_dir="$dir/designs/temp"
    mkdir -p "$temp_dir"
    
    # First move all designs to temp directory with new names
    for new_index in "${!original_designs[@]}"; do
        original_design="${original_designs[$new_index]}"
        mv "$dir/designs/design_$original_design" "$temp_dir/design_$((new_index + 1))"
    done
    
    # Then move them back to the original directory
    for new_index in "${!original_designs[@]}"; do
        mv "$temp_dir/design_$((new_index + 1))" "$dir/designs/"
    done
    
    # Clean up temp directory
    rmdir "$temp_dir"
}

# Function to remove designs by range
remove_designs() {
    local dir="$1"
    local start="$2"
    local end="$3"
    
    for i in $(seq "$start" "$end"); do
        rm -rf "$dir/designs/design_$i"
    done
}

for dir in ../*__fmri; do
    if [ -d "$dir" ]; then
        echo "Processing $dir"
        if [[ "$dir" == *"ax_cpt"* ]]; then
            # only keep first five designs 
            remove_designs "$dir" 6 8
        fi
        if [[ "$dir" == *"n_back"* || "$dir" == *"stop_signal"* || "$dir" == *"spatial_cueing"* || "$dir" == *"visual_search"* ]]; then
            # selected designs are fine
            continue
        fi
        if [[ "$dir" == *"cued_task_switching"* ]]; then
            # designs 2 and 6 felt blocky 
            # keep only design 1, 3, 4, 5, and 7
            rm -rf "$dir/designs/design_2"
            rm -rf "$dir/designs/design_6"
            remove_designs "$dir" 8 15
            rename_designs "$dir" 1 3 4 5 7
        fi
        if [[ "$dir" == *"spatial_task_switching"* ]]; then
            # designs 2 and 6 felt blocky 
            # keep only design 8, 9, 10, 11, 12
            remove_designs "$dir" 1 7
            remove_designs "$dir" 13 15
            rename_designs "$dir" 8 9 10 11 12
        fi
        if [[ "$dir" == *"simple_span"* ]]; then
            # keep only first 5 designs
            remove_designs "$dir" 6 15
        fi
        if [[ "$dir" == *"operation_span"* ]]; then
            # keep only designs 6-10
            remove_designs "$dir" 1 5
            remove_designs "$dir" 11 15
            rename_designs "$dir" 6 7 8 9 10
        fi 
        if [[ "$dir" == *"operation_only_span"* ]]; then
            # keep only designs 11-15
            remove_designs "$dir" 1 10
            rename_designs "$dir" 11 12 13 14 15
        fi 
        if [[ "$dir" == *"go_nogo"* ]]; then
            # design 8 starts with 3 nogo trials 
            # keep only designs 1-5 
            remove_designs "$dir" 6 8
        fi 
        if [[ "$dir" == *"flanker"* ]]; then
            # design 2 felt blocky 
            # keep 1, 3, 4, 5, 7
            rm -rf "$dir/designs/design_2"
            rm -rf "$dir/designs/design_6"
            remove_designs "$dir" 8 15
            rename_designs "$dir" 1 3 4 5 7
        fi 
        if [[ "$dir" == *"stroop"* ]]; then
            # design 2 felt blocky
            # keep 8, 9, 10, 11, 12
            remove_designs "$dir" 1 7
            remove_designs "$dir" 13 15
            rename_designs "$dir" 8 9 10 11 12
        fi  
    fi
done