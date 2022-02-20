import onoff from "onoff";
import { exec } from "child_process";

const resetScript = new onoff.Gpio(24, "in", "falling", {
    debounceTimeout: 10,
});

resetScript.watch((err, value) => {
    if (err) {
        throw err;
    }

    exec("sudo systemctl restart station", function (msg) {
        console.log(msg);
    });
});
