import glob
import os
import sys
import typing
from typing import List
import pandas as pd
import argparse
from utils import (
    ax_cpt,
    cued_ts_spatial_ts,
    flanker_stroop,
    nback,
    gng,
    span,
    spatial_cueing,
    stop_signal,
    visual_search,
)


def create_new_dirs(outdir: str, task_name: str) -> str:
    outdir = os.path.join(outdir, task_name, "designs")
    if not os.path.exists(outdir):
        os.makedirs(outdir)

    return outdir


def clean_events(design_path: str, task_name: str, outdir: str) -> None:
    outdir = create_new_dirs(outdir, task_name)

    pattern = os.path.join(design_path, "*")
    files = sorted(
        [f for f in glob.glob(pattern) if not f.endswith("_assessment_values.csv")]
    )

    func_mapping = {
        "ax_cpt": ax_cpt,
        "cued_ts_spatial_ts": cued_ts_spatial_ts,
        "flanker_stroop": flanker_stroop,
        "gng": gng,
        "nback": nback,
        "span": span,
        "spatial_cueing": spatial_cueing,
        "stop_signal": stop_signal,
        "visual_search": visual_search,
    }

    for index, f in enumerate(files, start=1):
        outpath = os.path.join(outdir, f"design_{index}")

        if not os.path.exists(outpath):
            os.makedirs(outpath)

        func_mapping[task_name](f, outpath)


def main():
    # args
    parser = argparse.ArgumentParser(description="Process some tasks.")
    parser.add_argument(
        "--task",
        type=str,
        default=None,
        help="Name of the task to process",
    )

    # Parse the arguments
    args = parser.parse_args()

    # paths
    raw = "../raw_designs"
    outdir = "../cleaned_designs"

    if not os.path.exists(outdir):
        os.makedirs(outdir)

    design_path = glob.glob(os.path.join(raw, "*"))
    design_dirs = sorted([p for p in design_path if os.path.isdir(p)])

    for design_dir in design_dirs:
        task_name = design_dir.split("/")[-1]

        if task_name == "ax_cpt":
            continue

        # Use this directory instead for ax_cpt
        if task_name == "ax_cpt_4lev_first_2lev_second":
            task_name = "ax_cpt"

        if args.task:
            if not task_name == args.task:
                continue

        clean_events(design_dir, task_name, outdir)


if __name__ == "__main__":
    main()
