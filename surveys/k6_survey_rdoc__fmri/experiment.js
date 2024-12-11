// question_type	question_text	required	page_number	option_text	option_values	variables
// instruction	Welcome to this survey. Press <strong>Next</strong> to begin.	0	1
// instruction	"The following questions ask about how you have been feeling during the past 30 days. For each
// question, please select the option that best describes how often you had this feeling."	0	2
// instruction	"<h4>Q1: During the past 30 days, about how
// often did you feel … </h4>"	0	3
// radio	… nervous?	1	3	All of the time, Most of the time, Some of the time, A little of the time, None of the time	1,2,3,4,5	k6_1
// radio	… hopeless?	1	3	All of the time, Most of the time, Some of the time, A little of the time, None of the time	1,2,3,4,5	k6_2
// radio	… restless or fidgety?	1	3	All of the time, Most of the time, Some of the time, A little of the time, None of the time	1,2,3,4,5	k6_3
// radio	… so depressed that nothing could cheer you up?	1	3	All of the time, Most of the time, Some of the time, A little of the time, None of the time	1,2,3,4,5	k6_4
// radio	… that everything was an effort?	1	3	All of the time, Most of the time, Some of the time, A little of the time, None of the time	1,2,3,4,5	k6_5
// radio	… worthless?	1	3	All of the time, Most of the time, Some of the time, A little of the time, None of the time	1,2,3,4,5	k6_6
// radio	"Q2: The last six questions asked about feelings that might have occurred during the past 30 days. Taking them altogether, did these feelings occur more often in the past 30 days than is usual for you, about the same as usual, or less often than usual? (If you never have any of these feelings, select “about the same as usual”) "	1	3	A lot, Some<br><strong>More often than usual<br>←</strong>, A little, About the same as usual, A little , Some<br><strong>Less often than usual<br>→</strong>, A lot	1,2,3,4,5,6,7	k6_7
// instruction	"<h4>The next few questions are about how these feelings may have affected you in the past 30 days. You need not answer these questions if you answered “None of the time” to all of the six questions about your feelings.</h4>"	0	4	k6_8
// numeric	"Q3: During the past 30 days, how many days out of 30 were you totally unable to work or carry out your normal activities because of these feelings?<br><br><strong>(Number of Days)</strong>"	0	4	k6_9
// numeric	"Q4: Not counting the days you reported in response to Q3, how many days in the past 30 were you able to do only half or less of what you would normally have been able to do, because of these feelings?<br><br><strong>(Number of Days)</strong>"	0	4	k6_10
// numeric	"Q5: During the past 30 days, how many times did you see a doctor or other health professional about these feelings?<br><br><strong>(Number of Times)</strong>"	0	4	k6_11
// radio	"Q6: During the past 30 days, how often have physical health problems been the main cause of these feelings? "	0	4	All of the time, Most of the time, Some of the time, A little of the time, None of the time	1,2,3,4,5	k6_12
// checkbox	Do you have or have you ever been diagnosed with any of the following psychological disorders (check all that apply)?	1	5	ADHD, Alcohol Dependency, Anorexi Nervosa, Anxiety Disorder, Autism/Autism Specturm Disorder, Borderline Personality Disorder, Bulimia, Drug Dependency, Depression, Manic-Depressive (Bilpolar) illness, Obessive Compulsive Disorder, Schizophrenia, Other, None	k6_13
// textfield	If you responded “other” to the above question, please describe:	0	5	k6_14
// radio	Have you been diagnosed with any neurological disorder (e.g. Alzheimer's, Parkinson's)?	1	5	Yes, No	1, 0	k6_15
// textfield	If you responded “yes” to the above question, please describe:	0	5	k6_16
// checkbox	Do you have or have you ever been diagnosed with any of the following medical conditions (check all that apply)?	1	5	Type II diabetes, Metabolic Syndrome, High Blood Pressure, Heart Disease, Stroke, Cancer, Sleep Apnea, Other, None	k6_17
// textfield	If you responded “other” to the above question, please describe:	0	5	k6_18
// instruction	Congratulations for completing this survey! Press < strong > finish</strong > to continue.0	6

