# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "gspread",
#     "gspread-pandas",
#     "oauth2client",
#     "pandas",
# ]
# ///

import gspread
import pandas as pd
import subprocess
import ast
from gspread.exceptions import SpreadsheetNotFound, WorksheetNotFound


def get_task_mapping():
    """Map abbreviated task names from the sheet to full experiment folder names"""
    return {
        'spatialTS': 'spatial_task_switching',
        'cuedTS': 'cued_task_switching',  
        'visualSearch': 'visual_search',
        'simpleSpan': 'simple_span',
        'opOnlySpan': 'operation_only_span',
        'opSpan': 'operation_span',
        'flanker': 'flanker',
        'goNogo': 'go_nogo',
        'axCPT': 'ax_cpt',
        'spatialCueing': 'spatial_cueing',
        'stroop': 'stroop',
        'nBack': 'n_back',
        'stopSignal': 'stop_signal'
    }


def main() -> None:
    print("Hello from setup.py!")

    CREDENTIALS_FILE = "credentials.json"
    SPREADSHEET_NAME = "r01_rdoc_participant_tracking"
    WORKSHEET_NAME = "counterbalancing"

    try:
        # Step 1: Authenticate using the gspread library
        client = gspread.service_account(filename=CREDENTIALS_FILE)

        # Step 2: Open the spreadsheet using the gspread client
        spreadsheet = client.open(SPREADSHEET_NAME)
        print(f"Successfully opened spreadsheet: '{SPREADSHEET_NAME}'")

        # Step 3: Access the worksheet directly
        worksheet = spreadsheet.worksheet(WORKSHEET_NAME)
        print(f"Successfully opened worksheet: '{WORKSHEET_NAME}'")

        # Step 4: Convert worksheet to DataFrame
        data = worksheet.get_all_records()
        df = pd.DataFrame(data)
        print("Successfully loaded worksheet into DataFrame!")

        # Get user input
        subject_id = input("Enter subject ID (e.g., s1): ").strip()
        session_input = input("Enter session (e.g., 1, 01, or ses-01): ").strip()
        
        # Ask about anatomical runs first
        is_anatomical = input("Are you running anatomicals? (y/n): ").strip().lower() == 'y'
        is_prescan = False
        
        if not is_anatomical:
            # Only ask about prescan if not running anatomicals
            is_prescan = input("Are you loading prescan tasks? (y/n): ").strip().lower() == 'y'

        # Normalize session input to ses-XX format
        if session_input.startswith("ses-"):
            session_col = session_input
        else:
            # Remove any leading zeros and convert to int, then format as ses-XX
            session_num = int(session_input)
            session_col = f"ses-{session_num:02d}"

        # Override session for anatomical runs
        if is_anatomical:
            # Force session to ses-02 for anatomical runs
            session_col = "ses-02"
            print(f"Anatomical run detected - loading practice tasks from {session_col}")
        
        print(f"Looking for subject '{subject_id}' in session '{session_col}'...")

        # Find matching row
        if "subject_id" not in df.columns:
            print("Error: 'subject_id' column not found in spreadsheet")
            print("Available columns:", df.columns.tolist())
            return

        if session_col not in df.columns:
            print(f"Error: Session column '{session_col}' not found in spreadsheet")
            print(
                "Available session columns:",
                [col for col in df.columns if col.startswith("ses-")],
            )
            return

        matching_rows = df[df["subject_id"] == subject_id]

        if matching_rows.empty:
            print(f"No rows found for subject ID '{subject_id}'")
            print("Available subject IDs:", df["subject_id"].unique().tolist())
            return

        # Get the specific session data for the subject
        subject_row = matching_rows.iloc[0]
        session_data = subject_row[session_col]

        print(f"\nFound subject '{subject_id}':")
        print(f"Session {session_col}: {session_data}")
        
        # Parse the session data array
        try:
            if isinstance(session_data, str):
                # Parse the string representation of the array
                tasks_array = ast.literal_eval(session_data)
            else:
                tasks_array = session_data
                
            if not tasks_array:
                print("No tasks found for this session.")
                return
                
            # Get task name mapping
            task_mapping = get_task_mapping()
                
            # Determine task type based on user input
            task_type = ""
            if is_anatomical:
                task_type = " (anatomical - practice versions from session 2)"
            elif is_prescan:
                task_type = " (prescan - practice versions)"
            else:
                task_type = " (regular session - from sheet)"
                
            print(f"\nFound {len(tasks_array)} tasks for {subject_id} in {session_col}{task_type}:")
            for i, task in enumerate(tasks_array, 1):
                if len(task) >= 3:
                    sheet_task_name, run_num, original_practice_flag = task[0], task[1], task[2]
                    
                    # Map sheet name to full experiment name
                    if sheet_task_name in task_mapping:
                        mapped_task_name = task_mapping[sheet_task_name]
                    else:
                        print(f"Warning: Unknown task name '{sheet_task_name}' - using as-is")
                        mapped_task_name = sheet_task_name
                    
                    # Override practice flag based on run type
                    if is_anatomical or is_prescan:
                        # Force practice versions for anatomical and prescan runs
                        practice_str = "_practice"
                        task_description = f"{mapped_task_name}_rdoc_practice__fmri (run {run_num}) [PRACTICE VERSION]"
                    else:
                        # Use original practice flag from sheet
                        practice_str = "_practice" if original_practice_flag == "1" else ""
                        task_description = f"{mapped_task_name}_rdoc{practice_str}__fmri (run {run_num})"
                        if original_practice_flag == "1":
                            task_description += " [PRACTICE VERSION]"
                    
                    print(f"{i}. {task_description}")
                    
        except (ValueError, SyntaxError) as e:
            print(f"Error parsing session data: {e}")
            print("Raw session data:", session_data)
            return
            
        # Ask user if they want to execute the tasks
        execute_choice = input(f"\nExecute all {len(tasks_array)} tasks for {subject_id} session {session_col}? (y/n): ").strip().lower()
        
        if execute_choice != 'y':
            print("Execution cancelled.")
            return
            
        # Execute each task
        print(f"\n### Starting execution for {subject_id} session {session_col} ###\n")
        
        for i, task in enumerate(tasks_array, 1):
            if len(task) >= 3:
                sheet_task_name, run_num, original_practice_flag = task[0], task[1], task[2]
                
                # Map sheet name to full experiment name
                if sheet_task_name in task_mapping:
                    mapped_task_name = task_mapping[sheet_task_name]
                else:
                    print(f"Warning: Unknown task name '{sheet_task_name}' - using as-is")
                    mapped_task_name = sheet_task_name
                
                # Override practice flag based on run type
                if is_anatomical or is_prescan:
                    # Force practice versions for anatomical and prescan runs
                    practice_str = "_practice"
                else:
                    # Use original practice flag from sheet
                    practice_str = "_practice" if original_practice_flag == "1" else ""
                    
                full_task_name = f"{mapped_task_name}_rdoc{practice_str}__fmri"
                
                print(f"### Task {i}/{len(tasks_array)}: {full_task_name} ###")
                print(f"### Subject: {subject_id}, Session: {session_num}, Run: {run_num} ###")
                
                # Build the command with virtual environment activation
                expfactory_cmd = f"expfactory_deploy_local -e {full_task_name} -raw /Users/loganbennett/rdoc-fmri-experiments/.output/raw -bids /Users/loganbennett/rdoc-fmri-experiments/.output/bids -sub {subject_id} -ses {session_num} -run {run_num}"
                
                # Create a bash command that sources the virtual environment first
                bash_cmd = f"cd /Users/loganbennett/rdoc-fmri-experiments && source ./.venv/bin/activate && {expfactory_cmd}"
                
                # Create a terminal command to open in new window
                terminal_title = f"{full_task_name}_s{subject_id}_ses{session_num}_run{run_num}"
                terminal_cmd = f'''osascript -e 'tell application "Terminal" to do script "echo \\"### {full_task_name} ###\\"; echo \\"### Subject: {subject_id}, Session: {session_num}, Run: {run_num} ###\\"; {bash_cmd}"' '''
                
                print(f"Opening new terminal for: {full_task_name}")
                print(f"Command: {expfactory_cmd}")
                
                try:
                    # Execute the terminal command to open new window
                    result = subprocess.run(terminal_cmd, shell=True, capture_output=True, text=True)
                    
                    if result.returncode == 0:
                        print(f"✅ Task {i} started in new terminal window")
                        print(f"   Terminal title: {terminal_title}")
                    else:
                        print(f"❌ Failed to open terminal for task {i}")
                        if result.stderr:
                            print("Error:", result.stderr.strip())
                            
                except Exception as e:
                    print(f"❌ Unexpected error opening terminal for task {i}: {e}")
                    
                print("-" * 50)
                
        print(f"\n### All tasks completed for {subject_id} session {session_col} ###")

    except FileNotFoundError:
        print(f"ERROR: Credentials file not found at '{CREDENTIALS_FILE}'.")
        print("Make sure the file is in the same directory as your script.")
    except SpreadsheetNotFound:
        print(f"ERROR: Spreadsheet named '{SPREADSHEET_NAME}' not found.")
        print("1. Check for typos in the SPREADSHEET_NAME variable.")
        print(
            "2. Ensure the sheet has been shared with the service account's client_email."
        )
    except WorksheetNotFound:
        print(f"ERROR: Worksheet named '{WORKSHEET_NAME}' not found.")
        print("Check the worksheet name in your spreadsheet.")
    except ValueError as e:
        print(f"ERROR: Invalid input - {e}")
        print("Please enter a valid session number (e.g., 9, 09, or ses-09)")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        print("\nCommon issues to check:")
        print("1. Is the Google Sheets API enabled in your Google Cloud project?")
        print("2. Is the Google Drive API enabled in your Google Cloud project?")
        print(
            f"3. Have you shared your Google Sheet ('{SPREADSHEET_NAME}') with the client_email from your credentials file?"
        )


if __name__ == "__main__":
    main()
