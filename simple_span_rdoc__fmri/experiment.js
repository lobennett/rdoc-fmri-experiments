function calculate_partial_accuracy(trials) {
  if (trials.length === 0) return 0; // Handle case where trials array is empty

  const totalAccuracy = trials.reduce((acc, trial) => {
    const { response, spatial_sequence } = trial;
    const correctCount = spatial_sequence.filter((item) =>
      response.includes(item)
    ).length;
    const accuracy = correctCount / spatial_sequence.length;
    return acc + accuracy;
  }, 0);

  const partialAccuracy = totalAccuracy / trials.length;
  return partialAccuracy;
}

function shuffleArray(array) {
  // Create a copy of the original array to avoid modifying it directly
  const shuffledArray = array.slice();

  // Perform Fisher-Yates shuffle
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

function generateSpatialTrialValues(n) {
  const possibleValues = Array.from({ length: 16 }, (_, i) => i);
  const randomList = [];

  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * possibleValues.length);
    randomList.push(possibleValues[randomIndex]);
    possibleValues.splice(randomIndex, 1);
  }

  return randomList;
}

var trialValue;

var getStim = function () {
  let html = '<div class="container">';

  const trialIndex = trialList.shift();

  for (var i = 0; i < 16; i++) {
    if (i === trialIndex) {
      html += '<div class="box active-box"></div>';
    } else {
      html += '<div class="box"></div>';
    }
  }
  trialValue = trialIndex;
  html += '</div>';
  return html;
};

function generateRandomGrid(size) {
  const grid = new Array(size);
  for (let i = 0; i < size; i++) {
    grid[i] = Math.random() < 0.5 ? 0 : 1;
  }
  return grid;
}

function areArraysAsymmetric(arr1, arr2) {
  // Check if arrays are asymmetric (values at each index are not the same)
  return !arr1.every((val, index) => val === arr2[index]);
}

function makeAsymmetricArrays() {
  const size = 32;
  let firstGrid = generateRandomGrid(size);
  let secondGrid = generateRandomGrid(size);

  while (areArraysAsymmetric(firstGrid, secondGrid) === false) {
    // Keep generating new arrays until they become asymmetric
    firstGrid = generateRandomGrid(size);
    secondGrid = generateRandomGrid(size);
  }
  return [firstGrid, secondGrid];
}

function makeAsymmetricArrays() {
  const size = 32;
  const firstGrid = generateRandomGrid(size);
  const secondGrid = generateRandomGrid(size);

  return [{ firstGrid: firstGrid, secondGrid: secondGrid, symmetric: false }];
}

function getProcessingStimProperties(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const divs = doc.querySelectorAll('.container > div');
  const classList = Array.from(divs).map((div) => div.className);

  const parsedClassList = classList.map((item) => {
    if (item === 'distractor-box active-box') {
      return 'black';
    } else if (item === 'distractor-box') {
      return 'gray';
    } else {
      return item;
    }
  });

  return parsedClassList;
}

var submittedAnswers = [];
var timestampsSubmissions = [];
var timestampsMovingThroughGrid = [];
var trackingCellMovingThroughGrid = [];
var startingCellInGrid;

