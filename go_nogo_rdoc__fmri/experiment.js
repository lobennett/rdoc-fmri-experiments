const getExpStage = () => expStage;

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function (data) {
  var currentTrial = jsPsych.data.get().last().trials[0];
  var correctTrial = 0;
  console.log(currentTrial);
  if (currentTrial.response == correctResponse) {
    correctTrial = 1;
  }

  data.correct_trial = correctTrial;
  data.shape = data.condition === 'go' ? 'filled square' : 'outlined square';

  currentTrial += 1;
};

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

var getStim = function () {
  stim = blockStims.shift();
  correctResponse = stim.data.correct_response;
  return stim.stimulus;
};

const getCurrBlockNum = () =>
  getExpStage() === 'practice' ? practiceCount : testCount;

var getData = function () {
  stimData = stim.data;
  stimData['trial_duration'] = stimTrialDuration;
  stimData['stimulus_duration'] = stimStimulusDuration;
  return stimData;
};

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
const fixationDuration = 500;

var goResponse;
var choices;
var correctResponses;
var practiceStimuli;
var testStimuliBlock;
function getKeyMappingForTask(motor_perm) {
  if (motor_perm === 0) {
    goResponse = 'y';
  } else {
    goResponse = 'g';
  }
  choices = ['y', 'g'];

  correctResponses = [
    ['go', goResponse],
    ['nogo', null],
  ];

  // can now assign stimuli
  practiceStimuli = [
    {
      stimulus:
        '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div id = ' +
        stims[1][1] +
        '></div></div></div></div></div>',
      data: {
        correct_response: correctResponses[1][1],
        condition: correctResponses[1][0],
        trial_id: 'practice_trial',
      },
      key_answer: correctResponses[1][1],
    },
  ].concat(
    Array(numGoStim).fill({
      stimulus:
        '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' +
        stims[0][1] +
        '></div></div></div></div></div>',
      data: {
        correct_response: correctResponses[0][1],
        condition: correctResponses[0][0],
        trial_id: 'practice_trial',
      },
      key_answer: correctResponses[0][1],
    })
  );

  testStimuliBlock = [
    {
      stimulus:
        '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div id = ' +
        stims[1][1] +
        '></div></div></div></div></div>',
      data: {
        correct_response: correctResponses[1][1],
        condition: correctResponses[1][0],
        trial_id: 'test_trial',
      },
    },
  ].concat(
    Array(numGoStim).fill({
      stimulus:
        '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' +
        stims[0][1] +
        '></div></div></div></div></div>',
      data: {
        correct_response: correctResponses[0][1],
        condition: correctResponses[0][0],
        trial_id: 'test_trial',
      },
    })
  );
}

var promptTextList;
var promptText;
var pageInstruct;
var speedReminder;
var feedbackText;

const setText = () => {
  speedReminder = `
  <p class="block-text">
    Try to respond as quickly and accurately as possible.
  </p>
`;

  promptTextList = `
  <ul style="text-align:left;">
    <li>${stims[0][0]} square: ${
    goResponse === 'y' ? 'index finger' : 'middle finger'
  }</li>
    <li>${stims[1][0]} square: do not respond</li>
  </ul>
`;

  promptText = `
  <div class="prompt_box">
    <p class="center-block-text" style="font-size:16px; line-height:80%;">${
      stims[0][0]
    } square: ${goResponse === 'y' ? 'index finger' : 'middle finger'}</p>
    <p class="center-block-text" style="font-size:16px; line-height:80%;">${
      stims[1][0]
    } square: do not respond</p>
  </div>
`;

  feedbackText = `
  <div class="centerbox">
    <p class="block-text">In this experiment, on each trial a ${stims[0][0]} or ${stims[1][0]} square will appear on the screen.</p>
    <p class="block-text">If you see the <b>${stims[0][0]} square</b>, you should respond by pressing your <b>index finger</b> as quickly as possible.</p>
    <p class="block-text">If you see the <b>${stims[1][0]} square</b>, you should <b>not respond</b>.</p>
    <p class="block-text">We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
    ${speedReminder}
  </div>
`;
};

// eslint-disable-next-line no-unused-vars
var expStage = 'practice';
// *: Timing
const stimStimulusDuration = 1000;
const stimTrialDuration = 1500;

// generic task variables
var sumInstructTime = 0; // ms
var instructTimeThresh = 5; // /in seconds

var numGoStim = 6;

