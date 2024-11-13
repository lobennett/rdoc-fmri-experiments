import pandas as pd
import json
import os

def main():
    # I am using using this script for testing purposes. 
    # It lets me quickly convert raw JSON files to CSV files for each task.
    # This is useful to see what the data looks like to make sure the experiment is working as expected.
    print("Converting all raw JSON files in ./raw/ to CSV files in ./out/")
    out_dir = "./out"
    in_dir = "./raw/"
    
    for filename in os.listdir(in_dir):
        if filename.endswith('.json'):
            task_name = filename.split('__fmri')[0].removeprefix('raw/')
            with open(os.path.join(in_dir, filename), 'r') as f:
                data = json.load(f)

                trialdata = json.loads(data['trialdata'])

                df = pd.DataFrame(trialdata)

                df.to_csv(f"{out_dir}/{task_name}.csv", index=False)

    print("Done!")


if __name__ == '__main__':
    main()