var generateGrid = function () {
  const randomIndex = Math.floor(Math.random() * 16);
  startingCellInGrid = randomIndex;
  // Variable to store the initial call time
  let initialCallTime = Date.now();

  let activeIndex = randomIndex;
  const activeBoxes = [];

  let html = '<div class="container">';
  for (var i = 0; i < 16; i++) {
    if (i === randomIndex) {
      html += '<div class="box response-active"></div>';
      activeBoxes.push(i);
    } else {
      html += '<div class="box"></div>';
    }
  }
  html += '</div>';

  let spacebarCount = 0;
  const selectedIndexes = [];

  // Declare a variable to store the setTimeout ID
  let timeoutId;
  function handleKeyDown(event) {
    let currentTime = Date.now();
    let timeDifference = currentTime - initialCallTime;
    timestampsMovingThroughGrid.push(timeDifference); // Store timestamp

    const key = event.key;
    const container = document.querySelector('.container');
    const boxes = container.querySelectorAll('.box');

    // Remove active-box class from all boxes
    boxes.forEach(function (box) {
      box.classList.remove('spacebar-box');
    });

    // Update activeIndex based on arrow key input
    let newActiveIndex = activeIndex;
    if (key === 'ArrowLeft' && activeIndex % 4 !== 0) {
      newActiveIndex = activeIndex - 1;
    } else if (key === 'ArrowRight' && activeIndex % 4 !== 3) {
      newActiveIndex = activeIndex + 1;
    } else if (key === 'ArrowUp' && activeIndex >= 4) {
      newActiveIndex = activeIndex - 4;
    } else if (key === 'ArrowDown' && activeIndex < 12) {
      newActiveIndex = activeIndex + 4;
    }

    trackingCellMovingThroughGrid.push(newActiveIndex);

    if (newActiveIndex !== activeIndex) {
      // Remove active-box class from all boxes
      boxes.forEach(function (box) {
        box.classList.remove('response-active');
      });
    }

    if (newActiveIndex !== activeIndex) {
      activeIndex = newActiveIndex;
      boxes[activeIndex].classList.add('response-active'); // Add active-box class for arrow key navigation
    }

    if (key === ' ') {
      event.preventDefault(); // handling default behavior on keydown event for spacebar. Prevents scrolling of the page.
      let currentTime = Date.now();
      let timeDifference = currentTime - initialCallTime;
      timestampsSubmissions.push(timeDifference); // Store timestamp

      if (spacebarCount < 4) {
        boxes[activeIndex].classList.add('spacebar-box'); // Add spacebar-box class for spacebar selection
        activeBoxes.push(activeIndex);
        selectedIndexes.push(activeIndex);
        spacebarCount++;
        submittedAnswers.push(activeIndex);
      }

      // Clear any existing setTimeout calls
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (key !== ' ') {
          boxes[activeIndex].classList.remove('response-active'); // Remove active-box class if the arrow key was pressed
        }
        boxes[activeIndex].classList.remove('spacebar-box'); // Remove spacebar-box class for spacebar selection
      }, 200);
    }
  }
  // Attach the event listener
  document.addEventListener('keydown', handleKeyDown);

  function resetGrid() {
    activeBoxes.length = 0; // Clear the activeBoxes array
    selectedIndexes.length = 0; // Clear the selectedIndexes array
    spacebarCount = 0;

    // Remove the event listener
    document.removeEventListener('keydown', handleKeyDown);

    // Clear any remaining state or perform other necessary actions
    submittedAnswers = [];

    // Also reset the initial call time when the grid is reset
    initialCallTime = Date.now();
  }

  return { html, resetGrid };
};

function combineArrays(array1, array2) {
  if (array1.length % 4 !== 0 || array2.length % 4 !== 0) {
    throw new Error('Both arrays must have a length that is a multiple of 4.');
  }

  const combinedArray = [];

  for (let i = 0; i < array1.length; i += 4) {
    combinedArray.push(...array1.slice(i, i + 4), ...array2.slice(i, i + 4));
  }

  return combinedArray;
}

var generateDistractorGrid = function (stim) {
  let html = '<div class="container">';
  const grid = stim.grid;

  for (let i = 0; i < grid.length; i++) {
    if (grid[i] == 1) {
      html += '<div class="distractor-box active-box"></div>';
    } else {
      html += '<div class="distractor-box"></div>';
    }
  }

  html += '</div>';

  return html;
};

const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

const getCurrSeq = () => currSeq;

const getCurrBlockNum = () =>
  getExpStage() === 'practice' ? practiceCount : testCount;

const getExpStage = () => expStage;

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// common variables

var spanResponses = [
  'left arrow key',
  'right arrow key',
  'up arrow key',
  'down arrow key',
  'spacebar',
];

