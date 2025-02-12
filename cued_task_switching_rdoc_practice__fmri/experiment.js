/* ********** GETTERS ****************** */
const get_practice_feedback = () => {
  var last = jsPsych.data.get().last(1).values()[0];
  if (last.response === -1) {
    return '<div class=center-box><div class=center-text><font size =20>Respond Faster!</font></div></div>';
  } else if (last.correct_trial == 1) {
    return '<div class=center-box><div class=center-text><font size =20>Correct!</font></div></div>';
  } else {
    return '<div class=center-box><div class=center-text><font size =20>Incorrect</font></div></div>';
  }
};

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

const getExpStage = () => expStage;

const setCTI = () => CTI;

const getCTI = () => CTI;

var taskSwitch = '';

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function () {
  var currTrial = jsPsych.getProgress().current_trial_global;
  var trialID = jsPsych.data.get().filter({ trial_index: currTrial })
    .trials[0].trial_id;
  var trialNum = currentTrial - 1;
  var taskSwitch = taskSwitches[trialNum];

  let combinedCondition =
    'task_' + taskSwitch.task_switch + '_cue_' + taskSwitch.cue_switch;

  jsPsych.data.get().addToLast({
    cue: currCue,
    trial_id: trialID,
    stim_number: currStim.number,
    task: currTask,
    task_condition: taskSwitch.task_switch,
    cue_condition: taskSwitch.cue_switch,
    condition: combinedCondition,
    current_trial: trialNum,
    correct_response: correctResponse,
    CTI: CTI,
    block_num: getExpStage() == 'practice' ? practiceCount : testCount,
  });

  if (trialID == 'practice_trial' || trialID == 'test_trial') {
    correctTrial = 0;
    if (jsPsych.data.get().last().trials[0].response == correctResponse) {
      correctTrial = 1;
    }
    jsPsych.data.get().addToLast({
      correct_trial: correctTrial,
    });

    console.log(jsPsych.data.get().last().trials[0]);
  }
};

const getCue = () => `
  <div class="upperbox">
    <div class="center-text" style="color:white;">${currCue}</div>
  </div>
  <div class="lowerbox">
    <div class="fixation">+</div>
  </div>
`;

const getStim = () => `
  <div class="upperbox">
    <div class="center-text" style="color:white;">${currCue}</div>
  </div>
  <div class="lowerbox">
    <div class="stim_number">
      <div class="cue-text">${preFileType}${currStim.number}${fileTypePNG}</div>
    </div>
  </div>
`;

const getCurrBlockNum = () =>
  getExpStage() === 'practice' ? practiceCount : testCount;

var randomDraw = function (lst) {
  var index = Math.floor(Math.random() * lst.length);
  return lst[index];
};

const parse_design = (designs) => {
  console.log('Parsing stim designs...');
  let parsed_designs = [];

  for (let i = 0; i < designs.length; i++) {
    let design = designs[i];

    if (design === 'tst_cst') {
      parsed_designs.push({ task_switch: 'stay', cue_switch: 'stay' });
    } else if (design === 'tst_csw') {
      parsed_designs.push({ task_switch: 'stay', cue_switch: 'switch' });
    } else if (design === 'tsw_csw') {
      parsed_designs.push({ task_switch: 'switch', cue_switch: 'switch' });
    } else {
      console.log('Invalid design: ', design);
    }
  }

  return parsed_designs;
};

// Task Specific Functions
var getKeys = function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }
  return keys;
};

var genStims = function (n) {
  stims = [];
  for (var i = 0; i < n; i++) {
    var number = randomDraw('12346789');
    var stim = {
      number: parseInt(number),
    };
    stims.push(stim);
  }
  return stims;
};

