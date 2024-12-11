const createSurveyQuestions = (questions) => {
  const firstObj = {
    type: 'html',
    prompt:
      '<h2>Indicate how much the statement applied to you <b>over the past week</b></h2>',
    name: 'Indicate how much the statement applied to you over the past week',
  };

  var surveyQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    var questionObj = {
      type: 'likert',
      likert_scale_values: [
        { value: 1, text: 'Did not apply to me at all' },
        { value: 2, text: 'Applied to me to some degree, or some of the time' },
        {
          value: 3,
          text: 'Applied to me to a considerable degree or good part of the time',
        },
        { value: 4, text: 'Applied to me very much or most of the time' },
      ],
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
  { key: 'hard_to_wind_down', question: 'I found it hard to wind down.' },
  { key: 'mouth_dryness', question: 'I was aware of dryness of my mouth.' },
  {
    key: 'no_positive_feelings',
    question: "I couldn't seem to experience any positive feeling at all.",
  },
  {
    key: 'breathing_difficulty',
    question:
      'I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion).',
  },
  {
    key: 'lack_of_initiative',
    question: 'I found it difficult to work up the initiative to do things.',
  },
  { key: 'over_react', question: 'I tended to over-react to situations.' },
  {
    key: 'experienced_trembling',
    question: 'I experienced trembling (e.g. in the hands).',
  },
  {
    key: 'using_nervous_energy',
    question: 'I felt that I was using a lot of nervous energy.',
  },
  {
    key: 'worry_about_panic',
    question:
      'I was worried about situations in which I might panic and make a fool of myself.',
  },
  {
    key: 'nothing_to_look_forward',
    question: 'I felt that I had nothing to look forward to.',
  },
  { key: 'getting_agitated', question: 'I found myself getting agitated.' },
  { key: 'difficult_to_relax', question: 'I found it difficult to relax.' },
  { key: 'down_hearted_blue', question: 'I felt down-hearted and blue.' },
  {
    key: 'intolerant_of_interference',
    question:
      'I was intolerant of anything that kept me from getting on with what I was doing.',
  },
  { key: 'close_to_panic', question: 'I felt I was close to panic.' },
  {
    key: 'no_enthusiasm',
    question: 'I was unable to become enthusiastic about anything.',
  },
  {
    key: 'low_self_worth',
    question: "I felt I wasn't worth much as a person.",
  },
  { key: 'feeling_touchy', question: 'I felt I was rather touchy.' },
  {
    key: 'aware_of_heart_action',
    question:
      'I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat).',
  },
  {
    key: 'felt_scared_unreasonably',
    question: 'I felt scared without any good reason.',
  },
  { key: 'life_meaningless', question: 'I felt that life was meaningless.' },
];

var surveyQuestions = createSurveyQuestions(questions);

var instructions = [
  `<div class='instructions'>
      <p>Welcome to this survey.</p>
      <p>Please read each statement and select the option which indicates how much the statement applied to you <b>over the past week</b>. There are no right or wrong answers. Do not spend too much time on any statement.</p>
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
      'Indicate how much the statement applied to you over the past week' in
      data.response
    ) {
      delete data.response[
        'Indicate how much the statement applied to you over the past week'
      ];
    }
    data.likert_scale_1_label = 'Did not apply to me at all';
    data.likert_scale_2_label =
      'Applied to me to some degree, or some of the time';
    data.likert_scale_3_label =
      'Applied to me to a considerable degree or good part of the time';
    data.likert_scale_4_label = 'Applied to me very much or most of the time';

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
    exp_id: 'dass21_survey_rdoc__fmri',
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: endText,
  choices: ['Enter'],
  post_trial_gap: 0,
};

dass21_survey_rdoc__fmri_experiment = [];
var dass21_survey_rdoc__fmri_init = () => {
  dass21_survey_rdoc__fmri_experiment.push(fullscreen);
  dass21_survey_rdoc__fmri_experiment.push(instructionsBlock);
  dass21_survey_rdoc__fmri_experiment.push(trial);
  dass21_survey_rdoc__fmri_experiment.push(endBlock);
  dass21_survey_rdoc__fmri_experiment.push(exitFullscreen);
};