// styled with css
var stims = [
  ['solid white', 'stim1'],
  ['outlined white', 'stim2'],
];

var currentTrial = 0;

const create_test_stimuli = (conditions) => {
  return conditions.map((condition) => {
    const isNoGo = condition === 'nogo';
    const index = isNoGo ? 1 : 0;

    const stimulus = `
    <div class="bigbox">
        <div class="centerbox">
          <div class="gng_number">
            <div class="cue-text">
              <div id="${stims[index][1]}"></div>
            </div>
          </div>
        </div>
      </div>`;

    return {
      stimulus,
      data: {
        correct_response: correctResponses[index][1],
        condition: correctResponses[index][0],
        trial_id: 'test_trial',
      },
    };
  });
};

var accuracyThresh = 0.8; // min acc for block-level feedback
var practiceAccuracyThresh = 0.85; // min acc to proceed to test blocks, 6 out of 7 ~ .857

var rtThresh = 750;
var missedResponseThresh = 0.1;

var practiceLen = 7;
var practiceThresh = 3;
var numTrialsPerBlock = 63; // multiple of 7 (6go:1nogo)
var numTestBlocks = 3;

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

var ITIms = null;

// *** ITI *** //
var ITIBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: ['NO_KEYS'],
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
    console.log('ITI data: ', data);
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
    console.log(motor_perm);
    console.log(design_perm);
    getKeyMappingForTask(motor_perm);
    // set practice stimuli
    blockStims = jsPsych.randomization.repeat(
      practiceStimuli,
      practiceLen / practiceStimuli.length
    );
    setText();
  },
};

var long_fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  choices: ['NO_KEYS'],
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
for (var i = 0; i < practiceLen; i++) {
  var practiceTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    data: function () {
      return Object.assign(getData(), {
        exp_stage: 'practice',
        choices: choices,
        block_num: practiceCount,
      });
    },
    choices: choices,
    stimulus_duration: stimStimulusDuration, // 1000,
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,
    on_finish: appendData,
    prompt: () => promptText,
  };

  var practiceFeedbackBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      var last = jsPsych.data.get().last(1).values()[0];
      if (last.condition == 'go') {
        if (last.response == last.correct_response) {
          return '<div class = center-box><divp class = center-text>Correct!</div></div>';
        } else {
          return '<div class = center-box><div class = center-text>The shape was solid</div></div>';
        }
      } else {
        if (last.response == last.correct_response) {
          return '<div class = center-box><div class = center-text>Correct!</div></div>';
        } else {
          return '<div class = center-box><div class = center-text>The shape was outlined</div></div>';
        }
      }
    },
    data: function () {
      return {
        exp_stage: 'practice',
        trial_id: 'practice_feedback',
        trial_duration: 500,
        stimulus_duration: 500,
        block_num: practiceCount,
      };
    },
    choices: ['NO_KEYS'],
    prompt: () => promptText,
    trial_duration: 500,
    stimulus_duration: 500,
  };
  practiceTrials.push(ITIBlock, practiceTrial, practiceFeedbackBlock);
}

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
    return trial_id === 'check_middle' ? undefined : 4000;
  },
  response_ends_trial: function () {
    const { trial_id } = jsPsych.data.get().last().trials[0];
    return trial_id === 'check_middle';
  },
};

var practiceCount = 0;
var practiceNode = {
  timeline: [feedbackBlock].concat(practiceTrials),
  loop_function: function (data) {
    practiceCount += 1;
    currentTrial = 0;

    var sumRT = 0;
    var sumResponses = 0;
    var correct = 0;
    var totalTrials = 0;

    var totalGoTrials = 0;
    var missedResponse = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == 'practice_trial' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        totalTrials += 1;
        if (data.trials[i].rt != null) {
          sumRT += data.trials[i].rt;
          sumResponses += 1;
        }
        if (data.trials[i].response == data.trials[i].correct_response) {
          correct += 1;
        }

        if (data.trials[i].condition == 'go') {
          totalGoTrials += 1;
          if (data.trials[i].rt == null) {
            missedResponse += 1;
          }
        }
      }
    }

    var accuracy = correct / totalTrials;
    var missedResponses = missedResponse / totalGoTrials;
    var avgRT = sumRT / sumResponses;

    feedbackText =
      '<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 4 seconds.</p>';

    if (accuracy < practiceAccuracyThresh) {
      feedbackText += `
       <p class="block-text">Your accuracy is low. Remember: </p>${promptTextList}
      `;
    }

    if (avgRT > rtThresh) {
      feedbackText += `
        <p class="block-text">You have been responding too slowly.${speedReminder}</p>
      `;
    }

    if (missedResponses > missedResponseThresh) {
      feedbackText += `
        <p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>
      `;
    }

    feedbackText += `<p class="block-text">We are now going to start the task.</p>`;

    // blockStims = jsPsych.randomization.repeat(
    //   practiceStimuli,
    //   practiceLen / practiceStimuli.length
    // );

    expStage = 'test';

    blockStims = stim_designs;

    console.log(blockStims);

    return false;
  },
};

