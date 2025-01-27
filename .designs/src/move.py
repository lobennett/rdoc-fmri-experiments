import glob
import os
import shutil
import typing
from typing import List, Union


def get_destination(task_name: str) -> Union[str, List[str]]:
    task_mapping = {
        "ax_cpt": "ax_cpt_rdoc__fmri",
        "cued_ts_spatial_ts": [
            "cued_task_switching_rdoc__fmri",
            "spatial_task_switching_rdoc__fmri",
        ],
        "flanker_stroop": ["flanker_rdoc__fmri", "stroop_rdoc__fmri"],
        "gng": "go_nogo_rdoc__fmri",
        "nback": "n_back_rdoc__fmri",
        "span": [
            "operation_span_rdoc__fmri",
            "simple_span_rdoc__fmri",
            "operation_only_span_rdoc__fmri",
        ],
        "spatial_cueing": "spatial_cueing_rdoc__fmri",
        "stop_signal": "stop_signal_rdoc__fmri",
        "visual_search": "visual_search_rdoc__fmri",
    }

    dest_name = task_mapping.get(task_name)
    if dest_name is None:
        raise ValueError(f"Unknown task name: {task_name}")

    return dest_name


def main():
    # paths
    source = "../cleaned_designs"
    source_dirs = glob.glob(os.path.join(source, "*"))

    for s in source_dirs:
        task_name = s.split("/")[-1]
        designs = glob.glob(os.path.join(s, "*"))
        destination = get_destination(task_name)

        if isinstance(destination, list):
            for d in destination:
                src_path = os.path.join("../../", d)
                if not os.path.exists(src_path):
                    os.makedirs(src_path, exist_ok=True)
                for design in designs:
                    dest_path = os.path.join(src_path, os.path.basename(design))
                    shutil.copytree(design, dest_path, dirs_exist_ok=True)
        else:
            src_path = os.path.join("../../", destination)
            if not os.path.exists(src_path):
                os.makedirs(src_path, exist_ok=True)
            for design in designs:
                dest_path = os.path.join(src_path, os.path.basename(design))
                shutil.copytree(design, dest_path, dirs_exist_ok=True)


if __name__ == "__main__":
    main()
