const getExpStage = () => expStage;

const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

const task_switch_arr = [
  'task_stay_cue_stay',
  'task_stay_cue_switch',
  'task_switch_cue_switch',
  'task_switch_cue_switch',
];

var makeTaskSwitches = (numTrials) =>
  jsPsych.randomization.repeat(task_switch_arr, numTrials / 4);

var createTrialTypes = function (task_switches) {
  // creating stims for trial
  var stims = [];

  // randomly select location of first quadrant
  const quadMapping = {
    1: quadMappings.top,
    2: quadMappings.top,
    3: quadMappings.bottom,
    4: quadMappings.bottom,
  };
  var whichQuadStart = jsPsych.randomization.repeat([1, 2, 3, 4], 1).shift();
  var spatial_cue = quadMapping[whichQuadStart];

  const shapes = [
    'blue_circle',
    'blue_square',
    'orange_circle',
    'orange_square',
  ];
  var shape = shapes[Math.floor(Math.random() * 4)];

  var color;
  var form;

  if (shape.includes('blue')) {
    color = 'blue';
  } else if (shape.includes('orange')) {
    color = 'orange';
  }

  if (shape.includes('circle')) {
    form = 'circle';
  } else if (shape.includes('square')) {
    form = 'square';
  }

  if (spatial_cue === 'form') {
    if (form === 'circle') {
      var correct_response = responseMappings.form.circle;
    } else {
      var correct_response = responseMappings.form.square;
    }
  } else {
    if (color === 'blue') {
      var correct_response = responseMappings.color.blue;
    } else {
      var correct_response = responseMappings.color.orange;
    }
  }

  var first_stim = {
    whichQuadrant: whichQuadStart,
    spatial_cue: spatial_cue,
    shape: shape,
    form: form,
    color: color,
    correct_response: correct_response,
  };
  stims.push(first_stim);

  var last_quad = whichQuadStart;

  for (i = 0; i < task_switches.length; i++) {
    var current_condition = task_switches[i];
    var shape = shapes[Math.floor(Math.random() * 4)];
    var color;
    var form;

    if (shape.includes('blue')) {
      color = 'blue';
    } else if (shape.includes('orange')) {
      color = 'orange';
    }

    if (shape.includes('circle')) {
      form = 'circle';
    } else if (shape.includes('square')) {
      form = 'square';
    }

    var current_quad;

    if (current_condition == 'task_stay_cue_stay') {
      current_quad = last_quad;
    } else if (current_condition == 'task_stay_cue_switch') {
      current_quad = last_quad;
      if (last_quad == 1) {
        current_quad = 2;
      } else if (last_quad == 2) {
        current_quad = 1;
      } else if (last_quad == 3) {
        current_quad = 4;
      } else {
        current_quad = 3;
      }
    } else {
      if (last_quad == 1 || last_quad == 2) {
        var current_quad = jsPsych.randomization.repeat([3, 4], 1).shift();
      } else {
        var current_quad = jsPsych.randomization.repeat([1, 2], 1).shift();
      }
    }
    var spatial_cue = quadMapping[current_quad];

    if (spatial_cue === 'form') {
      if (form === 'circle') {
        var correct_response = responseMappings.form.circle;
      } else {
        var correct_response = responseMappings.form.square;
      }
    } else {
      if (color === 'blue') {
        var correct_response = responseMappings.color.blue;
      } else {
        var correct_response = responseMappings.color.orange;
      }
    }

    var current_stim = {
      whichQuadrant: current_quad,
      spatial_cue: spatial_cue,
      shape: shape,
      color: color,
      form: form,
      correct_response: correct_response,
    };
    stims.push(current_stim);

    last_quad = current_quad;
  }

  return stims;
};

var getFixation = () =>
  '<div class = centerbox><div class = fixation>+</div></div>';

var getCue = function () {
  stim = stims.shift();
  shape = stim.shape;
  correct_response = stim.correct_response;
  whichQuadrant = stim.whichQuadrant;
  color = stim.color;
  form = stim.form;

  return stop_boards[whichQuadrant - 1][0] + stop_boards[whichQuadrant - 1][1];
};

