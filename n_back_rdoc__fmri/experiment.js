// Adding all available keys for button box
// - Four our configuration, keys can only be 'b', 'y', 'g', 'r', 'e'
const buttonBoxKeys = ['b', 'y', 'g', 'r', 'e'];

const getExpStage = () => expStage;

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

const randomDraw = (lst) => {
  var index = Math.floor(Math.random() * lst.length);
  return lst[index];
};

const create_conditions = () => {
  // Create an array with 4 "match" and 1 "mismatch"
  let conditions = ['mismatch', 'mismatch', 'mismatch', 'mismatch', 'match'];

  // Function to shuffle the array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Shuffle the array
  shuffleArray(conditions);

  conditions.unshift('starter_trial', 'starter_trial');

  // Return the shuffled array
  return conditions;
};

const create_conditions_from_designs = (designs) => {
  const createBlocks = (blocks) => {
    let matchTarget = (numTrialsPerBlock * numTestBlocks) / 5;
    let matchCount = 0;

    // Assign each block one "match" condition
    blocks.forEach((block) => {
      let randomIndex = Math.floor(Math.random() * block.length); // Use block.length to stay within bounds
      block[randomIndex] = 'match';
      matchCount++;
    });

    // Go through remaining blocks at random and assign remaining match conditions
    let remainingMatchTrials = matchTarget - matchCount;
    let randomBlockIndices = [];
    for (let i = 0; i < remainingMatchTrials; i++) {
      let randomIndex = Math.floor(Math.random() * blocks.length); // Use blocks.length to stay within bounds
      randomBlockIndices.push(randomIndex);
    }

    randomBlockIndices.forEach((i) => {
      if (i < blocks.length) {
        // Ensure i is within the range of blocks array
        let randomIndex = Math.floor(Math.random() * blocks[i].length);

        // Keep generating a new random index until we find one that isn't "match"
        while (blocks[i][randomIndex] !== 'mismatch') {
          randomIndex = Math.floor(Math.random() * blocks[i].length);
        }

        // Set the selected index's value to "match"
        blocks[i][randomIndex] = 'match';
      }
    });

    return blocks;
  };
  let conditions = [];
  let blockStart = [];

  designs.forEach((design, index) => {
    if (design === 'starter_trial') {
      if (
        designs[index - 1] === 'one_back' ||
        designs[index - 1] === 'two_back' ||
        designs[index - 1] === undefined
      ) {
        blockStart.push(index);
      }
      conditions.push(design);
    } else {
      conditions.push('mismatch');
    }
  });

  let subArrays = [];

  for (let i = 0; i < blockStart.length; i++) {
    // Use blockStart[i] as start, blockStart[i+1] as end for slice. If it's the last one, slice until the end of the array.
    let end = blockStart[i + 1] || conditions.length;
    let subset = conditions.slice(blockStart[i], end);
    subArrays.push(subset);
  }

  const blocks = createBlocks(subArrays);
  const trials = blocks.flat();
  return trials;
};

var getStim = function () {
  stim = stims.shift();
  nbackCondition = stim.condition;
  probe = stim.probe;
  correctResponse = stim.correct_response;
  delay = stim.delay;

  if (probe == probe.toUpperCase()) {
    letterCase = 'uppercase';
  } else if (probe == probe.toLowerCase()) {
    letterCase = 'lowercase';
  }

  return (
    taskBoards[0] +
    preFileType +
    letterCase +
    '_' +
    probe.toUpperCase() +
    fileTypePNG +
    taskBoards[1]
  );
};

const getCurrBlockNum = () =>
  getExpStage() === 'practice' ? practiceCount : testCount;

var appendData = function () {
  var currentTrial = jsPsych.data.get().last().trials[0];

  var correctTrial = 0;
  if (currentTrial.response == correctResponse) {
    correctTrial = 1;
  }

  jsPsych.data.get().addToLast({
    condition: nbackCondition,
    probe: probe,
    correct_response: correctResponse,
    delay: delay,
    letter_case: letterCase,
    correct_trial: correctTrial,
    block_num: getExpStage() == 'practice' ? practiceCount : testCount,
  });
};

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
// common variables
const fixationDuration = 500;
var possibleResponses;

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

