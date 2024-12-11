// question_type	question_text	required	page_number	option_text	option_values	variables
// instruction	Welcome to this survey. Press <strong>Next</strong> to begin.	0	1
// instruction	Please answer the following questions about your eating habits.	0	2
// radio	When I smell a sizzling steak or juicy piece of meat, I find it very difficult to keep from eating, even if I have just finished a meal.	1	3	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque1_bl
// radio	I deliberately take small helpings as a means of controlling my weight.	1	3	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque2_bl
// radio	When I feel anxious, I find myself eating.	1	3	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque3_bl
// radio	Sometimes when I start eating, I just can’t seem to stop.	1	3	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque4_bl
// radio	Being with someone who is eating often makes me hungry enough to eat also.	1	3	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque5_bl
// radio	When I feel blue, I often overeat.	1	3	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque6_bl
// radio	When I see a real delicacy, I often get so hungry that I have to eat right away.	1	4	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque7_bl
// radio	I get so hungry that my stomach often seems like a bottomless pit.	1	4	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque8_bl
// radio	I am always hungry so it is hard for me to stop eating before I finish the food on my plate.	1	4	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque9_bl
// radio	When I feel lonely, I console myself by eating.	1	4	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque10_bl
// radio	I consciously hold back at meals in order not to gain weight.	1	4	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque11_bl
// radio	I do not eat some foods because they make me fat.	1	4	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque12_bl
// radio	I am always hungry enough to eat at any time.	1	5	Definitely true,Mostly true,Mostly false,Definitely false	4,3,2,1	tfeque13_bl
// radio	How often do you feel hungry?	1	5	Only at <br>Meal times,Sometimes <br>between meals,Often between<br> meals,Almost always	1,2,3,4	tfeque14_bl
// radio	How frequently do you avoid 'stocking up' on tempting foods?	1	5	Almost never,Seldom,Usually,Almost always	1,2,3,4	tfeque15_bl
// radio	How likely are you to consciously eat less than you want?	1	5	Unlikely,Slightly likely,Moderately likely,Very likely	1,2,3,4	tfeque16_bl
// radio	Do you go on eating binges though you are not hungry?	1	5	Never,Rarely,Sometimes,At least once a week	1,2,3,4	tfeque17_bl
// radio	On a scale of 1 to 8, where 1 means no restraint in eating (eating whatever you want, whenever you want it) and 8 means total restraint (constantly limiting food intake and never 'giving in'), what number would you give yourself?	1	5	1,2,3,4,5,6,7,8	1,1,2,2,3,3,4,4	tfeque18_bl
// instruction	Congratulations for completing this survey! Press <strong>finish</strong> to continue.	0	6

const createSurveyQuestions = (questions, questions2) => {
  const firstObj = {
    type: 'html',
    prompt:
      '<h2>Please answer the following questions about your eating habits.</h2>',
    name: 'Please answer the following questions about your eating habits.',
  };

  var surveyQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    var questionObj = {
      type: 'likert',
      likert_scale_values: [
        {
          value: 1,
          text: 'Definitely true',
        },
        { value: 2, text: 'Mostly true' },
        {
          value: 3,
          text: 'Mostly false',
        },
        { value: 4, text: 'Definitely false' },
      ],
      prompt: `${questions[i].question}`,
      name: `${questions[i].question}`,
      required: true,
    };
    surveyQuestions.push(questionObj);
  }

  surveyQuestions = surveyQuestions.concat(questions2);

  function chunkArray(array, chunkSize, prependedObj) {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      let chunk = array.slice(i, i + chunkSize);
      chunk.unshift(prependedObj); // Add the object to the start of each chunk
      result.push(chunk);
    }
    return result;
  }
  // this won't chunk the array b/c surveyQuestions.length, but keeping in case we want to split up questions into different pages
  var preparedQuestionArray = chunkArray(
    surveyQuestions,
    surveyQuestions.length,
    firstObj
  );

  return preparedQuestionArray;
};

