// Adding all available keys for button box
// - Four our configuration, keys can only be 'b', 'y', 'g', 'r', 'e'
const buttonBoxKeys = ['b', 'y', 'g', 'r', 'e'];

/* ************************************ */
/* Define helper functions */
/* ************************************ */
/* ********** GETTERS ****************** */
const get_practice_feedback = () => {
  var last = jsPsych.data.get().last(1).values()[0];
  if (last.response === -1) {
    return '<div class=center-box><div class=center-text><font size =20>Respond Faster!</font></div></div>';
  } else if (last.correct_trial === 1) {
    return '<div class=center-box><div class=center-text><font size =20>Correct!</font></div></div>';
  } else {
    return '<div class=center-box><div class=center-text><font size =20>Incorrect</font></div></div>';
  }
};

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

const getCondition = () => currCondition;

const getExpStage = () => expStage;

const getCue = () => currCue;

const getStim = () => currStim;

const getCurrBlockNum = () =>
  getExpStage() === 'practice' ? practiceCount : testCount;

var currCue = '';
var currStim = '';

//TODO: check motor perm logic
function getKeyMappingForTask(motor_perm) {
  if (motor_perm % 2 === 0) {
    possibleResponses = [
      ['index finger', 'y', 'index finger'],
      ['middle finger', 'g', 'middle finger'],
    ];
  } else {
    possibleResponses = [
      ['middle finger', 'g', 'middle finger'],
      ['index finger', 'y', 'index finger'],
    ];
  }
}

function extractTextFromStimulus(obj) {
  // Create a temporary DOM element to parse the HTML string
  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = obj.stimulus;

  // Query the desired element and return its text content
  var textElement = tempDiv.querySelector('.centerbox .AX_text');
  return textElement ? textElement.textContent : null;
}

// Data logging
function appendData() {
  var data = jsPsych.data.get().last(1).values()[0];

  // handling correct trials
  if (data.response === data.correct_response) {
    var correctTrial = 1;
  } else {
    var correctTrial = 0;
  }

  // handling omissions
  if (data.response === null) {
    data.response = -1;
  }

  let parsedLetter = extractTextFromStimulus(data);

  jsPsych.data
    .get()
    .addToLast({ correct_trial: correctTrial, probe_letter: parsedLetter });
}

const setStims = () => {
  if (getExpStage() === 'practice') {
    switch (currCondition) {
      case 'AX':
        currStim = '<div class = centerbox><div class = AX_text>X</div></div>';
        currCue = '<div class = centerbox><div class = AX_text>A</div></div>';
        break;
      case 'BY':
        currStim = getChar();
        currCue = getChar();
        break;
      case 'BX':
        currStim = '<div class = centerbox><div class = AX_text>X</div></div>';
        currCue = getChar();
        break;
      case 'AY':
        currStim = getChar();
        currCue = '<div class = centerbox><div class = AX_text>A</div></div>';
        break;
    }
  } else {
    const { stim, cue } = blockList.shift();
    current_delay = delay_designs.shift() * 1000;

    if (cue === 'cue_a') {
      currCue = '<div class = centerbox><div class = AX_text>A</div></div>';
    } else {
      currCue = getChar();
    }

    if (stim === 'stim_ax' || stim === 'stim_bx') {
      currStim = '<div class = centerbox><div class = AX_text>X</div></div>';
    } else {
      currStim = getChar();
    }

    currCondition = stim.replace('stim_', '').toUpperCase();
  }
};

const createHTML = (char) =>
  `<div class="centerbox"><div class="AX_text">${char}</div></div>`;

const getChar = () =>
  createHTML(chars[Math.floor(Math.random() * chars.length)]);

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
const fixationDuration = 500;
const conditionValues = ['AX', 'BY', 'BX', 'AY'];

/* ******************************* */
/* TASK TEXT */
/* ******************************* */

