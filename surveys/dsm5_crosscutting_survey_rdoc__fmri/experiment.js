// question_type	question_text	required	page_number	option_text	option_values	variables
// instruction	Welcome to this survey. Press <strong>Next</strong> to begin.	0	1
// instruction	"Please answer the following questions using the following scale: <br><br><ul list-text><li> Not at all </li><li>Rare, less than a day or two</li><li> Several days</li><li> More than half the days</li><li> Nearly every day </li>"	0	2
// instruction	"Over the last 2 weeks, how often have you been bothered by any of the following problems?"	0	3
// radio	Having little interest or pleasure in doing things?	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_1
// radio	"Feeling down, depressed, or hopeless?"	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_2
// radio	"Feeling more irritated, grouchy, or angry than usual?"	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_3
// radio	"Sleeping less than usual, but still have lots of energy?"	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_4
// radio	Starting lots more projects than usual or doing more risky things than usual?	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_5
// radio	"Feeling nervous, anxious, frightened, worried, or on edge?"	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_6
// radio	Feeling panic or being frightened?	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_7
// radio	Avoiding situations that make you anxious?	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_8
// radio	"Unexplained aches and pains (e.g. head, back, joints, abdomen, legs)?"	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_9
// radio	That your illnesses are not being taken seriously enough?	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_10
// radio	Thoughts of actually hurting yourself?	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_11
// radio	"Hearing things other people couldn't hear, such as voices even when no one was around?"	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_12
// radio	"Feeling that someone could hear your thoughts, or that you could hear what another person was thinking?"	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_13
// radio	Problems with sleep that affected your sleep quality over all?	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_14
// radio	"Problems with memory (e.g., learning new information) or with location (e.g., finding your way home)?"	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_15
// radio	"Unpleasant thoughts, urges, or images that repeatedly enter your mind?"	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_16
// radio	Feeling driven to perform certain behaviors or mental acts over and over again?	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_17
// radio	"Feeling detached or distant from yourself, your body, your physical surroundings, or your memories?"	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_18
// radio	Not knowing who you really are or what you want out of life?	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_19
// radio	Not feeling close to other people or enjoying your relationships with them?	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_20
// radio	Drinking at least 4 drinks of any kind of alcohol in a single day?	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_21
// radio	"Smoking any cigarettes, a cigar, or pipe or using snuff or chewing tobacco?"	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_22
// radio	"Using any of the following medicines ON YOUR OWN, that is, without a doctor's prescription, in greater amounts or longer than prescribed [e.g., painkillers (like Vicodin), stimulants (like Ritalin or Adderall), sedatives or tranquilizers (like sleeping pills or Valium), or drugs like marijuana, cocaine or crack, club drugs (like ecstasy), hallucinogens (like LSD), heroin, inhalants or solvents (like glue), or methamphetamine (like speed)]?"	1	3	"Not at all,Less than a day or two,Several days,More than half the days,Nearly every day"	"1,2,3,4,5"	dsm5_cross_23
// instruction	Congratulations for completing this survey! Press <strong>finish</strong> to continue.	0	4

