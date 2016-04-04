## Online experiments using [jsPsych](http://www.jspsych.org/) JavaScript library 

### <img src="https://github.com/chris-zielinski/Online_experiments_jsPsych/blob/master/HowFast/keyseq/img/layout/hf_logo.png" width="200"> 


Experiment to collect the keyboard typing times, as response to visual stimuli, for research studies conducted at Aix-Marseille University (France)

#### keyseq experiment
Initial experiment to test for the validity of the typing time measurement.


Project files
-------------
<img src="https://github.com/chris-zielinski/Online_experiments_jsPsych/blob/master/keyseq_files.png" width="400"> 

Experimental design
------------------
<img src="https://github.com/chris-zielinski/Online_experiments_jsPsych/blob/master/keyseq_design.png" width="800"> 


Adapted jsPsych plugins
-----------------------
* **jspsych-key-sequence** : devoted to the main task of the study, involving the typing of a 3-keys sequence as a response to a visual stimulus (i.e. a character appearing on the screen). This plugin allowed to record the typing times of each pressed key and to display a visual feedback by changing the color of the stimulus before it disappeared (at the end of the 3nd typing, the initially black symbol became green if the key-sequence was correct, red otherwise). The visual stimulus, the corresponding expected typing sequences, the total number of stimulus and the inter-stimulus duration are configurable as input parameters. When given several types of stimuli and associated sequences, the stimuli are firstly randomly shuffled before to be displayed successively. The plugin also offers a "training mode" that could be switched on from the input settings. In that case, a word is adding below the display symbol, in addition to the feedback color indication ("REUSSI" (succeeded) associated with the green symbol and "RATE" (missed) associated with the red one). This mode is also causing the early end of the block, as soon as the keystroke sequence is wrongly typed (with the aim to remind the instructions as often as necessary to the participant during the training session).

* **jspsych-form** : set as an improvement of the available jspsych-survey-text plugin to display either free text area or clickable predefined options in association with any question of the form. It also allows customizing the width of each input text area of the form, as input settings.