var expStage = 'practice';
var letters = 'bBdDgGtTvV'.split('');

// *: Timing
const stimStimulusDuration = 1000;
const stimTrialDuration = 1500;

// generic task variables
var sumInstructTime = 0; // ms
var instructTimeThresh = 5;

var expLen = 120;
var practiceLen = 5;
var numTrialsPerBlock = 12;
var numTestBlocks = expLen / numTrialsPerBlock; //  10 test blocks total
var practiceThresh = 3;

var delay = 2;
var nbackConditions = ['match', 'mismatch', 'mismatch', 'mismatch', 'mismatch'];

var stims;

var accuracyThresh = 0.8;
var practiceAccuracyThresh = 0.8;
var rtThresh = 750;
var missedResponseThresh = 0.1;

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
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // NOTE: Half start with 1-back, half with 2-back
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

    practiceConditions = create_conditions();
    stims = create_trial_types(practiceConditions);
    console.log('Starting practice stims: ', stims);
    setText();
  },
};

var long_fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  response_ends_trial: false,
  choices: buttonBoxKeys,
  data: function () {
    return {
      trial_id: 'test_long_fixation',
      exp_stage: 'test',
      trial_duration: 500,
      stimulus_duration: 500,
      block_num: testCount,
      choices: buttonBoxKeys,
    };
  },
  stimulus_duration: 500,
  trial_duration: 500,
};

var long_fixation_node = {
  timeline: [long_fixation],
  conditional_function: function () {
    const { trial_id } = jsPsych.data.get().last().trials[0];
    if (trial_id === 'fmri_wait_block_trigger_end') return false;

    return true;
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

const base = window.location.origin;
const pathSource = `${base}/static/experiments/n_back_rdoc__fmri/images/`;
var fileTypePNG = ".png'></img>";
var preFileType =
  `<img class=center src='${pathSource}`;

var promptTextList;
var speedReminder;
var pageInstruct;

var setText = () => {
  promptTextList = `
  <ul style="text-align:left;">
    <li>${
      possibleResponses[0][0] === 'index finger'
        ? 'Match (the delayed letter)'
        : 'Mismatch'
    }: Index</li>
    <li>${
      possibleResponses[0][0] === 'index finger'
        ? 'Mismatch'
        : 'Match (the delayed letter)'
    }: Middle</li>
  </ul>
`;

  speedReminder =
    '<p class = block-text>Try to respond as quickly and accurately as possible.</p>';

  feedbackText = `
  <div class="centerbox" style="height: auto;">
    <p class="block-text">On each trial you will see a letter.</p>
    <p class="block-text">Your task is to match the current letter to the letter that appeared either 1 or 2 trials ago, depending on the delay (1- or 2-back) presented at the beginning of the block.</p>
    <p class="block-text">Press your <b>index finger</b> if the letters <b>${
      possibleResponses[0][0] === 'index finger' ? 'match' : 'mismatch'
    }</b>, and your <b>middle finger</b> if they <b>${
    possibleResponses[0][0] === 'index finger' ? 'mismatch' : 'match'
  }</b>.</p>
    <p class="block-text">Capitalization does not matter, so "T" matches with "t".</p>
    <p class="block-text"><b>Your delay for this practice round is ${delay}</b>.</p>
    <p class="block-text">For blocks with a delay of <b>${delay}</b>, respond <b>mismatch</b> for the <b>first ${
    delay === 1 ? 'trial' : 'two trials'
  }</b>.</p>
  </div>
  `;

  choices = [possibleResponses[0][1], possibleResponses[1][1]];
};

var getPromptText = function () {
  return `
    <div class="prompt_box">
      <p class="center-block-text" style="font-size:16px; line-height:80%;">Match the current letter to the letter that appeared ${delay} ${
    delay === 1 ? 'trial' : 'trials'
  } ago.</p>
      <p class="center-block-text" style="font-size:16px; line-height:80%;">${
        possibleResponses[0][0] === 'index finger' ? 'Match' : 'Mismatch'
      }: Index</p>
      <p class="center-block-text" style="font-size:16px; line-height:80%;">${
        possibleResponses[0][0] === 'index finger' ? 'Mismatch' : 'Match'
      }: Middle</p>
    </div>
  `;
};

// IMAGES TO PRELOAD
var lettersPreload = ['B', 'D', 'G', 'T', 'V'];
var casePreload = ['lowercase', 'uppercase'];
var images = [];

for (i = 0; i < lettersPreload.length; i++) {
  for (x = 0; x < casePreload.length; x++) {
    images.push(pathSource + casePreload[x] + '_' + lettersPreload[i] + '.png');
  }
}
// preload them later when we have access to jsPsych variable

/* ************************************ */
/*          Define Game Boards          */
/* ************************************ */

var taskBoards = [
  '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text>',
  '</div></div></div></div>',
];

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

var ITIms = null;

// *** ITI *** //
var ITIBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  choices: buttonBoxKeys,
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
      choices: buttonBoxKeys,
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
    return getExpStage() === 'practice' ? getPromptText() : '';
  },
  on_finish: function (data) {
    data['trial_duration'] = ITIms * 1000;
    data['stimulus_duration'] = ITIms * 1000;
  },
};

