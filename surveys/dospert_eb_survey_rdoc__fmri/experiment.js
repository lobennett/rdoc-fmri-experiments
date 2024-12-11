// question_type	question_text	required	page_number	option_text	option_values
// instruction	Welcome to this survey. Press <strong>Next</strong> to begin.	0	1
// instruction	For each of the following statements, please indicate <strong>the benefits</strong> you would obtain from each situation. Provide a rating from <strong>1 to 7</strong>.	0	2
// radio	Admitting that your tastes are different from those of a friend.	1	3	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Going camping in the wilderness.	1	3	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Betting a day's income at the horse races.	1	3	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Investing 10% of your annual income in a moderate growth diversified fund.	1	3	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Drinking heavily at a social function.	1	3	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Taking some questionable deductions on your income tax return.	1	3	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Disagreeing with an authority figure on a major issue.	1	4	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Betting a day's income at a high-stake poker game.	1	4	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Having an affair with a married man/woman.	1	4	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Passing off somebody else’s work as your own.	1	4	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Going down a ski run that is beyond your ability.	1	4	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Investing 5% of your annual income in a very speculative stock.	1	4	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Going whitewater rafting at high water in the spring.	1	5	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Betting a day's income on the outcome of a sporting event.	1	5	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Engaging in unprotected sex.	1	5	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Revealing a friend's secret to someone else.	1	5	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Driving a car without wearing a seat belt.	1	5	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Investing 10% of your annual income in a new business venture.	1	5	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Taking a skydiving class.	1	6	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Riding a motorcycle without a helmet.	1	6	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Choosing a career that you truly enjoy over a more secure one.	1	6	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Speaking your mind about an unpopular issue in a meeting at work.	1	6	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Sunbathing without sunscreen.	1	6	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Bungee jumping off a tall bridge.	1	6	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Piloting a small plane.	1	7	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Walking home alone at night in an unsafe area of town.	1	7	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Moving to a city far away from your extended family.	1	7	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Starting a new career in your mid-thirties.	1	7	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Leaving your young children alone at home while running an errand.	1	7	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// radio	Not returning a wallet you found that contains $200.	1	7	No benefits at all: 1,2,3,Moderate benefits: 4,5,6,Great benefits: 7	1,2,3,4,5,6,7
// instruction	Congratulations for completing this survey! Press < strong > finish</strong > to continue.0	8

const createSurveyQuestions = (questions) => {
  const firstObj = {
    type: 'html',
    prompt:
      '<h2>For each of the following statements, please indicate <b>the benefits</b> you would obtain from each situation.</h2>',
    name: 'Indicate the benefits you would obtain from each situation.',
  };

  var surveyQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    var questionObj = {
      type: 'likert',
      likert_scale_min_label: 'No benefits at all',
      likert_scale_max_label: 'Great benefits',
      likert_scale_max: 7,
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
    key: 'admit_diff_tastes',
    question:
      'Admitting that your tastes are different from those of a friend.',
  },
  { key: 'camping_wilderness', question: 'Going camping in the wilderness.' },
  {
    key: 'betting_horse_races',
    question: "Betting a day's income at the horse races.",
  },
  {
    key: 'investing_diversified_fund',
    question:
      'Investing 10% of your annual income in a moderate growth diversified fund.',
  },
  {
    key: 'drinking_heavily_social',
    question: 'Drinking heavily at a social function.',
  },
  {
    key: 'questionable_tax_deductions',
    question: 'Taking some questionable deductions on your income tax return.',
  },
  {
    key: 'disagreeing_authority',
    question: 'Disagreeing with an authority figure on a major issue.',
  },
  {
    key: 'betting_poker_game',
    question: "Betting a day's income at a high-stake poker game.",
  },
  {
    key: 'having_affair',
    question: 'Having an affair with a married man/woman.',
  },
  {
    key: 'passing_off_work',
    question: 'Passing off somebody else’s work as your own.',
  },
  {
    key: 'skiing_beyond_ability',
    question: 'Going down a ski run that is beyond your ability.',
  },
  {
    key: 'investing_speculative_stock',
    question: 'Investing 5% of your annual income in a very speculative stock.',
  },
  {
    key: 'whitewater_rafting',
    question: 'Going whitewater rafting at high water in the spring.',
  },
  {
    key: 'betting_sporting_event',
    question: "Betting a day's income on the outcome of a sporting event.",
  },
  { key: 'unprotected_sex', question: 'Engaging in unprotected sex.' },
  {
    key: 'revealing_secret',
    question: "Revealing a friend's secret to someone else.",
  },
  {
    key: 'driving_no_seatbelt',
    question: 'Driving a car without wearing a seat belt.',
  },
  {
    key: 'investing_new_venture',
    question: 'Investing 10% of your annual income in a new business venture.',
  },
  { key: 'taking_skydiving_class', question: 'Taking a skydiving class.' },
  {
    key: 'riding_motorcycle_no_helmet',
    question: 'Riding a motorcycle without a helmet.',
  },
  {
    key: 'choosing_career_enjoy',
    question: 'Choosing a career that you truly enjoy over a more secure one.',
  },
  {
    key: 'speaking_unpopular_issue',
    question:
      'Speaking your mind about an unpopular issue in a meeting at work.',
  },
  { key: 'sunbathing_no_sunscreen', question: 'Sunbathing without sunscreen.' },
  {
    key: 'bungee_jumping_bridge',
    question: 'Bungee jumping off a tall bridge.',
  },
  { key: 'piloting_small_plane', question: 'Piloting a small plane.' },
  {
    key: 'walking_home_alone_unsafe',
    question: 'Walking home alone at night in an unsafe area of town.',
  },
  {
    key: 'moving_far_family',
    question: 'Moving to a city far away from your extended family.',
  },
  {
    key: 'starting_new_career_mid30s',
    question: 'Starting a new career in your mid-thirties.',
  },
  {
    key: 'leaving_children_home',
    question:
      'Leaving your young children alone at home while running an errand.',
  },
  {
    key: 'not_returning_wallet',
    question: 'Not returning a wallet you found that contains $200.',
  },
];

var surveyQuestions = createSurveyQuestions(questions);

var instructions = [
  `<div class='instructions'>
      <p>Welcome to this survey.</p>
      <p>For each of the following statements, please indicate <b>the benefits</b> you would obtain from each situation.</p>
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
      'Indicate the benefits you would obtain from each situation.' in
      data.response
    ) {
      delete data.response[
        'Indicate the benefits you would obtain from each situation.'
      ];
    }

    data.likert_scale_min_label = 'No benefits at all';
    data.likert_scale_max_label = 'Great benefits';

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
    exp_id: 'dospert_eb_survey_rdoc__fmri',
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: endText,
  choices: ['Enter'],
  post_trial_gap: 0,
};

dospert_eb_survey_rdoc__fmri_experiment = [];
var dospert_eb_survey_rdoc__fmri_init = () => {
  dospert_eb_survey_rdoc__fmri_experiment.push(fullscreen);
  dospert_eb_survey_rdoc__fmri_experiment.push(instructionsBlock);
  dospert_eb_survey_rdoc__fmri_experiment.push(trial);
  dospert_eb_survey_rdoc__fmri_experiment.push(endBlock);
  dospert_eb_survey_rdoc__fmri_experiment.push(exitFullscreen);
};
