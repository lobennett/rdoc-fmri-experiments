const getExpStage = () => expStage;

const getInstructFeedback =
  () => `<div class = centerbox><p class = center-block-text>
    ${feedbackInstructText}
    </p></div>`;

const getFeedback =
  () => `<div class = bigbox><div class = picture_box><p class = block-text>
    ${feedbackText}
    </font></p></div></div>`;

var createTrialTypes = function (numTrialsPerBlock) {
  var uniqueCombos = stopSignalsConditions.length * shapes.length;

  var stims = [];
  for (var x = 0; x < stopSignalsConditions.length; x++) {
    for (var j = 0; j < shapes.length; j++) {
      stim = {
        stim: shapes[j],
        correct_response: possibleResponses[j][1],
        condition: stopSignalsConditions[x],
      };
      stims.push(stim);
    }
  }
  var iteration = numTrialsPerBlock / uniqueCombos;
  stims = jsPsych.randomization.repeat(stims, iteration);
  return stims;
};

const create_test_trials = (designs) => {
  let stims = [];

  designs.forEach((d) => {
    let randomIndex = Math.round(Math.random());
    let temp = {
      stim: shapes[randomIndex],
      correct_response: possibleResponses[randomIndex][1],
      condition: d,
    };
    stims.push(temp);
  });
  return stims;
};

const getStopStim = () => `${preFileType}stopSignal${postFileType}`;

var getStim = function () {
  stim = stims.shift();
  shape = stim.stim;
  correct_response = stim.correct_response;
  condition = stim.condition;

  stim = {
    image:
      '<div class = centerbox><div class = cue-text>' +
      preFileType +
      shape +
      postFileType +
      '</div></div>',
    data: {
      stim: shape,
      condition: condition,
      correct_response: condition === 'go' ? correct_response : null,
    },
  };

  stimData = stim.data;
  return stim.image;
};

const getCurrBlockNum = () =>
  getExpStage() === 'practice' ? practiceCount : testCount;

const getSSD = () => SSD;

const getCondition = () => condition;

const getCorrectResponse = () => correct_response;

var appendData = function (data) {
  currentTrial += 1;

  data.stim = stimData.stim;
  data.correct_response = correct_response;
  data.current_trial = currentTrial;
  data.condition = stimData.condition;
  data.block_num = getExpStage() == 'practice' ? practiceCount : testCount;

  if (data.condition == 'stop') {
    data.correct_trial = data.response === null ? 1 : 0;
    if (data.response == null && SSD < maxSSD) {
      SSD += 50;
    } else if (data.response != null && SSD > minSSD) {
      SSD -= 50;
    }
  } else {
    data.correct_trial = data.response === data.correct_response ? 1 : 0;
  }
};

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
const fixationDuration = 500;

var possibleResponses;