var questions = [
  [
    {
      type: 'html',
      prompt: 'During the past 30 days, about how often did you feel...',
      name: 'During the past 30 days, about how often did you feel...',
      key: 'feelings_past_30_days',
    },
    {
      type: 'multi-choice',
      prompt: '...nervous',
      name: 'nervous',
      key: 'nervous',
      required: true,
      options: [
        'All of the time',
        'Most of the time',
        'Some of the time',
        'A little of the time',
        'None of the time',
      ],
    },
    {
      type: 'multi-choice',
      prompt: '...hopeless',
      name: 'hopeless',
      key: 'hopeless',
      required: true,
      options: [
        'All of the time',
        'Most of the time',
        'Some of the time',
        'A little of the time',
        'None of the time',
      ],
    },
    {
      type: 'multi-choice',
      prompt: '...restless or fidgety',
      name: 'restless or fidgety',
      key: 'restless_fidgety',
      required: true,
      options: [
        'All of the time',
        'Most of the time',
        'Some of the time',
        'A little of the time',
        'None of the time',
      ],
    },
    {
      type: 'multi-choice',
      prompt: '...so depressed that nothing could cheer you up?',
      name: 'so depressed that nothing could cheer you up?',
      key: 'depressed_no_cheer',
      required: true,
      options: [
        'All of the time',
        'Most of the time',
        'Some of the time',
        'A little of the time',
        'None of the time',
      ],
    },
    {
      type: 'multi-choice',
      prompt: '...that everything was an effort?',
      name: 'that everything was an effort?',
      key: 'everything_effort',
      required: true,
      options: [
        'All of the time',
        'Most of the time',
        'Some of the time',
        'A little of the time',
        'None of the time',
      ],
    },
    {
      type: 'multi-choice',
      prompt: '...worthless?',
      name: 'worthless?',
      key: 'worthless',
      required: true,
      options: [
        'All of the time',
        'Most of the time',
        'Some of the time',
        'A little of the time',
        'None of the time',
      ],
    },
  ],
  [
    {
      type: 'multi-choice',
      prompt:
        'The last six questions asked about feelings that might have occurred during the past 30 days. Taking them altogether, did these feelings occur less often in the past 30 days than is usual for you, about the same as usual, or more often than usual? (If you never have any of these feelings, select “about the same as usual”)',
      name: 'The last six questions asked about feelings that might have occurred during the past 30 days. Taking them altogether, did these feelings occur less often in the past 30 days than is usual for you, about the same as usual, or more often than usual? (If you never have any of these feelings, select “about the same as usual”)',
      key: 'feelings_occurrence',
      required: true,
      options: [
        'A little less often than usual',
        'Some less often than usual',
        'A lot less often than usual',
        'About the same as usual',
        'A little more often than usual',
        'Some more often than usual',
        'A lot more often than usual',
      ],
    },
    {
      type: 'html',
      prompt:
        '<h4 style="margin-top:50px;">The next few questions are about how these feelings may have affected you in the past 30 days. If you answered "None of the time" to all of the six questions about your feelings, enter N/A for the following questions.<h4>',
      name: 'The next few questions are about how these feelings may have affected you in the past 30 days. If you answered "None of the time" to all of the six questions about your feelings, enter N/A for the following questions.',
      key: 'feelings_impact_intro',
    },
    {
      type: 'text',
      prompt:
        'During the past 30 days, how many days out of 30 were you totally unable to work or carry out your normal activities because of these feelings? (Number of Days)',
      name: 'During the past 30 days, how many days out of 30 were you totally unable to work or carry out your normal activities because of these feelings? (Number of Days)',
      key: 'unable_to_work_days',
      required: false,
      placeholder: '',
    },
    {
      type: 'text',
      prompt:
        'Not counting the days you reported in response to the last question, how many days in the past 30 were you able to do only half or less of what you would normally have been able to do, because of these feelings? (Number of Days)',
      name: 'Not counting the days you reported in response to the last question, how many days in the past 30 were you able to do only half or less of what you would normally have been able to do, because of these feelings? (Number of Days)',
      key: 'half_days_work',
      required: false,
      placeholder: '',
    },
    {
      type: 'text',
      prompt:
        'During the past 30 days, how many times did you see a doctor or other health professional about these feelings? (Number of Times)',
      name: 'During the past 30 days, how many times did you see a doctor or other health professional about these feelings? (Number of Times)',
      key: 'doctor_visits',
      required: false,
      placeholder: '',
    },
    {
      type: 'multi-choice',
      prompt:
        'During the past 30 days, how often have physical health problems been the main cause of these feelings?',
      name: 'During the past 30 days, how often have physical health problems been the main cause of these feelings?',
      key: 'physical_health_cause',
      required: false,
      options: [
        'All of the time',
        'Most of the time',
        'Some of the time',
        'A little of the time',
        'None of the time',
      ],
    },
  ],
  [
    {
      type: 'multi-select',
      prompt:
        'Do you have or have you ever been diagnosed with any of the following psychological disorders (check all that apply)',
      name: 'Do you have or have you ever been diagnosed with any of the following psychological disorders (check all that apply)',
      key: 'diagnosed_psych_disorders',
      required: true,
      options: [
        'ADHD',
        'Alcohol Dependency',
        'Anorexi Nervosa',
        'Anxiety Disorder',
        'Autism/Autism Specturm Disorder',
        'Borderline Personality Disorder',
        'Bulimia',
        'Drug Dependency',
        'Depression',
        'Manic - Depressive(Bilpolar) illness',
        'Obessive Compulsive Disorder',
        'Schizophrenia',
        'Other',
        'None',
      ],
    },
    {
      type: 'text',
      prompt:
        'If you responded “other” to the above question about psychological disorder, please describe:',
      name: 'If you responded “other” to the above question about psychological disorder, please describe:',
      key: 'other_psych_disorder',
      required: false,
      placeholder: '',
    },
    {
      type: 'multi-choice',
      prompt:
        "Have you been diagnosed with any neurological disorder (e.g. Alzheimer's, Parkinson's)?",
      name: "Have you been diagnosed with any neurological disorder (e.g. Alzheimer's, Parkinson's)?",
      key: 'diagnosed_neuro_disorder',
      required: true,
      options: ['Yes', 'No'],
    },
    {
      type: 'text',
      prompt: 'If you responded “yes” to the above question, please describe:',
      name: 'If you responded “yes” to the above question, please describe:',
      key: 'yes_neuro_disorder',
      required: false,
      placeholder: '',
    },
    {
      type: 'multi-select',
      prompt:
        'Do you have or have you ever been diagnosed with any of the following medical conditions (check all that apply)?',
      name: 'Do you have or have you ever been diagnosed with any of the following medical conditions (check all that apply)?',
      key: 'diagnosed_med_conditions',
      required: true,
      options: [
        'Type II diabetes',
        'Metabolic Syndrome',
        'High Blood Pressure',
        'Heart Disease',
        'Stroke',
        'Cancer',
        'Sleep Apnea',
        'Other',
        'None',
      ],
    },
    {
      type: 'text',
      prompt:
        'If you responded “other” to the above question about medical conditions, please describe:',
      name: 'If you responded “other” to the above question about medical conditions, please describe:',
      key: 'other_med_condition',
      required: false,
      placeholder: '',
    },
  ],
];

