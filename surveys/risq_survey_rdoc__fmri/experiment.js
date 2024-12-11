// question_type	question_text	required	page_number	option_text	option_values	variables
// instruction	Welcome to this survey. Press <strong>next</strong> to begin.	0	1
// instruction	"For each behavior, fill-in how many times you did it in your lifetime (A) & the total number of times you did it in the past month (B). <br><br>Enter one number for each time period, even if it is your best guess. Please do not put a range, but enter a single number (e.g., behaviors engaged in everyday for multiple years can be written in as 1000+, behaviors engaged in daily for a single year can be written in as 365, any other frequency should be estimated using your best guess).<br><br>If you have ever done the behavior, write how old you were the first time (C) and check the box if the behavior ever caused you any problems, regardless of the specific problem (D). <br><br> For the last two questions (E & F), use the scale to rate how much you agree with each statement from 0 = Strongly Disagree to 4 = Strongly Agree. Please provide ratings for both statements (E & F) and treat them as separate questions."	0	2
// instruction	"If you have never done the shown behavior, then you can just put 0 or N/A for questions where applicable. You can put down Strongly Disagree for the last two questions associated with the behavior."	0	2
// instruction	Behavior: Shoplifted things	0	3
// numeric	(A) How many times total have you done this in your life?	1	3			beh_1_total
// numeric	(B)How many times have you done this in the past month?	1	3			beh_1_month
// numeric	(C) How old were you the first time?	1	3			beh_1_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	3	"Yes, No, N/A"	"1, 0, 2"	beh_1_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	3	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_1_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	3	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_1_pos
// instruction	Behavior: Drove 30mph or faster over the speed limit	0	4
// numeric	(A) How many times total have you done this in your life?	1	4			beh_2_total
// numeric	(B)How many times have you done this in the past month?	1	4			beh_2_month
// numeric	(C) How old were you the first time?	1	4			beh_2_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	4	"Yes, No, N/A"	"1, 0, 2"	beh_2_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	4	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_2_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	4	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_2_pos
// instruction	"Behavior: Bet on sports, horses, or other animals"	0	5
// numeric	(A) How many times total have you done this in your life?	1	5			beh_3_total
// numeric	(B)How many times have you done this in the past month?	1	5			beh_3_month
// numeric	(C) How old were you the first time?	1	5			beh_3_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	5	"Yes, No, N/A"	"1, 0, 2"	beh_3_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	5	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_3_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	5	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_3_pos
// instruction	Behavior: Used cocaine or crack	0	6
// numeric	(A) How many times total have you done this in your life?	1	6			beh_4_total
// numeric	(B)How many times have you done this in the past month?	1	6			beh_4_month
// numeric	(C) How old were you the first time?	1	6			beh_4_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	6	"Yes, No, N/A"	"1, 0, 2"	beh_4_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	6	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_4_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	6	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_4_pos
// instruction	Behavior: Bought drugs.	0	7
// numeric	(A) How many times total have you done this in your life?	1	7			beh_5_total
// numeric	(B)How many times have you done this in the past month?	1	7			beh_5_month
// numeric	(C) How old were you the first time?	1	7			beh_5_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	7	"Yes, No, N/A"	"1, 0, 2"	beh_5_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	7	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_5_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	7	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_5_pos
// instruction	Behavior: Impulsively bought stuff you did not need & won't use.	0	8
// numeric	(A) How many times total have you done this in your life?	1	8			beh_6_total
// numeric	(B)How many times have you done this in the past month?	1	8			beh_6_month
// numeric	(C) How old were you the first time?	1	8			beh_6_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	8	"Yes, No, N/A"	"1, 0, 2"	beh_6_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	8	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_6_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	8	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_6_pos
// instruction	Behavior: Had unprotected sex with someone you just met or didn't know well.	0	9
// numeric	(A) How many times total have you done this in your life?	1	9			beh_7_total
// numeric	(B)How many times have you done this in the past month?	1	9			beh_7_month
// numeric	(C) How old were you the first time?	1	9			beh_7_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	9	"Yes, No, N/A"	"1, 0, 2"	beh_7_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	9	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_7_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	9	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_7_pos
// instruction	Behavior: Gotten in a physical fight.	0	10
// numeric	(A) How many times total have you done this in your life?	1	10			beh_8_total
// numeric	(B)How many times have you done this in the past month?	1	10			beh_8_month
// numeric	(C) How old were you the first time?	1	10			beh_8_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	10	"Yes, No, N/A"	"1, 0, 2"	beh_8_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	10	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_8_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	10	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_8_pos
// instruction	Behavior: Though about killing yourself.	0	11
// numeric	(A) How many times total have you done this in your life?	1	11			beh_9_total
// numeric	(B)How many times have you done this in the past month?	1	11			beh_9_month
// numeric	(C) How old were you the first time?	1	11			beh_9_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	11	"Yes, No, N/A"	"1, 0, 2"	beh_9_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	11	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_9_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	11	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_9_pos
// instruction	Behavior: Had sex for money or drugs.	0	12
// numeric	(A) How many times total have you done this in your life?	1	12			beh_10_total
// numeric	(B)How many times have you done this in the past month?	1	12			beh_10_month
// numeric	(C) How old were you the first time?	1	12			beh_10_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	12	"Yes, No, N/A"	"1, 0, 2"	beh_10_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	12	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_10_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	12	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_10_pos
// instruction	Behavior: Drank alcohol untill you blacked or passed out.	0	13
// numeric	(A) How many times total have you done this in your life?	1	13			beh_11_total
// numeric	(B)How many times have you done this in the past month?	1	13			beh_11_month
// numeric	(C) How old were you the first time?	1	13			beh_11_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	13	"Yes, No, N/A"	"1, 0, 2"	beh_11_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	13	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_11_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	13	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_11_pos
// instruction	"Behavior: Used hallucinogens, LSD, or mushrooms."	0	14
// numeric	(A) How many times total have you done this in your life?	1	14			beh_12_total
// numeric	(B)How many times have you done this in the past month?	1	14			beh_12_month
// numeric	(C) How old were you the first time?	1	14			beh_12_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	14	"Yes, No, N/A"	"1, 0, 2"	beh_12_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	14	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_12_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	14	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_12_pos
// instruction	Behavior: Gone to work intoxicated or high.	0	15
// numeric	(A) How many times total have you done this in your life?	1	15			beh_13_total
// numeric	(B)How many times have you done this in the past month?	1	15			beh_13_month
// numeric	(C) How old were you the first time?	1	15			beh_13_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	15	"Yes, No, N/A"	"1, 0, 2"	beh_13_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	15	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_13_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	15	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_13_pos
// instruction	"Behavior: Attacked someone with a weapon, such as a knife or gun."	0	16
// numeric	(A) How many times total have you done this in your life?	1	16			beh_14_total
// numeric	(B)How many times have you done this in the past month?	1	16			beh_14_month
// numeric	(C) How old were you the first time?	1	16			beh_14_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	16	"Yes, No, N/A"	"1, 0, 2"	beh_14_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	16	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_14_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	16	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_14_pos
// instruction	Behavior: Punched or hit someone with a fist or object.	0	17
// numeric	(A) How many times total have you done this in your life?	1	17			beh_15_total
// numeric	(B)How many times have you done this in the past month?	1	17			beh_15_month
// numeric	(C) How old were you the first time?	1	17			beh_15_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	17	"Yes, No, N/A"	"1, 0, 2"	beh_15_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	17	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_15_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	17	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_15_pos
// instruction	"Behavior: Cut, burned, or hurt yourself on purpose without trying to die."	0	18
// numeric	(A) How many times total have you done this in your life?	1	18			beh_16_total
// numeric	(B)How many times have you done this in the past month?	1	18			beh_16_month
// numeric	(C) How old were you the first time?	1	18			beh_16_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	18	"Yes, No, N/A"	"1, 0, 2"	beh_16_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	18	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_16_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	18	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_16_pos
// instruction	Behavior: Lost more money than you can afford gambling.	0	19
// numeric	(A) How many times total have you done this in your life?	1	19			beh_17_total
// numeric	(B)How many times have you done this in the past month?	1	19			beh_17_month
// numeric	(C) How old were you the first time?	1	19			beh_17_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	19	"Yes, No, N/A"	"1, 0, 2"	beh_17_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	19	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_17_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	19	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_17_pos
// instruction	Behavior: Threatened to physically hurt someone.	0	20
// numeric	(A) How many times total have you done this in your life?	1	20			beh_18_total
// numeric	(B)How many times have you done this in the past month?	1	20			beh_18_month
// numeric	(C) How old were you the first time?	1	20			beh_18_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	20	"Yes, No, N/A"	"1, 0, 2"	beh_18_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	20	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_18_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	20	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_18_pos
// instruction	"Behavior: Threatened someone with a weapon, such a knife or a gun."	0	21
// numeric	(A) How many times total have you done this in your life?	1	21			beh_19_total
// numeric	(B)How many times have you done this in the past month?	1	21			beh_19_month
// numeric	(C) How old were you the first time?	1	21			beh_19_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	21	"Yes, No, N/A"	"1, 0, 2"	beh_19_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	21	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_19_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	21	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_19_pos
// instruction	Behavior: Used heroin.	0	22
// numeric	(A) How many times total have you done this in your life?	1	22			beh_20_total
// numeric	(B)How many times have you done this in the past month?	1	22			beh_20_month
// numeric	(C) How old were you the first time?	1	22			beh_20_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	22	"Yes, No, N/A"	"1, 0, 2"	beh_20_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	22	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_20_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	22	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_20_pos
// instruction	Behavior: Destroyed or vandalized property.	0	23
// numeric	(A) How many times total have you done this in your life?	1	23			beh_21_total
// numeric	(B)How many times have you done this in the past month?	1	23			beh_21_month
// numeric	(C) How old were you the first time?	1	23			beh_21_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	23	"Yes, No, N/A"	"1, 0, 2"	beh_21_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	23	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_21_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	23	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_21_pos
// instruction	Behavior: Drank 5 or more alcholic drinks in 3 hours or less.	0	24
// numeric	(A) How many times total have you done this in your life?	1	24			beh_22_total
// numeric	(B)How many times have you done this in the past month?	1	24			beh_22_month
// numeric	(C) How old were you the first time?	1	24			beh_22_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	24	"Yes, No, N/A"	"1, 0, 2"	beh_22_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	24	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_22_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	24	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_22_pos
// instruction	Behavior: Paid for sex.	0	25
// numeric	(A) How many times total have you done this in your life?	1	25			beh_23_total
// numeric	(B)How many times have you done this in the past month?	1	25			beh_23_month
// numeric	(C) How old were you the first time?	1	25			beh_23_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	25	"Yes, No, N/A"	"1, 0, 2"	beh_23_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	25	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_23_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	25	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_23_pos
// instruction	Behavior: Sold drugs.	0	26
// numeric	(A) How many times total have you done this in your life?	1	26			beh_24_total
// numeric	(B)How many times have you done this in the past month?	1	26			beh_24_month
// numeric	(C) How old were you the first time?	1	26			beh_24_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	26	"Yes, No, N/A"	"1, 0, 2"	beh_24_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	26	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_24_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	26	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_24_pos
// instruction	Behavior: Robbed someone.	0	27
// numeric	(A) How many times total have you done this in your life?	1	27			beh_25_total
// numeric	(B)How many times have you done this in the past month?	1	27			beh_25_month
// numeric	(C) How old were you the first time?	1	27			beh_25_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	27	"Yes, No, N/A"	"1, 0, 2"	beh_25_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	27	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_25_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	27	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_25_pos
// instruction	Behavior: Tried to kill yourself.	0	28
// numeric	(A) How many times total have you done this in your life?	1	28			beh_26_total
// numeric	(B)How many times have you done this in the past month?	1	28			beh_26_month
// numeric	(C) How old were you the first time?	1	28			beh_26_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	28	"Yes, No, N/A"	"1, 0, 2"	beh_26_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	28	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_26_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	28	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_26_pos
// instruction	Behavior: Used marijuana.	0	29
// numeric	(A) How many times total have you done this in your life?	1	29			beh_27_total
// numeric	(B)How many times have you done this in the past month?	1	29			beh_27_month
// numeric	(C) How old were you the first time?	1	29			beh_27_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	29	"Yes, No, N/A"	"1, 0, 2"	beh_27_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	29	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_27_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	29	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_27_pos
// instruction	Behavior: Had difficulty stopping eating.	0	30
// numeric	(A) How many times total have you done this in your life?	1	30			beh_28_total
// numeric	(B)How many times have you done this in the past month?	1	30			beh_28_month
// numeric	(C) How old were you the first time?	1	30			beh_28_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	30	"Yes, No, N/A"	"1, 0, 2"	beh_28_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	30	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_28_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	30	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_28_pos
// instruction	Behavior: Been in 2 or more sexual relationships at the same time.	0	31
// numeric	(A) How many times total have you done this in your life?	1	31			beh_29_total
// numeric	(B)How many times have you done this in the past month?	1	31			beh_29_month
// numeric	(C) How old were you the first time?	1	31			beh_29_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	31	"Yes, No, N/A"	"1, 0, 2"	beh_29_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	31	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_29_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	31	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_29_pos
// instruction	Behavior: Bought expensive items you could not afford on the spur of the moment.	0	32
// numeric	(A) How many times total have you done this in your life?	1	32			beh_30_total
// numeric	(B)How many times have you done this in the past month?	1	32			beh_30_month
// numeric	(C) How old were you the first time?	1	32			beh_30_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	32	"Yes, No, N/A"	"1, 0, 2"	beh_30_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	32	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_30_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	32	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_30_pos
// instruction	Behavior: Abused multiple drugs at once.	0	33
// numeric	(A) How many times total have you done this in your life?	1	33			beh_31_total
// numeric	(B)How many times have you done this in the past month?	1	33			beh_31_month
// numeric	(C) How old were you the first time?	1	33			beh_31_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	33	"Yes, No, N/A"	"1, 0, 2"	beh_31_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	33	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_31_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	33	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_31_pos
// instruction	"Behavior: Played lotteries, card games for money, or went to the casino."	0	34
// numeric	(A) How many times total have you done this in your life?	1	34			beh_32_total
// numeric	(B)How many times have you done this in the past month?	1	34			beh_32_month
// numeric	(C) How old were you the first time?	1	34			beh_32_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	34	"Yes, No, N/A"	"1, 0, 2"	beh_32_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	34	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_32_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	34	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_32_pos
// instruction	"Behavior: Gambled illegally (not part of a legal business, using a bookie)."	0	35
// numeric	(A) How many times total have you done this in your life?	1	35			beh_33_total
// numeric	(B)How many times have you done this in the past month?	1	35			beh_33_month
// numeric	(C) How old were you the first time?	1	35			beh_33_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	35	"Yes, No, N/A"	"1, 0, 2"	beh_33_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	35	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_33_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	35	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_33_pos
// instruction	Behavior: Abused prescription medication.	0	36
// numeric	(A) How many times total have you done this in your life?	1	36			beh_34_total
// numeric	(B)How many times have you done this in the past month?	1	36			beh_34_month
// numeric	(C) How old were you the first time?	1	36			beh_34_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	36	"Yes, No, N/A"	"1, 0, 2"	beh_34_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	36	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_34_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	36	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_34_pos
// instruction	Behavior: Ate a lot of food when not hungry.	0	37
// numeric	(A) How many times total have you done this in your life?	1	37			beh_35_total
// numeric	(B)How many times have you done this in the past month?	1	37			beh_35_month
// numeric	(C) How old were you the first time?	1	37			beh_35_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	37	"Yes, No, N/A"	"1, 0, 2"	beh_35_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	37	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_35_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	37	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_35_pos
// instruction	Behavior: Had a plan to kill yourself.	0	38
// numeric	(A) How many times total have you done this in your life?	1	38			beh_36_total
// numeric	(B)How many times have you done this in the past month?	1	38			beh_36_month
// numeric	(C) How old were you the first time?	1	38			beh_36_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	38	"Yes, No, N/A"	"1, 0, 2"	beh_36_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	38	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_36_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	38	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_36_pos
// instruction	Behavior: Ran red lights or ignored stop signs.	0	39
// numeric	(A) How many times total have you done this in your life?	1	39			beh_37_total
// numeric	(B)How many times have you done this in the past month?	1	39			beh_37_month
// numeric	(C) How old were you the first time?	1	39			beh_37_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	39	"Yes, No, N/A"	"1, 0, 2"	beh_37_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	39	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_37_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	39	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_37_pos
// instruction	Behavior: Stole money.	0	40
// numeric	(A) How many times total have you done this in your life?	1	40			beh_38_total
// numeric	(B)How many times have you done this in the past month?	1	40			beh_38_month
// numeric	(C) How old were you the first time?	1	40			beh_38_age
// radio	"(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?"	1	40	"Yes, No, N/A"	"1, 0, 2"	beh_38_problems
// radio	"(E) I do this behavior to stop feeling upset, distressed, or overwhelmed."	1	40	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_38_neg
// radio	"(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure."	1	40	"Strongly Disgree, Somewhat Disagree, Equally Disagree/Agree, Somewhat Agree, Strongly Agree"	"0, 1, 2, 3, 4"	beh_38_pos
// instruction	Congratulations for completing this survey! Press <strong>finish</strong> to continue.	0	41