// TODO: Check motor perms
function getKeyMappingForTask(motor_perm) {
  if (motor_perm === 0) {
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

var choices;

var expStage = 'practice';
// *: Timing
const stimStimulusDuration = 1000;
const stimTrialDuration = 1500;

// generic task variables
var sumInstructTime = 0; // ms
var instructTimeThresh = 5; // /in seconds

var practiceLen = 6; // must be divisible by shapes.length * stopSignalsConditions.length
var numTrialsPerBlock = 60; // must be divisible by shapes.length * stopSignalsConditions.length
var numTestBlocks = 3;

var practiceThresh = 3; // max number of times to repeat practice
var accuracyThresh = 0.8;
var practiceAccuracyThresh = 0.75;

var missedResponseThresh = 0.1;
var rtThresh = 750;

var SSD = 250;
var maxSSD = 1000;
var minSSD = 0;

var currentTrial = 0;
var correct_response = null;
var stimData = null;
var condition = null;

var maxStopCorrect = 0.75;
var minStopCorrect = 0.25;
var maxStopCorrectPractice = 1;
var minStopCorrectPractice = 0;

var stopSignalsConditions = ['go', 'go', 'stop'];
var shapes = ['circle', 'square'];

// IMAGES
// path info
var pathSource = '/static/experiments/stop_signal_rdoc__fmri/images/';
var postFileType = ".png'></img>";
var preFileType = "<img class = center src='" + pathSource;
// append to images array to preload
var images = [pathSource + 'stopSignal' + '.png'];
for (i = 0; i < shapes.length; i++) {
  images.push(pathSource + shapes[i] + '.png');
}

var promptTextList;
var promptText;
var speedReminder =
  '<p class = block-text>Try to respond as quickly and accurately as possible.</p>';

var feedbackText;

const setText = () => {
  choices = [possibleResponses[0][1], possibleResponses[1][1]];
  promptText = `
    <div class="prompt_box">
      <p class="center-block-text" style="font-size:16px; line-height:80%;">${
        possibleResponses[0][0] == 'index finger' ? shapes[0] : shapes[1]
      }: index finger</p>
      <p class="center-block-text" style="font-size:16px; line-height:80%;">${
        possibleResponses[1][0] == 'middle finger' ? shapes[1] : shapes[0]
      }: middle finger</p>
      <p class="center-block-text" style="font-size:16px; line-height:80%;">Do not respond if a star appears.</p>
    </div>
  `;

  promptTextList = `
  <ul style="text-align:left;">
    <li>${
      possibleResponses[0][0] == 'index finger' ? shapes[0] : shapes[1]
    }: index finger</li>
    <li>${
      possibleResponses[1][0] == 'middle finger' ? shapes[1] : shapes[0]
    }: middle finger</li>
    <li>Do not respond if a star appears.</li>
  </ul>
`;

  feedbackText = `
  <div class="centerbox">
    <p class="block-text">During this task, on each trial you will see shapes appear on the screen one at a time.</p>
    <p class="block-text">If the shape is a <b>${
      possibleResponses[0][0] == 'index finger' ? shapes[0] : shapes[1]
    }</b>, press your <b>index finger</b>.</p>
    <p class="block-text">If the shape is a <b>${
      possibleResponses[1][0] == 'middle finger' ? shapes[1] : shapes[0]
    }</b>, press your <b>middle finger</b>.</p>
    <p class="block-text">You should respond as quickly and accurately as possible to each shape.</p>
    <p class="block-text">On some trials, a star will appear around the shape, with or shortly after the shape appears.</p>
    <p class="block-text">If you see the star, please try your best to <b>withhold your response</b> on that trial.</p>
    <p class="block-text">If the star appears and you try your best to withhold your response, you will find that you will be able to stop sometimes, but not always.</p>
    <p class="block-text">Please <b>do not</b> slow down your responses in order to wait for the star. It is equally important to respond quickly on trials without the star as it is to stop on trials with the star.</p>
    <p class="block-text">We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
    ${speedReminder}
  </div>`;
};

/* ************************************ */
/*        Set up jsPsych blocks         */
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
    return trial_id === 'check_middle' ? undefined : 4000;
  },
  response_ends_trial: function () {
    const { trial_id } = jsPsych.data.get().last().trials[0];
    return trial_id === 'check_middle';
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
        options: Array.from({ length: 5 }, (_, i) => i + 1),
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
    stims = createTrialTypes(practiceLen);
    console.log('Starting stims: ', stims);
  },
};

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
      ITIParams: {
        min: 0,
        max: 5,
        mean: 0.5,
      },
      block_num: stage === 'practice' ? practiceCount : testCount,
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
    return getExpStage() === 'practice' ? promptText : '';
  },
  on_finish: function (data) {
    data['trial_duration'] = ITIms * 1000;
    data['stimulus_duration'] = ITIms * 1000;
  },
};

