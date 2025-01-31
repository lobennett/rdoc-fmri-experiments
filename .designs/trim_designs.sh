#!/bin/bash

# Write a function that takes in start and end design numbers and removes all designs in that range
function remove_designs {
    start=$1
    end=$2
    for i in $(seq $start $end); do
        design_dir="$dir/designs/design_$i"
        if [ -d "$design_dir" ]; then
            echo "Removing $design_dir"
            rm -rf "$design_dir"
        fi
    done
}

function remove_extra_designs {
    for dir in ../*__fmri; do
    if [ -d "$dir" ]; then
        echo "Processing directory: $dir"
        if [[ "$dir" == "../ax_cpt_rdoc__fmri" ]]; then
            echo "Found ax_cpt_rdoc__fmri directory"
            remove_designs 6 12
        fi
        if [[ "$dir" == "../cued_task_switching_rdoc__fmri" ]]; then
            echo "Found cued_task_switching_rdoc__fmri directory"
            remove_designs 6 17
        fi
        if [[ "$dir" == "../flanker_rdoc__fmri" ]]; then
            echo "Found flanker_rdoc__fmri directory"
            remove_designs 6 17
        fi
        if [[ "$dir" == "../go_nogo_rdoc__fmri" ]]; then
            echo "Found go_nogo_rdoc__fmri directory"
            remove_designs 6 10
        fi
        if [[ "$dir" == "../n_back_rdoc__fmri" ]]; then
            echo "Skipping n_back_rdoc__fmri directory"
            remove_designs 10 10
            remove_designs 12 20
        fi
        if [[ "$dir" == "../operation_only_span_rdoc__fmri" ]]; then
            echo "Found operation_only_span_rdoc__fmri directory"
            remove_designs 6 17
        fi
        if [[ "$dir" == "../operation_span_rdoc__fmri" ]]; then
            echo "Found operation_span_rdoc__fmri directory"
            remove_designs 1 5
            remove_designs 11 17
        fi
        if [[ "$dir" == "../simple_span_rdoc__fmri" ]]; then
            echo "Found simple_span_rdoc__fmri directory"
            remove_designs 1 10
            remove_designs 16 17
        fi
        if [[ "$dir" == "../spatial_cueing_rdoc__fmri" ]]; then
            echo "Found spatial_cueing_rdoc__fmri directory"
            remove_designs 6 7
        fi
        if [[ "$dir" == "../spatial_task_switching_rdoc__fmri" ]]; then
            echo "Found spatial_task_switching_rdoc__fmri directory"
            remove_designs 1 5
            remove_designs 11 17
        fi
        if [[ "$dir" == "../stop_signal_rdoc__fmri" ]]; then
            echo "Found stop_signal_rdoc__fmri directory"
            remove_designs 6 7
        fi
        if [[ "$dir" == "../stroop_rdoc__fmri" ]]; then
            echo "Found stroop_rdoc__fmri directory"
            remove_designs 1 5
            remove_designs 11 17
        fi
        if [[ "$dir" == "../visual_search_rdoc__fmri" ]]; then
            echo "Found visual_search_rdoc__fmri directory"
            remove_designs 6 7
        fi
        fi
    done
}

function rename_remaining_designs {
    for dir in ../*__fmri; do
        if [ -d "$dir" ]; then
            echo "Renaming dirs in: $dir"
            if [[ "$dir" == "../operation_span_rdoc__fmri" ]]; then
                mv "$dir/designs/design_6" "$dir/designs/design_1"
                mv "$dir/designs/design_7" "$dir/designs/design_2"
                mv "$dir/designs/design_8" "$dir/designs/design_3"
                mv "$dir/designs/design_9" "$dir/designs/design_4"
                mv "$dir/designs/design_10" "$dir/designs/design_5"
            fi
            if [[ "$dir" == "../simple_span_rdoc__fmri" ]]; then
                mv "$dir/designs/design_11" "$dir/designs/design_1"
                mv "$dir/designs/design_12" "$dir/designs/design_2"
                mv "$dir/designs/design_13" "$dir/designs/design_3"
                mv "$dir/designs/design_14" "$dir/designs/design_4"
                mv "$dir/designs/design_15" "$dir/designs/design_5"
            fi
            if [[ "$dir" == "../spatial_task_switching_rdoc__fmri" ]]; then
                mv "$dir/designs/design_6" "$dir/designs/design_1"
                mv "$dir/designs/design_7" "$dir/designs/design_2"
                mv "$dir/designs/design_8" "$dir/designs/design_3"
                mv "$dir/designs/design_9" "$dir/designs/design_4"
                mv "$dir/designs/design_10" "$dir/designs/design_5"
            fi
            if [[ "$dir" == "../stroop_rdoc__fmri" ]]; then
                mv "$dir/designs/design_6" "$dir/designs/design_1"
                mv "$dir/designs/design_7" "$dir/designs/design_2"
                mv "$dir/designs/design_8" "$dir/designs/design_3"
                mv "$dir/designs/design_9" "$dir/designs/design_4"
                mv "$dir/designs/design_10" "$dir/designs/design_5"
            fi
            if [[ "$dir" == "../n_back_rdoc__fmri" ]]; then
                # Rename to make all odd designs starting with 1-back and even designs starting with 2-back
                # - doing odd first 
                # mv "$dir/designs/design_1" "$dir/designs/design_1"
                mv "$dir/designs/design_2" "$dir/designs/design_03"
                mv "$dir/designs/design_3" "$dir/designs/design_05"
                mv "$dir/designs/design_4" "$dir/designs/design_07"
                mv "$dir/designs/design_11" "$dir/designs/design_09"

                # - doing even next
                mv "$dir/designs/design_5" "$dir/designs/design_2"
                mv "$dir/designs/design_6" "$dir/designs/design_4"
                mv "$dir/designs/design_7" "$dir/designs/design_6"
                # mv "$dir/designs/design_8" "$dir/designs/design_8"
                mv "$dir/designs/design_9" "$dir/designs/design_10"

                # - renaming because otherwise would've conflicted with 1-back designs
                mv "$dir/designs/design_03" "$dir/designs/design_3"
                mv "$dir/designs/design_05" "$dir/designs/design_5"
                mv "$dir/designs/design_07" "$dir/designs/design_7"
                mv "$dir/designs/design_09" "$dir/designs/design_9"
            fi
        fi
    done
}

remove_extra_designs
rename_remaining_designs