var getStim = function () {
  return (
    task_boards[whichQuadrant - 1][0] +
    preFileType +
    shape +
    fileTypePNG +
    task_boards[whichQuadrant - 1][1]
  );
};

const getCurrBlockNum = () =>
  getExpStage() === 'practice' ? practiceCount : testCount;

var appendData = function () {
  curr_trial = jsPsych.getProgress().current_trial_global;
  trial_id = jsPsych.data.get().filter({ trial_index: curr_trial })
    .trials[0].trial_id;
  current_trial += 1;
  task_switch = 'na';
  if (current_trial > 1) {
    task_switch = task_switches[current_trial - 2]; // this might be off
  }

  if (trial_id == 'practice_trial') {
    current_block = practiceCount;
  } else if (trial_id == 'test_trial') {
    current_block = testCount;
  }

  jsPsych.data.get().addToLast({
    spatial_cue:
      whichQuadrant === 1
        ? quadMappings.top
        : whichQuadrant === 2
        ? quadMappings.top
        : quadMappings.bottom,
    condition: task_switch,
    correct_response: correct_response,
    whichQuadrant: whichQuadrant,
    shape: shape,
    form: form,
    color: color,
    current_trial: current_trial,
    current_block: current_block,
    block_num: getCurrBlockNum(),
  });

  if (trial_id == 'practice_trial' || trial_id == 'test_trial') {
    correct_trial = 0;
    if (jsPsych.data.get().last().trials[0].response == correct_response) {
      correct_trial = 1;
    }
    jsPsych.data.get().addToLast({
      correct_trial: correct_trial,
    });
  }
};

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
function getResponseMappings(motor_perm) {
  const formMappings = [
    { circle: 'y', square: 'g' },
    { circle: 'g', square: 'y' },
  ];

  const colorMappings = [
    { blue: 'y', orange: 'g' },
    { blue: 'g', orange: 'y' },
  ];

  const formIndex = motor_perm % formMappings.length;
  const colorIndex =
    Math.floor(motor_perm / colorMappings.length) % colorMappings.length;

  const responseMapping = {
    form: formMappings[formIndex],
    color: colorMappings[colorIndex],
  };

  const quadMappings = {
    top: 'form',
    bottom: 'color',
  };

  return { responseMapping, quadMappings };
}

var responseMappings;
var quadMappings;