var behaviors = [
  { key: 'shoplifted', question: 'Shoplifted things' },
  {
    key: 'speeding_over_30mph',
    question: 'Drove 30mph or faster over the speed limit',
  },
  {
    key: 'betting_sports',
    question: 'Bet on sports, horses, or other animals',
  },
  { key: 'used_cocaine', question: 'Used cocaine or crack' },
  { key: 'bought_drugs', question: 'Bought drugs' },
  {
    key: 'impulsive_buying',
    question: "Impulsively bought stuff you did not need & won't use",
  },
  {
    key: 'unprotected_sex',
    question:
      "Had unprotected sex with someone you just met or didn't know well",
  },
  { key: 'physical_fight', question: 'Gotten in a physical fight' },
  { key: 'sex_for_money_drugs', question: 'Had sex for money or drugs' },
  {
    key: 'alcohol_blackout',
    question: 'Drank alcohol until you blacked or passed out',
  },
  {
    key: 'used_hallucinogens',
    question: 'Used hallucinogens, LSD, or mushrooms',
  },
  { key: 'intoxicated_at_work', question: 'Gone to work intoxicated or high' },
  {
    key: 'attacked_with_weapon',
    question: 'Attacked someone with a weapon, such as a knife or gun',
  },
  {
    key: 'physical_assault',
    question: 'Punched or hit someone with a fist or object',
  },
  {
    key: 'self_harm',
    question: 'Cut, burned, or hurt yourself on purpose without trying to die',
  },
  {
    key: 'gambling_loss',
    question: 'Lost more money than you can afford gambling',
  },
  {
    key: 'threat_physical_harm',
    question: 'Threatened to physically hurt someone',
  },
  {
    key: 'threat_with_weapon',
    question: 'Threatened someone with a weapon, such as a knife or a gun',
  },
  { key: 'used_heroin', question: 'Used heroin' },
  { key: 'vandalism', question: 'Destroyed or vandalized property' },
  {
    key: 'binge_drinking',
    question: 'Drank 5 or more alcoholic drinks in 3 hours or less',
  },
  { key: 'paid_for_sex', question: 'Paid for sex' },
  { key: 'sold_drugs', question: 'Sold drugs' },
  { key: 'robbery', question: 'Robbed someone' },
  { key: 'used_marijuana', question: 'Used marijuana' },
  { key: 'eating_difficulty', question: 'Had difficulty stopping eating' },
  {
    key: 'multiple_sexual_relationships',
    question: 'Been in 2 or more sexual relationships at the same time',
  },
  {
    key: 'impulsive_spending',
    question:
      'Bought expensive items you could not afford on the spur of the moment',
  },
  { key: 'multi_drug_abuse', question: 'Abused multiple drugs at once' },
  {
    key: 'gambling_legal',
    question: 'Played lotteries, card games for money, or went to the casino',
  },
  {
    key: 'gambling_illegal',
    question:
      'Gambled illegally (not part of a legal business, using a bookie)',
  },
  {
    key: 'abused_prescription_meds',
    question: 'Abused prescription medication',
  },
  { key: 'overeating', question: 'Ate a lot of food when not hungry' },
  {
    key: 'traffic_violations',
    question: 'Ran red lights or ignored stop signs',
  },
  { key: 'stole_money', question: 'Stole money' },
];

