// Adding all available keys for button box
// - Four our configuration, keys can only be 'b', 'y', 'g', 'r', 'e'
const buttonBoxKeys = ['b', 'y', 'g', 'r', 'e'];

function sampleWithoutReplacement(arr, n) {
  let result = [];
  let tempArray = [...arr];

  for (let i = 0; i < n; i++) {
    if (tempArray.length === 0) {
      break;
    }

    const index = Math.floor(Math.random() * tempArray.length);
    result.push(tempArray[index]);
    tempArray.splice(index, 1);
  }

  return result;
}

const getExpStage = () => expStage;

function appendData() {
  var data = jsPsych.data.get().last(1).values()[0];
  if (data.response == data.correct_response) {
    var correctTrial = 1;
  } else {
    var correctTrial = 0;
  }
  jsPsych.data.get().addToLast({
    correct_trial: correctTrial,
    block_num: getExpStage() == 'practice' ? practiceCount : testCount,
  });
}

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

const getCue = () => {
  currStim = blockStims.shift();
  return currStim.cue_stimulus;
};

const getStim = () => currStim.stimulus;

const getStimData = () => currStim.data;

const getCurrBlockNum = () =>
  getExpStage() === 'practice' ? practiceCount : testCount;

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// common variables
const fixationDuration = 500;

const possibleResponses = [
  ['index finger', 'y', 'index finger'],
  ['middle finger', 'g', 'middle finger'],
];

const choiceResponses = [possibleResponses[0][1], possibleResponses[1][1]];

var endText = `
  <div class="centerbox">
    <p class="center-block-text">Thanks for completing this task!</p>
    <p class="center-block-text">Press <i>enter</i> to continue.</p>
  </div>
`;

var feedbackInstructText = `
  <p class="center-block-text">
    Welcome! This experiment will take around 13 minutes.
  </p>
  <p class="center-block-text">
    To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in fullscreen mode for the whole duration of each task.
  </p>
  <p class="center-block-text"> Press <i>enter</i> to begin.</p>
`;

// eslint-disable-next-line no-unused-vars
var expStage = 'practice';

// Timing
const stimStimulusDuration = 1000;
const stimTrialDuration = 1500;
const cueStimulusDuration = 100;
const cueTrialDuration = 100;
const ctiDuration = 400;

var accuracyThresh = 0.8;
var practiceAccuracyThresh = 0.83; // 2 wrong, 10 out of 12 is .833
var rtThresh = 750;
var missedResponseThresh = 0.1;
var practiceThresh = 3;

var practiceLen = 1; // reduced from 12 -> showing one of each condition.
var numTestBlocks = 3;
var numTrialsPerBlock = 72; // should be multiple of 24

const responseKeys = `
  <ul class='block-text'>
    <li>Left (*): Index</li>
    <li>Right (*): Middle</li>
  </ul>`;

var currStim = '';

var fixation =
  '<div class = centerbox><div class = fixation style="font-size:100px">+</div></div>';

var images = {
  left: {
    box: '<div class = bigbox><div id=left_box></div></div>',
    bold: '<div class = bigbox><div id=left_box style="border-width:15px"></div></div>',
    star: "<div class = bigbox><div id=left_box><div class='center-text star'>*</div></div></div>",
  },
  right: {
    box: '<div class = bigbox><div id=right_box></div></div>',
    bold: '<div class = bigbox><div id=right_box style="border-width:15px"></div></div>',
    star: "<div class = bigbox><div id=right_box><div class='center-text star'>*</div></div></div>",
  },
};

var practiceStimuli = [];

