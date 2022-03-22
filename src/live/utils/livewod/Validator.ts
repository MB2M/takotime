class Validator {
    static wod(wod: any, cb: Function) {
        // if (!wod.globals) cb("wod globals missing");

        if (!wod.workouts) cb("wod workouts missing");
    }

    static devices(devices: any, cb: Function) {}
}

export default Validator;
