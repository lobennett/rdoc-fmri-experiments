function chunkArray(array, chunkSize) {
  let result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    let chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}

var questions = [
  {
    type: 'multi-choice',
    prompt: 'What is your gender?',
    name: 'What is your gender?',
    required: true,
    options: [
      'Male',
      'Female',
      'Non-binary/Third gender',
      'Prefer not to answer',
    ],
    key: 'gender',
  },
  {
    type: 'text',
    prompt: 'How old are you?',
    name: 'How old are you?',
    required: true,
    placeholder: 'Enter your age in years',
    key: 'age',
  },
  {
    type: 'multi-choice',
    prompt: 'What is your race?',
    name: 'What is your race?',
    required: true,
    options: [
      'American Indian or Alaska Native',
      'Asian',
      'Black or African American',
      'Native Hawaiian or Other Pacific Islander',
      'White',
      'Other (please specify)',
    ],
    key: 'race',
  },
  {
    type: 'text',
    prompt:
      'If you chose "Other" for racial background, how would you describe it?',
    name: 'If you chose "Other" for racial background, how would you describe it?',
    required: false,
    placeholder: 'Racial background or N/A',
    key: 'race_other',
  },
  {
    type: 'multi-choice',
    prompt: 'Are you of Hispanic, Latino or Spanish origin?',
    name: 'Are you of Hispanic, Latino or Spanish origin?',
    required: true,
    options: ['Yes', 'No'],
    key: 'latino',
  },
  {
    type: 'multi-choice',
    prompt: 'What is the highest level of education you have completed?',
    name: 'What is the highest level of education you have completed?',
    required: true,
    options: [
      'Did Not Complete High School',
      'High School/GED',
      'Some College',
      "Bachelor's Degree",
      "Master's Degree",
      'Advanced Graduate work or Ph.D',
    ],
    key: 'education',
  },
  {
    type: 'text',
    prompt:
      'How tall are you (in feet and inches)? Enter as X feet Y inches, for example: 5 feet 10 inches.',
    name: 'How tall are you (in feet and inches)? Enter as X feet Y inches, for example: 5 feet 10 inches.',
    required: true,
    placeholder: 'X feet Y inches',
    key: 'height',
  },
  {
    type: 'text',
    prompt: 'How much do you weight (in pounds)?',
    name: 'How much do you weight (in pounds)?',
    required: true,
    placeholder: '',
    key: 'weight',
  },
  {
    type: 'multi-choice',
    prompt: 'What is your relationship status?',
    name: 'What is your relationship status?',
    required: true,
    options: ['Single', 'Married', 'In Committed Relationship'],
    key: 'relationship_status',
  },
  {
    type: 'multi-choice',
    prompt: 'How many times have you been divorced?',
    name: 'How many times have you been divorced?',
    required: true,
    options: ['0', '1', '2', '3', '4', '5', 'More than 5'],
    key: 'times_divorced',
  },
  {
    type: 'text',
    prompt:
      'How long was/is your longest romantic relationship (in years and months)? Enter as X years Y months.',
    name: 'How long was/is your longest romantic relationship (in years and months)? Enter as X years Y months.',
    required: true,
    placeholder: 'X years Y months',
    key: 'longest_romantic_relationship',
  },
  {
    type: 'multi-choice',
    prompt: 'How many romantic relationships have you had?',
    name: 'How many romantic relationships have you had?',
    required: true,
    options: ['0', '1', '2', '3', '4', '5-10', 'More than 10'],
    key: 'num_romantic_relationships',
  },
  {
    type: 'multi-choice',
    prompt: 'How many children do you have?',
    name: 'How many children do you have?',
    required: true,
    options: ['0', '1', '2', '3', '4', '5-10', 'More than 10'],
    key: 'num_children',
  },
  {
    type: 'text',
    prompt:
      'If you menstruate, when was the date of your last period (Enter as mm/dd/yyyy)? If you do not menstruate, enter N/A.',
    name: 'If you menstruate, when was the date of your last period (Enter as mm/dd/yyyy)? If you do not menstruate, enter N/A.',
    required: false,
    placeholder: '',
    key: 'date_last_period',
  },
  {
    type: 'text',
    prompt:
      'If you menstruate, what is the length (in days) of your typical cycle? If you do not menstruate, enter N/A.',
    name: 'If you menstruate, what is the length (in days) of your typical cycle? If you do not menstruate, enter N/A.',
    required: false,
    placeholder: '',
    key: 'cycle_length',
  },
  {
    type: 'multi-choice',
    prompt: 'Are you taking any form of hormonal birth control?',
    name: 'Are you taking any form of hormonal birth control?',
    required: true,
    options: ['Yes', 'No'],
    key: 'on_birth_control',
  },
  {
    type: 'text',
    prompt:
      'If you chose "Yes" for using hormonal birth control, which type are you using? (List brand and type if known). Enter N/A if not using hormonal birth control.',
    name: 'If you chose "Yes" for using hormonal birth control, which type are you using? (List brand and type if known). Enter N/A if not using hormonal birth control.',
    required: false,
    placeholder: 'Brand and type of hormonal birth control',
    key: 'brand_type_birth_control',
  },
  {
    type: 'text',
    prompt: "What is your household's annual income (in US dollars)?",
    name: "What is your household's annual income (in US dollars)?",
    required: true,
    placeholder: '',
    key: 'household_income',
  },
  {
    type: 'multi-choice',
    prompt: 'Do you have a retirement account?',
    name: 'Do you have a retirement account?',
    required: true,
    options: ['Yes', 'No'],
    key: 'retirement_account',
  },
  {
    type: 'multi-choice',
    prompt:
      'If you do have a retirement account what percent is in stocks? Select N/A if you do not have a retirement account.',
    name: 'If you do have a retirement account what percent is in stocks? Select N/A if you do not have a retirement account.',
    required: true,
    options: [
      'N/A',
      '0-10%',
      '10-20%',
      '20-29%',
      '30-39%',
      '40-49%',
      '50-59%',
      '60-69%',
      '70-79%',
      '80-89%',
      '90-100%',
    ],
    key: 'stocks_retirement_account',
  },
  {
    type: 'multi-choice',
    prompt: 'What is your housing status?',
    name: 'What is your housing status?',
    required: true,
    options: [
      'Own a home',
      'Rent a home/apartment',
      'Live with someone (no rent)',
      'Residential/halfway house',
      'Shelter',
      'No current home',
    ],
    key: 'housing_status',
  },
  {
    type: 'multi-choice',
    prompt: 'How much mortgage debt do you have?',
    name: 'How much mortgage debt do you have?',
    required: true,
    options: [
      '0-$499',
      '$500-$2499',
      '$2500-$9999',
      '$10000-$24999',
      '$25000-$49999',
      '$50000-$99999',
      '$100000-$199999',
      'More than $200000',
      'Prefer Not To Say',
    ],
    key: 'mortgage_debt',
  },
  {
    type: 'multi-choice',
    prompt: 'How much car-related debt do you have?',
    name: 'How much car-related debt do you have?',
    required: true,
    options: [
      '0-$499',
      '$500-$2499',
      '$2500-$9999',
      '$10000-$24999',
      '$25000-$49999',
      '$50000-$99999',
      '$100000-$199999',
      'More than $200000',
      'Prefer Not To Say',
    ],
    key: 'car_debt',
  },
  {
    type: 'multi-choice',
    prompt: 'How much education debt do you have?',
    name: 'How much education debt do you have?',
    required: true,
    options: [
      '0-$499',
      '$500-$2499',
      '$2500-$9999',
      '$10000-$24999',
      '$25000-$49999',
      '$50000-$99999',
      '$100000-$199999',
      'More than $200000',
      'Prefer Not To Say',
    ],
    key: 'education_debt',
  },
  {
    type: 'multi-choice',
    prompt: 'How much credit card debt do you have?',
    name: 'How much credit card debt do you have?',
    required: true,
    options: [
      '0-$499',
      '$500-$2499',
      '$2500-$9999',
      '$10000-$24999',
      '$25000-$49999',
      '$50000-$99999',
      '$100000-$199999',
      'More than $200000',
      'Prefer Not To Say',
    ],
    key: 'credit_card_debt',
  },
  {
    type: 'text',
    prompt:
      'Please list any other sources of debt you have (Enter N/A if none):',
    name: 'Please list any other sources of debt you have (Enter N/A if none):',
    required: true,
    placeholder: '',
    key: 'other_debt',
  },
  {
    type: 'multi-choice',
    prompt:
      'If you listed any other sources of debt, how much debt do you have from these other sources? Select N/A if do not have any other sources of debt.',
    name: 'If you listed any other sources of debt, how much debt do you have from these other sources? Select N/A if do not have any other sources of debt.',
    required: true,
    options: [
      'N/A',
      '0-$499',
      '$500-$2499',
      '$2500-$9999',
      '$10000-$24999',
      '$25000-$49999',
      '$50000-$99999',
      '$100000-$199999',
      'More than $200000',
      'Prefer Not To Say',
    ],
    key: 'amount_other_debt',
  },
  {
    type: 'text',
    prompt: 'On average, how many cups of coffee do you have each day?',
    name: 'On average, how many cups of coffee do you have each day?',
    required: true,
    placeholder: '',
    key: 'num_cups_coffee',
  },
  {
    type: 'text',
    prompt: 'On average, how many cups of tea do you have each day?',
    name: 'On average, how many cups of tea do you have each day?',
    required: true,
    placeholder: '',
    key: 'num_cups_tea',
  },
  {
    type: 'text',
    prompt:
      'On average, how many cans of caffeinated soda do you have each day?',
    name: 'On average, how many cans of caffeinated soda do you have each day?',
    required: true,
    placeholder: '',
    key: 'num_cans_caffeinated_soda',
  },
  {
    type: 'text',
    prompt:
      'What is your daily caffeine intake from other sources each day (in mg)? For reference, a standard 16oz energy drink has about 140 mg and a 1 oz serving of milk chocolate has about 6 mg of caffeine.',
    name: 'What is your daily caffeine intake from other sources each day (in mg)? For reference, a standard 16oz energy drink has about 140 mg and a 1 oz serving of milk chocolate has about 6 mg of caffeine.',
    required: true,
    placeholder: '',
    key: 'other_caffeine',
  },
  {
    type: 'multi-choice',
    prompt: 'Do you feel you have a problem with gambling?',
    name: 'Do you feel you have a problem with gambling?',
    required: true,
    options: ['No', 'Yes in the past but not now', 'Yes'],
    key: 'problem_gambling',
  },
  {
    type: 'multi-choice',
    prompt: 'How many traffic tickets have you gotten in the last year?',
    name: 'How many traffic tickets have you gotten in the last year?',
    required: true,
    options: ['0', '1', '2', '3', '4', '5-10', 'More than 10'],
    key: 'num_traffic_tickets',
  },
  {
    type: 'multi-choice',
    prompt: 'How many traffic accidents have you been in over your life?',
    name: 'How many traffic accidents have you been in over your life?',
    required: true,
    options: ['0', '1', '2', '3', '4', '5-10', 'More than 10'],
    key: 'num_traffic_accidents',
  },
  {
    type: 'multi-choice',
    prompt:
      'How many times in your life have you been arrested and/or charged with illegal activities?',
    name: 'How many times in your life have you been arrested and/or charged with illegal activities?',
    required: true,
    options: ['0', '1', '2', '3', '4', '5-10', 'More than 10'],
    key: 'num_arrested_illegal_activities',
  },
  {
    type: 'multi-choice',
    prompt: 'What are your motivations for participating in this experiment?',
    name: 'What are your motivations for participating in this experiment?',
    required: true,
    options: [
      'Money',
      'Tasks are fun',
      'Want to contribute to research',
      'Other',
    ],
    key: 'motivations_to_participate',
  },
  {
    type: 'text',
    prompt:
      'If you have other motivations, please list them. Enter N/A if you do not have other motivations for participating.',
    name: 'If you have other motivations, please list them. Enter N/A if you do not have other motivations for participating.',
    required: true,
    placeholder: '',
    key: 'other_motivations_to_participate',
  },
];

var instructions = [
  `<div class='instructions'>
      <p>Welcome to this survey.</p>
      <p>Please answer the following questions regarding your demographics.</p>
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
  pages: [questions],
  button_label_finish: 'Submit',
  on_finish: function (data) {
    Object.keys(data.response).forEach(function (key) {
      var questionItem = questions.find((q) => q.prompt === key);
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
    exp_id: 'demographics_survey_rdoc__fmri',
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: endText,
  choices: ['Enter'],
  post_trial_gap: 0,
};

demographics_survey_rdoc__fmri_experiment = [];
var demographics_survey_rdoc__fmri_init = () => {
  demographics_survey_rdoc__fmri_experiment.push(fullscreen);
  demographics_survey_rdoc__fmri_experiment.push(instructionsBlock);
  demographics_survey_rdoc__fmri_experiment.push(trial);
  demographics_survey_rdoc__fmri_experiment.push(endBlock);
  demographics_survey_rdoc__fmri_experiment.push(exitFullscreen);
};
