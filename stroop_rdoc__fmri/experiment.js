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

function renameDataProperties() {
  // Fetch the data from the experiment
  var data = jsPsych.data.get().trials;
  // rename colors from hex values to color words
  data.forEach(function (obj) {
    if (obj.stim_color === '#FF7070') {
      obj.stim_color = 'red';
    } else if (obj.stim_color === '#7070FF') {
      obj.stim_color = 'blue';
    } else if (obj.stim_color === '#70FF70') {
      obj.stim_color = 'green';
    }
  });
}

// Function to randomly select n elements from an array without replacement
function getRandomElements(arr, n) {
  let result = [];
  let tempArray = [...arr]; // Create a copy of the array to avoid modifying the original array

  for (let i = 0; i < n; i++) {
    if (tempArray.length === 0) {
      break; // Break if there are no more elements to select
    }

    const randomIndex = Math.floor(Math.random() * tempArray.length);
    result.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1); // Remove the selected element from the temporary array
  }

  return result;
}

const getExpStage = () => expStage;

function appendData() {
  var data = jsPsych.data.get().last(1).values()[0];

  if (data.response === null) {
    data.response = -1;
  }

  if (data.response === data.correct_response) {
    var correctTrial = 1;
  } else {
    var correctTrial = 0;
  }

  jsPsych.data.get().addToLast({ correct_trial: correctTrial });
}

const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

const getStim = () => {
  currStim = blockStims.shift();
  return currStim.stimulus;
};

const getStimData = () => currStim.data;

const getKeyAnswer = () => currStim.key_answer;

const getCurrBlockNum = () =>
  getExpStage() === 'practice' ? practiceCount : testCount;

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
const fixationDuration = 500;

var possibleResponses;

// TODO: Confirm ring is 'r' key and not 'c' key
function getKeyMappingForTask(motor_perm) {
  if (motor_perm === 0) {
    possibleResponses = [
      ['index finger', 'y', 'index finger'], // red
      ['middle finger', 'g', 'middle finger'], // blue
      ['ring finger', 'r', 'ring finger'], // green
    ];
  } else if (motor_perm === 1) {
    possibleResponses = [
      ['middle finger', 'g', 'middle finger'], // red
      ['index finger', 'y', 'index finger'], // blue
      ['ring finger', 'r', 'ring finger'], // green
    ];
  } else if (motor_perm === 2) {
    possibleResponses = [
      ['middle finger', 'g', 'middle finger'], // red
      ['ring finger', 'r', 'ring finger'], // blue
      ['index finger', 'y', 'index finger'], // green
    ];
  } else if (motor_perm === 3) {
    possibleResponses = [
      ['ring finger', 'r', 'ring finger'], // red
      ['index finger', 'y', 'index finger'], // blue
      ['middle finger', 'g', 'middle finger'], // green
    ];
  } else if (motor_perm === 4) {
    possibleResponses = [
      ['ring finger', 'r', 'ring finger'], // red
      ['middle finger', 'g', 'middle finger'], // blue
      ['index finger', 'y', 'index finger'], // green
    ];
  } else if (motor_perm === 5) {
    possibleResponses = [
      ['index finger', 'y', 'index finger'], // blue
      ['ring finger', 'r', 'ring finger'], // red
      ['middle finger', 'g', 'middle finger'], // green
    ];
  } else {
    throw new Error('Invalid motor perm');
  }
}

const choices = ['y', 'g', 'r']; // TODO: Check this should not be 'c'

var feedbackInstructText = `
  <p class="center-block-text">
    Welcome! This experiment will take around 7 minutes.
  </p>
  <p class="center-block-text">
    To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in fullscreen mode for the whole duration of each task.
  </p>
  <p class="center-block-text"> Press <i>enter</i> to begin.</p>
`;

// speed reminder
var speedReminder =
  '<p class = block-text>' +
  'Try to respond as quickly and accurately as possible.</p> ';

var expStage = 'practice';

const stimStimulusDuration = 1000;
const stimTrialDuration = 1500;

var accuracyThresh = 0.8; // threshold for block-level feedback
var practiceAccuracyThresh = 0.75; // threshold to proceed to test, .75 for 3 out of 4 trials
var rtThresh = 750;
var missedResponseThresh = 0.1;
var practiceThresh = 3; // 3 blocks max

var currStim = '';

var stimulusText =
  '<div class = centerbox><div class = stroop-stim style = "color:XXX">YYY</div></div>';

