// Adding all available keys for button box
// - Four our configuration, keys can only be 'b', 'y', 'g', 'r', 'e'
const buttonBoxKeys = ['b', 'y', 'g', 'r', 'e'];

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

const generateImageString = (
  flankerBoards,
  preFileType,
  fileTypePNG,
  centerLetter,
  flanker
) => {
  return (
    flankerBoards[0] +
    preFileType +
    flanker +
    fileTypePNG +
    flankerBoards[1] +
    preFileType +
    flanker +
    fileTypePNG +
    flankerBoards[2] +
    preFileType +
    centerLetter +
    fileTypePNG +
    flankerBoards[3] +
    preFileType +
    flanker +
    fileTypePNG +
    flankerBoards[4] +
    preFileType +
    flanker +
    fileTypePNG +
    flankerBoards[5]
  );
};

const create_test_stimuli = (conditions) => {
  const center_letters = ['H', 'F'];
  const stimuli = [];

  for (let i = 0; i < conditions.length; i++) {
    const current_condition = conditions[i];
    const random_index = Math.floor(Math.random() * 2);
    const center_letter = center_letters[random_index];

    const id = `center_${center_letter}_${current_condition}`;
    const stimulus = testStimuli.find((stimulus) => stimulus.id === id);
    stimuli.push(stimulus);
  }
  return stimuli;
};

const getExpStage = () => expStage;

function appendData() {
  var data = jsPsych.data.get().last(1).values()[0];

  if (data.response === data.correct_response) {
    var correctTrial = 1;
  } else {
    var correctTrial = 0;
  }

  if (data.response === null) {
    data.response = -1;
  }

  jsPsych.data.get().addToLast({ correct_trial: correctTrial });
}

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

var getStim = function () {
  currStim = blockStims.shift();
  return currStim.image;
};

var getStimData = function () {
  return currStim.data;
};

const getCurrBlockNum = () =>
  getExpStage() === 'practice' ? practiceCount : testCount;

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

// TODO: Check counterbalancing
/*

If we use 1/0 for counterbalancing like we did for network, we won't 
have the granularity to counterbalance the motor and design permutations
as we did for the behavioral tasks. i.e. ensuring similar match/mismatch
tasks have same mapping, etc. We used 32 for behavioral sample for counterbalancing 
but only 1s and 0s for fMRI. I'm using 1/0 now since that's what we did 
for network, but if we want the granality we had for behavioral tasks, we
should reconsider how motor perms are generated and read in. 

*/
var possibleResponses;
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

var expStage = 'practice';

// *: Timing
const fixationDuration = 500;
const stimStimulusDuration = 1000;
const stimTrialDuration = 1500;
var sumInstructTime = 0; // ms
var instructTimeThresh = 5; // /in seconds

/* *********** Feedback performance thresholds ************* */
var practiceThresh = 3;
var rtThresh = 750;
var missedResponseThresh = 0.1;
var accuracyThresh = 0.8;
var practiceAccuracyThresh = 0.75;

var currStim = '';

var fileTypePNG = '.png"></img>';
var preFileType =
  '<img class = center src="/static/experiments/flanker_rdoc__fmri/images/';

var flankerBoards = [
  [
    '<div class="centerbox-flex"><div class="stimuli-container"><div class="flankerLeft_2"><div class="cue-text">',
  ],
  ['</div></div><div class="flankerLeft_1"><div class="cue-text">'],
  ['</div></div><div class="flankerMiddle"><div class="cue-text">'],
  ['</div></div><div class="flankerRight_1"><div class="cue-text">'],
  ['</div></div><div class="flankerRight_2"><div class="cue-text">'],
  ['</div></div></div></div>'],
];

var practiceLen = 1; // must be divisible by 4
var numTrialsPerBlock = 40; // must be divisible by 4
var numTestBlocks = 3;

var speedReminder;
var promptTextList;
var promptText;
var feedbackText;
var testStimuli;

