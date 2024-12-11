// question_type	question_text	required	page_number	option_text	option_values
// instruction	Welcome to this survey. Press <strong>next</strong> to begin.	0	1
// instruction	For each of the following statements please indicate how much each of the following statements reflects how you typically are.	0	2
// radio	I am good at resisting temptation.	1	3	Not at all: 1,2,3,4,Very much: 5	1,2,3,4,5
// radio	I have a hard time breaking bad habits.	1	3	Not at all: 1,2,3,4,Very much: 5	5,4,3,2,1
// radio	I am lazy.	1	3	Not at all: 1,2,3,4,Very much: 5	5,4,3,2,1
// radio	I say inappropriate things.	1	3	Not at all: 1,2,3,4,Very much: 5	5,4,3,2,1
// radio	I do certain things that are bad for me, if they are fun.	1	3	Not at all: 1,2,3,4,Very much: 5	5,4,3,2,1
// radio	I refuse things that are bad for me.	1	3	Not at all: 1,2,3,4,Very much: 5	1,2,3,4,5
// radio	I wish I had more self-discipline.	1	3	Not at all: 1,2,3,4,Very much: 5	5,4,3,2,1
// radio	People would say that I have iron self-discipline.	1	3	Not at all: 1,2,3,4,Very much: 5	1,2,3,4,5
// radio	Pleasure and fun sometimes keep me from getting work done.	1	3	Not at all: 1,2,3,4,Very much: 5	5,4,3,2,1
// radio	I have trouble concentrating.	1	3	Not at all: 1,2,3,4,Very much: 5	5,4,3,2,1
// radio	I am able to work effectively toward long-term goals.	1	3	Not at all: 1,2,3,4,Very much: 5	1,2,3,4,5
// radio	Sometimes I can't stop myself from doing something, even if I know it is wrong.	1	3	Not at all: 1,2,3,4,Very much: 5	5,4,3,2,1
// radio	I often act without thinking through all the alternatives.	1	3	Not at all: 1,2,3,4,Very much: 5	5,4,3,2,1
// instruction	Congratulations for completing this task!	0	4

var topStatement =
  'Please indicate how much each of the following statements reflects how you typically are.';

const createSurveyQuestions = (questions) => {
  const firstObj = {
    type: 'html',
    prompt: `<h3>${topStatement}</h3>`,
    name: topStatement,
  };

  var surveyQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    var questionObj = {
      type: 'likert',
      likert_scale_min_label: 'Not at all',
      likert_scale_max_label: 'Very much',
      prompt: `${questions[i].question}`,
      name: `${questions[i].question}`,
      required: true,
    };
    surveyQuestions.push(questionObj);
  }

  function chunkArray(array, chunkSize, prependedObj) {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      let chunk = array.slice(i, i + chunkSize);
      chunk.unshift(prependedObj); // Add the object to the start of each chunk
      result.push(chunk);
    }
    return result;
  }

  // this won't chunk the array b/c questions.length, but keeping in case we want to split up questions into different pages
  var preparedQuestionArray = chunkArray(
    surveyQuestions,
    questions.length,
    firstObj
  );

  return preparedQuestionArray;
};

var questions = [
  {
    key: 'resisting_temptation',
    question: 'I am good at resisting temptation.',
  },
  {
    key: 'breaking_bad_habits',
    question: 'I have a hard time breaking bad habits.',
  },
  { key: 'being_lazy', question: 'I am lazy.' },
  {
    key: 'saying_inappropriate_things',
    question: 'I say inappropriate things.',
  },
  {
    key: 'doing_bad_fun_things',
    question: 'I do certain things that are bad for me, if they are fun.',
  },
  {
    key: 'refusing_bad_things',
    question: 'I refuse things that are bad for me.',
  },
  {
    key: 'wishing_more_discipline',
    question: 'I wish I had more self-discipline.',
  },
  {
    key: 'having_iron_discipline',
    question: 'People would say that I have iron self-discipline.',
  },
  {
    key: 'pleasure_blocking_work',
    question: 'Pleasure and fun sometimes keep me from getting work done.',
  },
  { key: 'trouble_concentrating', question: 'I have trouble concentrating.' },
  {
    key: 'working_toward_goals',
    question: 'I am able to work effectively toward long-term goals.',
  },
  {
    key: 'cant_stop_wrong',
    question:
      "Sometimes I can't stop myself from doing something, even if I know it is wrong.",
  },
  {
    key: 'acting_without_thinking',
    question: 'I often act without thinking through all the alternatives.',
  },
];

var surveyQuestions = createSurveyQuestions(questions);

var instructions = [
  `<div class='instructions'>
      <p>Welcome to this survey.</p>
      <p>For each of the following statements, please indicate how much each of the following statements reflects how you typically are.</p>
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
    if (topStatement in data.response) {
      delete data.response[topStatement];
    }
    data.likert_scale_min_label = 'Not at all';
    data.likert_scale_max_label = 'Very much';

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
    exp_id: 'brief_self_control_survey_rdoc__fmri',
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: endText,
  choices: ['Enter'],
  post_trial_gap: 0,
};

brief_self_control_survey_rdoc__fmri_experiment = [];
var brief_self_control_survey_rdoc__fmri_init = () => {
  brief_self_control_survey_rdoc__fmri_experiment.push(fullscreen);
  brief_self_control_survey_rdoc__fmri_experiment.push(instructionsBlock);
  brief_self_control_survey_rdoc__fmri_experiment.push(trial);
  brief_self_control_survey_rdoc__fmri_experiment.push(endBlock);
  brief_self_control_survey_rdoc__fmri_experiment.push(exitFullscreen);
};