var feedbackText;
var prompt_text_list;
var prompt_text;
const setText = () => {
  feedbackText = `
  <div class = centerbox>
    <p class = block-text>During this task, on each trial you will see a single shape in one of the four quadrants of the screen.
    Based upon which quadrant the shape is presented, you will complete a different task for that shape.
    </p>
    <p class = block-text>In the top two quadrants, please judge the shape based on its <b>${
      quadMappings.top
    }</b>. Press your <b>index finger</b> ${
    quadMappings.top === 'form' ? "if it's a" : "if it's"
  }
    <b>${
      quadMappings.top === 'form'
        ? responseMappings.form.circle === 'y'
          ? 'circle'
          : 'square'
        : quadMappings.top === 'color'
        ? responseMappings.color.blue === 'y'
          ? "<span style='color:#87CEEB'>blue</span>"
          : "<span style='color:#FFD700'>orange</span>"
        : ''
    }</b> and your <b>middle finger</b> ${
    quadMappings.top === 'form' ? "if it's a" : "if it's"
  }
    <b>${
      quadMappings.top === 'form'
        ? responseMappings.form.circle === 'g'
          ? 'circle'
          : 'square'
        : quadMappings.top === 'color'
        ? responseMappings.color.blue === 'g'
          ? "<span style='color:#87CEEB'>blue</span>"
          : "<span style='color:#FFD700'>orange</span>"
        : ''
    }</b>. 
    </p>
     <p class = block-text>In the bottom two quadrants, please judge the shape based on its <b>${
       quadMappings.bottom
     }</b>. Press your <b>index finger</b> ${
    quadMappings.bottom === 'form' ? "if it's a" : "if it's"
  }
    <b>${
      quadMappings.bottom === 'form'
        ? responseMappings.form.circle === 'y'
          ? 'circle'
          : 'square'
        : quadMappings.bottom === 'color'
        ? responseMappings.color.blue === 'y'
          ? "<span style='color:#87CEEB'>blue</span>"
          : "<span style='color:#FFD700'>orange</span>"
        : ''
    }</b> and your <b>middle finger</b> ${
    quadMappings.bottom === 'form' ? "if it's a" : "if it's"
  }
    <b>${
      quadMappings.bottom === 'form'
        ? responseMappings.form.circle === 'g'
          ? 'circle'
          : 'square'
        : quadMappings.bottom === 'color'
        ? responseMappings.color.blue === 'g'
          ? "<span style='color:#87CEEB'>blue</span>"
          : "<span style='color:#FFD700'>orange</span>"
        : ''
    }</b>. 
    </p>
    <p class = block-text>We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
    ${speedReminder}
  </div>`;

  prompt_text_list = `
  <ul style="text-align:left;">
    <li>Top 2 quadrants: judge the shape on its <b>${quadMappings.top}</b></li>
    <li><b>${
      quadMappings.top === 'form'
        ? responseMappings.form.circle === 'y'
          ? 'circle'
          : 'square'
        : quadMappings.top === 'color'
        ? responseMappings.color.blue === 'y'
          ? 'blue'
          : 'orange'
        : ''
    }</b>: index finger</li>
    <li><b>${
      quadMappings.top === 'form'
        ? responseMappings.form.circle === 'g'
          ? 'circle'
          : 'square'
        : quadMappings.top === 'color'
        ? responseMappings.color.blue === 'g'
          ? 'blue'
          : 'orange'
        : ''
    }</b>: middle finger</li>
    <li>Bottom 2 quadrants: judge the shape on its <b>${
      quadMappings.bottom
    }</b></li>
    <li><b>${
      quadMappings.bottom === 'form'
        ? responseMappings.form.circle === 'y'
          ? 'circle'
          : 'square'
        : quadMappings.bottom === 'color'
        ? responseMappings.color.blue === 'y'
          ? 'blue'
          : 'orange'
        : ''
    }</b>: index finger</li>
    <li><b>${
      quadMappings.bottom === 'form'
        ? responseMappings.form.circle === 'g'
          ? 'circle'
          : 'square'
        : quadMappings.bottom === 'color'
        ? responseMappings.color.blue === 'g'
          ? 'blue'
          : 'orange'
        : ''
    }</b>: middle finger</li>
  </ul>`;

  prompt_text = `
  <div class="prompt_box">
    <div class='prompt_content' style='margin-bottom: 80px;'>
      <p>Top 2 quadrants, judge the shape on its <b>${quadMappings.top}</b>:</p>
      <ul>
        <li><b>${
          quadMappings.top === 'form'
            ? responseMappings.form.circle === 'y'
              ? 'circle'
              : 'square'
            : quadMappings.top === 'color'
            ? responseMappings.color.blue === 'y'
              ? 'blue'
              : 'orange'
            : ''
        }</b>: index finger</li>
        <li><b>${
          quadMappings.top === 'form'
            ? responseMappings.form.circle === 'g'
              ? 'circle'
              : 'square'
            : quadMappings.top === 'color'
            ? responseMappings.color.blue === 'g'
              ? 'blue'
              : 'orange'
            : ''
        }</b>: middle finger</li>
      </ul>
    </div>
    <div class='prompt_content' style='margin-top: 80px;'>
      <p>Bottom 2 quadrants, judge the shape on its <b>${
        quadMappings.bottom
      }</b>:</p>
       <ul>
        <li><b>${
          quadMappings.bottom === 'form'
            ? responseMappings.form.circle === 'y'
              ? 'circle'
              : 'square'
            : quadMappings.bottom === 'color'
            ? responseMappings.color.blue === 'y'
              ? 'blue'
              : 'orange'
            : ''
        }</b>: index finger</li>
        <li><b>${
          quadMappings.bottom === 'form'
            ? responseMappings.form.circle === 'g'
              ? 'circle'
              : 'square'
            : quadMappings.bottom === 'color'
            ? responseMappings.color.blue === 'g'
              ? 'blue'
              : 'orange'
            : ''
        }</b>: middle finger</li>
      </ul>
    </div>
  </div>`;
};