// arrays for colors and words to be used for stimuli
var colors = ['#FF7070', '#7070FF', '#70FF70'];
var words = ['red', 'blue', 'green'];

const getColorByKey = (key) => {
  let keyColorMap = {};
  keyColorMap[possibleResponses[0][1]] = { name: 'red', color: '#FF7070' };
  keyColorMap[possibleResponses[1][1]] = { name: 'blue', color: '#7070FF' };
  keyColorMap[possibleResponses[2][1]] = { name: 'green', color: '#70FF70' };

  return keyColorMap[key];
};

var colors = ['#FF7070', '#7070FF', '#70FF70'];
var words = ['red', 'blue', 'green'];

var tempArray = [];
var incongruentStim;
var congruentStim;
var responseKeys;
var promptText;
var feedbackText;
var testStimuli;

const setText = () => {
  feedbackText = `
  <div class='centerbox'>
    <p class='block-text'>During this task, on each trial you will be presented with a single word on the screen. This word will be <b>'RED'</b>, <b>'BLUE'</b>, or <b>'GREEN'</b>.</p>
    <p class='block-text'>Each word will appear in colored ink. The color of the word may not match the word itself. For example, you might see the word 'RED' in green ink, like this: <span style='color:#70FF70'>RED</span>.</p>
    <p class='block-text'>Your task is to identify the <b>color of the ink in which the word is displayed</b>, not the word itself. So, if you see the word <b>'RED'</b> in green ink, you should press the key corresponding to <b>green</b>.</p>
    <p class='block-text'>Press your <b>index finger</b> if the color is <span style='color:${
      getColorByKey('y').color
    }'>${getColorByKey('y').name}</span>.</p>
    <p class='block-text'>Press your <b>middle finger</b> if the color is <span style='color:${
      getColorByKey('g').color
    }'>${getColorByKey('g').name}</span>.</p>
    <p class='block-text'>Press your <b>ring finger</b> if the color is <span style='color:${
      getColorByKey('r').color
    }'>${getColorByKey('r').name}</span>.</p>
    <p class='block-text'>We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
    ${speedReminder}
    </div>
    `;

  promptText = `
  <div class="prompt_box">
    <p class="center-block-text" style="font-size:16px; line-height:80%;">
      <span class="large" style="color:${
        getColorByKey('y').color
      }">WORD</span>: Index
    </p>
    <p class="center-block-text" style="font-size:16px; line-height:80%;">
      <span class="large" style="color:${
        getColorByKey('g').color
      }">WORD</span>: Middle
    </p>
    <p class="center-block-text" style="font-size:16px; line-height:80%;">
      <span class="large" style="color:${
        getColorByKey('r').color
      }">WORD</span>: Ring
    </p>
  </div>`;

  responseKeys = `
  <ul class="list-text">
    <li>
    <span class="large" style="color:${
      getColorByKey('y').color
    };">WORD</span>: Index
  </span>
  </li>
   <li>
    <span class="large" style="color:${
      getColorByKey('g').color
    };">WORD</span>: Middle
  </span>
  </li>
    <li>
    <span class="large" style="color:${
      getColorByKey('r').color
    };">WORD</span>: Ring
  </span>
  </li>
  </ul>`;

  incongruentStim = [
    // red word in blue ink
    {
      stimulus:
        '<div class = centerbox><div class = stroop-stim style = "color:#7070FF">red</div></div>',
      data: {
        trial_id: 'stim',
        condition: 'incongruent',
        stim_color: '#7070FF',
        stim_word: 'red',
        correct_response: possibleResponses[1][1],
      },
      key_answer: possibleResponses[1][1],
      id: 'red_in_blue',
    },
    // red word in green ink
    {
      stimulus:
        '<div class = centerbox><div class = stroop-stim style = "color:#70FF70">red</div></div>',
      data: {
        trial_id: 'stim',
        condition: 'incongruent',
        stim_color: '#70FF70',
        stim_word: 'red',
        correct_response: possibleResponses[2][1],
      },
      key_answer: possibleResponses[2][1],
      id: 'red_in_green',
    },
    // blue word in red ink
    {
      stimulus:
        '<div class = centerbox><div class = stroop-stim style = "color:#FF7070">blue</div></div>',
      data: {
        trial_id: 'stim',
        condition: 'incongruent',
        stim_color: '#FF7070',
        stim_word: 'blue',
        correct_response: possibleResponses[0][1],
      },
      key_answer: possibleResponses[0][1],
      id: 'blue_in_red',
    },
    // blue word in green ink
    {
      stimulus:
        '<div class = centerbox><div class = stroop-stim style = "color:#70FF70">blue</div></div>',
      data: {
        trial_id: 'stim',
        condition: 'incongruent',
        stim_color: '#70FF70',
        stim_word: 'blue',
        correct_response: possibleResponses[2][1],
      },
      key_answer: possibleResponses[2][1],
      id: 'blue_in_green',
    },
    // green word in red ink
    {
      stimulus:
        '<div class = centerbox><div class = stroop-stim style = "color:#FF7070">green</div></div>',
      data: {
        trial_id: 'stim',
        condition: 'incongruent',
        stim_color: '#FF7070',
        stim_word: 'green',
        correct_response: possibleResponses[0][1],
      },
      key_answer: possibleResponses[0][1],
      id: 'green_in_red',
    },
    // green word in blue ink
    {
      stimulus:
        '<div class = centerbox><div class = stroop-stim style = "color:#7070FF">green</div></div>',
      data: {
        trial_id: 'stim',
        condition: 'incongruent',
        stim_color: '#7070FF',
        stim_word: 'green',
        correct_response: possibleResponses[1][1],
      },
      key_answer: possibleResponses[1][1],
      id: 'green_in_blue',
    },
  ];
  congruentStim = [
    {
      stimulus:
        '<div class = centerbox><div class = stroop-stim style = "color:#FF7070">red</div></div>',
      data: {
        trial_id: 'stim',
        condition: 'congruent',
        stim_color: '#FF7070',
        stim_word: 'red',
        correct_response: possibleResponses[0][1],
      },
      key_answer: possibleResponses[0][1],
      id: 'red_in_red',
    },
    {
      stimulus:
        '<div class = centerbox><div class = stroop-stim style = "color:#7070FF">blue</div></div>',
      data: {
        trial_id: 'stim',
        condition: 'congruent',
        stim_color: '#7070FF',
        stim_word: 'blue',
        correct_response: possibleResponses[1][1],
      },
      key_answer: possibleResponses[1][1],
      id: 'blue_in_blue',
    },
    {
      stimulus:
        '<div class = centerbox><div class = stroop-stim style = "color:#70FF70">green</div></div>',
      data: {
        trial_id: 'stim',
        condition: 'congruent',
        stim_color: '#70FF70',
        stim_word: 'green',
        correct_response: possibleResponses[2][1],
      },
      key_answer: possibleResponses[2][1],
      id: 'green_in_green',
    },
  ];

  testStimuli = incongruentStim.concat(congruentStim);
};