const create_stimuli_objs = () => {
  // Creates 24 stimuli with the following conditions
  // 4 nocue left, 4 nocue right; 4 doublecue left, 4 doublecue right; 3 valid left, 1 invalid left, 3 valid right, 1 invalid right

  let stims_in_correct_proportion = [];

  for (let i = 0; i < 2; i++) {
    var loc = ['left', 'right'][i];
    var noloc = ['left', 'right'].filter((value) => value != loc)[0];
    // for this side, add 4 nocue, 4 double cue, 3 valid, 1 invalid
    let noCueTrials = Array(4).fill({
      stimulus: images[loc].star + images[noloc].box + fixation,
      cue_stimulus: images[loc].box + images[noloc].box + fixation,
      data: {
        cue_location: 'none',
        stim_location: loc,
        condition: 'nocue',
        correct_response: choiceResponses[i],
      },
    });

    let doubleCueTrials = Array(4).fill({
      stimulus: images[loc].star + images[noloc].box + fixation,
      cue_stimulus: images[loc].bold + images[noloc].bold + fixation,
      data: {
        cue_location: 'both',
        stim_location: loc,
        condition: 'doublecue',
        correct_response: choiceResponses[i],
      },
    });

    let validTrials = Array(3).fill({
      stimulus: images[loc].star + images[noloc].box + fixation,
      cue_stimulus: images[loc].bold + images[noloc].box + fixation,
      data: {
        cue_location: loc,
        stim_location: loc,
        condition: 'valid',
        correct_response: choiceResponses[i],
      },
    });

    let invalidTrials = [
      {
        stimulus: images[loc].star + images[noloc].box + fixation,
        cue_stimulus: images[loc].box + images[noloc].bold + fixation,
        data: {
          cue_location: noloc,
          stim_location: loc,
          condition: 'invalid',
          correct_response: choiceResponses[i],
        },
      },
    ];

    stims_in_correct_proportion.push(
      noCueTrials,
      doubleCueTrials,
      validTrials,
      invalidTrials
    );
  }
  return stims_in_correct_proportion.flat();
};

var stimuli = create_stimuli_objs();

var noCueStim = stimuli.filter((obj) => obj.data.condition === 'nocue');
var doubleCueStim = stimuli.filter((obj) => obj.data.condition === 'doublecue');
var validCueStim = stimuli.filter((obj) => obj.data.condition === 'valid');
var invalidCueStim = stimuli.filter((obj) => obj.data.condition === 'invalid');

var promptText;
var feedbackText;
const setText = () => {
  speedReminder =
    '<p class = block-text>Try to respond as quickly and accurately as possible.</p>';

  promptText = `
  <div class="prompt_box">
    <p class="center-block-text" style="font-size:16px; line-height:80%;">Left (*): Index</p>
    <p class="center-block-text" style="font-size:16px; line-height:80%;">Right (*): Middle</p>
  </div>
`;

  feedbackText = `
    <div class="centerbox">
    <p class="block-text">
      On each trial you will see two boxes on the screen, and then a star appear in either the left or right box.
    </p>
    <p class="block-text">
      Press your <b>${possibleResponses[0][0]}</b> if the star appears in the <b>left box</b>, and your <b>${possibleResponses[1][0]}</b> if the star appears in the <b>right box</b>.
    </p>
  </div>`;
};

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

var practiceFeedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    var last = jsPsych.data.get().last(1).trials[0];
    if (last.response == null) {
      return (
        "<div class=fb_box><div class='center-text'><font size =20>Respond Faster!</font></div></div>" +
        images.left.box +
        images.right.box +
        fixation
      );
    } else if (last.correct_trial == 1) {
      return (
        "<div class=fb_box><div class='center-text'><font size =20>Correct!</font></div></div>" +
        images.left.box +
        images.right.box +
        fixation
      );
    } else {
      return (
        "<div class=fb_box><div class='center-text'><font size =20>Incorrect</font></div></div>" +
        images.left.box +
        images.right.box +
        fixation
      );
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
        prompt: 'Select the design perm:',
        name: 'design_perm',
        options: Array.from({ length: 5 }, (_, i) => i + 1),
        required: true,
      },
    ],
  ],
  button_label_finish: 'Submit',
  on_finish: function (data) {
    data['design_perm'] = data.response.design_perm;
    design_perm = data.response.design_perm;

    setText();
  },
};

