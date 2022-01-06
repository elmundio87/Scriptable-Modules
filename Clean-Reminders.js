//Completes the reminder with the title passed in the main shortcut parameter

var reminder = args.shortcutParameter;

let all = await Reminder.allCompleted();
for (let r of all) {
  r.remove();
}

Script.complete();
