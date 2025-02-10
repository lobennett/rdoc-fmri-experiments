function createPracticeStimArrays(blockLen) {
  let blockStimConditions = [];
  let blockStimNums = [];
  let blockStimTargets = [];

  for (let i = 0; i < blockLen; i++) {
    if (i < practiceLen / 2) {
      blockStimConditions.push('feature');
      if (i % 2 === 0) {
        blockStimNums.push(8);
        blockStimTargets.push(1);
      } else {
        blockStimNums.push(24);
        blockStimTargets.push(0);
      }
    } else {
      blockStimConditions.push('conjunction');
      if (i % 2 === 0) {
        blockStimNums.push(8);
        blockStimTargets.push(0);
      } else {
        blockStimNums.push(24);
        blockStimTargets.push(1);
      }
    }
  }

  return { blockStimConditions, blockStimNums, blockStimTargets };
}

const create_test_stimuli = (designs) => {
  let stimConditions = [];
  let stimNums = [];
  let stimTargets = [];
  designs.forEach((d) => {
    let target = Math.round(Math.random());

    if (d === 'feat_low') {
      stimConditions.push('feature');
      stimNums.push(8);
      stimTargets.push(target);
    } else if (d === 'feat_high') {
      stimConditions.push('feature');
      stimNums.push(24);
      stimTargets.push(target);
    } else if (d === 'con_low') {
      stimConditions.push('conjunction');
      stimNums.push(8);
      stimTargets.push(target);
    } else if (d === 'con_high') {
      stimConditions.push('conjunction');
      stimNums.push(24);
      stimTargets.push(target);
    } else {
      throw new Error(`Design ${d} not matching any condition.`);
    }
  });

  return getStims(
    stimNums,
    stimTargets,
    stimConditions,
    numTrialsPerBlock * numTestBlocks
  );
};