const setText = () => {
  speedReminder = `
  <p class="block-text">
    Try to respond as quickly and accurately as possible.
  </p>
`;

  promptTextList = `
  <ul style="text-align:left;">
    <li>If the middle letter is:</li>
    <ul>
      <li>${possibleResponses[0][0] === 'index finger' ? 'H' : 'F'}: Index</li>
      <li>${possibleResponses[0][0] === 'index finger' ? 'F' : 'H'}: Middle</li>
    </ul>
  </ul>
`;

  promptText = `
  <div class="prompt_box">
    <p class="center-block-text" style="font-size:16px; line-height:80%;">If the middle letter is:</p>
    <p class="center-block-text" style="font-size:16px; line-height:80%;">${
      possibleResponses[0][0] === 'index finger' ? 'H' : 'F'
    }: Index</p>
    <p class="center-block-text" style="font-size:16px; line-height:80%;">${
      possibleResponses[0][0] === 'index finger' ? 'F' : 'H'
    }: Middle</p>
  </div>
`;

  feedbackText = `
  <div class="centerbox">
    <p class="block-text">On each trial you will see a string of F's and H's. </p>
    <p class="block-text">If the middle letter is an <b>${
      possibleResponses[0][0] === 'index finger' ? 'H' : 'F'
    }</b>, press your <b>index finger</b>.</p>
    <p class="block-text">If the middle letter is an <b>${
      possibleResponses[0][0] === 'index finger' ? 'F' : 'H'
    }</b>, press your <b>middle finger</b>.</p>
  </div>
`;

  testStimuli = [
    {
      image: generateImageString(
        flankerBoards,
        preFileType,
        fileTypePNG,
        'H',
        'F'
      ),
      data: {
        correct_response: possibleResponses[0][1],
        condition: 'incongruent',
        trial_id: 'stim',
        flanker: 'F',
        center_letter: 'H',
      },
      id: 'center_H_incongruent',
    },
    {
      image: generateImageString(
        flankerBoards,
        preFileType,
        fileTypePNG,
        'F',
        'H'
      ),
      data: {
        correct_response: possibleResponses[1][1],
        condition: 'incongruent',
        trial_id: 'stim',
        flanker: 'H',
        center_letter: 'F',
      },
      id: 'center_F_incongruent',
    },
    {
      image: generateImageString(
        flankerBoards,
        preFileType,
        fileTypePNG,
        'H',
        'H'
      ),
      data: {
        correct_response: possibleResponses[0][1],
        condition: 'congruent',
        trial_id: 'stim',
        flanker: 'H',
        center_letter: 'H',
      },
      id: 'center_H_congruent',
    },
    {
      image: generateImageString(
        flankerBoards,
        preFileType,
        fileTypePNG,
        'F',
        'F'
      ),
      data: {
        correct_response: possibleResponses[1][1],
        condition: 'congruent',
        trial_id: 'stim',
        flanker: 'F',
        center_letter: 'F',
      },
      id: 'center_F_congruent',
    },
  ];
};

// PRE LOAD IMAGES HERE
var pathSource = '/static/experiments/flanker_rdoc__fmri/images/';
var images = [];
images.push(pathSource + 'F.png');
images.push(pathSource + 'H.png');

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
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
    data['motor_perm'] = data.response.motor_perm;
    data['design_perm'] = data.response.design_perm;
    motor_perm = data.response.motor_perm;
    design_perm = data.response.design_perm;

    getKeyMappingForTask(motor_perm);
    setText();
    blockStims = jsPsych.randomization.repeat(testStimuli, practiceLen / 4);
    // Take only the first trial 
    blockStims = blockStims.slice(0, 1);
    console.log('blockStims', blockStims);
  },
};

var practiceTrials = [];
for (i = 0; i < practiceLen; i++) {
  var practiceTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: buttonBoxKeys,
    data: function () {
      return Object.assign({}, getStimData(), {
        trial_id: 'practice_trial',
        exp_stage: 'practice',
        choices: buttonBoxKeys,
        trial_duration: stimTrialDuration,
        stimulus_duration: stimStimulusDuration,
        block_num: practiceCount,
      });
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
    choices: buttonBoxKeys,
    data: function () {
      return {
        exp_stage: 'practice',
        trial_id: 'practice_feedback',
        trial_duration: 500,
        stimulus_duration: 500,
        block_num: practiceCount,
        choices: buttonBoxKeys,
      };
    },
    response_ends_trial: false,
    stimulus_duration: 500,
    trial_duration: 500,
    prompt: () => promptText,
  };
  practiceTrials.push(ITIBlock, practiceTrial, practiceFeedbackBlock);
}

