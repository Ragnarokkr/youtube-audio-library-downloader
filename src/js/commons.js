/**
 * Enum for supported inter-messaging commands
 * @readonly
 * @enum {number}
 */
let Commands;
(function (Commands) {
    Commands[Commands["Download"] = 0] = "Download";
    Commands[Commands["Notify"] = 1] = "Notify";
    
    return Commands;
})(Commands || (Commands = {}));
