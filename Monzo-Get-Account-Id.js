let input = args.shortcutParameter;

let globals = importModule("Globals");

return globals.accounts[input];

Script.complete();