var feedbackText;
var speedReminder;
var promptTextList;
var promptText;
const setText = () => {
  speedReminder = `
  <p class = block-text>
    Try to respond as quickly and accurately as possible.
  </p>
`;

  feedbackText = `
  <div class = centerbox>
    <p class = block-text>During this task, on each trial you will see a letter presented, a short break, and then a second letter. For instance, you may see an "A" followed by an "F".</p>
    <p class = block-text>If the first letter was an "A" <b>AND</b> the second letter is an "X", press your <b>${possibleResponses[0][0]}</b>. Otherwise, press your <b>${possibleResponses[1][0]}</b>.</p>
     <p class = block-text>We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
    <p class = block-text>Remember, press your <b>${possibleResponses[0][0]}</b> after you see "A" followed by an "X", and your <b>${possibleResponses[1][0]}</b> for all other combinations.</p>
    ${speedReminder}
  </div>
`;

  promptTextList = `
  <ul style="text-align:left;">
    <li>${
      possibleResponses[0][0] === 'index finger' ? 'A -> X' : 'Any other pair'
    }: Index</li>
    <li>${
      possibleResponses[0][0] === 'index finger' ? 'Any other pair' : 'A -> X'
    }: Middle</li>
  </ul>
`;

  promptText = `
  <div class = prompt_box>
    <p class = center-block-text style = "font-size:16px; line-height:80%;">${
      possibleResponses[0][0] === 'index finger' ? 'A -> X' : 'Any other pair'
    }: Index</p>
    <p class = center-block-text style = "font-size:16px; line-height:80%;">${
      possibleResponses[0][0] === 'index finger' ? 'Any other pair' : 'A -> X'
    }: Middle</p>
  </div>
`;
};

/* ******************************* */
/* TIMINGS */
/* ******************************* */
var possibleResponses;

// cue
const cueStimulusDuration = 500;
const cueTrialDuration = 500;
// // probe
const probeStimulusDuration = 1000;
const probeTrialDuration = 1500;

/* ******************************* */
/* THRESHOLDS */
/* ******************************* */
/* Practice */
var practiceThresh = 1; // 1 practice blocks max
var accuracyThresh = 0.8; // block-level accuracy feedback
var practiceAccuracyThresh = 0.8; // min accuracy to proceed to test

/* Test */
var rtThresh = 750;
var missedResponseThresh = 0.1; // get feedback if missed responses > 10% of trials

/* ******************************* */
/* Conditions/Num Trials */
/* ******************************* */
var chars = 'BCDEFGHIJLMNOPQRSTUVWZ';

/* ************ CONDITION PROPORTIONS ************ */
// 4 AX: 2 BX: 2 AY: 2 BY
var trialProportions = [
  'AX',
  'AX',
  'AX',
  'AX',
  'BX',
  'BX',
  'AY',
  'AY',
  'BY',
  'BY',
];

/* ************ TASK LENGTH SETUP ************ */
var numTestBlocks = 3; // 3 test blocks - 150 trials total
var numTrialsPerBlock = trialProportions.length * 5; // 50 trials per test block
var practiceLen = 1;
var currCondition = '';
var expStage = 'practice';

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

// *** ISI *** //
var ISI = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  response_ends_trial: false,
  choices: buttonBoxKeys,
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_inter-stimulus`,
      exp_stage: stage,
      trial_duration: stage === 'practice' ? 3000 : current_delay,
      stimulus_duration: stage === 'practice' ? 3000 : current_delay,
      block_num: stage === 'practice' ? practiceCount : testCount,
    };
  },
  stimulus_duration: () =>
    getExpStage() === 'practice' ? 3000 : current_delay,
  trial_duration: () => (getExpStage() === 'practice' ? 3000 : current_delay),
  prompt: function () {
    return getExpStage() === 'practice' ? promptText : '';
  },
  on_finish: (data) =>
    getExpStage() === 'practice'
      ? (data['delay_ms'] = 3000)
      : (data['delay_ms'] = current_delay),
};

// *** ITI *** //
var ITIms = null;
var ITIBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  choices: buttonBoxKeys,
  response_ends_trial: false,
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_ITI`,
      ITIParams:
        stage === 'practice' ? 0.5 : null,
      block_num: stage === 'practice' ? 0 : testCount,
      exp_stage: stage,
      choices: buttonBoxKeys,
    };
  },
  trial_duration: function () {
    ITIms = getExpStage() === 'practice' ? 0.5 : ITIs.shift();
    return ITIms * 1000;
  },
  prompt: function () {
    return getExpStage() === 'practice' ? promptText : '';
  },
  on_finish: function (data) {
    data['trial_duration'] = ITIms * 1000;
    data['stimulus_duration'] = ITIms * 1000;
  },
};