var speedReminder;
var promptText;
var reminderInstruct;
var feedbackText;
var choices;
const setText = () => {
  speedReminder =
    '<p class = block-text>Try to respond as quickly and accurately as possible.</p>';

  feedbackText = `
    <div class="centerbox">
      <p class="block-text">Place your fingers on the arrow keys.</p>
      <p class="block-text">
        During this task, you will see a fixation (****) followed by a 4x4 grid. This 4x4 grid will have one cell colored black. Try to remember the location of the black cell.
      </p>
      <p class="block-text">
        This sequence of a fixation (****) and 4x4 grid will alternate four times. After the fourth time, a blank 4x4 grid will be presented.
      </p>
      <p class="block-text">
        On the blank 4x4 grid, use the <b>arrow keys</b> to navigate the grid and the <b>spacebar</b> to select the cells you think were colored black in the preceding 4 4x4 grids. Please select them in the order they were shown (i.e., respond with the location of the first black square in the 4x4 grid, then the 2nd, …).
      </p>
      <p class='block-text'>
        <b>Please note</b>, it's important to be ready to respond promptly when the grid appears, as the screen will move on automatically after a limited time, whether you have responded or not.
      </p>
    </div>
  `;

  promptText = `<div class=prompt_box_operation>
    <p class = center-block-text style = "font-size:16px; line-height:80%%;">Memorize all the black colored cells.</p>
    <p class = center-block-text style = "font-size:16px; line-height:80%%;">Press <b>"left arrow key"</b> if 8x8 is <b>${
      processingChoices[0].keyname === 'left arrow key'
        ? 'symmetric'
        : 'asymmetric'
    }</b> and <b>"right arrow key"</b> if <b>${
    processingChoices[0].keyname === 'left arrow key'
      ? 'asymmetric'
      : 'symmetric'
  }</b>.</p>
  </div>`;

  reminderInstruct = `
  <div class="centerbox">
    <p class="block-text">
      During the practice round, you will receive feedback and a reminder of the rules. These will be removed for the actual test, so make sure that you understand the instructions before moving on.
    </p>
    <p class="block-text">${speedReminder}</p>
  </div>
`;

  choices = [processingChoices[0].keycode, processingChoices[1].keycode];
};

// *Timing:
// stimulus and fixation
const stimStimulusDuration = 1000;
const stimTrialDuration = 1000;
const responseBlockDuration = 7000; // changed from 5000

var sumInstructTime = 0; // ms
var instructTimeThresh = 5; // /in seconds

var accuracyThresh = 0.6;
var partialAccuracyThresh = 0.75;
var missedResponseThresh = 0.1;
var practiceThresh = 3;

var processingChoices;

function getKeyMappingForTask(motor_perm) {
  if (motor_perm === 0) {
    processingChoices = [
      { keycode: 'ArrowLeft', keyname: 'left arrow key' },
      { keycode: 'ArrowRight', keyname: 'right arrow key' },
    ];
  } else {
    processingChoices = [
      { keycode: 'ArrowRight', keyname: 'right arrow key' },
      { keycode: 'ArrowLeft', keyname: 'left arrow key' },
    ];
  }
}

var practiceLen = 1;
var numTrialsPerBlock = 8;
var numTestBlocks = 3;

var trialList;

var currCondition = 'simple';

var numStimuli = 4;

var expStage = 'practice';
var currSeq = [];

var practicePromptResponse = `<div class = prompt_box_response>
  <p class = center-block-text style = "font-size:16px; line-height:80%%;">Use the <b>arrow keys</b> to navigate the grid and the <b>spacebar</b> to select the cells colored black in the order they were shown.
  </p>
</div>`;

var practicePromptText = `<div class = prompt_box_simple>
  <p class = center-block-text style = "font-size:16px; line-height:80%%;">Memorize all the black colored cells.</p>
  </div>`;

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
var feedbackText =
  '<div class = centerbox><p class = center-block-text>Press <i>enter</i> to begin practice.</p></div>';

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

var expStage = 'practice';

var stimulusBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    return getStim();
  },
  stimulus_duration: stimStimulusDuration,
  trial_duration: stimTrialDuration,
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_stim`,
      exp_stage: stage,
      condition: 'simple',
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
      block_num: stage === 'practice' ? practiceCount : testCount,
    };
  },
  choices: ['NO_KEYS'],
  prompt: function () {
    return getExpStage() === 'practice' ? practicePromptText : '';
  },
  on_finish: function (data) {
    data['spatial_location'] = trialValue;
    data['block_num'] = getExpStage() == 'practice' ? practiceCount : testCount;
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
        options: Array.from({ length: 15 }, (_, i) => i + 1),
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
  },
};

var startTime = null;
var initializingTrialIDs = new Set([
  'practice_feedback',
  'practice_ITI',
  'test_ITI',
  'test_long_fixation',
  'fmri_wait_block_trigger_end',
]);

var waitBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = fixation>****</div></div>',
  choices: 'NO_KEYS',
  stimulus_duration: 2500, // changed from 3000
  trial_duration: 2500, // changed from 3000
  response_ends_trial: true,
  on_start: function () {
    var { trial_id } = jsPsych.data.get().last(1).trials[0];
    if (initializingTrialIDs.has(trial_id)) {
      trialList = generateSpatialTrialValues(numStimuli);
    }
  },
  data: function () {
    return {
      trial_id:
        getExpStage() == 'practice'
          ? 'practice_inter-stimulus'
          : 'test_inter-stimulus',
      exp_stage: getExpStage(),
      condition: 'simple',
      choices: '',
      trial_duration: 2500, // changed from 3000
      stimulus_duration: 2500, // changed from 3000
      block_num: getExpStage() == 'practice' ? practiceCount : testCount,
    };
  },
  on_finish: function (data) {
    data['correct_spatial_judgement_key'] = null;
    data['block_num'] = getExpStage() == 'practice' ? practiceCount : testCount;
  },
  prompt: function () {
    if (getExpStage() == 'practice') {
      return practicePromptText;
    }
  },
};

function arraysAreEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
}

var activeGrid;

var practiceFeedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    function arraysEqual(a, b) {
      if (a === b) return true;
      if (a == null || b == null) return false;
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    const { response, spatial_sequence } = jsPsych.data.get().last(1).trials[0];
    const common = spatial_sequence.filter((ele) =>
      response.includes(ele)
    ).length;

    const areArraysEqual = arraysEqual(response, spatial_sequence);

    const text =
      common === 0 ? 'You did not submit any' : `You submitted ${common}`;

    if (areArraysEqual) {
      return `
          <div class='memory_feedback'>
            <p>Correct!</p>
          </div>
        `;
    } else {
      return `
          <div class='memory_feedback'>
            <p>${text} correct responses.</p>
            <p>Please attempt to make all 4 correct responses in the order they were presented.</p>
        </div>`;
    }
  },
  data: function () {
    return {
      exp_stage: 'practice',
      trial_id: 'practice_feedback',
      trial_duration: 5000, // changed from 500
      stimulus_duration: 5000, // changed from 500
      block_num: practiceCount,
    };
  },
  choices: ['NO_KEYS'],
  stimulus_duration: 5000, // changed from 500
  trial_duration: 5000, // changed from 500
};

var testTrial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    activeGrid = generateGrid();
    return activeGrid.html;
  },
  choices: ['NO_KEYS'],
  data: function () {
    return {
      trial_id: getExpStage() == 'test' ? 'test_trial' : 'practice_trial',
      exp_stage: getExpStage(),
      choices: ['NO_KEYS'],
      trial_duration: responseBlockDuration,
      stimulus_duration: responseBlockDuration,
    };
  },
  trial_duration: responseBlockDuration,
  stimulus_duration: responseBlockDuration,
  prompt: function () {
    if (getExpStage() == 'practice') {
      return practicePromptResponse;
    }
  },
  on_finish: function (data) {
    if (getExpStage() == 'practice') {
      var stimTrials = jsPsych.data
        .get()
        .filter({ trial_id: 'practice_stim' }).trials;
    } else {
      var stimTrials = jsPsych.data
        .get()
        .filter({ trial_id: 'test_stim' }).trials;
    }

    var lastTrials = stimTrials.slice(-4);
    var correctResponses = lastTrials.map((trial) => trial.spatial_location);

    data['response'] = submittedAnswers;

    if (submittedAnswers.length < 4) {
      data['correct_trial'] = null;
    } else if (submittedAnswers.length == 4) {
      const correct = arraysAreEqual(correctResponses, submittedAnswers);
      data['correct_trial'] = correct ? 1 : 0;
    }

    data['condition'] = 'simple';

    if (getExpStage() == 'practice') {
      var lastInterStimTrials = jsPsych.data
        .get()
        .filter({ trial_id: 'practice_stim' });

      var lastInterStimTrialsCorrectAnswers = lastInterStimTrials.trials
        .slice(-4)
        .map((trial) => trial.spatial_location);
    } else {
      var lastInterStimTrials = jsPsych.data
        .get()
        .filter({ trial_id: 'test_stim' });

      var lastInterStimTrialsCorrectAnswers = lastInterStimTrials.trials
        .slice(-4)
        .map((trial) => trial.spatial_location);
    }
    data['starting_cell_in_grid'] = startingCellInGrid;

    data['spatial_sequence'] = lastInterStimTrialsCorrectAnswers;
    data['block_num'] = getExpStage() == 'practice' ? practiceCount : testCount;
    data['rt_each_spatial_location_response_grid'] =
      timestampsSubmissions.slice(0, 4);

    data['rt_moving_each_spatial_location_response_grid'] =
      timestampsMovingThroughGrid;

    data['moving_order_spatial_location'] = trackingCellMovingThroughGrid;

    trackingCellMovingThroughGrid = [];
    timestampsSubmissions = [];
    timestampsMovingThroughGrid = [];

    activeGrid.resetGrid();
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
    const commonData = {
      trial_id: `${stage}_ITI`,
      exp_stage: stage,
      block_num: stage === 'practice' ? practiceCount : testCount,
      condition: 'simple',
    };

    if (stage === 'practice') {
      commonData.ITIParams = { duration: 5 };
    } else {
      commonData.ITIParams = {
        min: 2,
        max: 20,
        mean: 5,
      };
    }

    return commonData;
  },
  trial_duration: function () {
    if (getExpStage() === 'practice') return 5000;

    ITIms = ITIs.shift();
    return ITIms * 1000;
  },
  on_finish: function (data) {
    if (getExpStage() === 'practice') {
      data['trial_duration'] = 5000;
      data['stimulus_duration'] = 5000;
    } else {
      data['trial_duration'] = ITIms * 1000;
      data['stimulus_duration'] = ITIms * 1000;
    }
  },
};

var practiceTrials = [];
function generatePracticeTrials() {
  var returnArray = [];

  for (let i = 0; i < practiceLen; i++) {
    for (let j = 0; j < numStimuli; j++) {
      returnArray.push(waitBlock, stimulusBlock);
    }
    returnArray.push(testTrial, practiceFeedbackBlock, ITIBlock);
  }

  return returnArray;
}

practiceTrials = generatePracticeTrials();

// loop based on criteria
var practiceCount = 0;
var practiceNode = {
  timeline: [feedbackBlock].concat(practiceTrials),
  loop_function: function () {
    var responseGridData = jsPsych.data.get().filter({
      trial_id: 'practice_trial',
      condition: 'simple',
      block_num: getCurrBlockNum(),
    }).trials;

    practiceCount += 1;
    var partialAccuracy = calculate_partial_accuracy(responseGridData);

    var correct = 0;
    var totalTrials = responseGridData.length;
    var missedCount = 0;
    var responseCount = 0;

    for (var i = 0; i < responseGridData.length; i++) {
      if (responseGridData[i].correct_trial == null) {
        missedCount += 1;
      } else {
        responseCount += 1;
        if (responseGridData[i].correct_trial == 1) {
          correct += 1;
        }
      }
    }

    var missedResponses = missedCount / totalTrials;

    feedbackText =
      '<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 4 seconds.</p>';

    if (partialAccuracy < partialAccuracyThresh) {
      feedbackText +=
        '<p class = block-text>Your accuracy for the 4x4 grid is low.</p>' +
        '<p class = block-text>Try your best to recall the black colored cells.</p>';
    }

    if (missedResponses > missedResponseThresh) {
      feedbackText +=
        '<p class = block-text>You have not been responding to some trials. Please respond on every trial that requires a response.</p>';
    }

    feedbackText += `<p class="block-text">We are now going to start the task.</p>`;

    expStage = 'test';
    return false;
  },
};

var testTrials = [];
function generateTestTrials() {
  var returnArray = [];

  for (let i = 0; i < numTrialsPerBlock; i++) {
    for (let j = 0; j < numStimuli; j++) {
      returnArray.push(waitBlock, stimulusBlock);
    }
    returnArray.push(testTrial, ITIBlock);
  }

  return returnArray;
}

testTrials = generateTestTrials();

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

var feedback_node = {
  timeline: [feedbackBlock],
  conditional_function: function () {
    const { trial_id } = jsPsych.data.get().last().trials[0];
    if (trial_id === 'fmri_wait_block_trigger_end') return false;
    return true;
  },
};

// loop based on criteria
var testCount = 0;
var testNode = {
  timeline: [feedback_node].concat(long_fixation_node, testTrials),
  loop_function: function () {
    var responseGridData = jsPsych.data.get().filter({
      trial_id: 'test_trial',
      exp_stage: 'test',
      condition: 'simple',
      block_num: getCurrBlockNum(),
    }).trials;

    testCount += 1;
    var correct = 0;
    var totalTrials = responseGridData.length;
    var missedCount = 0;
    var responseCount = 0;

    for (var i = 0; i < responseGridData.length; i++) {
      if (responseGridData[i].correct_trial == null) {
        missedCount += 1;
      } else {
        responseCount += 1;

        if (responseGridData[i].correct_trial == 1) {
          correct += 1;
        }
      }
    }

    var accuracy = correct / responseCount;
    var missedResponses = missedCount / totalTrials;

    if (testCount === numTestBlocks) {
      feedbackText = `
        <div class=centerbox>
        <p class=block-text>Done with this task.</p>
        </div>
      `;

      return false;
    } else {
      feedbackText =
        '<div class = centerbox><p class = block-text>Please take this time to read your feedback!</p>';

      feedbackText += `<p class=block-text>You have completed ${testCount} out of ${numTestBlocks} blocks of trials.</p>`;

      // feedback for either simple or operation span
      if (accuracy < accuracyThresh) {
        feedbackText +=
          '<p class = block-text>Your accuracy for the 4x4 grid is low. Try your best to recall all the black colored cells.</p>';
      }

      if (missedResponses > missedResponseThresh) {
        feedbackText +=
          '<p class = block-text>You have not been responding to some trials. Please respond on every trial that requires a response.</p>';
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
var trial_designs = [];
var fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  on_finish: async function () {
    console.log('Reading in designs and ITIs...');
    const design_path =
      'http://0.0.0.0:8080/static/experiments/simple_span_rdoc__fmri/designs';
    const results = await loadDesignsAndITIs(design_perm, design_path, []);
    ITIs = results.ITIs;
  },
};
var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var expID = 'simple_span_rdoc__fmri';
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
    trial_duration: 30_000,
  },
  trial_duration: 30_000,
  stimulus: endText,
  response_ends_trial: false,
  choices: ['Enter'],
};
simple_span_rdoc__fmri_experiment = [];
var simple_span_rdoc__fmri_init = () => {
  simple_span_rdoc__fmri_experiment.push(motor_and_design_perm_block);
  simple_span_rdoc__fmri_experiment.push(fullscreen);
  simple_span_rdoc__fmri_experiment.push(check_fingers_node);

  // Start practice block
  simple_span_rdoc__fmri_experiment.push(practiceNode);
  simple_span_rdoc__fmri_experiment.push(feedbackBlock);
  simple_span_rdoc__fmri_experiment.push(fmri_wait_node);

  // Start test blocks
  simple_span_rdoc__fmri_experiment.push(testNode);
  simple_span_rdoc__fmri_experiment.push(endBlock);
  simple_span_rdoc__fmri_experiment.push(exitFullscreen);
};