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
        "spatialTS": "spatial_task_switching",
        "cuedTS": "cued_task_switching",
        "visualSearch": "visual_search",
        "simpleSpan": "simple_span",
        "opOnlySpan": "operation_only_span",
        "opSpan": "operation_span",
        "flanker": "flanker",
        "goNogo": "go_nogo",
        "axCPT": "ax_cpt",
        "spatialCueing": "spatial_cueing",
        "stroop": "stroop",
        "nBack": "n_back",
        "stopSignal": "stop_signal",
    }


def main() -> None:
    print("Hello from setup.py!")

    CREDENTIALS_FILE = "credentials.json"
    SPREADSHEET_NAME = "r01_rdoc_participant_tracking"
    WORKSHEET_NAME = "counterbalancing"

    try:
        # Authenticate using the gspread library
        client = gspread.service_account(filename=CREDENTIALS_FILE)
        spreadsheet = client.open(SPREADSHEET_NAME)
        print(f"Successfully opened spreadsheet: '{SPREADSHEET_NAME}'")
        worksheet = spreadsheet.worksheet(WORKSHEET_NAME)
        print(f"Successfully opened worksheet: '{WORKSHEET_NAME}'")

        # Get all records from the worksheet
        data = worksheet.get_all_records()
        df = pd.DataFrame(data)
        print("Successfully loaded worksheet into DataFrame!")

        # Get user input
        subject_id = input("Enter subject ID (e.g., s1): ").strip()
        session_input = input("Enter session (e.g., 1, 01, or anat): ").strip()

        # Determine run type based on session input
        is_anatomical = session_input.lower() == "anat"
        is_prescan = False

        if is_anatomical:
            # For anatomical runs, use ses-02 tasks but save with "anat" session path
            session_col = "ses-02"
            print("Anatomical run detected - loading practice tasks from ses-02")
        else:
            # Ask about prescan for non-anatomical sessions
            is_prescan = (
                input("Are you loading prescan tasks? (y/n): ").strip().lower() == "y"
            )
            
            # Normalize session input to ses-XX format
            if session_input.startswith("ses-"):
                session_col = session_input
            else:
                # Remove any leading zeros and convert to int, then format as ses-XX
                session_num = int(session_input)
                session_col = f"ses-{session_num:02d}"

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

            print(
                f"\nFound {len(tasks_array)} tasks for {subject_id} in {session_col}{task_type}:"
            )
            for i, task in enumerate(tasks_array, 1):
                if len(task) >= 3:
                    sheet_task_name, run_num, original_practice_flag = (
                        task[0],
                        task[1],
                        task[2],
                    )

                    # Map sheet name to full experiment name
                    if sheet_task_name in task_mapping:
                        mapped_task_name = task_mapping[sheet_task_name]
                    else:
                        print(
                            f"Warning: Unknown task name '{sheet_task_name}' - using as-is"
                        )
                        mapped_task_name = sheet_task_name

                    # Override practice flag based on run type
                    if is_anatomical or is_prescan:
                        # Force practice versions for anatomical and prescan runs
                        practice_str = "_practice"
                        task_description = f"{mapped_task_name}_rdoc_practice__fmri (run {run_num}) [PRACTICE VERSION]"
                    else:
                        # For regular sessions, always use non-practice versions (ignore original_practice_flag)
                        practice_str = ""
                        task_description = f"{mapped_task_name}_rdoc__fmri (run {run_num})"

                    print(f"{i}. {task_description}")

        except (ValueError, SyntaxError) as e:
            print(f"Error parsing session data: {e}")
            print("Raw session data:", session_data)
            return

        # Ask user if they want to execute the tasks
        execute_choice = (
            input(
                f"\nExecute all {len(tasks_array)} tasks for {subject_id} session {session_col}? (y/n): "
            )
            .strip()
            .lower()
        )

        if execute_choice != "y":
            print("Execution cancelled.")
            return

        # Execute each task in separate terminals with delays
        print(
            f"\n### Starting parallel execution for {subject_id} session {session_col} ###\n"
        )
        print(
            f"Will launch {len(tasks_array)} separate terminals with 3-second delays between each launch"
        )

        import time

        for i, task in enumerate(tasks_array, 1):
            if len(task) >= 3:
                sheet_task_name, run_num, original_practice_flag = (
                    task[0],
                    task[1],
                    task[2],
                )

                # Map sheet name to full experiment name
                if sheet_task_name in task_mapping:
                    mapped_task_name = task_mapping[sheet_task_name]
                else:
                    print(
                        f"Warning: Unknown task name '{sheet_task_name}' - using as-is"
                    )
                    mapped_task_name = sheet_task_name

                # Override practice flag based on run type
                if is_anatomical or is_prescan:
                    # Force practice versions for anatomical and prescan runs
                    practice_str = "_practice"
                else:
                    # For regular sessions, always use non-practice versions (ignore original_practice_flag)
                    practice_str = ""

                full_task_name = f"{mapped_task_name}_rdoc{practice_str}__fmri"

                # Determine session path for expfactory command
                if is_anatomical:
                    session_path = "anat"
                elif is_prescan:
                    # For prescan, extract session number from original input
                    if session_input.startswith("ses-"):
                        session_num = int(session_input.split("-")[1])
                    else:
                        session_num = int(session_input)
                    session_path = f"prescan{session_num}"
                else:
                    # For regular sessions, extract session number from original input
                    if session_input.startswith("ses-"):
                        session_num = int(session_input.split("-")[1])
                    else:
                        session_num = int(session_input)
                    session_path = str(session_num)

                print(
                    f"### Launching Task {i}/{len(tasks_array)}: {full_task_name} ###"
                )
                print(f"### Subject: {subject_id}, Session: {session_path}, Run: 1 ###")

                # Build the command with virtual environment activation
                expfactory_cmd = f"expfactory_deploy_local -e {full_task_name} -raw /Users/loganbennett/rdoc-fmri-experiments/.output/raw -bids /Users/loganbennett/rdoc-fmri-experiments/.output/bids -sub {subject_id} -ses {session_path} -run 1"

                # Create a bash command that sources the virtual environment first and cleans up any existing static symlink
                bash_cmd = f"cd /Users/loganbennett/rdoc-fmri-experiments && rm -f ./static && source ./.venv/bin/activate && {expfactory_cmd}"

                # Create a terminal command to open in new window (equivalent to bash run.sh)
                terminal_title = (
                    f"{full_task_name}_sub-{subject_id}_ses-{session_path}_run-1"
                )
                terminal_cmd = f"""osascript -e 'tell application "Terminal" to do script "echo \\"### {full_task_name} ###\\"; echo \\"### Subject: {subject_id}, Session: {session_path}, Run: 1 ###\\"; {bash_cmd}"' """

                print(f"Opening terminal {i} for: {full_task_name}")
                print(f"Command: {expfactory_cmd}")
                print("Terminal will find available port automatically")

                try:
                    # Execute the terminal command to open new window
                    result = subprocess.run(
                        terminal_cmd, shell=True, capture_output=True, text=True
                    )

                    if result.returncode == 0:
                        print(f"✅ Terminal {i} launched successfully")
                        print(f"   Terminal title: {terminal_title}")
                    else:
                        print(f"❌ Failed to launch terminal {i}")
                        if result.stderr:
                            print("Error:", result.stderr.strip())

                except Exception as e:
                    print(f"❌ Unexpected error launching terminal {i}: {e}")

                print("-" * 50)

                # Wait 3 seconds before launching next terminal (except for the last one)
                if i < len(tasks_array):
                    print("Waiting 3 seconds before launching next terminal...")
                    time.sleep(3)

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