const fixationDuration = 500;

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
        options: [1, 2, 3, 4],
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

    const mappings = getResponseMappings(motor_perm);

    responseMappings = mappings.responseMapping;
    quadMappings = mappings.quadMappings;
    task_switches = makeTaskSwitches(practiceLen);
    stims = createTrialTypes(task_switches);

    console.log('#####');
    console.log(task_switches);
    console.log(stims);

    setText();
  },
};

const choices = ['y', 'g'];

var endText = `
  <div class="centerbox">
    <p class="center-block-text">Thanks for completing this task!</p>
    <p class="center-block-text">Press <i>enter</i> to continue.</p>
  </div>
`;

var feedbackInstructText = `
  <p class="center-block-text">
    Welcome! This experiment will take around 11 minutes.
  </p>
  <p class="center-block-text">
    To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in fullscreen mode for the whole duration of each task.
  </p>
  <p class="center-block-text"> Press <i>enter</i> to begin.</p>
`;

var speedReminder =
  '<p class = block-text>Try to respond as quickly and accurately as possible.</p>';

var sumInstructTime = 0; // ms
var instructTimeThresh = 5; // /in seconds

var expStage = 'practice';
var practiceLen = 4; // divisible by 4,  2 (switch or stay) by 2 (mag or parity)]
var numTrialsPerBlock = 64; //  divisible by 4
var numTestBlocks = 3;

var accuracy_thresh = 0.8;
var practice_accuracy_thresh = 0.75;

var rt_thresh = 750;
var missed_response_thresh = 0.1;
var practice_thresh = 3;

var fileTypePNG = ".png'></img>";
var preFileType =
  "<img class = center src='/static/experiments/spatial_task_switching_rdoc__fmri/images/";

var current_trial = 0;

var task_boards = [
  [
    [
      '<div class = bigbox><div class = quad_box><div class = decision-top-left><div class = gng_number><div class = cue-text>',
    ],
    ['</div></div></div></div></div>'],
  ],
  [
    [
      '<div class = bigbox><div class = quad_box><div class = decision-top-right><div class = gng_number><div class = cue-text>',
    ],
    ['</div></div></div></div></div>'],
  ],
  [
    [
      '<div class = bigbox><div class = quad_box><div class = decision-bottom-right><div class = gng_number><div class = cue-text>',
    ],
    ['</div></div></div></div></div>'],
  ],
  [
    [
      '<div class = bigbox><div class = quad_box><div class = decision-bottom-left><div class = gng_number><div class = cue-text>',
    ],
    ['</div></div></div></div></div>'],
  ],
];

var stop_boards = [
  [
    [
      '<div class = bigbox><div class = quad_box><div class = decision-top-left>',
    ],
    ['</div></div></div>'],
  ],
  [
    [
      '<div class = bigbox><div class = quad_box><div class = decision-top-right>',
    ],
    ['</div></div></div>'],
  ],
  [
    [
      '<div class = bigbox><div class = quad_box><div class = decision-bottom-right>',
    ],
    ['</div></div></div>'],
  ],
  [
    [
      '<div class = bigbox><div class = quad_box><div class = decision-bottom-left>',
    ],
    ['</div></div></div>'],
  ],
];

const parse_design = (designs) => {
  console.log('Parsing stim designs...');
  let parsed_designs = [];

  for (let i = 0; i < designs.length; i++) {
    let design = designs[i];

    if (design === 'tst_cst') {
      parsed_designs.push('task_switch_cue_stay');
    } else if (design === 'tst_csw') {
      parsed_designs.push('task_stay_cue_switch');
    } else if (design === 'tsw_csw') {
      parsed_designs.push('task_switch_cue_switch');
    } else {
      console.log('Invalid design: ', design);
    }
  }

  return parsed_designs;
};

// IMAGES TO PRELOAD
var pathSource =
  '/static/experiments/spatial_task_switching_rdoc__fmri/images/';
