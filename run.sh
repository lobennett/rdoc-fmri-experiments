#!/bin/bash
#
# Prompt the user to select an experiment, subject, session, and run number.
# Then launch the task in their browser.

# Activate the virtual environment
source ./.venv/bin/activate

#######################################
# Get list of directories ending in __fmri
# Globals:
#   None
# Arguments:
#   None
# Returns:
#   List of directories ending in __fmri
#######################################
function get_fmri_dirs() {
  local dirs=()
  for dir in */; do 
    if [[ "$dir" == *__fmri/ ]]; then 
      dirs+=("${dir%/*}") 
    fi
  done
  echo "${dirs[@]}"
}

#######################################
# Prompt the user for an experiment name
# Globals:
#   None
# Arguments:
#   List of experiment names
# Returns:
#   Selected experiment name
#######################################
function prompt_user_for_experiment() {
  local options=("$@")
  PS3="Please select an experiment: "
  
  select experiment_name in "${options[@]}"; do
    if [ -n "$experiment_name" ]; then
      echo "$experiment_name"
      break
    else
      echo "Invalid selection. Please try again."
    fi
  done
}

#######################################
# Prompt the user for metadata that 
# will appear in the output paths 
# Globals:
#   None
# Arguments:
#   None
# Returns:
#   Run number, subject ID, and session number
#######################################
function prompt_user_for_metadata() {
    read -p "Enter subject ID (e.g. 001 or s001): " subject_id
    read -p "Enter session number (1-10): " session_num
    read -p "Enter run number (e.g., 1): " run_num

    echo "$subject_id $session_num $run_num"
}

#######################################
# Launch the experiment
# Globals:
#   None
# Arguments:
#   Experiment name, run number, subject ID, and session number
# Returns:
#   None
#######################################
function launch_experiment() {
    local bids_path="$(pwd)/.output/bids"
    local raw_path="$(pwd)/.output/raw"
    local experiment_name=$1
    local run_num=$2
    local subject_id=$3
    local session_num=$4
    
    echo "### Launching experiment: $experiment_name ###"
    echo "### Subject: $subject_id, Session: $session_num, Run: $run_num ###"

    cmd="expfactory_deploy_local -e "$experiment_name" -raw "$raw_path" -bids "$bids_path" -sub "$subject_id" -ses "$session_num" -run "$run_num""
    echo "$cmd"
    eval "$cmd"
}

#######################################
# Main function
#######################################
function main() {
    # Get available experiments
    fmri_dirs=($(get_fmri_dirs))
    
    # Prompt user for experiment
    selected_experiment=$(prompt_user_for_experiment "${fmri_dirs[@]}")
    
    # Prompt user for metadata
    read run_num subject_id session_num < <(prompt_user_for_metadata)
    
    # Launch the experiment
    launch_experiment "$selected_experiment" "$run_num" "$subject_id" "$session_num"
}

# Execute main function
main