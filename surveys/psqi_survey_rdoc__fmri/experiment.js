// question_type	question_text	required	page_number	option_text	option_values	variables
// instruction	Welcome to this survey. Press <strong>next</strong> to begin.	0	1
// instruction	The following questions relate to your usual sleep habits during the past month only. Your answers should indicate the most accurate reply for the majority of days and nights in the past month. Please answer all questions.	0	2
// textfield	"1. During the past month, what time have you usually gone to bed at night? (hour:minutes AM/PM)"	1	3			psqi_1
// numeric	"2. During the past month, how long (in minutes) has it usually taken you to fall asleep each night?"	1	3			psqi_2
// textfield	"3. During the past month, what time have you usually gotten up in the morning?  (hour:minutes AM/PM)"	1	3			psqi_3
// numeric	"4. During the past month, how many hours of actual sleep did you get at night? (This may be different than the number of hours you spent in bed.)"	1	3			psqi_4
// instruction	"For each of the remaining questions, check the one best response. Please answer all questions."	0	4
// radio	"<font size=""5"">5. During the past month, how often have you had trouble sleeping because you . . . </font><br /><br />a) Cannot get to sleep within 30 minutes"	1	4	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_5
// radio	b) Wake up in the middle of the night or early morning	1	4	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_6
// radio	c) Have to get up to use the bathroom	1	4	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_7
// radio	d) Cannot breathe comfortably	1	4	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_8
// radio	e) Cough or snore loudly	1	4	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_9
// radio	f) Feel too cold	1	4	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_10
// radio	g) Feel too hot	1	4	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_11
// radio	h) Had bad dreams	1	4	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_12
// radio	i) Have pain	1	4	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_13
// textfield	"j) Other reason(s), please describe:"	0	4	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_14
// radio	j) How often during the past month have you had trouble sleeping because of this?	0	4	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_15
// radio	"6. During the past month, how would you rate your sleep quality overall?"	1	5	"Very good, Fairly good, Fairly bad, Very bad"	"0, 1, 2, 3"	psqi_16
// radio	"7. During the past month, how often have you taken medicine to help you sleep (prescribed or ""over the counter"")?"	1	5	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_17
// radio	"8. During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?"	1	5	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_18
// radio	"9. During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done?"	1	5	"No problem at all, Only a very slight problem, Somewhat of a problem, A very big problem"	"0, 1, 2, 3"	psqi_19
// radio	10. Do you have a bed partner or room mate?	1	5	"No bed partner or room mate, Partner/room mate in other room, Partner in same room but not same bed, Partner in same bed"	"0, 1, 2, 3"	psqi_20
// instruction	"If you have a room mate or bed partner, ask him/her how often in the past month you have had . . ."	0	6
// radio	a) Loud snoring	0	6	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_21
// radio	b) Long pauses between breaths while asleep	0	6	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_22
// radio	c) Legs twitching or jerking while you sleep	0	6	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_23
// radio	d) Episodes of disorientation or confusion during sleep	0	6	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_24
// textfield	e) Other restlessness while you sleep; please describe:	0	6			psqi_25
// radio	e) please choose how often.	0	6	"Not during the past month, Less than once a week, Once or twice a week, Three or more times a week"	"0, 1, 2, 3"	psqi_26
// instruction	Congratulations for completing this survey! Press <strong>finish</strong> to continue.	0	7

function chunkArray(array, chunkSize) {
  let result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    let chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}