var setStims = function () {
  var tmp;
  switch (taskSwitches[currentTrial].task_switch) {
    case 'na':
      tmp = currTask;
      currTask = randomDraw(getKeys(tasks));
      cueI = randomDraw([0, 1]);
      break;
    case 'stay':
      if (currTask == 'na') {
        tmp = currTask;
        currTask = randomDraw(getKeys(tasks));
      }
      if (taskSwitches[currentTrial].cue_switch == 'switch') {
        cueI = 1 - cueI;
      }
      break;
    case 'switch':
      taskSwitches[currentTrial].cue_switch = 'switch';
      cueI = randomDraw([0, 1]);
      if (lastTask == 'na') {
        tmp = currTask;
        currTask = randomDraw(
          getKeys(tasks).filter(function (x) {
            return x != currTask;
          })
        );
        lastTask = tmp;
      } else {
        tmp = currTask;
        currTask = getKeys(tasks).filter(function (x) {
          return x != currTask;
        })[0];
        lastTask = tmp;
      }
      break;
    case 'switch_old':
      taskSwitches[currentTrial].cue_switch = 'switch';
      cueI = randomDraw([0, 1]);
      if (lastTask == 'na') {
        tmp = currTask;
        currTask = randomDraw(
          getKeys(tasks).filter(function (x) {
            return x != currTask;
          })
        );
        lastTask = tmp;
      } else {
        tmp = currTask;
        currTask = lastTask;
        lastTask = tmp;
      }
      break;
  }
  currCue = tasks[currTask].cues[cueI];
  currStim = stims[currentTrial];
  currentTrial = currentTrial + 1;
  CTI = setCTI();
  correctResponse = getResponse();
};

// Returns the key corresponding to the correct response for the current
// task and stim
var getResponse = function () {
  switch (currTask) {
    case 'magnitude':
      if (currStim.number > 5) {
        return responseMappings.higherLower.higher;
      } else {
        return responseMappings.higherLower.lower;
      }
    case 'parity':
      if (currStim.number % 2 === 0) {
        return responseMappings.oddEven.even;
      } else {
        return responseMappings.oddEven.odd;
      }
  }
};

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
const fixationDuration = 500;

//TODO: check motor perm logic
function getKeyMappingForTask(motor_perm) {
  var mappings;

  // Sort out key mappings here
  if (motor_perm <= 1) {
    if (motor_perm === 0) {
      // Index is high and odd
      mappings = {
        higherLower: { higher: ',', lower: '.' },
        oddEven: { odd: ',', even: '.' },
      };
    } else {
      // Index is high and even
      mappings = {
        higherLower: { higher: ',', lower: '.' },
        oddEven: { odd: '.', even: ',' },
      };
    }
  } else {
    if (motor_perm === 2) {
      // Index is low and odd
      mappings = {
        higherLower: { higher: '.', lower: ',' },
        oddEven: { odd: ',', even: '.' },
      };
    } else {
      // Index is low and even
      mappings = {
        higherLower: { higher: '.', lower: ',' },
        oddEven: { odd: '.', even: ',' },
      };
    }
  }
  return mappings;
}

var responseMappings;
var choices = [',', '.'];

var promptText;
var promptTextList;
var speedReminder;
var feedbackText;