function shuffleArray(array) {
  // Create a copy of the original array
  const shuffledArray = [...array];

  // Perform Fisher-Yates shuffle
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

var trialTargetPresent;
var condition;
var numberStim;

function getStims(
  blockStimNums,
  blockStimTargets,
  blockStimConditions,
  length
) {
  const containerWidth = window.innerWidth * 0.7;
  const containerHeight = window.innerHeight * 0.7;
  const boxWidth = 40;
  const boxHeight = 80;
  var stims = [];

  for (var i = 0; i < length; i++) {
    const targetPresent = blockStimTargets.shift();
    const stimCondition = blockStimConditions.shift();
    const stimNum = blockStimNums.shift();
    const targetIndex = Math.floor(Math.random() * stimNum);
    const html = generateHTML(
      containerWidth,
      containerHeight,
      targetPresent,
      targetIndex,
      boxWidth,
      boxHeight,
      stimCondition,
      stimNum
    );

    var obj = {
      html: html,
      targetPresent: targetPresent,
      condition: stimCondition,
      stimNum: stimNum,
    };

    stims.push(obj);
  }

  return stims;
}

function getStim() {
  stim = blockStims.shift();
  trialTargetPresent = stim.targetPresent;
  condition = stim.condition;
  numberStim = stim.stimNum;
  return stim.html;
}

const getCurrBlockNum = () =>
  getExpStage() === 'practice' ? practiceCount : testCount;

function getStimProperties(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const divs = doc.querySelectorAll('.container > div');
  const ids = Array.from(divs).map((div) => div.id);

  const parsedIDList = ids.map((item) => {
    if (item === 'black-distractor-element') {
      return 'black vertical';
    } else if (item === 'white-distractor-element') {
      return 'white horizontal';
    } else if (item === 'target') {
      return 'white vertical';
    }
  });

  return parsedIDList;
}

const getTargetLocation = (arr) => arr.indexOf('white vertical');

function generateHTML(
  containerWidth,
  containerHeight,
  targetPresent,
  targetIndex,
  boxWidth,
  boxHeight,
  stimCondition,
  stimNum
) {
  let html;

  html =
    '<div class="container" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: ' +
    containerWidth +
    'px; height: ' +
    containerHeight +
    'px;">';

  const positions = [];
  let rows;
  let cols;

  if (stimNum === 8) {
    rows = 4;
    cols = 2;
  } else if (stimNum === 24) {
    rows = 6;
    cols = 4;
  } else {
    throw new Error('Invalid value of n. Only 8 or 24 is supported.');
  }

  const spacingX = (containerWidth - cols * boxWidth) / (cols + 1);
  const spacingY = (containerHeight - rows * boxHeight) / (rows + 1);

  for (let i = 0; i < stimNum; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    const left = spacingX * (col + 1) + col * boxWidth;
    const top = spacingY * (row + 1) + row * boxHeight;

    positions.push({ left, top });

    if (i === targetIndex && targetPresent) {
      html += generateTargetElement(left, top, boxWidth, boxHeight);
    } else {
      html += generateDistractorElement(
        left,
        top,
        boxWidth,
        boxHeight,
        stimCondition
      );
    }
  }

  html += '</div>';

  return html;
}

function generateTargetElement(left, top, width, height) {
  return (
    '<div id="target" class="box" style="position: absolute; left: ' +
    left +
    'px; top: ' +
    top +
    'px; width: ' +
    width +
    'px; height: ' +
    height +
    'px; background-color: white;"></div>'
  );
}

function generateDistractorElement(left, top, width, height, stimCondition) {
  if (stimCondition === 'feature') {
    return (
      '<div id="black-distractor-element" class="box" style="position: absolute; left: ' +
      left +
      'px; top: ' +
      top +
      'px; width: ' +
      width +
      'px; height: ' +
      height +
      'px; background-color: black;"></div>'
    );
  } else if (stimCondition === 'conjunction') {
    if (Math.random() < 0.5) {
      return (
        '<div id="white-distractor-element"  class="box" style="position: absolute; left: ' +
        left +
        'px; top: ' +
        top +
        'px; width: ' +
        width +
        'px; height: ' +
        height +
        'px; background-color: white; transform: rotate(90deg); transform-origin: center;"></div>'
      );
    } else {
      return (
        '<div id="black-distractor-element"  class="box" style="position: absolute; left: ' +
        left +
        'px; top: ' +
        top +
        'px; width: ' +
        width +
        'px; height: ' +
        height +
        'px; background-color: black;"></div>'
      );
    }
  }
}

const getExpStage = () => expStage;

const getCurrCondition = () => condition;

const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
const fixationDuration = 500;
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

var possibleResponses;
var choices;
var speedReminder =
  '<p class = block-text>Try to respond as quickly and accurately as possible.</p>';

var feedbackText;

const setText = () => {
  promptTextList = `
    <ul style="text-align: left; font-size: 24px;">
      <li>${
        possibleResponses[0][0] === 'index finger' ? 'Present' : 'Absent'
      }: Index</li>
      <li>${
        possibleResponses[0][0] === 'index finger' ? 'Absent' : 'Present'
      }: Middle</li>
    </ul>`;

  promptText = `
    <div class="prompt_box">
      <p class="center-block-text" style="font-size: 16px; line-height: 80%;">${
        possibleResponses[0][0] === 'index finger' ? 'Present' : 'Absent'
      }: Index</p>
      <p class="center-block-text" style="font-size: 16px; line-height: 80%;">${
        possibleResponses[0][0] === 'index finger' ? 'Absent' : 'Present'
      }: Middle</p>
    </div>`;

  choices = [possibleResponses[0][1], possibleResponses[1][1]];

  feedbackText = `<div class="centerbox" style='width: 60vw; height: auto !important;'>
    <p class="block-text">During this task, on each trial rectangles will appear on the screen. The rectangles can be either black or white in color.</p>
    <p class="block-text">On some trials, <b>one</b> of these rectangles will be a <b>vertical white rectangle</b>. We will call this rectangle the 'target'.</p>
    <div style="display: flex; align-items: center; justify-content: center; padding-top: 80px; padding-bottom: 80px;">
    <p style="width: 70%; font-size: 24px;">The target looks like: </p>
    <div style="display: flex; justify-content: center; align-items: center; width:100%;">
    <div id="target" class="box" style="background-color:white; width:40px; height:80px;"></div>
    </div>
    </div>
    <p class="block-text">Your task is to determine whether a target is ${
      possibleResponses[0][0] === 'index finger' ? 'present' : 'absent'
    } or ${
    possibleResponses[0][0] === 'index finger' ? 'absent' : 'present'
  } on each trial.</p>
    <p class="block-text">If you determine a target is <b>${
      possibleResponses[0][0] === 'index finger' ? 'present' : 'absent'
    }</b>, press your <b>index finger</b>, and if you determine a target is <b>${
    possibleResponses[0][0] === 'index finger' ? 'absent' : 'present'
  }</b>, press your <b>middle finger</b>.</p>
    <p class="block-text">We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
    ${speedReminder}
  </div>`;
};

const stimStimulusDuration = 1500;
const stimTrialDuration = 2000;

// thresholds
var sumInstructTime = 0; // ms
const instructTimeThresh = 5; // /in seconds
const accuracyThresh = 0.8; // threshhold for block-level feedback
const practiceAccuracyThresh = 0.75; //threshold to proceed to test blocks, 3 out of 4 trials for .75

const rtThresh = 1250;
const missedResponseThresh = 0.1;

// trial nums
var practiceLen = 4;
var numTrialsPerBlock = 64;
var numTestBlocks = 3;

var practiceCount = 0;
var practiceThresh = 3;

var expStage = 'practice';

/*  ######## Important text values for display ######## */
var promptText;
var promptTextList;

// setting first value for feature/conjunction condition
const conditionArray = ['feature', 'conjunction'];

var blockStims = [];
var blockStimNums = [];
var blockStimTargets = [];
var blockStimConditions = [];

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

var testTrial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: getStim,
  choices: choices,
  stimulus_duration: stimStimulusDuration, // 1500,
  trial_duration: stimTrialDuration, // 1500
  response_ends_trial: false,
  prompt: function () {
    return getExpStage() === 'practice' ? promptText : '';
  },
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_trial`,
      choices: choices,
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
      block_num: stage === 'practice' ? practiceCount : testCount,
    };
  },
  on_finish: function (data) {
    data['target_present'] = trialTargetPresent ? 1 : 0;
    data['num_stimuli'] = numberStim;
    data['condition'] = condition;
    data['exp_stage'] = getExpStage();
    data['correct_response'] = trialTargetPresent
      ? possibleResponses[0][1]
      : possibleResponses[1][1];

    if (data.response !== null) {
      if (trialTargetPresent === 1) {
        if (data.response === possibleResponses[0][1]) {
          data['correct_trial'] = 1;
        } else {
          data['correct_trial'] = 0;
        }
      } else {
        if (data.response === possibleResponses[0][1]) {
          data['correct_trial'] = 0;
        } else {
          data['correct_trial'] = 1;
        }
      }
    } else {
      data['correct_trial'] = null;
    }

    let stimProperties = getStimProperties(data.stimulus);
    data['order_and_color_of_rectangles'] = stimProperties;
    data['target_rectangle_location'] = trialTargetPresent
      ? getTargetLocation(stimProperties)
      : null;
  },
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
    return trial_id === 'check_middle' ? undefined : 4000;
  },
  response_ends_trial: function () {
    const { trial_id } = jsPsych.data.get().last().trials[0];
    return trial_id === 'check_middle';
  },
  on_finish: function (data) {
    data['block_level_feedback'] = block_level_feedback;
  },
};

var ITIms = null;

// *** ITI *** //
var ITIBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  response_ends_trial: false,
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
    const { blockStimConditions, blockStimNums, blockStimTargets } =
      createPracticeStimArrays(practiceLen);

    blockStims = getStims(
      blockStimNums,
      blockStimTargets,
      blockStimConditions,
      practiceLen
    );

    blockStims = jsPsych.randomization.repeat(blockStims, 1);
  },
};

var practiceFeedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    var last = jsPsych.data.get().last(1).trials[0];
    if (last.response === null) {
      return '<div class=center-box><p class=center-text>Respond Faster!</div></div>';
    }
    if (last.correct_trial === 1) {
      return '<div class=center-box><p class=center-text>Correct!</div></div>';
    } else if (last.correct_trial === 0) {
      return '<div class=center-box><p class=center-text>Incorrect!</div></div>';
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
  response_ends_trial: false,
  stimulus_duration: 500,
  trial_duration: 500,
  prompt: function () {
    return getExpStage() === 'practice' ? promptText : '';
  },
};

var practiceTrials = [];
for (let i = 0; i < practiceLen; i++) {
  practiceTrials.push(ITIBlock, testTrial, practiceFeedbackBlock);
}
var block_level_feedback = {};
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
        if (data.trials[i].rt != null) {
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
      let text =
        '<p class="block-text">Your accuracy was low.</p>' + promptTextList;
      feedbackText += text;
      feedback['accuracy'] = {
        value: accuracy,
        text: text,
      };
    }
    if (avgRT > rtThresh) {
      let text = `<p class="block-text">Please respond more quickly without sacrificing accuracy.</p>`;
      feedbackText += text;
      feedback['rt'] = {
        value: avgRT,
        text: text,
      };
    }
    if (missedResponses > missedResponseThresh) {
      let text = `<p class="block-text">Respond on every trial.</p>`;
      feedbackText += text;
      feedback['missed_responses'] = {
        value: missedResponses,
        text: text,
      };
    }

    feedbackText += '</div>';

    blockStims = stim_designs;
    block_level_feedback = feedback;
    expStage = 'test';
    return false;
  },
};

var testTrials = [];
for (let i = 0; i < numTrialsPerBlock; i++) {
  testTrials.push(ITIBlock, testTrial);
}
var testCount = 0;

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
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
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

    if (testCount === numTestBlocks) {
      let text = `<div class=centerbox>
        <p class=block-text>Done with this task.</p>
        </div>`;
      feedbackText = text;
      feedback['done'] = {
        value: true,
        text: text,
      };
      block_level_feedback = feedback;
      return false;
    } else {
      feedbackText = '<div class = centerbox>';

      feedbackText += `<p class=block-text>You have completed ${testCount} out of ${numTestBlocks} blocks of trials.</p>`;

      if (accuracy < accuracyThresh) {
        let text =
          '<p class="block-text">Your accuracy was low.</p>' + promptTextList;
        feedbackText += text;
        feedback['accuracy'] = {
          value: accuracy,
          text: text,
        };
      }
      if (avgRT > rtThresh) {
        let text = `<p class="block-text">Please respond more quickly without sacrificing accuracy.</p>`;
        feedbackText += text;
        feedback['rt'] = {
          value: avgRT,
          text: text,
        };
      }
      if (missedResponses > missedResponseThresh) {
        let text = `<p class="block-text">Respond on every trial.</p>`;
        feedbackText += text;
        feedback['missed_responses'] = {
          value: missedResponses,
          text: text,
        };
      }

      feedbackText += '</div>';

      block_level_feedback = feedback;
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
      'http://0.0.0.0:8080/static/experiments/visual_search_rdoc__fmri/designs';
    const results = await loadDesignsAndITIs(design_perm, design_path, [
      'stims',
    ]);
    ITIs = results.ITIs;
    stim_designs = create_test_stimuli(results.stims);
  },
};

var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var expID = 'visual_search_rdoc__fmri';
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

var visual_search_rdoc__fmri_experiment = [];
var visual_search_rdoc__fmri_init = () => {
  visual_search_rdoc__fmri_experiment.push(motor_and_design_perm_block);
  visual_search_rdoc__fmri_experiment.push(fullscreen);
  visual_search_rdoc__fmri_experiment.push(check_fingers_node);
  visual_search_rdoc__fmri_experiment.push(practiceNode);
  visual_search_rdoc__fmri_experiment.push(feedbackBlock);
  visual_search_rdoc__fmri_experiment.push(fmri_wait_node);
  visual_search_rdoc__fmri_experiment.push(testNode);
  visual_search_rdoc__fmri_experiment.push(endBlock);
  visual_search_rdoc__fmri_experiment.push(exitFullscreen);
};