var questions = [
  [
    {
      type: 'html',
      prompt:
        'Indicate the most accurate reply for the majority of days and nights in the past month.',
      name: 'Indicate the most accurate reply for the majority of days and nights in the past month.',
      key: 'intro_prompt',
    },
    {
      type: 'text',
      prompt:
        'During the past month, what time have you usually gone to bed at night? (hour:minutes AM/PM)',
      name: 'During the past month, what time have you usually gone to bed at night? (hour:minutes AM/PM)',
      required: true,
      placeholder: '',
      key: 'bedtime',
    },
    {
      type: 'text',
      prompt:
        'During the past month, how long (in minutes) has it usually taken you to fall asleep each night?',
      name: 'During the past month, how long (in minutes) has it usually taken you to fall asleep each night?',
      required: true,
      placeholder: '',
      key: 'time_to_sleep',
    },
    {
      type: 'text',
      prompt:
        'During the past month, what time have you usually gotten up in the morning? (hour:minutes AM/PM)',
      name: 'During the past month, what time have you usually gotten up in the morning? (hour:minutes AM/PM)',
      required: true,
      placeholder: '',
      key: 'wake_time',
    },
    {
      type: 'text',
      prompt:
        'During the past month, how many hours of actual sleep did you get at night ? (This may be different than the number of hours you spent in bed.)',
      name: 'During the past month, how many hours of actual sleep did you get at night ? (This may be different than the number of hours you spent in bed.)',
      required: true,
      placeholder: '',
      key: 'actual_sleep_hours',
    },
    {
      type: 'html',
      prompt:
        "<h4 style='margin-top: 50px;'>For each of the remaining questions, check the one best response. Please answer all questions.</h4>",
      name: 'For each of the remaining questions, check the one best response. Please answer all questions.',
      key: 'question_instructions',
    },
    {
      type: 'html',
      prompt:
        '<b>During the past month, how often have you had trouble sleeping because you...</b>',
      name: 'During the past month, how often have you had trouble sleeping because you...',
      key: 'trouble_sleeping_causes_intro',
    },
    {
      type: 'multi-choice',
      prompt: 'Cannot get to sleep within 30 minutes?',
      name: 'Cannot get to sleep within 30 minutes?',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'sleep_delay',
    },
    {
      type: 'multi-choice',
      prompt: 'Wake up in the middle of the night or early morning',
      name: 'Wake up in the middle of the night or early morning',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'night_waking',
    },
    {
      type: 'multi-choice',
      prompt: 'Have to get up to use the bathroom',
      name: 'Have to get up to use the bathroom',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'night_bathroom_visits',
    },
    {
      type: 'multi-choice',
      prompt: 'Cannot breathe comfortably',
      name: 'Cannot breathe comfortably',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'breathing_difficulty',
    },
    {
      type: 'multi-choice',
      prompt: 'Cough or snore loudly',
      name: 'Cough or snore loudly',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'snoring',
    },
    {
      type: 'multi-choice',
      prompt: 'Feel too cold',
      name: 'Feel too cold',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'feeling_cold',
    },
    {
      type: 'multi-choice',
      prompt: 'Had bad dreams',
      name: 'Had bad dreams',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'bad_dreams',
    },
    {
      type: 'multi-choice',
      prompt: 'Have pain',
      name: 'Have pain',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'pain_while_sleeping',
    },
    {
      type: 'text',
      prompt: 'Other reason(s), please describe:',
      name: 'Other reason(s), please describe:',
      key: 'other_sleep_issues',
    },
    {
      type: 'multi-choice',
      prompt:
        'How often during the past month have you had trouble sleeping because of this?',
      name: 'How often during the past month have you had trouble sleeping because of this?',
      required: false,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'frequency_of_trouble_sleeping',
    },
    {
      type: 'multi-choice',
      prompt:
        'During the past month, how would you rate your sleep quality overall?',
      name: 'During the past month, how would you rate your sleep quality overall?',
      required: true,
      options: ['Very good', 'Fairly good', 'Fairly bad', 'Very bad'],
      key: 'overall_sleep_quality',
    },
    {
      type: 'multi-choice',
      prompt:
        'During the past month, how often have you taken medicine to help you sleep (prescribed or "over the counter")?',
      name: 'During the past month, how often have you taken medicine to help you sleep (prescribed or "over the counter")?',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'sleep_medication_use',
    },
    {
      type: 'multi-choice',
      prompt:
        'During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?',
      name: 'During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'trouble_staying_awake',
    },
    {
      type: 'multi-choice',
      prompt:
        'During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done?',
      name: 'During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done?',
      required: true,
      options: [
        'No problem at all',
        'Only a very slight problem',
        'Somewhat of a problem',
        'A very big problem',
      ],
      key: 'enthusiasm_for_tasks',
    },
    {
      type: 'multi-choice',
      prompt: 'Do you have a bed partner or room mate?',
      name: 'Do you have a bed partner or room mate?',
      required: true,
      options: [
        'No bed partner or room mate',
        'Partner/room mate in other room',
        'Partner in same room but not same bed',
        'Partner in same bed',
      ],
      key: 'bed_partner_status',
    },
    {
      type: 'html',
      prompt:
        "<h4 style='margin-top:50px;'>If you have a room mate or bed partner, ask him/her how often in the past month you have had...</h4>",
      name: 'If you have a room mate or bed partner, ask him/her how often in the past month you have had...',
      key: 'partner_observation_intro',
    },
    {
      type: 'multi-choice',
      prompt: 'Loud snoring',
      name: 'Loud snoring',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'loud_snoring',
    },
    {
      type: 'multi-choice',
      prompt: 'Long pauses between breaths while asleep',
      name: 'Long pauses between breaths while asleep',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'breathing_pauses',
    },
    {
      type: 'multi-choice',
      prompt: 'Legs twitching or jerking while you sleep',
      name: 'Legs twitching or jerking while you sleep',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'leg_twitching',
    },
    {
      type: 'multi-choice',
      prompt: 'Episodes of disorientation or confusion during sleep',
      name: 'Episodes of disorientation or confusion during sleep',
      required: true,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'sleep_disorientation',
    },
    {
      type: 'text',
      prompt: 'Other restlessness while you sleep, please describe:',
      name: 'Other restlessness while you sleep, please describe:',
      required: false,
      key: 'other_restlessness_description',
    },
    {
      type: 'multi-choice',
      prompt: 'Please choose how often for the last question:',
      name: 'Please choose how often for the last question:',
      required: false,
      options: [
        'Not during the past month',
        'Less than once a week',
        'Once or twice a week',
        'Three or more times a week',
      ],
      key: 'frequency_of_restlessness',
    },
  ],
];