const create_test_stimuli = (conditions) => {
  const colors = ['red', 'blue', 'green'];
  const stimuli = [];

  for (let i = 0; i < conditions.length; i++) {
    const current_condition = conditions[i];
    const random_index = Math.floor(Math.random() * 3);
    const color = colors[random_index];

    if (current_condition === 'congruent') {
      var id = `${color}_in_${color}`;
    } else {
      const other_colors = colors.filter((c) => c !== color);
      const random_index = Math.floor(Math.random() * 2);
      const other_color = other_colors[random_index];
      var id = `${color}_in_${other_color}`;
    }

    const stimulus = testStimuli.find((stimulus) => stimulus.id === id);
    stimuli.push(stimulus);
  }
  return stimuli;
};

var practiceLen = 1;
var numTrialsPerBlock = 40;
var numTestBlocks = 3;

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

var fixationBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class="centerbox"><div class="fixation">+</div></div>',
  response_ends_trial: false,
  choices: buttonBoxKeys,
  data: {
    trial_id: 'test_fixation',
    exp_stage: 'test',
    trial_duration: fixationDuration,
    stimulus_duration: fixationDuration,
    choices: buttonBoxKeys,
  },
  stimulus_duration: fixationDuration,
  trial_duration: fixationDuration,
  on_finish: (data) => (data['block_num'] = testCount),
};

var practiceFixationBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class="centerbox"><div class="fixation">+</div></div>',
  response_ends_trial: false,
  choices: buttonBoxKeys,
  data: {
    trial_id: 'practice_fixation',
    exp_stage: 'practice',
    trial_duration: 500,
    stimulus_duration: 500,
    choices: buttonBoxKeys,
  },
  stimulus_duration: fixationDuration,
  trial_duration: fixationDuration,
  prompt: () => promptText,
  on_finish: (data) => (data['block_num'] = practiceCount),
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
    return trial_id === 'check_ring' || trial_id === 'practice_feedback'
      ? undefined
      : 4000;
  },
  response_ends_trial: function () {
    const { trial_id } = jsPsych.data.get().last().trials[0];
    return trial_id === 'check_ring' || trial_id === 'practice_feedback';
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
        options: [0, 1, 2, 3, 4, 5],
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

    // Randomly select two congruent and two incongruent stimuli
    let selectedCongruent = getRandomElements(congruentStim, 2);
    let selectedIncongruent = getRandomElements(incongruentStim, 2);

    // Combine the selected stimuli into a new array
    let tempArray = selectedCongruent.concat(selectedIncongruent);
    tempArray = jsPsych.randomization.repeat(tempArray, 1);
    blockStims = tempArray;
    // Take only the first trial 
    blockStims = blockStims.slice(0, 1);
    console.log('blockStims', blockStims);
  },
};

// create trials and repeat nodes
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
        correct_response: getKeyAnswer(), 
        trial_duration: stimTrialDuration,
        stimulus_duration: stimStimulusDuration,
        block_num: practiceCount,
        choices: buttonBoxKeys,
      });
    },
    response_ends_trial: false,
    stimulus_duration: stimStimulusDuration,
    trial_duration: stimTrialDuration,
    prompt: () => promptText,
    on_finish: appendData,
  };
  practiceTrials.push(ITIBlock, practiceTrial, practiceFeedbackBlock);
}

// loop based on criteria
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
          <p class="block-text">Your accuracy was low.</p>
          ${responseKeys}`;
      feedbackText += text;
      feedback['accuracy'] = {
        value: accuracy,
        text: text,
      };
    }

    if (avgRT > rtThresh) {
      let text = `
          <p class="block-text">Please respond more quickly without sacrificing accuracy.</p>`;
      feedbackText += text;
      feedback['rt'] = {
        value: avgRT,
        text: text,
      };
    }

    if (missedResponses > missedResponseThresh) {
      let text = `
          <p class="block-text">Respond on every trial.</p>`;
      feedbackText += text;
      feedback['missed_responses'] = {
        value: missedResponses,
        text: text,
      };
    }

    feedbackText += '</div>';

    expStage = 'test';

    let block_designs = stim_designs.slice(0, numTrialsPerBlock);
    stim_designs = stim_designs.slice(numTrialsPerBlock);

    block_level_feedback = feedback;

    blockStims = create_test_stimuli(block_designs);

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
        correct_response: getKeyAnswer(),
        trial_duration: stimTrialDuration,
        stimulus_duration: stimStimulusDuration,
        block_num: testCount,
        choices: buttonBoxKeys,
      });
    },
    response_ends_trial: false,
    stimulus_duration: stimStimulusDuration,
    trial_duration: stimTrialDuration,
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
          if (data.trials[i].correct_trial == 1) {
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
          ${responseKeys}`;
      feedbackText += text;
      feedback['accuracy'] = {
        value: accuracy,
        text: text,
      };
    }

    if (avgRT > rtThresh) {
      let text = `
          <p class="block-text">Please respond more quickly without sacrificing accuracy.</p>`;
      feedbackText += text;
      feedback['rt'] = {
        value: avgRT,
        text: text,
      };
    }

    if (missedResponses > missedResponseThresh) {
      let text = `
          <p class="block-text">Respond on every trial.</p>`;
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
    const design_path = `${base}/static/experiments/stroop_rdoc__fmri/designs`;
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

var expID = 'stroop_rdoc__fmri';
var endText = `
  <div class="centerbox">
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
  on_finish: function () {
    renameDataProperties();
  },
};

stroop_rdoc__fmri_experiment = [];
var stroop_rdoc__fmri_init = () => {
  stroop_rdoc__fmri_experiment.push(motor_and_design_perm_block);
  stroop_rdoc__fmri_experiment.push(fullscreen);
  stroop_rdoc__fmri_experiment.push(check_fingers_node_stroop);
  stroop_rdoc__fmri_experiment.push(practiceNode);
  stroop_rdoc__fmri_experiment.push(feedbackBlock);
  stroop_rdoc__fmri_experiment.push(fmri_wait_node);
  stroop_rdoc__fmri_experiment.push(testNode);
  stroop_rdoc__fmri_experiment.push(long_fixation_node);
  stroop_rdoc__fmri_experiment.push(feedbackBlock);
  stroop_rdoc__fmri_experiment.push(endBlock);
  stroop_rdoc__fmri_experiment.push(exitFullscreen);
};
