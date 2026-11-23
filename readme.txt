A4 Group 7
Christine Nguyen, chrisln4@uci.edu, 70228903 && Timothy Le, leth4@uci.edu, 87088090

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
estimated 10-12 hours for both of us

3. What online resources did you consult when completing this assignment? (list specific URLs)
https://www.youtube.com/watch?v=hSFy_qvlDGE
https://github.com/ionic-team/ionic-storage
https://ionicframework.com/docs/theming/color-generator 
https://www.med.upenn.edu/cbti/assets/user-content/documents/Stanford%20Sleepiness%20Scale.pdf
https://ionicframework.com/docs/api/datetime
https://capacitorjs.com/docs/apis/preferences

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
We only consulted each other when writing our code for this project. We split the work and made sure the sleep tracker
works before submitting. We also did our research to make sure we coded the project correctly as well

5. Is there anything special we need to know in order to run your code?
No.

6. Did you design your app with a particular type of user in mind? If so, whom?
College students who want to track their night time and day time drowsiness because sometimes studying keeps students up late,
so getting 8 hours of sleep is ideal. The sleeptracker would help them track their sleep accurately. The colors used are very colorblind friendly.

7. Did you design your app specifically for iOS or Android, or both?
No, only the browser with capacitor preference storage

8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
They log overnight sleep by selecting the date (calendar form) and changing the time with the wheel, as long as bedtime 
is before wake time.We wanted to make the UI as simple for our users so they can easily adjust the date/time without any confusion.
An error warning pops up as well if the wake time is earlier than bed time, and it won't let users save their sleep at all, making
sure that everything is accurately recorded.

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
They can log sleepiness right under overnight sleep. It follows the Stanford Sleepiness Scale, and they would only have to drag
or click the slider (goes from 0-9). The slider is easy since they can see the small details when sliding left or right. For 
example, if they chose 6, it would show "sleepy, woozy, fighting sleep; prefer to lay down" for the description. They can also
adjust date and time the same way as logging overnight sleep with calendar and time wheel.

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
They can view their saved data at the bottom when they scroll down. It splits the saved data by overnight sleep vs. sleepiness.
Their logged data displays the day of the week, month and date (#), as well as the time and duration, and sleepiness scale (if applicable).
Users also have the option to delete their logs as well if they mess up on the date or no longer need it logged. This just simplifies 
everything for the user so they know what day they logged their sleep or sleepiness. It is simple and straightforward.

11. Which feature choose--using a native device resource, backing up logged data, or both?
Backed up logged data only

12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
N/A, everything is in the browser

13. If you backed up logged data, where does it back up to?
Data is backed up to capacitor preferences storage (in the browser it gets saved in local storage). 
Every time a sleep or sleepiness log is saved or deleted the lists get saved again, so all the logs are still 
there after the page reloads or app is re-opened

14. How does your app implement or follow principles of good mobile design?
our app opens to the "Log last night's sleep" card with bedtime and wake time already filled in with default values (10 PM to 7 AM), 
so logging wouldn't take long for users. if a user decides to delete a log, it asks "Delete this log?" with a Cancel option, and every 
date/time picker has Cancel and Done, so nothing changes by accident.we used date/time pickers and a 1-7 slider instead of typing, 
future dates can't be picked, and Save sleep is disabled with a red message if the wake up time is before bedtime or in the future.
lastly, we used standard Ionic components (cards, lists, toasts, alerts), one main indigo color for buttons, 
and the app follows the phone's light/dark mode.