var instructions = [
  `<div class='instructions'>
      <p>Welcome to this survey.</p>
      <p>The following questions ask about how you have been feeling during the past 30 days. For each question, please select the option that best describes how often you had this feeling.</p>
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
    if (
      'During the past 30 days, about how often did you feel...' in
      data.response
    ) {
      delete data.response[
        'During the past 30 days, about how often did you feel...'
      ];
    }

    if (
      'The last six questions asked about feelings that might have occurred during the past 30 days. Taking them altogether, did these feelings occur more often in the past 30 days than is usual for you, about the same as usual, or less often than usual? (If you never have any of these feelings, select “about the same as usual”)' in
      data.response
    ) {
      delete data.response[
        'The last six questions asked about feelings that might have occurred during the past 30 days. Taking them altogether, did these feelings occur more often in the past 30 days than is usual for you, about the same as usual, or less often than usual? (If you never have any of these feelings, select “about the same as usual”)'
      ];
    }

    if (
      'The next few questions are about how these feelings may have affected you in the past 30 days. You need not answer these questions if you answered “None of the time” to all of the six questions about your feelings.' in
      data.response
    ) {
      delete data.response[
        'The next few questions are about how these feelings may have affected you in the past 30 days. You need not answer these questions if you answered “None of the time” to all of the six questions about your feelings.'
      ];
    }

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
    exp_id: 'k6_survey_rdoc__fmri',
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: endText,
  choices: ['Enter'],
  post_trial_gap: 0,
};

k6_survey_rdoc__fmri_experiment = [];
var k6_survey_rdoc__fmri_init = () => {
  k6_survey_rdoc__fmri_experiment.push(fullscreen);
  k6_survey_rdoc__fmri_experiment.push(instructionsBlock);
  k6_survey_rdoc__fmri_experiment.push(trial);
  k6_survey_rdoc__fmri_experiment.push(endBlock);
  k6_survey_rdoc__fmri_experiment.push(exitFullscreen);
};