const createSurveyQuestions = (behaviors) => {
  var surveyQuestions = [];

  surveyQuestions.push([
    {
      type: 'html',
      prompt: `<div class='survey_instructions'><p>For each behavior, fill in how many times you did it in your lifetime (A) & the total number of times you did it in the past month (B).</p>
      <p>Enter one number for each time period, even if it is your best guess. Please do not put a range, but enter a single number (e.g., behaviors engaged in everyday for multiple years can be written in as 1000+, behaviors engaged in daily for a single year can be written in as 365, any other frequency should be estimated using your best guess).</p>
      <p>If you have ever done the behavior, write how old you were the first time (C) and check the box if the behavior ever caused you any problems, regardless of the specific problem (D).</p> 
      <p>For the last two questions (E & F), use the scale to rate how much you agree with each statement from 0 = Strongly Disagree to 4 = Strongly Agree. Please provide ratings for both statements (E & F) and treat them as separate questions.</p>
      <p>If you have never done the shown behavior, then you can just put 0 for questions where applicable, and you skip the last two questions associated with the behavior.</p>
       </div>`,
    },
  ]);

  for (let i = 0; i < behaviors.length; i++) {
    const whichBehavior = {
      type: 'html',
      prompt: `<h1>Behavior: ${behaviors[i].question}</h1>`,
    };

    const firstQ = {
      type: 'text',
      prompt: '(A) How many times total have you done this in your life?',
      name: `total_lifetime_${behaviors[i].key}`,
      required: true,
      placeholder: `Enter "0" if never`,
    };
    const secondQ = {
      type: 'text',
      prompt: '(B) How many times have you done this in the past month?',
      name: `total_last_month_${behaviors[i].key}`,
      required: true,
      placeholder: `Enter "0" if never`,
    };
    const thirdQ = {
      type: 'text',
      prompt: '(C) How old were you the first time?',
      name: `age_first_time_${behaviors[i].key}`,
      required: true,
      placeholder: `Enter "0" if never`,
    };
    const fourthQ = {
      type: 'multi-choice',
      prompt:
        '(D) Did it ever cause you any problems, such as going to the hospital, legal trouble, problems at work, with family, or friends?',
      name: `any_problems_${behaviors[i].key}`,
      required: true,
      options: ['Yes', 'No', 'N/A'],
    };
    const fifthQ = {
      type: 'multi-choice',
      prompt:
        '(E) I do this behavior to stop feeling upset, distressed, or overwhelmed.',
      name: `upset_distressed_or_overwhelmed_${behaviors[i].key}`,
      required: false,
      options: [
        'Strongly Disagree',
        'Somewhat Disagree',
        'Equally Disagree/Agree',
        'Somewhat Agree',
        'Strongly Agree',
      ],
    };
    const sixthQ = {
      type: 'multi-choice',
      prompt:
        '(F) I do this behavior to feel excitement, to get a thrill, or to feel pleasure.',
      name: `excitement_thrill_or_pleasure_${behaviors[i].key}`,
      required: false,
      options: [
        'Strongly Disagree',
        'Somewhat Disagree',
        'Equally Disagree/Agree',
        'Somewhat Agree',
        'Strongly Agree',
      ],
    };
    surveyQuestions.push([
      whichBehavior,
      firstQ,
      secondQ,
      thirdQ,
      fourthQ,
      fifthQ,
      sixthQ,
    ]);
  }
  return surveyQuestions;
};

var surveyQuestions = createSurveyQuestions(behaviors);

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
    Object.keys(data.response).forEach(function (key) {
      data[key] = data.response[key];
    });

    delete data['P0_Q0'];
    delete data['P1_Q0'];
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
    exp_id: 'risq_survey_rdoc__fmri',
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: endText,
  choices: ['Enter'],
  post_trial_gap: 0,
};

risq_survey_rdoc__fmri_experiment = [];
var risq_survey_rdoc__fmri_init = () => {
  risq_survey_rdoc__fmri_experiment.push(fullscreen);
  risq_survey_rdoc__fmri_experiment.push(instructionsBlock);
  risq_survey_rdoc__fmri_experiment.push(trial);
  risq_survey_rdoc__fmri_experiment.push(endBlock);
  risq_survey_rdoc__fmri_experiment.push(exitFullscreen);
};
