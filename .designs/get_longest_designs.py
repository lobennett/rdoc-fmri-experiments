import pandas as pd
import glob
import os


def main():
    task_dirs = glob.glob(os.path.join("..", "*__fmri"))
    longest_designs_by_task = {}
    for t in task_dirs:
        designs, longest_design = glob.glob(os.path.join(t, "designs", "design_*", "design.csv")), None
        for d in designs:
            df = pd.read_csv(d)
            last_onset = df["onset"].max()
            if longest_design is None:
                longest_design = (d, last_onset)
            elif last_onset > longest_design[1]:
                longest_design = (d, last_onset)
        longest_designs_by_task[t] = longest_design
    
    design_names = [d[0] for d in longest_designs_by_task.values()]
    
    temp = pd.DataFrame(columns=["task_name", "design_number", "design_name"])
    for d in design_names:
        task_name = d.split("/")[1]
        design_number = d.split("/")[3]
        temp = pd.concat([temp, pd.DataFrame([{
            "task_name": task_name,
            "design_number": design_number,
            "design_name": d
        }])], ignore_index=True)
    
    temp = temp.sort_values(by=["task_name"])
    temp.to_csv("longest_designs.csv", index=False)

    return

if __name__ == "__main__":
    main()