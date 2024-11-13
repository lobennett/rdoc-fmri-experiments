import pandas as pd
import os

def remove_trailing_newline(filename):
    with open(filename, "rb+") as filehandle:
        filehandle.seek(-1, os.SEEK_END)  # Move to the end of file minus one position
        if filehandle.read(1) == b"\n":  # Check if it ends with a newline
            filehandle.seek(
                -1, os.SEEK_END
            )  # Move to the position of the found newline
            filehandle.truncate()  # Truncate the file to remove the last newline


def calculate_itis(
    df: pd.DataFrame,
    conditions: list,
    blank_screen_sec: float,
    break_fix_pre_duration: float,
    break_fix_post_duration: float,
    within_task_breaks: int,
) -> list:
    ITIs = []
    break_count = 0

    for index, row in df.iterrows():
        if row["trial_type"] == "break_message":
            continue

        if index == 0:
            ITIs.append(row["onset"])
            continue

        if row["trial_type"] in conditions:
            current_onset = row["onset"]
            prev_row = df.iloc[index - 1]

            if prev_row["trial_type"] == "break_message":
                if break_count == within_task_breaks:
                    continue

                last_break = prev_row
                last_break_offset = last_break["onset"] + last_break["duration"]

                ITIs.append(current_onset - last_break_offset - break_fix_post_duration)
                break_count += 1
            else:
                last_stim = prev_row
                last_stim_offset = (
                    last_stim["onset"] + last_stim["duration"] + blank_screen_sec
                )
                ITIs.append(current_onset - last_stim_offset)

    return ITIs


def ax_cpt(path: str, outpath: str):
    df = pd.read_csv(path)
    df.to_csv(os.path.join(outpath, "design.csv"), index=False)
    remove_trailing_newline(os.path.join(outpath, "design.csv"))

    cues_df = df[df["trial_type"].str.startswith("cue_")]
    stims_df = df[df["trial_type"].str.startswith("stim_")]
    delays_df = df[df["trial_type"].str.startswith("delay")]

    cues_df["trial_type"].to_csv(f"{outpath}/cues.txt", index=False, header=False)
    stims_df["trial_type"].to_csv(f"{outpath}/stims.txt", index=False, header=False)
    delays_df["duration"].to_csv(f"{outpath}/delays.txt", index=False, header=False)

    remove_trailing_newline(f"{outpath}/cues.txt")
    remove_trailing_newline(f"{outpath}/stims.txt")
    remove_trailing_newline(f"{outpath}/delays.txt")

    ITIs = calculate_itis(df, ["cue_b", "cue_a"], 0.5, 6, 6, 2)
    pd.Series(ITIs).to_csv(f"{outpath}/ITIs.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/ITIs.txt")


def cued_ts_spatial_ts(path: str, outpath: str):
    df = pd.read_csv(path)
    df.to_csv(os.path.join(outpath, "design.csv"), index=False)
    remove_trailing_newline(os.path.join(outpath, "design.csv"))

    stims_df = df[df["trial_type"].str.startswith("t")]
    stims_df["trial_type"].to_csv(f"{outpath}/stims.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/stims.txt")

    ITIs = calculate_itis(df, ["tst_csw", "tsw_csw", "tst_cst", "start"], 0.5, 6, 6, 2)
    pd.Series(ITIs).to_csv(f"{outpath}/ITIs.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/ITIs.txt")


def flanker_stroop(path: str, outpath: str):
    df = pd.read_csv(path)
    df.to_csv(os.path.join(outpath, "design.csv"), index=False)
    remove_trailing_newline(os.path.join(outpath, "design.csv"))

    conditions = ["congruent", "incongruent"]
    stims_df = df[df["trial_type"].isin(conditions)]
    stims_df["trial_type"].to_csv(f"{outpath}/stims.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/stims.txt")

    ITIs = calculate_itis(df, conditions, 0.5, 6, 6, 2)
    pd.Series(ITIs).to_csv(f"{outpath}/ITIs.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/ITIs.txt")