const setText = () => {
  speedReminder = `
  <p class="block-text">
    Try to respond as quickly and accurately as possible.
  </p>
`;

  promptText = `
  <div class="prompt_box">
    <p class="center-block-text" style="font-size:16px; line-height:80%;">
      Index: ${responseMappings.oddEven.odd === ',' ? 'Odd' : 'Even'}/${
    responseMappings.higherLower.higher === ',' ? 'High' : 'Low'
  }
    </p>
    <p class="center-block-text" style="font-size:16px; line-height:80%;">
      Middle: ${responseMappings.oddEven.odd === ',' ? 'Even' : 'Odd'}/${
    responseMappings.higherLower.higher === ',' ? 'Low' : 'High'
  }
    </p>
  </div>
`;

  promptTextList = `
  <ul style="text-align:left;font-size:24px;">
    <li>Index: ${responseMappings.oddEven.odd === ',' ? 'Odd' : 'Even'}/${
    responseMappings.higherLower.higher === ',' ? 'High' : 'Low'
  }</li>
    <li>Middle: ${responseMappings.oddEven.odd === ',' ? 'Even' : 'Odd'}/${
    responseMappings.higherLower.higher === ',' ? 'Low' : 'High'
  }</li>
  </ul>
`;

  feedbackText = `
  <div class="centerbox">
    <p class="block-text">During this task, you will respond to a sequence of numbers.</p>
    <p class="block-text">Your response will depend on the current task, which can change each trial. On some trials, you will have to indicate whether the number is <b>odd or even</b>, and on other trials, you will indicate whether the number is <b>higher or lower than 5</b>. Each trial will start with a cue telling you which task to do on that trial.</p>
    <p class="block-text">The cue before the number will be a word indicating the task. There will be <b>four</b> different cues indicating <b>two</b> different tasks. The cues and tasks are described below:</p>
    ${promptTextList}
    <p class="block-text">We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
    ${speedReminder}
  </div>
`;
};
// *: Timing
// stimuli
const stimStimulusDuration = 1000;
const stimTrialDuration = 1500;

/* ******************************* */
/* THRESHOLD STUFF  */
/* ******************************* */
var sumInstructTime = 0; // ms
var instructTimeThresh = 5; // /in seconds

/* ******************************* */
/* TASK TEXT */
/* ******************************* */

var practiceLen = 4;
var numTrialsPerBlock = 64;
var numTestBlocks = 3;
var expStage = 'practice';

var practiceThresh = 3;
var rtThresh = 750;
var missedResponseThresh = 0.1;
var accuracyThresh = 0.8; // min acc for block-level feedback
var practiceAccuracyThresh = 0.75; // min acc to proceed to test blocks

var fileTypePNG = ".png'></img>";
var preFileType =
  "<img class = center src='/static/experiments/cued_task_switching_rdoc_practice__fmri/images/";

var tasks = {
  parity: {
    task: 'parity',
    cues: ['Parity', 'Odd-Even'],
  },
  magnitude: {
    task: 'magnitude',
    cues: ['Magnitude', 'High-Low'],
  },
};

var taskSwitchesArr = [
  { task_switch: 'stay', cue_switch: 'stay' },
  { task_switch: 'stay', cue_switch: 'switch' },
  { task_switch: 'switch', cue_switch: 'switch' },
  { task_switch: 'switch', cue_switch: 'switch' },
];

var currTask = randomDraw(getKeys(tasks));
var lastTask = 'na'; // object that holds the last task, set by setStims()
var currCue = 'na'; // object that holds the current cue, set by setStims()
var cueI = randomDraw([0, 1]); // index for one of two cues of the current task
var currStim = 'na'; // object that holds the current stim, set by setStims()
var currentTrial = 0;
var CTI = 150; // cue-target-interval or cue's length (7/29, changed from 300 to 150; less time to process the cue should increase cue switch costs and task switch costs)

// PRE LOAD IMAGES HERE
var pathSource =
  '/static/experiments/cued_task_switching_rdoc_practice__fmri/images/';
var numbersPreload = ['1', '2', '3', '4', '6', '7', '8', '9'];
var images = [];
for (i = 0; i < numbersPreload.length; i++) {
  images.push(pathSource + numbersPreload[i] + '.png');
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// *** ITI *** //
var ITIms = null;

var ITIBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div class="upperbox">
              <div class="center-text" style="color:white;">+</div>
            </div>
            <div class="lowerbox">
              <div class="fixation">+</div>
            </div>`,
  is_html: true,
  response_ends_trial: false,
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_ITI`,
      ITIParams:
        stage === 'practice' ? { min: 0.5, max: 5.5, mean: 1.0 } : null,
      block_num: stage === 'practice' ? 0 : testCount,
      exp_stage: stage,
    };
  },
  trial_duration: function () {
    ITIms =
      getExpStage() === 'practice'
        ? sampleFromDecayingExponential(1, 0.5, 5.5)
        : ITIs.shift();
    return ITIms * 1000;
  },
  prompt: function () {
    return getExpStage() == 'practice' ? promptText : '';
  },
  on_finish: function (data) {
    data['trial_duration'] = ITIms * 1000;
    data['stimulus_duration'] = ITIms * 1000;
  },
};