/* ******************************* */
/* PRACTICE FEEDBACK STUFF */
/* ******************************* */
var practiceFeedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: get_practice_feedback,
  choices: buttonBoxKeys,
  response_ends_trial: false,
  data: function () {
    return {
      exp_stage: 'practice',
      trial_id: 'practice_feedback',
      trial_duration: 500,
      stimulus_duration: 500,
      block_num: practiceCount,
    };
  },
  stimulus_duration: 500,
  trial_duration: 500,
  prompt: () => promptText,
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
  trial_duration: function () {
    const { trial_id } = jsPsych.data.get().last().trials[0];
    return trial_id === 'check_middle' || trial_id === 'practice_feedback'
      ? undefined
      : 4000;
  },
  response_ends_trial: function () {
    const { trial_id } = jsPsych.data.get().last().trials[0];
    return trial_id === 'check_middle' || trial_id === 'practice_feedback';
  },
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

var setStimsBlock = {
  type: jsPsychCallFunction,
  func: setStims,
};

/* ******************************* */
/* PRACTICE TRIALS */
/* ******************************* */

/*
 * Practice trials
 * 1 block max
 */
practiceTrials = [];
for (i = 0; i < practiceLen; i++) {
  var cueBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCue,
    choices: buttonBoxKeys,
    data: function () {
      return {
        trial_id: 'practice_cue',
        exp_stage: 'practice',
        condition: getCondition(),
        trial_duration: cueTrialDuration,
        stimulus_duration: cueStimulusDuration,
        block_num: practiceCount,
      };
    },
    stimulus_duration: cueStimulusDuration, // 500
    trial_duration: cueTrialDuration, // 500
    response_ends_trial: false,
    prompt: () => promptText,
    on_finish: function (data) {
      data['cue_letter'] = extractTextFromStimulus(data);
    },
  };

  var probeBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: buttonBoxKeys,
    data: function () {
      return {
        trial_id: 'practice_trial',
        exp_stage: 'practice',
        condition: getCondition(),
        choices: buttonBoxKeys,
        trial_duration: probeTrialDuration,
        stimulus_duration: probeStimulusDuration,
        correct_response:
          getCondition() == 'AX'
            ? possibleResponses[0][1]
            : possibleResponses[1][1],
        block_num: practiceCount,
      };
    },
    stimulus_duration: probeStimulusDuration,
    trial_duration: probeTrialDuration,
    response_ends_trial: false,
    prompt: () => promptText,
    on_finish: appendData,
  };

  practiceTrials.push(
    setStimsBlock,
    ITIBlock,
    cueBlock,
    ISI,
    probeBlock,
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
    var sumRT = 0;
    var sumResponses = 0;
    var correct = 0;
    var totalTrials = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (data.trials[i].trial_id == 'practice_trial') {
        totalTrials += 1;
        if (data.trials[i].rt !== null) {
          sumRT += data.trials[i].rt;
          sumResponses += 1;
          if (data.trials[i].correct_trial === 1) {
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

    if (accuracy < practiceAccuracyThresh) {
      let text = `
        <p class = block-text>Your accuracy was low.</p>
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
       <p class = block-text>Please respond more quickly without sacrificing accuracy.</p>
      `;
      feedbackText += text;
      feedback['rt'] = {
        value: avgRT,
        text: text,
      };
    }

    if (missedResponses > missedResponseThresh) {
      let text = `
        <p class = block-text>Respond on every trial.</p>
      `;
      feedbackText += text;
      feedback['missed_responses'] = {
        value: missedResponses,
        text: text,
      };
    }

    feedbackText += '</div>';

    // Here set first block of test trials
    blockList = trial_designs;
    expStage = 'test';

    // Set block-level feedback
    block_level_feedback = feedback;
    return false;
  },
};

/* ******************************* */
/* TEST TRIALS */
/* ******************************* */
var long_fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  response_ends_trial: false,
  choices: buttonBoxKeys,
  data: function () {
    return {
      trial_id: 'test_long_fixation',
      exp_stage: 'test',
      trial_duration: 6000,
      stimulus_duration: 6000,
      block_num: testCount,
      choices: buttonBoxKeys,
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

var testTrials = [];
for (i = 0; i < numTrialsPerBlock; i++) {
  var cueBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCue,
    choices: buttonBoxKeys,
    data: function () {
      return {
        trial_id: 'test_cue',
        exp_stage: 'test',
        condition: getCondition(),
        trial_duration: cueTrialDuration,
        stimulus_duration: cueStimulusDuration,
        block_num: testCount,
      };
    },
    stimulus_duration: cueStimulusDuration,
    trial_duration: cueTrialDuration,
    response_ends_trial: false,
    on_finish: function (data) {
      data['cue_letter'] = extractTextFromStimulus(data);
    },
  };
  var probeBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: buttonBoxKeys,
    data: function () {
      return {
        trial_id: 'test_trial',
        exp_stage: 'test',
        condition: getCondition(),
        choices: buttonBoxKeys,
        trial_duration: probeTrialDuration,
        stimulus_duration: probeStimulusDuration,
        correct_response:
          getCondition() == 'AX'
            ? possibleResponses[0][1]
            : possibleResponses[1][1],
        block_num: testCount,
      };
    },
    stimulus_duration: probeStimulusDuration,
    trial_duration: probeTrialDuration,
    response_ends_trial: false,
    on_finish: appendData,
  };
  testTrials.push(setStimsBlock, ITIBlock, cueBlock, ISI, probeBlock);
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
          if (data.trials[i].correct_trial === 1) {
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
        <p class = block-text>Your accuracy was low.</p>
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
       <p class = block-text>Please respond more quickly without sacrificing accuracy.</p>
      `;
      feedbackText += text;
      feedback['rt'] = {
        value: avgRT,
        text: text,
      };
    }
    if (missedResponses > missedResponseThresh) {
      let text = `
        <p class = block-text>Respond on every trial.</p>
      `;
      feedbackText += text;
      feedback['missed_responses'] = {
        value: missedResponses,
        text: text,
      };
    }

    feedbackText += '</div>';

    // Set block-level feedback
    block_level_feedback = feedback;

    if (testCount === numTestBlocks) {
      return false;
    }

    return true;
  },
  on_timeline_finish: function () {
    // window.dataSync();
  },
};

/* ******************************* */
/* JSPSYCH REQUIRED IN ALL SCRIPTS */
/* ******************************* */

// Move to plugins?
var motor_perm = null;
var design_perm = null;
var motor_and_design_perm_block = {
  // Grab motor and design perms to be used in the task for this subject
  // The number of design options is hardcoded for now, and must match the number of designs in ./designs/
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
        options: [0, 1],
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
    // Save response to data object
    data['motor_perm'] = data.response.motor_perm;
    data['design_perm'] = data.response.design_perm;

    // Set global variables for use in other functions
    motor_perm = data.response.motor_perm;
    design_perm = data.response.design_perm;

    getKeyMappingForTask(motor_perm);
    setText();
  },
};

var ITIs = [];
var cue_designs = [];
var stim_designs = [];
var delay_designs = [];
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
    const base = window.location.origin;
    const design_path =
      `${base}/static/experiments/ax_cpt_rdoc__fmri/designs`;
    const results = await loadDesignsAndITIs(design_perm, design_path, [
      'cues',
      'stims',
      'delays',
    ]);
    ITIs = results.ITIs;
    cue_designs = results.cues;
    stim_designs = results.stims;
    delay_designs = results.delays;

    trial_designs = cue_designs.map((cue, index) => ({
      cue: cue,
      stim: stim_designs[index],
    }));
  },
};

var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var expID = 'ax_cpt_rdoc__fmri';
var endText = `
  <div class="centerbox" style="height: 50vh;">
    <p class="center-block-text">Thanks for completing this task!</p>
     <p class="center-block-text">Please remain still for the remainder of the scan!</p>
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

// Experiment timeline
var ax_cpt_rdoc__fmri_experiment = [];
var ax_cpt_rdoc__fmri_init = () => {
  // Create block of conditions for first practice block
  blockList = conditionValues.concat(['AX']);
  blockList = jsPsych.randomization.repeat(blockList, 1);
  currCondition = blockList[0];

  // Add blocks to timeline
  ax_cpt_rdoc__fmri_experiment.push(motor_and_design_perm_block);
  ax_cpt_rdoc__fmri_experiment.push(fullscreen);
  ax_cpt_rdoc__fmri_experiment.push(check_fingers_node);

  // Begin practice block - 1 max
  ax_cpt_rdoc__fmri_experiment.push(practiceNode);
  ax_cpt_rdoc__fmri_experiment.push(feedbackBlock);

  // Prep scan
  ax_cpt_rdoc__fmri_experiment.push(fmri_wait_node);

  // Start test blocks
  ax_cpt_rdoc__fmri_experiment.push(testNode);
  ax_cpt_rdoc__fmri_experiment.push(long_fixation_node);
  ax_cpt_rdoc__fmri_experiment.push(feedbackBlock);
  ax_cpt_rdoc__fmri_experiment.push(endBlock);
  ax_cpt_rdoc__fmri_experiment.push(exitFullscreen);
};