/** ******************************************/
/*				Set up nodes				*/
/** ******************************************/

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
for (i = 0; i < practiceLen; i++) {
  var practiceTrial = {
    type: jsPoldracklabStopSignal,
    stimulus: getStim,
    SS_stimulus: getStopStim,
    SS_trial_type: getCondition,
    data: {
      trial_id: 'practice_trial',
      exp_stage: 'practice',
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
    },
    choices: () => choices,
    correct_choice: getCorrectResponse,
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,
    SSD: getSSD,
    SS_duration: 500, // 500
    post_trial_gap: 0,
    on_finish: function (data) {
      appendData(data);
    },
    prompt: () => promptText,
  };

  var practiceFeedbackBlock = {
    type: jsPsychHtmlKeyboardResponse,
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
    stimulus: function () {
      var last = jsPsych.data.get().last(1).trials[0];
      if (last.condition == 'stop') {
        if (last.response === null) {
          return (
            '<div class=center-box><div class=center-text><font size = 20>Correct!</font></div></div>' +
            promptText
          );
        } else {
          return (
            '<div class=center-box><div class=center-text><font size = 20>There was a star</font></div></div>' +
            promptText
          );
        }
      } else {
        if (last.response == null) {
          return (
            '<div class=center-box><div class=center-text><font size = 20>Respond Faster!</font></div></div>' +
            promptText
          );
        } else if (last.response === last.correct_response) {
          return (
            '<div class=center-box><div class=center-text><font size = 20>Correct!</font></div></div>' +
            promptText
          );
        } else {
          return (
            '<div class=center-box><div class=center-text><font size = 20>Incorrect</font></div></div>' +
            promptText
          );
        }
      }
    },
    post_trial_gap: 0,
    stimulus_duration: 500, // 500
    trial_duration: 500, // 500
    response_ends_trial: false,
    prompt: () => promptText,
  };

  practiceTrials.push(ITIBlock, practiceTrial, practiceFeedbackBlock);
}

var practiceCount = 0;
var practiceNode = {
  timeline: [feedbackBlock].concat(practiceTrials),
  loop_function: function (data) {
    practiceCount += 1;
    currentTrial = 0;

    // go trials
    var goLength = 0;
    var sumGoRT = 0;
    var numGoResponses = 0;
    var sumGoCorrect = 0;
    // stop trials
    var stopLength = 0;
    var numStopResponses = 0;

    for (i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].condition == 'go' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        goLength += 1;
        if (data.trials[i].rt != null) {
          numGoResponses += 1;
          sumGoRT += data.trials[i].rt;
          if (data.trials[i].response == data.trials[i].correct_response) {
            sumGoCorrect += 1;
          }
        }
      } else if (
        data.trials[i].condition == 'stop' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        stopLength += 1;
        if (data.trials[i].rt != null) {
          numStopResponses += 1;
        }
      }
    }

    var avgRT = sumGoRT / numGoResponses;
    var missedResponses = (goLength - numGoResponses) / goLength;
    var aveShapeRespondCorrect = sumGoCorrect / goLength;
    var stopSignalRespond = numStopResponses / stopLength;

    feedbackText =
      '<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 4 seconds.</p>';

    if (aveShapeRespondCorrect <= practiceAccuracyThresh) {
      feedbackText += `
        <p class="block-text">Your accuracy is low. Remember:</p>
        ${promptTextList}`;
    }

    if (avgRT > rtThresh) {
      feedbackText += `
        <p class="block-text">You have been responding too slowly.</p>
        ${speedReminder}`;
    }

    if (missedResponses > missedResponseThresh) {
      feedbackText += `
          <p class="block-text">We have detected a number of trials that required a response, where no response was made. Please ensure that you are responding quickly and accurately to the shapes.</p>`;
    }

    if (stopSignalRespond === maxStopCorrectPractice) {
      feedbackText += `
        <p class="block-text">You have not been stopping your response when stars are present.</p>
        <p class="block-text">Please try your best to stop your response if you see a star.</p>`;
    }

    if (stopSignalRespond === minStopCorrectPractice) {
      feedbackText += `
        <p class="block-text">Please do not slow down and wait for the star to appear. Respond as quickly and accurately as possible when a star does not appear.</p>`;
    }

    feedbackText += `<p class="block-text">We are now going to start the task.</p>`;

    stims = stim_designs;
    expStage = 'test';
    return false;
  },
};