const createSurveyQuestions = (questions) => {
  const firstObj = {
    type: 'html',
    prompt:
      '<h2>Over the last 2 weeks, how often have you been bothered by any of the following problems?</h2>',
    name: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
  };

  var surveyQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    var questionObj = {
      type: 'likert',
      likert_scale_values: [
        { value: 1, text: 'Not at all' },
        {
          value: 2,
          text: 'Less than a day or two',
        },
        { value: 3, text: 'Several days' },
        { value: 4, text: 'More than half the days' },
        { value: 5, text: 'Nearly every day' },
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
  {
    key: 'little_interest',
    question: 'Having little interest or pleasure in doing things?',
  },
  {
    key: 'feeling_depressed',
    question: 'Feeling down, depressed, or hopeless?',
  },
  {
    key: 'more_irritated',
    question: 'Feeling more irritated, grouchy, or angry than usual?',
  },
  {
    key: 'sleeping_less_energy',
    question: 'Sleeping less than usual, but still have lots of energy?',
  },
  {
    key: 'starting_more_projects',
    question:
      'Starting lots more projects than usual or doing more risky things than usual?',
  },
  {
    key: 'feeling_anxious',
    question: 'Feeling nervous, anxious, frightened, worried, or on edge?',
  },
  { key: 'feeling_panic', question: 'Feeling panic or being frightened?' },
  {
    key: 'avoiding_situations',
    question: 'Avoiding situations that make you anxious?',
  },
  {
    key: 'unexplained_pains',
    question:
      'Unexplained aches and pains (e.g. head, back, joints, abdomen, legs)?',
  },
  {
    key: 'illnesses_not_serious',
    question: 'That your illnesses are not being taken seriously enough?',
  },
  {
    key: 'thoughts_hurting_self',
    question: 'Thoughts of actually hurting yourself?',
  },
  {
    key: 'hearing_things',
    question:
      "Hearing things other people couldn't hear, such as voices even when no one was around?",
  },
  {
    key: 'telepathy_feelings',
    question:
      'Feeling that someone could hear your thoughts, or that you could hear what another person was thinking?',
  },
  {
    key: 'sleep_problems',
    question: 'Problems with sleep that affected your sleep quality over all?',
  },
  {
    key: 'memory_problems',
    question:
      'Problems with memory (e.g., learning new information) or with location (e.g., finding your way home)?',
  },
  {
    key: 'unpleasant_thoughts',
    question:
      'Unpleasant thoughts, urges, or images that repeatedly enter your mind?',
  },
  {
    key: 'repetitive_behaviors',
    question:
      'Feeling driven to perform certain behaviors or mental acts over and over again?',
  },
  {
    key: 'feeling_detached',
    question:
      'Feeling detached or distant from yourself, your body, your physical surroundings, or your memories?',
  },
  {
    key: 'identity_confusion',
    question: 'Not knowing who you really are or what you want out of life?',
  },
  {
    key: 'lacking_close_relationships',
    question:
      'Not feeling close to other people or enjoying your relationships with them?',
  },
  {
    key: 'heavy_drinking',
    question:
      'Drinking at least 4 drinks of any kind of alcohol in a single day?',
  },
  {
    key: 'smoking_tobacco',
    question:
      'Smoking any cigarettes, a cigar, or pipe or using snuff or chewing tobacco?',
  },
  {
    key: 'unprescribed_drug_use',
    question:
      "Using any of the following medicines ON YOUR OWN, that is, without a doctor's prescription, in greater amounts or longer than prescribed [e.g., painkillers (like Vicodin), stimulants (like Ritalin or Adderall), sedatives or tranquilizers (like sleeping pills or Valium), or drugs like marijuana, cocaine or crack, club drugs (like ecstasy), hallucinogens (like LSD), heroin, inhalants or solvents (like glue), or methamphetamine (like speed)]?",
  },
];

var surveyQuestions = createSurveyQuestions(questions);

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
      'Over the last 2 weeks, how often have you been bothered by any of the following problems?' in
      data.response
    ) {
      delete data.response[
        'Over the last 2 weeks, how often have you been bothered by any of the following problems?'
      ];
    }
    data.likert_scale_1_label = 'Not at all';
    data.likert_scale_3_label = 'Less than a day or two';
    data.likert_scale_4_label = 'Several days';
    data.likert_scale_5_label = 'More than half the days';
    data.likert_scale_6_label = 'Nearly every day ';

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
    exp_id: 'dsm5_crosscutting_survey_rdoc__fmri',
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: endText,
  choices: ['Enter'],
  post_trial_gap: 0,
};

dsm5_crosscutting_survey_rdoc__fmri_experiment = [];
var dsm5_crosscutting_survey_rdoc__fmri_init = () => {
  dsm5_crosscutting_survey_rdoc__fmri_experiment.push(fullscreen);
  dsm5_crosscutting_survey_rdoc__fmri_experiment.push(instructionsBlock);
  dsm5_crosscutting_survey_rdoc__fmri_experiment.push(trial);
  dsm5_crosscutting_survey_rdoc__fmri_experiment.push(endBlock);
  dsm5_crosscutting_survey_rdoc__fmri_experiment.push(exitFullscreen);
};