/* ************************************ */
/*        Set up timeline blocks        */
/* ************************************ */
var practiceTrials = [];
for (i = 0; i < practiceLen + 2; i++) {
  var practiceTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: buttonBoxKeys,
    data: {
      trial_id: 'practice_trial',
      exp_stage: 'practice',
      choices: buttonBoxKeys,
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
    },
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,
    prompt: getPromptText,
    on_finish: appendData,
  };

  var practiceFeedbackBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      var last = jsPsych.data.get().last(1).values()[0];
      if (last.response === null) {
        return '<div class=center-box><div class=center-text><font size =20>Respond Faster!</font></div></div>';
      } else if (last.correct_trial === 1) {
        return '<div class=center-box><div class=center-text><font size =20>Correct!</font></div></div>';
      } else {
        return '<div class=center-box><div class=center-text><font size =20>Incorrect</font></div></div>';
      }
    },
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
    prompt: getPromptText,
  };

  practiceTrials.push(ITIBlock, practiceTrial, practiceFeedbackBlock);
}

// Create variable to log block-level feedback
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
        data.trials[i].trial_id == 'practice_trial' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
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

    stims = stim_designs;

    let current_delay =
      stims[0].condition === 'starter_trial' &&
      stims[1].condition === 'starter_trial'
        ? 2
        : 1;

    block_level_feedback = feedback;

    delay = current_delay;

    feedbackText += `<p class="block-text"><b>Delay = ${delay}</b>.</p>`;
    feedbackText += '</div>';

    expStage = 'test';
    return false;
  },
};

const create_test_trials = (delay) => {
  let testTrials = [];
  for (i = 0; i < numTrialsPerBlock + delay; i++) {
    var testTrial = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: getStim,
      choices: buttonBoxKeys,
      data: {
        trial_id: 'test_trial',
        exp_stage: 'test',
        choices: buttonBoxKeys,
        trial_duration: stimTrialDuration,
        stimulus_duration: stimStimulusDuration,
      },
      stimulus_duration: stimStimulusDuration, // 1000
      trial_duration: stimTrialDuration, // 1500
      response_ends_trial: false,
      on_finish: appendData,
    };
    testTrials.push(ITIBlock, testTrial);
  }
  return testTrials;
};

var one_back_trials = create_test_trials(1);
var two_back_trials = create_test_trials(2);

var one_back_conditional_node = {
  timeline: one_back_trials,
  conditional_function: function () {
    if (delay === 1) return true;

    return false;
  },
};

var two_back_conditional_node = {
  timeline: two_back_trials,
  conditional_function: function () {
    if (delay === 2) return true;

    return false;
  },
};

var testCount = 0;
var testNode = {
  timeline: [long_fixation_node, feedback_node].concat(
    long_fixation_node,
    one_back_conditional_node,
    two_back_conditional_node
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

    let current_delay =
      stims[0].condition === 'starter_trial' &&
      stims[1].condition === 'starter_trial'
        ? 2
        : 1;

    delay = current_delay;

    feedbackText += `<p class=block-text><b>Delay = ${delay}</b>.</p>`;

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

    return true;
  },
  on_timeline_finish: function () {
    // window.dataSync();
  },
};