var testTrials = [];
for (i = 0; i < numTrialsPerBlock; i++) {
  var testTrial = {
    type: jsPoldracklabStopSignal,
    stimulus: getStim,
    SS_stimulus: getStopStim,
    SS_trial_type: getCondition,
    data: {
      trial_id: 'test_trial',
      exp_stage: 'test',
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
    },
    choices: () => choices,
    correct_choice: getCorrectResponse,
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    timing_duration: 1500,
    response_ends_trial: false,
    SSD: getSSD,
    SS_duration: 500, // 500
    on_finish: function (data) {
      appendData(data);
    },
    post_trial_gap: 0,
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
  timeline: [long_fixation_node, feedback_node].concat(
    long_fixation_node,
    testTrials
  ),
  loop_function: function (data) {
    currentTrial = 0;
    testCount += 1;

    var sumGoRT = 0;
    var sumGoCorrect = 0;
    var numGoResponses = 0;
    var numStopResponses = 0;
    var goLength = 0;
    var stopLength = 0;

    for (i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].condition == 'go' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        goLength += 1;
        if (data.trials[i].rt != null) {
          numGoResponses += 1;
          sumGoRT += data.trials[i].rt;
          if (data.trials[i].response == data.trials[i].correct_response) {
            sumGoCorrect += 1;
          }
        }
      } else if (
        data.trials[i].condition == 'stop' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        stopLength += 1;
        if (data.trials[i].rt != null) {
          numStopResponses += 1;
        }
      }
    }

    var avgRT = sumGoRT / numGoResponses;
    var missedResponses = (goLength - numGoResponses) / goLength;
    var aveShapeRespondCorrect = sumGoCorrect / goLength;
    var stopSignalRespond = numStopResponses / stopLength;

    if (testCount === numTestBlocks) {
      feedbackText = `<div class=centerbox>
        <p class=block-text>Done with this task.</p>
        </div>`;

      return false;
    } else {
      feedbackText =
        '<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 4 seconds.</p>';

      feedbackText += `<p class=block-text>You have completed ${testCount} out of ${numTestBlocks} blocks of trials.</p>`;

      if (aveShapeRespondCorrect < accuracyThresh) {
        feedbackText += `
        <p class="block-text">Your accuracy is low. Remember:</p>
        ${promptTextList}`;
      }

      if (avgRT > rtThresh) {
        feedbackText += `
        <p class="block-text">You have been responding too slowly.</p>
        ${speedReminder}`;
      }

      if (missedResponses > missedResponseThresh) {
        feedbackText += `
          <p class="block-text">We have detected a number of trials that required a response, where no response was made. Please ensure that you are responding quickly and accurately to the shapes.</p>`;
      }

      if (stopSignalRespond >= maxStopCorrect) {
        feedbackText += `
        <p class="block-text">You have not been stopping your response when stars are present.</p>
        <p class="block-text">Please try your best to stop your response if you see a star.</p>`;
      }

      if (stopSignalRespond <= minStopCorrect) {
        feedbackText += `
        <p class="block-text">Please do not slow down and wait for the star to appear. Respond as quickly and accurately as possible when a star does not appear.</p>`;
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
      'http://0.0.0.0:8080/static/experiments/stop_signal_rdoc__fmri/designs';
    const results = await loadDesignsAndITIs(design_perm, design_path, [
      'stims',
    ]);
    ITIs = results.ITIs;
    stim_designs = create_test_trials(results.stims);
  },
};

var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var expID = 'stop_signal_rdoc__fmri';
var endText = `
  <div class="centerbox", style="height: 50vh;">
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

var stop_signal_rdoc__fmri_experiment = [];
var stop_signal_rdoc__fmri_init = () => {
  jsPsych.pluginAPI.preloadImages(images);
  stop_signal_rdoc__fmri_experiment.push(motor_and_design_perm_block);
  stop_signal_rdoc__fmri_experiment.push(fullscreen);
  stop_signal_rdoc__fmri_experiment.push(check_fingers_node);

  // Practice block
  stop_signal_rdoc__fmri_experiment.push(practiceNode);
  stop_signal_rdoc__fmri_experiment.push(feedbackBlock);
  stop_signal_rdoc__fmri_experiment.push(fmri_wait_node);

  // Test block
  stop_signal_rdoc__fmri_experiment.push(testNode);
  stop_signal_rdoc__fmri_experiment.push(endBlock);
  stop_signal_rdoc__fmri_experiment.push(exitFullscreen);
};