var testTrials = [];
for (var i = 0; i < numTrialsPerBlock; i++) {
  var testTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: choices,
    data: function () {
      return Object.assign(getData(), {
        exp_stage: 'test',
        choices: choices,
        block_num: testCount,
      });
    },
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,
    on_finish: appendData,
  };
  testTrials.push(ITIBlock, testTrial);
}

var feedback_node = {
  timeline: [feedbackBlock],
  conditional_function: function () {
    const { trial_id } = jsPsych.data.get().last().trials[0];
    if (trial_id === 'fmri_wait_block_trigger_end') return false;
    return true;
  },
};

var testCount = 0;
var testNode = {
  timeline: [feedback_node].concat(
    long_fixation_node,
    testTrials,
    long_fixation_node
  ),
  loop_function: function (data) {
    testCount += 1;
    currentTrial = 0;

    var sumRT = 0;
    var sumResponses = 0;
    var correct = 0;
    var totalTrials = 0;
    var totalGoTrials = 0;
    var missedResponse = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == 'test_trial' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        totalTrials += 1;
        if (data.trials[i].rt != null) {
          sumRT += data.trials[i].rt;
          sumResponses += 1;
        }
        if (data.trials[i].response == data.trials[i].correct_response) {
          correct += 1;
        }
        if (data.trials[i].condition == 'go') {
          totalGoTrials += 1;
          if (data.trials[i].rt == null) {
            missedResponse += 1;
          }
        }
      }
    }
    var accuracy = correct / totalTrials;
    var missedResponses = missedResponse / totalGoTrials;
    var avgRT = sumRT / sumResponses;

    if (testCount === numTestBlocks) {
      feedbackText = `<div class=centerbox>
        <p class=block-text>Done with this task.</p>
        </div>`;

      return false;
    } else {
      feedbackText =
        '<div class = centerbox><p class = block-text>Please take this time to read your feedback!</p>';

      feedbackText += `<p class=block-text>You have completed ${testCount} out of ${numTestBlocks} blocks of trials.</p>`;

      if (accuracy < accuracyThresh) {
        feedbackText += `
       <p class="block-text">Your accuracy is low. Remember: </p>${promptTextList}
      `;
      }

      if (avgRT > rtThresh) {
        feedbackText += `
        <p class="block-text">You have been responding too slowly.${speedReminder}</p>
      `;
      }

      if (missedResponses > missedResponseThresh) {
        feedbackText += `
        <p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>
      `;
      }

      feedbackText += '</div>';

      return true;
    }
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
    console.log('Reading in designs and ITIs...');
    const design_path =
      'http://0.0.0.0:8080/static/experiments/go_nogo_rdoc__fmri/designs';
    const results = await loadDesignsAndITIs(design_perm, design_path, [
      'stims',
    ]);
    ITIs = results.ITIs;
    stim_designs = create_test_stimuli(results.stims);
    console.log(ITIs);
    console.log(stim_designs);
  },
};

var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var expID = 'go_nogo_rdoc__fmri';
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

var go_nogo_rdoc__fmri_experiment = [];
var go_nogo_rdoc__fmri_init = () => {
  // globals
  go_nogo_rdoc__fmri_experiment.push(motor_and_design_perm_block);
  go_nogo_rdoc__fmri_experiment.push(fullscreen);
  go_nogo_rdoc__fmri_experiment.push(check_fingers_node);
  // practice block
  go_nogo_rdoc__fmri_experiment.push(practiceNode);
  go_nogo_rdoc__fmri_experiment.push(feedbackBlock);
  go_nogo_rdoc__fmri_experiment.push(fmri_wait_node);
  // test block
  go_nogo_rdoc__fmri_experiment.push(testNode);
  go_nogo_rdoc__fmri_experiment.push(endBlock);
  go_nogo_rdoc__fmri_experiment.push(exitFullscreen);
};