var shapesPreload = [
  'blue_circle',
  'blue_square',
  'orange_circle',
  'orange_square',
];
var images = [];
for (i = 0; i < shapesPreload.length; i++) {
  images.push(pathSource + shapesPreload[i] + '.png');
}

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
    return trial_id === 'check_middle' ? undefined : 4000;
  },
  response_ends_trial: function () {
    const { trial_id } = jsPsych.data.get().last().trials[0];
    return trial_id === 'check_middle';
  },
};

var practiceTrials = [];
for (i = 0; i < practiceLen + 1; i++) {
  var practice_cue_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCue,
    choices: ['NO_KEYS'],
    data: {
      exp_stage: 'practice',
      trial_id: 'practice_cue',
      trial_duration: 150,
      stimulus_duration: 150,
    },
    trial_duration: 150, // getCTI
    stimulus_duration: 150, // getCTI

    prompt: () => prompt_text,
    on_finish: (data) => (data['block_num'] = practiceCount),
  };

  var practiceTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: choices,
    data: {
      exp_stage: 'practice',
      trial_id: 'practice_trial',
      choices: choices,
      trial_duration: 1500,
      stimulus_duration: 1000,
    },
    stimulus_duration: 1000, // 1000
    trial_duration: 1500, // 1500
    response_ends_trial: false,
    on_finish: appendData,
    prompt: () => prompt_text,
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
      return getExpStage() === 'practice' ? prompt_text : '';
    },
    on_finish: function (data) {
      data['trial_duration'] = ITIms * 1000;
      data['stimulus_duration'] = ITIms * 1000;
    },
  };

  var practiceFeedbackBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      var last = jsPsych.data.get().last(1).values()[0];
      if (last.response == null) {
        return '<div class = fb_box><div class = center-text><font size =20>Respond Faster!</font></div></div>';
      } else if (last.correct_trial == 1) {
        return '<div class = fb_box><div class = center-text><font size =20>Correct!</font></div></div>';
      } else {
        return '<div class = fb_box><div class = center-text><font size =20>Incorrect</font></div></div>';
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
    stimulus_duration: 500,
    trial_duration: 500,
    prompt: () => prompt_text,
  };
  practiceTrials.push(
    ITIBlock,
    practice_cue_block,
    practiceTrial,
    practiceFeedbackBlock
  );
}

var practiceCount = 0;
var practiceNode = {
  timeline: [feedbackBlock].concat(practiceTrials),
  loop_function: function (data) {
    practiceCount += 1;

    current_trial = 0;

    var sum_rt = 0;
    var sum_responses = 0;
    var correct = 0;
    var total_trials = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == 'practice_trial' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        total_trials += 1;
        if (data.trials[i].rt != null) {
          sum_rt += data.trials[i].rt;
          sum_responses += 1;
          if (data.trials[i].response == data.trials[i].correct_response) {
            correct += 1;
          }
        }
      }
    }

    var accuracy = correct / total_trials;
    var missed_responses = (total_trials - sum_responses) / total_trials;
    var ave_rt = sum_rt / sum_responses;

    feedbackText =
      '<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 4 seconds.</p>';

    if (accuracy < practice_accuracy_thresh) {
      feedbackText += `
          <p class="block-text">Your accuracy is low. Remember:</p>
          ${prompt_text_list}
        `;
    }

    if (ave_rt > rt_thresh) {
      feedbackText += `
        <p class="block-text">You have been responding too slowly.${speedReminder}</p>
      `;
    }

    if (missed_responses > missed_response_thresh) {
      feedbackText += `
          <p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>
        `;
    }

    feedbackText += `<p class="block-text">We are now going to start the task.</p>`;

    trial_designs = stim_designs.slice(0, numTrialsPerBlock);
    stim_designs = stim_designs.slice(numTrialsPerBlock);
    trial_designs = parse_design(trial_designs);
    task_switches = trial_designs;
    stims = createTrialTypes(task_switches);
    expStage = 'test';
    return false;
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

