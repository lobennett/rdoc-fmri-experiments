#!/bin/bash

# Activate virtual environment if not already activated
if [ -z "$VIRTUAL_ENV" ]; then
    source .deploy/.venv/bin/activate
fi

echo "Using virtual environment: $VIRTUAL_ENV"
echo "Checking installation for expfactory-deploy-local: $(pip list | grep expfactory-deploy-local)"

# Find all directories ending in __fmri and store in array
fmri_dirs=($(find . -type d -name "*__fmri"))

if [ ${#fmri_dirs[@]} -eq 0 ]; then
    echo "No directories ending in __fmri found"
    exit 1
fi

# Create options string for select prompt
PS3="Please select an experiment: "

# Creat list of options in alphabetical order 
sorted_dirs=()
for dir in "${fmri_dirs[@]#./}"; do
    if [[ "$dir" == "ax_cpt__fmri" ]]; then
        continue
    fi
    sorted_dirs+=("$dir")
done
sorted_dirs=($(printf '%s\n' "${sorted_dirs[@]}" | sort))

# Show selection menu and store choice
select experiment_name in "${sorted_dirs[@]}"; do
    if [ -n "$experiment_name" ]; then
        break
    else
        echo "Invalid selection"
    fi
done

# Remove leading ./ if there is one
experiment_name="${experiment_name#./}"

# Get subject ID and format it
read -p "Enter subject ID (e.g. 001 or s001): " subject_id
# Remove leading 's' if present, then add it back
subject_id=${subject_id#s}
subject_id="s${subject_id}"

# Get session number and format it with leading zero if needed
while true; do
    read -p "Enter session number (1-10): " session_num
    if [[ "$session_num" =~ ^[1-9]|10$ ]]; then
        # Format single digit numbers with leading zero
        if [[ "$session_num" =~ ^[1-9]$ ]]; then
            session_num=$(printf "%02d" $session_num)
        fi
        break
    else
        echo "Invalid session number. Please enter a number between 1 and 10."
    fi
done

# Ask for run number
read -p "Enter run number (e.g., 1): " run_num

while true; do
    read -p "Skip practice? (y/n): " skip_practice
    if [[ "$skip_practice" =~ ^[yYnN]$ ]]; then
        skip_practice=$([ "$skip_practice" = "y" -o "$skip_practice" = "Y" ] && echo "true" || echo "false")
        break
    else
        echo "Invalid input. Please enter 'y' or 'n'."
    fi
done

while true; do
    read -p "Only complete a single block? (y/n): " single_block
    if [[ "$single_block" =~ ^[yYnN]$ ]]; then
        single_block=$([ "$single_block" = "y" -o "$single_block" = "Y" ] && echo "true" || echo "false")
        break
    else
        echo "Invalid input. Please enter 'y' or 'n'."
    fi
done

echo "Launching experiment $experiment_name with subject $subject_id, session $session_num, and run $run_num"

# Launch with experiment factory deploy local and specify raw and bids directories
raw_path="$(pwd)/.output/raw"
bids_path="$(pwd)/.output/bids"
echo "expfactory_deploy_local -e $experiment_name -raw $raw_path -bids $bids_path -sub $subject_id -ses $session_num -run $run_num"
expfactory_deploy_local -e "$experiment_name" -raw "$raw_path" -bids "$bids_path" -sub "$subject_id" -ses "$session_num" -run "$run_num" -skip_practice "$skip_practice" -single_block "$single_block"