var ITIms = null;

// *** ITI *** //
var ITIBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: images.left.box + images.right.box + fixation,
  choices: buttonBoxKeys,
  response_ends_trial: false,
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_ITI`,
      ITIParams: stage === 'practice' ? 0.5 : null,
      block_num: stage === 'practice' ? practiceCount : testCount,
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

var practiceTrials = [];
for (let i = 0; i < practiceLen; i++) {
  var cueBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCue,
    response_ends_trial: false,
    choices: buttonBoxKeys,
    data: function () {
      return {
        trial_id: 'practice_cue',
        exp_stage: 'practice',
        trial_duration: cueTrialDuration,
        stimulus_duration: cueStimulusDuration,
        choices: buttonBoxKeys,
      };
    },
    stimulus_duration: cueStimulusDuration,
    trial_duration: cueTrialDuration,
    prompt: () => promptText,
    on_finish: (data) => (data['block_num'] = practiceCount),
  };
  var ctiBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: images.left.box + images.right.box + fixation,
    response_ends_trial: false,
    choices: buttonBoxKeys,
    data: {
      trial_id: 'practice_CTI',
      exp_stage: 'practice',
      choices: buttonBoxKeys,
    },
    stimulus_duration: ctiDuration,
    trial_duration: ctiDuration,
    prompt: () => promptText,
    on_finish: function (data) {
      data['block_num'] = practiceCount;
      data['trial_duration'] = ctiDuration;
      data['stimulus_duration'] = ctiDuration;
      data['CTI_duration'] = ctiDuration;
    },
  };
  var testTrial = {
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
      });
    },
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1000
    response_ends_trial: false,
    on_finish: appendData,
    prompt: () => promptText,
  };
  practiceTrials.push(
    ITIBlock,
    cueBlock,
    ctiBlock,
    testTrial,
    practiceFeedbackBlock
  );
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
      let text =
        '<p class="block-text">Your accuracy was low.</p>' + responseKeys;

      feedbackText += text;
      block_level_feedback['accuracy'] = {
        value: accuracy,
        text: text,
      };
    }

    if (avgRT > rtThresh) {
      let text =
        '<p class="block-text">Please respond more quickly without sacrificing accuracy</p>';
      feedbackText += text;
      block_level_feedback['rt'] = {
        value: avgRT,
        text: text,
      };
    }

    if (missedResponses > missedResponseThresh) {
      let text = '<p class="block-text">Respond on every trial.</p>';
      feedbackText += text;
      block_level_feedback['missed_responses'] = {
        value: missedResponses,
        text: text,
      };
    }

    feedbackText += '</div>';

    expStage = 'test';

    blockStims = stim_designs;
    block_level_feedback = feedback;

    return false;
  },
};

var testTrials = [];
for (i = 0; i < numTrialsPerBlock; i++) {
  var cueBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCue,
    response_ends_trial: false,
    choices: buttonBoxKeys,
    data: function () {
      return {
        trial_id: 'test_cue',
        exp_stage: 'test',
        trial_duration: cueTrialDuration,
        stimulus_duration: cueStimulusDuration,
        choices: buttonBoxKeys,
      };
    },
    stimulus_duration: cueStimulusDuration,
    trial_duration: cueTrialDuration,
    on_finish: (data) => (data['block_num'] = testCount),
  };
  var ctiBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: images.left.box + images.right.box + fixation,
    response_ends_trial: false,
    choices: buttonBoxKeys,
    data: {
      trial_id: 'test_CTI',
      exp_stage: 'test',
      choices: buttonBoxKeys,
    },
    stimulus_duration: ctiDuration,
    trial_duration: ctiDuration,
    on_finish: function (data) {
      data['block_num'] = testCount;
      data['trial_duration'] = ctiDuration;
      data['stimulus_duration'] = ctiDuration;
      data['CTI_duration'] = ctiDuration;
    },
  };
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
      });
    },
    stimulus_duration: stimStimulusDuration,
    trial_duration: stimTrialDuration,
    response_ends_trial: false,
    on_finish: appendData,
  };
  testTrials.push(ITIBlock, cueBlock, ctiBlock, testTrial);
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
      let text =
        '<p class="block-text">Your accuracy was low.</p>' + responseKeys;
      feedbackText += text;
      block_level_feedback['accuracy'] = {
        value: accuracy,
        text: text,
      };
    }

    if (avgRT > rtThresh) {
      let text =
        '<p class="block-text">Please respond more quickly without sacrificing accuracy</p>';
      feedbackText += text;
      block_level_feedback['rt'] = {
        value: avgRT,
        text: text,
      };
    }

    if (missedResponses > missedResponseThresh) {
      let text = '<p class="block-text">Respond on every trial.</p>';
      feedbackText += text;
      block_level_feedback['missed_responses'] = {
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
const create_test_trials = (designs, stimuli) => {
  const areAllObjectsIdentical = (arr) => {
    if (arr.length === 0) return true;

    // Serialize the first object to compare with others
    const firstObjString = JSON.stringify(arr[0]);

    // Compare each object with the first one
    return arr.every((obj) => JSON.stringify(obj) === firstObjString);
  };

  let stims = [];

  designs.forEach((design) => {
    const parts = design.split('_');
    let cue_type = parts[3];

    switch (cue_type) {
      case 'no':
        cue_type = 'nocue';
        break;
      case 'double':
        cue_type = 'doublecue';
        break;
      default:
        cue_type = cue_type;
    }

    let stim_location = Math.random() < 0.5 ? 'left' : 'right';

    let filtered = stimuli.filter((obj) => {
      return (
        obj.data.condition === cue_type &&
        obj.data.stim_location === stim_location
      );
    });

    if (areAllObjectsIdentical(filtered)) {
      stims.push(filtered[0]);
    } else {
      throw new Error('All objects in filtered array should be identical.');
    }
  });

  return stims;
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
    const design_path = `${base}/static/experiments/spatial_cueing_rdoc__fmri/designs`;
    const results = await loadDesignsAndITIs(design_perm, design_path, [
      'stims',
    ]);
    ITIs = results.ITIs;
    stim_designs = create_test_trials(results.stims, stimuli);
  },
};
var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var expID = 'spatial_cueing_rdoc__fmri';
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
};

var spatial_cueing_rdoc__fmri_experiment = [];
var spatial_cueing_rdoc__fmri_init = () => {
  practiceStimuli.push(
    ...sampleWithoutReplacement(doubleCueStim, 1),
    ...sampleWithoutReplacement(noCueStim, 1),
    ...sampleWithoutReplacement(validCueStim, 1),
    ...sampleWithoutReplacement(invalidCueStim, 1)
  );
  blockStims = jsPsych.randomization.repeat(practiceStimuli, 1);
  // Take only the first trial 
  blockStims = blockStims.slice(0, 1);
  console.log('blockStims', blockStims);

  spatial_cueing_rdoc__fmri_experiment.push(motor_and_design_perm_block);
  spatial_cueing_rdoc__fmri_experiment.push(fullscreen);
  spatial_cueing_rdoc__fmri_experiment.push(check_fingers_node);
  spatial_cueing_rdoc__fmri_experiment.push(practiceNode);
  spatial_cueing_rdoc__fmri_experiment.push(feedbackBlock);
  spatial_cueing_rdoc__fmri_experiment.push(fmri_wait_node);
  spatial_cueing_rdoc__fmri_experiment.push(testNode);
  spatial_cueing_rdoc__fmri_experiment.push(long_fixation_node);
  spatial_cueing_rdoc__fmri_experiment.push(feedbackBlock);
  spatial_cueing_rdoc__fmri_experiment.push(endBlock);
  spatial_cueing_rdoc__fmri_experiment.push(exitFullscreen);
};