var ITIs = [];
var stim_designs = [];
var trial_designs = [];
var fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  on_finish: async function () {
    console.log('Reading in designs and ITIs...');
    const base = window.location.origin;
    const design_path = `${base}/static/experiments/n_back_rdoc__fmri/designs`;
    const results = await loadDesignsAndITIs(design_perm, design_path, [
      'stims',
    ]);
    ITIs = results.ITIs;
    let testConditions = create_conditions_from_designs(results.stims);
    stim_designs = create_trial_types(testConditions);
  },
};

var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var expID = 'n_back_rdoc__fmri';
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

const check_conditions = (conditions) => {
  let mm = 0; // Count of mismatches
  let m = 0; // Count of matches
  let st = 0; // Count of starter trials

  conditions.forEach((o) => {
    if (o === 'mismatch') {
      mm++;
    } else if (o === 'match') {
      m++;
    } else if (o === 'starter_trial') {
      st++;
    }
  });

  // Construct error message if conditions don't match expected values

  if (m !== (numTrialsPerBlock * numTestBlocks) / 5) {
    throw new Error(
      `Wrong number of condition counts: mismatches=${mm}, matches=${m}, starter_trials=${st}`
    );
  }
};

var delays = [];
const create_trial_types = (conditions) => {
  let blockStart = [];
  conditions.forEach((c, index) => {
    if (c === 'starter_trial') {
      if (
        conditions[index - 1] === 'match' ||
        conditions[index - 1] === 'mismatch' ||
        conditions[index - 1] === undefined
      ) {
        blockStart.push(index);
      }
    }
  });

  let subArrays = [];

  for (let i = 0; i < blockStart.length; i++) {
    let end = blockStart[i + 1] || conditions.length;
    let subset = conditions.slice(blockStart[i], end);
    subArrays.push(subset);
  }

  let all = [];
  subArrays.forEach((s, index) => {
    let probeHistory = [];
    let delay = s[0] === 'starter_trial' && s[1] === 'starter_trial' ? 2 : 1;
    let stims = [];

    s.forEach((c) => {
      let temp = {
        condition: c,
        probe: null,
        correct_response: null,
        delay: delay,
      };

      if (c === 'starter_trial') {
        temp.probe = randomDraw(letters);
        temp.correct_response = possibleResponses[1][1];
      } else if (c === 'match' && probeHistory.length >= delay) {
        let lastProbe = probeHistory[probeHistory.length - delay];
        temp.probe =
          Math.random() < 0.5
            ? lastProbe.toLowerCase()
            : lastProbe.toUpperCase();
        temp.correct_response = possibleResponses[0][1];
      } else if (c === 'mismatch' && probeHistory.length) {
        let lastProbe = probeHistory[probeHistory.length - delay];
        let filteredLetters = letters.filter(
          (letter) =>
            letter.toLowerCase() !== lastProbe.toLowerCase() && // Ensure consistent case comparison
            letter.toUpperCase() !== lastProbe.toUpperCase()
        );
        temp.probe = randomDraw(filteredLetters);
        temp.correct_response = possibleResponses[1][1];
      }

      // Store the current probe in the history, maintain case
      probeHistory.push(temp.probe);
      stims.push(temp);
    });
    all.push(stims);
  });

  return all.flat();
};

var n_back_rdoc__fmri_experiment = [];
var n_back_rdoc__fmri_init = () => {
  jsPsych.pluginAPI.preloadImages(images);
  n_back_rdoc__fmri_experiment.push(motor_and_design_perm_block);
  n_back_rdoc__fmri_experiment.push(fullscreen);
  n_back_rdoc__fmri_experiment.push(check_fingers_node);

  // Start practice
  n_back_rdoc__fmri_experiment.push(practiceNode);
  n_back_rdoc__fmri_experiment.push(feedbackBlock);
  // wait for scanner
  n_back_rdoc__fmri_experiment.push(fmri_wait_node);

  // start test blocks
  n_back_rdoc__fmri_experiment.push(testNode);
  n_back_rdoc__fmri_experiment.push(long_fixation_node);
  n_back_rdoc__fmri_experiment.push(feedbackBlock);

  n_back_rdoc__fmri_experiment.push(endBlock);
  n_back_rdoc__fmri_experiment.push(exitFullscreen);
};