var motor_perm = null;
var design_perm = null;
var motor_and_design_perm_block = {
  type: jsPsychSurvey,
  pages: [
    [
      {
        type: 'html',
        prompt: 'fMRI setup',
      },
      {
        type: 'multi-choice',
        prompt: 'Select the motor perm:',
        name: 'motor_perm',
        options: [0, 1, 2, 3],
        required: true,
      },
      {
        type: 'multi-choice',
        prompt: 'Select the design perm:',
        name: 'design_perm',
        options: [1, 2, 3, 4, 5],
        required: true,
      },
    ],
  ],
  button_label_finish: 'Submit',
  on_finish: function (data) {
    // save response to data object
    data['motor_perm'] = data.response.motor_perm;
    data['design_perm'] = data.response.design_perm;

    // set global variables for use in other functions
    motor_perm = data.response.motor_perm;
    design_perm = data.response.design_perm;

    responseMappings = getKeyMappingForTask(motor_perm);
    setText();
  },
};

var setStimsBlock = {
  type: jsPsychCallFunction,
  data: {
    trial_id: 'set_stims',
    trial_duration: null,
  },
  func: setStims,
};

var feedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_feedback`,
      exp_stage: stage,
      trial_duration: 4000,
      block_num: stage === 'practice' ? 0 : testCount,
    };
  },
  choices: [' '],
  stimulus: getFeedback,
  response_ends_trial: true,
  on_finish: function (data) {
    data['block_level_feedback'] = block_level_feedback;
  },
};

var feedback_node = {
  timeline: [feedbackBlock],
  conditional_function: function () {
    const { trial_id } = jsPsych.data.get().last().trials[0];
    if (trial_id === 'fmri_wait_block_trigger_end') return false;

    return true;
  },
};

var long_fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    '<div class = upperbox><div class = fixation>+</div></div><div class = lowerbox><div class = fixation>+</div></div>',
  response_ends_trial: false,
  data: function () {
    return {
      trial_id: 'test_long_fixation',
      exp_stage: 'test',
      trial_duration: 6000,
      stimulus_duration: 6000,
      block_num: testCount,
    };
  },
  stimulus_duration: 6000,
  trial_duration: 6000,
};

var long_fixation_node = {
  timeline: [long_fixation],
  conditional_function: function () {
    const { trial_id } = jsPsych.data.get().last().trials[0];
    if (trial_id === 'fmri_wait_block_trigger_end') return false;

    return true;
  },
};

var practiceTrials = [];
for (var i = 0; i < practiceLen + 1; i++) {
  var practiceCueBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCue,
    response_ends_trial: false,
    data: {
      trial_id: 'practice_cue',
      exp_stage: 'practice',
      trial_duration: getCTI(),
      stimulus_duration: getCTI(),
    },
    trial_duration: getCTI,
    stimulus_duration: getCTI,
    prompt: () => promptText,
    on_finish: appendData,
  };

  var practiceTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: choices,
    data: {
      exp_stage: 'practice',
      trial_id: 'practice_trial',
      choices: choices,
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
    },
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,
    prompt: () => promptText,
    on_finish: appendData,
  };

  var practiceFeedbackBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: get_practice_feedback,
    data: function () {
      return {
        exp_stage: 'practice',
        trial_id: 'practice_feedback',
        trial_duration: 500,
        stimulus_duration: 500,
        block_num: practiceCount,
      };
    },
    response_ends_trial: false,
    stimulus_duration: 500,
    trial_duration: 500,
    prompt: () => promptText,
  };

  practiceTrials.push(
    setStimsBlock,
    ITIBlock,
    practiceCueBlock,
    practiceTrial,
    practiceFeedbackBlock
  );
}

// Create variable to log block-level feedback
var block_level_feedback = {};
var practiceCount = 0;
var practiceNode = {
  timeline: [feedbackBlock].concat(practiceTrials),
  loop_function: function (data) {
    let feedback = {};
    practiceCount += 1;
    currentTrial = 0;

    var sumRT = 0;
    var sumResponses = 0;
    var correct = 0;
    var totalTrials = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id === 'practice_trial' &&
        data.trials[i].block_num === getCurrBlockNum() - 1
      ) {
        totalTrials += 1;
        if (data.trials[i].rt !== null) {
          sumRT += data.trials[i].rt;
          sumResponses += 1;
          if (data.trials[i].response === data.trials[i].correct_response) {
            correct += 1;
          }
        }
      }
    }

    var accuracy = correct / totalTrials;
    var missedResponses = (totalTrials - sumResponses) / totalTrials;
    var avgRT = sumRT / sumResponses;

    feedbackText = '<div class = centerbox>';
    feedbackText += '<p class = block-text>Please take a short break.</p>';
    let trippedFlag = false;

    if (accuracy < practiceAccuracyThresh) {
      let text = `
          <p class="block-text">Your accuracy was low.</p>
          ${promptTextList}
        `;
      feedbackText += text;
      feedback['accuracy'] = {
        value: accuracy,
        text: text,
      };
      trippedFlag = true;
    }

    if (avgRT > rtThresh) {
      let text = `
          <p class="block-text">Please respond more quickly without sacrificing accuracy.</p>
        `;
      feedbackText += text;
      feedback['rt'] = {
        value: avgRT,
        text: text,
      };
      trippedFlag = true;
    }

    if (missedResponses > missedResponseThresh) {
      let text = `
          <p class="block-text">Respond on every trial.</p>
        `;
      feedbackText += text;
      feedback['missed_responses'] = {
        value: missedResponses,
        text: text,
      };
      trippedFlag = true;
    }

    feedbackText += '</div>';

    // Create block of conditions for first practice block
    taskSwitches = jsPsych.randomization.repeat(
      taskSwitchesArr,
      practiceLen / 4
    );
    taskSwitches.unshift({
      task_switch: 'na',
      cue_switch: 'na',
    });
    stims = genStims(practiceLen + 1);

    block_level_feedback = feedback;

    if (practiceCount === practiceThresh || !trippedFlag) {
      return false;
    }

    return true;
  },
};

var testTrials = [];
for (i = 0; i < numTrialsPerBlock + 1; i++) {
  var cueBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCue,
    response_ends_trial: false,
    data: {
      trial_id: 'test_cue',
      exp_stage: 'test',
      trial_duration: getCTI(),
      stimulus_duration: getCTI(),
    },
    trial_duration: getCTI,
    stimulus_duration: getCTI,
    on_finish: appendData,
  };

  var testTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: choices,
    data: {
      trial_id: 'test_trial',
      exp_stage: 'test',
      choices: choices,
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
    },
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,
    on_finish: appendData,
  };

  testTrials.push(setStimsBlock, ITIBlock, cueBlock, testTrial);
}

var testCount = 0;
var testNode = {
  timeline: [long_fixation_node, feedback_node].concat(
    long_fixation_node,
    testTrials
  ),
  loop_function: function (data) {
    let feedback = {};
    testCount += 1;
    currentTrial = 0;

    var sumRT = 0;
    var sumResponses = 0;
    var correct = 0;
    var totalTrials = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id === 'test_trial' &&
        data.trials[i].block_num === getCurrBlockNum() - 1
      ) {
        totalTrials += 1;
        if (data.trials[i].rt !== null) {
          sumRT += data.trials[i].rt;
          sumResponses += 1;
          if (data.trials[i].response === data.trials[i].correct_response) {
            correct += 1;
          }
        }
      }
    }

    var accuracy = correct / totalTrials;
    var missedResponses = (totalTrials - sumResponses) / totalTrials;
    var avgRT = sumRT / sumResponses;

    feedbackText = '<div class = centerbox>';
    feedbackText += `<p class=block-text>Completed ${testCount} of ${numTestBlocks} blocks.</p>`;

    if (accuracy < accuracyThresh) {
      let text = `
          <p class="block-text">Your accuracy was low.</p>
          ${promptTextList}
        `;
      feedbackText += text;
      feedback['accuracy'] = {
        value: accuracy,
        text: text,
      };
    }

    if (avgRT > rtThresh) {
      let text = `
          <p class="block-text">Please respond more quickly without sacrificing accuracy.</p>
        `;
      feedbackText += text;
      feedback['rt'] = {
        value: avgRT,
        text: text,
      };
    }

    if (missedResponses > missedResponseThresh) {
      let text = `
          <p class="block-text">Respond on every trial.</p>
        `;
      feedbackText += text;
      feedback['missed_responses'] = {
        value: missedResponses,
        text: text,
      };
    }

    feedbackText += '</div>';

    block_level_feedback = feedback;
    if (testCount === numTestBlocks) {
      return false;
    }

    // setting next block's stimuli
    trial_designs = trial_designs.slice(0, numTrialsPerBlock);
    trial_designs.unshift({
      task_switch: 'na',
      cue_switch: 'na',
    });
    stim_designs = stim_designs.slice(numTrialsPerBlock);

    taskSwitches = trial_designs;
    stims = genStims(numTrialsPerBlock + 1);

    return true;
  },
  on_timeline_finish: function () {
    // window.dataSync();
  },
};

var ITIs = [];
var stim_designs = [];
var current_delay = null;
var trial_designs = [];
var fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  on_finish: async function () {
    /*
     * This is where the designs and ITIs are read in
     * Uses the design number from a global variable
     */
    console.log('Reading in designs and ITIs...');
    const design_path =
      'http://0.0.0.0:8080/static/experiments/cued_task_switching_rdoc_practice__fmri/designs';
    const results = await loadDesignsAndITIs(design_perm, design_path, [
      'stims',
    ]);
    ITIs = results.ITIs;
    stim_designs = results.stims;

    // create trials
    trial_designs = stim_designs.slice(0, numTrialsPerBlock);
    stim_designs = stim_designs.slice(numTrialsPerBlock);
    trial_designs = parse_design(trial_designs);
    trial_designs.unshift({
      task_switch: 'na',
      cue_switch: 'na',
    });
  },
};

var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var expID = 'cued_task_switching_rdoc__fmri';
var endText = `
  <div class="centerbox" style="height: 50vh;">
    <p class="center-block-text">Thanks for completing this task!</p>
  </div>`;

var endBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: 'end',
    exp_id: expID,
    trial_duration: 10000,
  },
  trial_duration: 10000,
  stimulus: endText,
  response_ends_trial: false,
  choices: ['Enter'],
};

var cued_task_switching_rdoc_practice__fmri_experiment = [];
var cued_task_switching_rdoc_practice__fmri_init = () => {
  // Preload images
  jsPsych.pluginAPI.preloadImages(images);

  // Create block of conditions for first practice block
  taskSwitches = jsPsych.randomization.repeat(taskSwitchesArr, practiceLen / 4);
  taskSwitches.unshift({
    task_switch: 'na',
    cue_switch: 'na',
  });
  stims = genStims(practiceLen + 1);

  // Add blocks to timeline
  cued_task_switching_rdoc_practice__fmri_experiment.push(
    motor_and_design_perm_block
  );
  cued_task_switching_rdoc_practice__fmri_experiment.push(fullscreen);

  // Begin practice block - 1 max
  cued_task_switching_rdoc_practice__fmri_experiment.push(practiceNode);
  cued_task_switching_rdoc_practice__fmri_experiment.push(feedbackBlock);
  cued_task_switching_rdoc_practice__fmri_experiment.push(endBlock);
  cued_task_switching_rdoc_practice__fmri_experiment.push(exitFullscreen);
};