var block_level_feedback = {};
var practiceCount = 0;
var practiceNode = {
  timeline: [feedbackBlock].concat(practiceTrials),
  loop_function: function (data) {
    let feedback = {};
    practiceCount += 1;

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
    var aveRT = sumRT / sumResponses;

    feedbackText = '<div class = centerbox>';
    feedbackText += '<p class = block-text>Please take a short break.</p>';

    if (accuracy < practiceAccuracyThresh) {
      let text = `
       <p class="block-text">Your accuracy was low. <br>${promptTextList}</p>
      `;
      feedbackText += text;
      feedback['accuracy'] = {
        value: accuracy,
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

    if (aveRT > rtThresh) {
      let text = `
       <p class="block-text">Please respond more quickly without sacrificing accuracy.</p>
      `;
      feedbackText += text;
      feedback['rt'] = {
        value: aveRT,
        text: text,
      };
    }

    feedbackText += '</div>';

    expStage = 'test';
    let block_designs = stim_designs.slice(0, numTrialsPerBlock);
    stim_designs = stim_designs.slice(numTrialsPerBlock);

    blockStims = create_test_stimuli(block_designs);

    block_level_feedback = feedback;

    return false;
  },
};

var testTrials = [];
for (i = 0; i < numTrialsPerBlock; i++) {
  var testTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: buttonBoxKeys,
    data: function () {
      return Object.assign({}, getStimData(), {
        trial_id: 'test_trial',
        exp_stage: 'test',
        choices: buttonBoxKeys,
        trial_duration: stimTrialDuration,
        stimulus_duration: stimStimulusDuration,
        block_num: testCount,
      });
    },
    response_ends_trial: false,
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    on_finish: appendData,
  };

  testTrials.push(ITIBlock, testTrial);
}

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
        data.trials[i].trial_id == 'test_trial' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        totalTrials += 1;
        if (data.trials[i].rt != null) {
          sumRT += data.trials[i].rt;
          sumResponses += 1;
          if (data.trials[i].response == data.trials[i].correct_response) {
            correct += 1;
          }
        }
      }
    }
    var accuracy = correct / totalTrials;
    var missedResponses = (totalTrials - sumResponses) / totalTrials;
    var aveRT = sumRT / sumResponses;

    feedbackText = '<div class = centerbox>';
    feedbackText += `<p class=block-text>Completed ${testCount} of ${numTestBlocks} blocks.</p>`;

    if (accuracy < accuracyThresh) {
      let text = `
       <p class="block-text">Your accuracy was low. <br>${promptTextList}</p>
      `;
      feedbackText += text;
      feedback['accuracy'] = {
        value: accuracy,
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

    if (aveRT > rtThresh) {
      let text = `
       <p class="block-text">Please respond more quickly without sacrificing accuracy.</p>
      `;
      feedbackText += text;
      feedback['rt'] = {
        value: aveRT,
        text: text,
      };
    }

    feedbackText += '</div>';

    block_level_feedback = feedback;
    if (testCount === numTestBlocks) {
      return false;
    }

    let block_designs = stim_designs.slice(0, numTrialsPerBlock);
    stim_designs = stim_designs.slice(numTrialsPerBlock);

    blockStims = create_test_stimuli(block_designs);
    return true;
  },
  // on_timeline_finish: function () {
  //   window.dataSync();
  // },
};

var ITIs = [];
var stim_designs = [];
var current_delay = null;
var trial_designs = [];
var fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  on_finish: async function () {
    console.log('Reading in designs and ITIs...');
    const base = window.location.origin;
    const design_path =
      `${base}/static/experiments/flanker_rdoc__fmri/designs`;
    const results = await loadDesignsAndITIs(design_perm, design_path, [
      'stims',
    ]);
    ITIs = results.ITIs;
    stim_designs = results.stims;
  },
};

var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var expID = 'flanker_rdoc__fmri';
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

flanker_rdoc__fmri_experiment = [];
var flanker_rdoc__fmri_init = () => {
  jsPsych.pluginAPI.preloadImages(images);
  // globals
  flanker_rdoc__fmri_experiment.push(motor_and_design_perm_block);
  flanker_rdoc__fmri_experiment.push(fullscreen);
  flanker_rdoc__fmri_experiment.push(check_fingers_node);
  // practice block
  flanker_rdoc__fmri_experiment.push(practiceNode);
  flanker_rdoc__fmri_experiment.push(feedbackBlock);
  flanker_rdoc__fmri_experiment.push(fmri_wait_node);
  // test block
  flanker_rdoc__fmri_experiment.push(testNode);
  flanker_rdoc__fmri_experiment.push(long_fixation_node);
  flanker_rdoc__fmri_experiment.push(feedbackBlock);
  flanker_rdoc__fmri_experiment.push(endBlock);
  flanker_rdoc__fmri_experiment.push(exitFullscreen);
};