var questions = [
  {
    key: 'smell_meat_difficulty_resisting',
    question:
      'When I smell a sizzling steak or juicy piece of meat, I find it very difficult to keep from eating, even if I have just finished a meal.',
  },
  {
    key: 'takes_small_helpings_control_weight',
    question:
      'I deliberately take small helpings as a means of controlling my weight.',
  },
  {
    key: 'eating_when_anxious',
    question: 'When I feel anxious, I find myself eating.',
  },
  {
    key: 'cant_stop_eating',
    question: 'Sometimes when I start eating, I just can’t seem to stop.',
  },
  {
    key: 'eating_when_others_eat',
    question:
      'Being with someone who is eating often makes me hungry enough to eat also.',
  },
  {
    key: 'overeating_when_sad',
    question: 'When I feel blue, I often overeat.',
  },
  {
    key: 'eating_when_seeing_delicacies',
    question:
      'When I see a real delicacy, I often get so hungry that I have to eat right away.',
  },
  {
    key: 'bottomless_pit_feeling',
    question:
      'I get so hungry that my stomach often seems like a bottomless pit.',
  },
  {
    key: 'always_hungry_hard_to_stop',
    question:
      'I am always hungry so it is hard for me to stop eating before I finish the food on my plate.',
  },
  {
    key: 'eating_when_lonely',
    question: 'When I feel lonely, I console myself by eating.',
  },
  {
    key: 'hold_back_at_meals',
    question: 'I consciously hold back at meals in order not to gain weight.',
  },
  {
    key: 'avoid_foods_gain_weight',
    question: 'I do not eat some foods because they make me fat.',
  },
  {
    key: 'hungry_anytime',
    question: 'I am always hungry enough to eat at any time.',
  },
];

var questions2 = [
  {
    type: 'multi-choice',
    prompt: 'How often do you feel hungry?',
    name: 'How often do you feel hungry?',
    required: true,
    options: [
      'Only at meal times',
      'Sometimes between meals',
      'Often between meals',
      'Almost always',
    ],
  },
  {
    type: 'multi-choice',
    prompt: "How frequently do you avoid 'stocking up' on tempting foods?",
    name: "How frequently do you avoid 'stocking up' on tempting foods?",
    required: true,
    options: ['Almost never', 'Seldom', 'Usually', 'Almost always'],
  },
  {
    type: 'multi-choice',
    prompt: 'How likely are you to consciously eat less than you want?',
    name: 'How likely are you to consciously eat less than you want?',
    required: true,
    options: [
      'Unlikely',
      'Slightly likely',
      'Moderately likely',
      'Very likely',
    ],
  },
  {
    type: 'multi-choice',
    prompt: 'Do you go on eating binges though you are not hungry?',
    name: 'Do you go on eating binges though you are not hungry?',
    required: true,
    options: ['Never', 'Rarely', 'Sometimes', 'At least once a week'],
  },
  {
    type: 'likert',
    prompt:
      "On a scale of 1 to 8, where 1 means no restraint in eating (eating whatever you want, whenever you want it) and 8 means total restraint (constantly limiting food intake and never 'giving in'), what number would you give yourself?",
    name: "How frequently do you avoid 'stocking up' on tempting foods?",
    required: true,
    likert_scale_min_label: 'No restraint',
    likert_scale_max_label: 'Total restraint',
    likert_scale_max: 8,
  },
];

var surveyQuestions = createSurveyQuestions(questions, questions2);

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
  pages: surveyQuestions,
  button_label_finish: 'Submit',
  on_finish: function (data) {
    if (
      'Please answer the following questions about your eating habits.' in
      data.response
    ) {
      delete data.response[
        'Please answer the following questions about your eating habits.'
      ];
    }
    data.likert_scale_1_label = 'Definitely true';
    data.likert_scale_2_label = 'Mostly true';
    data.likert_scale_3_label = 'Mostly false';
    data.likert_scale_4_label = 'Definitely false';

    var questionKeys = {};
    questions.forEach(function (q) {
      questionKeys[q.question] = q.key;
    });

    for (var question in data.response) {
      var key = questionKeys[question];
      if (key) {
        data[key] = {
          response: data.response[question],
          question: question,
          key: key,
        };
      }
    }
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
    exp_id: 'tfeq_survey_rdoc__fmri',
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: endText,
  choices: ['Enter'],
  post_trial_gap: 0,
};

tfeq_survey_rdoc__fmri_experiment = [];
var tfeq_survey_rdoc__fmri_init = () => {
  tfeq_survey_rdoc__fmri_experiment.push(fullscreen);
  tfeq_survey_rdoc__fmri_experiment.push(instructionsBlock);
  tfeq_survey_rdoc__fmri_experiment.push(trial);
  tfeq_survey_rdoc__fmri_experiment.push(endBlock);
  tfeq_survey_rdoc__fmri_experiment.push(exitFullscreen);
};
