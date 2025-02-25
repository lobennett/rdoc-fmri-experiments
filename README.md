# rdoc-fmri-experiments

> This repository contains the tasks used in the RDOC fMRI experiments.

## Documentation

### uv 

[uv](https://docs.astral.sh/uv/getting-started/installation/) is a tool for managing Python environments, dependencies, and projects. Follow the instructions there to install uv. 

### expfactory deploy local

To run this code, you will need to install "expfactory deploy local". This codebase uses a fork of the expfactory deploy local codebase, which can be found [here](https://github.com/lobennett/expfactory-deploy).

The differences between the two codebases are:

- The forked codebase outputs data in a BIDS-like format by allowing the user to specify flags when running the task (see [run.sh](./run.sh#L72)).
- The forked codebase includes the jspsych7 [poldrack-plugins](https://github.com/lobennett/expfactory-deploy/tree/main/expfactory_deploy_local/src/expfactory_deploy_local/static/jspsych7/poldrack-plugins) used to run the fMRI tasks.


### Designs

[Jeanette](https://github.com/jmumford) created the designs for the tasks in [this repository](https://github.com/jmumford/efficiency_model_mockups). She also created a [slidedeck](https://docs.google.com/presentation/d/15qc8DHQ_8VCVIX6gASrjQIuLV7KIRNbVxNnqPzLIUC8/edit?usp=sharing) to visualize the different phases of the tasks.

## Run the tasks 

### Set up the environment

First create a virtual environment in this directory. 

```bash
uv venv --python 3.12.1
```


```bash
uv pip install /path/to/expfactory-deploy/expfactory_deploy_local
```


```bash
# 1. Activates virtual environment in ./.venv
# 2. Select the task you would like to run
# 3. Select the number of participants you would like to run
# 4. Enter subject ID (e.g., s001)
# 5. Enter session ID (e.g., ses-01)
# 6. Enter run ID (e.g., run-01)
# 7. Enter run number (e.g., 1)
# 8. Launches the task in your browser (http://0.0.0.0:8080/)

./run.sh

```
