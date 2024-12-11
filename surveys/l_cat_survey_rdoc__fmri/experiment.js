// question_type	question_text	required	page_number	option_text	option_values
// instruction	Welcome to this survey. Press <strong>Next</strong> to begin.	0	1
// instruction	In the past 30 days, which statement best describes the kinds of physical activity you usually did?  Do not include the time you spent working at a job.  Please read all six statements before selecting one.	0	2
// instruction	1. I did not do much physical activity.  I mostly did things like watching television, reading, playing cards, or playing computer games.  Only occasionally, no more than once or twice a month, did I do anything more active such as going for a walk or playing tennis.	0	3
// instruction	2. Once or twice a week, I did light activities such as getting outdoors on the weekends for an easy walk or stroll.  Or one or twice a week, I did chores around the house such as sweeping floors or vacuuming.	0	3
// instruction	3. About three times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for about 15–20 minutes each time. Or about once a week, I did moderately difficult chores such as raking or mowing the lawn for about 45–60 minutes. Or about once a week, I played sports such as softball, basketball, or soccer for about 45–60 minutes.	0	3
// instruction	4. Almost daily, that is five or more times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for 30 minutes or more each time. Or about once a week, I did moderately difficult chores or played sports for 2 hours or more.	0	3
// instruction	5. About three times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time.	0	3
// instruction	6. Almost daily, that is five or more times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time.	0	3
// radio	Please select the option that best describes the kinds of physical activity you have usually done.	1	3	1,2,3,4,5,6	1,2,3,4,5,6
// instruction	Congratulations for completing this survey! Press <strong>finish</strong> to continue.	0	4

var questions = [
  [
    {
      type: 'html',
      prompt:
        '<b>In the past 30 days, which statement best describes the kinds of physical activity you usually did? Do not include the time you spent working at a job. Please read all six statements before selecting one.</b>',
      name: 'In the past 30 days, which statement best describes the kinds of physical activity you usually did? Do not include the time you spent working at a job. Please read all six statements before selecting one.',
    },
    {
      type: 'html',
      prompt:
        '1. I did not do much physical activity. I mostly did things like watching television, reading, playing cards, or playing computer games. Only occasionally, no more than once or twice a month, did I do anything more active such as going for a walk or playing tennis.',
      name: '1. I did not do much physical activity. I mostly did things like watching television, reading, playing cards, or playing computer games. Only occasionally, no more than once or twice a month, did I do anything more active such as going for a walk or playing tennis.',
    },
    {
      type: 'html',
      prompt:
        '2. Once or twice a week, I did light activities such as getting outdoors on the weekends for an easy walk or stroll. Or one or twice a week, I did chores around the house such as sweeping floors or vacuuming.',
      name: '2. Once or twice a week, I did light activities such as getting outdoors on the weekends for an easy walk or stroll. Or one or twice a week, I did chores around the house such as sweeping floors or vacuuming.',
    },
    {
      type: 'html',
      prompt:
        '3. About three times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for about 15–20 minutes each time. Or about once a week, I did moderately difficult chores such as raking or mowing the lawn for about 45–60 minutes. Or about once a week, I played sports such as softball, basketball, or soccer for about 45–60 minutes.',
      name: '3. About three times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for about 15–20 minutes each time. Or about once a week, I did moderately difficult chores such as raking or mowing the lawn for about 45–60 minutes. Or about once a week, I played sports such as softball, basketball, or soccer for about 45–60 minutes.',
    },
    {
      type: 'html',
      prompt:
        '3. About three times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for about 15–20 minutes each time. Or about once a week, I did moderately difficult chores such as raking or mowing the lawn for about 45–60 minutes. Or about once a week, I played sports such as softball, basketball, or soccer for about 45–60 minutes.',
      name: '3. About three times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for about 15–20 minutes each time. Or about once a week, I did moderately difficult chores such as raking or mowing the lawn for about 45–60 minutes. Or about once a week, I played sports such as softball, basketball, or soccer for about 45–60 minutes.',
    },
    {
      type: 'html',
      prompt:
        '4. Almost daily, that is five or more times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for 30 minutes or more each time. Or about once a week, I did moderately difficult chores or played sports for 2 hours or more.',
      name: '4. Almost daily, that is five or more times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for 30 minutes or more each time. Or about once a week, I did moderately difficult chores or played sports for 2 hours or more.',
    },
    {
      type: 'html',
      prompt:
        '5. About three times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time.',
      name: '5. About three times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time.',
    },
    {
      type: 'html',
      prompt:
        '6. Almost daily, that is five or more times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time.',
      name: '6. Almost daily, that is five or more times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time.',
    },
    {
      type: 'likert',
      likert_scale_max: 6,
      prompt:
        'Please select the option that best describes the kinds of physical activity you have usually done.',
      name: 'Please select the option that best describes the kinds of physical activity you have usually done.',
    },
  ],
];

var instructions = [
  `<div class='instructions'>
      <p>Welcome to this survey.</p>
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
    data.likert_scale_1_label =
      'I did not do much physical activity. I mostly did things like watching television, reading, playing cards, or playing computer games. Only occasionally, no more than once or twice a month, did I do anything more active such as going for a walk or playing tennis.';
    data.likert_scale_2_label =
      'Once or twice a week, I did light activities such as getting outdoors on the weekends for an easy walk or stroll.  Or one or twice a week, I did chores around the house such as sweeping floors or vacuuming.';
    data.likert_scale_3_label =
      'About three times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for about 15–20 minutes each time. Or about once a week, I did moderately difficult chores such as raking or mowing the lawn for about 45–60 minutes. Or about once a week, I played sports such as softball, basketball, or soccer for about 45–60 minutes.';
    data.likert_scale_4_label =
      'Almost daily, that is five or more times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for 30 minutes or more each time. Or about once a week, I did moderately difficult chores or played sports for 2 hours or more.';
    data.likert_scale_5_label =
      'About three times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time.';
    data.likert_scale_6_label =
      'Almost daily, that is five or more times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time.';

    let response =
      data.response[
        'Please select the option that best describes the kinds of physical activity you have usually done.'
      ];

    data['exercise'] = {
      key: 'exercise',
      response: response,
      question:
        'Please select the option that best describes the kinds of physical activity you have usually done.',
    };
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
    exp_id: 'l_cat_survey_rdoc__fmri',
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: endText,
  choices: ['Enter'],
  post_trial_gap: 0,
};

l_cat_survey_rdoc__fmri_experiment = [];
var l_cat_survey_rdoc__fmri_init = () => {
  l_cat_survey_rdoc__fmri_experiment.push(fullscreen);
  l_cat_survey_rdoc__fmri_experiment.push(instructionsBlock);
  l_cat_survey_rdoc__fmri_experiment.push(trial);
  l_cat_survey_rdoc__fmri_experiment.push(endBlock);
  l_cat_survey_rdoc__fmri_experiment.push(exitFullscreen);
};