def nback(path: str, outpath: str):
    df = pd.read_csv(path)
    df.to_csv(os.path.join(outpath, "design.csv"), index=False)
    remove_trailing_newline(os.path.join(outpath, "design.csv"))

    conditions = ["one_back", "two_back", "starter_trial"]
    stims_df = df[df["trial_type"].isin(conditions)]
    stims_df["trial_type"].to_csv(f"{outpath}/stims.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/stims.txt")

    ITIs = calculate_itis(df, conditions, 0.5, 0.5, 0.5, 9)
    pd.Series(ITIs).to_csv(f"{outpath}/ITIs.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/ITIs.txt")


def gng(path: str, outpath: str):
    df = pd.read_csv(path)
    df.to_csv(os.path.join(outpath, "design.csv"), index=False)
    remove_trailing_newline(os.path.join(outpath, "design.csv"))

    conditions = ["go", "nogo"]
    stims_df = df[df["trial_type"].isin(conditions)]
    stims_df["trial_type"].to_csv(f"{outpath}/stims.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/stims.txt")

    ITIs = calculate_itis(df, conditions, 0.5, 6, 6, 2)
    pd.Series(ITIs).to_csv(f"{outpath}/ITIs.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/ITIs.txt")


def span(path: str, outpath: str):
    df = pd.read_csv(path)
    df.to_csv(os.path.join(outpath, "design.csv"), index=False)
    remove_trailing_newline(os.path.join(outpath, "design.csv"))

    ITIs = calculate_itis(df, ["emc"], 0.0, 6, 6, 2)
    pd.Series(ITIs).to_csv(f"{outpath}/ITIs.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/ITIs.txt")


def spatial_cueing(path: str, outpath: str):
    df = pd.read_csv(path)
    df.to_csv(os.path.join(outpath, "design.csv"), index=False)
    remove_trailing_newline(os.path.join(outpath, "design.csv"))

    conditions = [
        "cue_cti_stim_invalid_cue_400",
        "cue_cti_stim_valid_cue_400",
        "cue_cti_stim_double_cue_400",
        "cue_cti_stim_no_cue_400",
    ]
    stims_df = df[df["trial_type"].isin(conditions)]
    stims_df["trial_type"].to_csv(f"{outpath}/stims.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/stims.txt")

    ITIs = calculate_itis(df, conditions, 0.5, 6, 6, 2)
    pd.Series(ITIs).to_csv(f"{outpath}/ITIs.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/ITIs.txt")


def stop_signal(path: str, outpath: str):
    df = pd.read_csv(path)
    df.to_csv(os.path.join(outpath, "design.csv"), index=False)
    remove_trailing_newline(os.path.join(outpath, "design.csv"))

    conditions = ["go", "stop"]
    stims_df = df[df["trial_type"].isin(conditions)]
    stims_df["trial_type"].to_csv(f"{outpath}/stims.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/stims.txt")

    ITIs = calculate_itis(df, conditions, 0.5, 6, 6, 2)
    pd.Series(ITIs).to_csv(f"{outpath}/ITIs.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/ITIs.txt")


def visual_search(path: str, outpath: str):
    df = pd.read_csv(path)
    df.to_csv(os.path.join(outpath, "design.csv"), index=False)
    remove_trailing_newline(os.path.join(outpath, "design.csv"))

    conditions = ["con_high", "con_low", "feat_high", "feat_low"]
    stims_df = df[df["trial_type"].isin(conditions)]
    stims_df["trial_type"].to_csv(f"{outpath}/stims.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/stims.txt")

    ITIs = calculate_itis(df, conditions, 0.5, 6, 6, 2)
    pd.Series(ITIs).to_csv(f"{outpath}/ITIs.txt", index=False, header=False)
    remove_trailing_newline(f"{outpath}/ITIs.txt")