var instructions = [
  `<div class='instructions'>
      <p>Welcome to this survey.</p>
      <p>The following questions relate to your usual sleep habits during the <b>past month only</b>. Your answers should indicate the most accurate reply for the majority of days and nights in the past month. Please answer all questions.</p>
      <p>Press <b>enter</b> to begin.</p>
  </div>`,
];

var instructionsBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: 'instructions',
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: instructions,
  choices: ['Enter'],
  post_trial_gap: 0,
};
var trial = {
  type: jsPsychSurvey,
  pages: questions,
  button_label_finish: 'Submit',
  on_finish: function (data) {
    Object.keys(data.response).forEach(function (key) {
      var questionItem = questions.flat().find((q) => q.name === key);
      if (questionItem) {
        data[questionItem.key] = {
          key: questionItem.key,
          question: questionItem.prompt,
          response: data.response[key],
        };
      }
    });
  },
};

var fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
};
var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var endText = `
  <div class="centerbox">
    <p class="center-block-text">Thanks for completing this task!</p>
    <p class="center-block-text">Press <i>enter</i> to continue.</p>
  </div>
`;

var endBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: 'end',
    exp_id: 'psqi_survey_rdoc__fmri',
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: endText,
  choices: ['Enter'],
  post_trial_gap: 0,
};

psqi_survey_rdoc__fmri_experiment = [];
var psqi_survey_rdoc__fmri_init = () => {
  psqi_survey_rdoc__fmri_experiment.push(fullscreen);
  psqi_survey_rdoc__fmri_experiment.push(instructionsBlock);
  psqi_survey_rdoc__fmri_experiment.push(trial);
  psqi_survey_rdoc__fmri_experiment.push(endBlock);
  psqi_survey_rdoc__fmri_experiment.push(exitFullscreen);
};