var testTrials = [];
for (i = 0; i < numTrialsPerBlock + 1; i++) {
  var cue_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCue,
    choices: ['NO_KEYS'],
    data: {
      exp_stage: 'test',
      trial_id: 'test_cue',
      trial_duration: 150,
      stimulus_duration: 150,
    },
    trial_duration: 150, // getCTI
    stimulus_duration: 150, // getCTI

    on_finish: (data) => (data['block_num'] = practiceCount),
  };

  var testTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: choices,
    data: {
      exp_stage: 'test',
      trial_id: 'test_trial',
      choices: choices,
      trial_duration: 1500,
      stimulus_duration: 1000,
    },
    stimulus_duration: 1000, // 1000
    trial_duration: 1500, // 1500

    response_ends_trial: false,
    on_finish: appendData,
  };
  testTrials.push(ITIBlock);
  testTrials.push(cue_block);
  testTrials.push(testTrial);
}

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

var testCount = 0;
var testNode = {
  timeline: [long_fixation_node, feedback_node].concat(
    long_fixation_node,
    testTrials
  ),
  loop_function: function (data) {
    testCount += 1;
    current_trial = 0;

    var sum_rt = 0;
    var sum_responses = 0;
    var correct = 0;
    var total_trials = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == 'test_trial' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        total_trials += 1;
        if (data.trials[i].rt != null) {
          sum_rt += data.trials[i].rt;
          sum_responses += 1;
          if (data.trials[i].response == data.trials[i].correct_response) {
            correct += 1;
          }
        }
      }
    }

    var accuracy = correct / total_trials;
    var missed_responses = (total_trials - sum_responses) / total_trials;
    var ave_rt = sum_rt / sum_responses;

    if (testCount === numTestBlocks) {
      feedbackText = `<div class=centerbox>
        <p class=block-text>Done with this task.</p>
        </div>`;

      return false;
    } else {
      feedbackText =
        '<div class = centerbox><p class = block-text>Please take this time to read your feedback!</p>';

      feedbackText += `<p class=block-text>You have completed ${testCount} out of ${numTestBlocks} blocks of trials.</p>`;

      if (accuracy < accuracy_thresh) {
        feedbackText += `
          <p class="block-text">Your accuracy is low. Remember:</p>
          ${prompt_text_list}
        `;
      }

      if (ave_rt > rt_thresh) {
        feedbackText += `
        <p class="block-text">You have been responding too slowly.${speedReminder}</p>
      `;
      }

      if (missed_responses > missed_response_thresh) {
        feedbackText += `
          <p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>
        `;
      }

      feedbackText += '</div>';

      trial_designs = stim_designs.slice(0, numTrialsPerBlock);
      stim_designs = stim_designs.slice(numTrialsPerBlock);
      trial_designs = parse_design(trial_designs);
      task_switches = trial_designs;
      stims = createTrialTypes(task_switches);
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
      'http://0.0.0.0:8080/static/experiments/spatial_task_switching_rdoc__fmri/designs';
    const results = await loadDesignsAndITIs(design_perm, design_path, [
      'stims',
    ]);
    ITIs = results.ITIs;
    stim_designs = results.stims;
  },
};

var expID = 'spatial_task_switching_rdoc__fmri';
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

var exit_fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

spatial_task_switching_rdoc__fmri_experiment = [];

var spatial_task_switching_rdoc__fmri_init = () => {
  jsPsych.pluginAPI.preloadImages(images);
  spatial_task_switching_rdoc__fmri_experiment.push(
    motor_and_design_perm_block
  );
  spatial_task_switching_rdoc__fmri_experiment.push(fullscreen);
  spatial_task_switching_rdoc__fmri_experiment.push(check_fingers_node);

  // Practice block
  spatial_task_switching_rdoc__fmri_experiment.push(practiceNode);
  spatial_task_switching_rdoc__fmri_experiment.push(feedbackBlock);
  spatial_task_switching_rdoc__fmri_experiment.push(fmri_wait_node);

  // Test blocks
  spatial_task_switching_rdoc__fmri_experiment.push(testNode);
  spatial_task_switching_rdoc__fmri_experiment.push(endBlock);
  spatial_task_switching_rdoc__fmri_experiment.push(exit_fullscreen);
};
