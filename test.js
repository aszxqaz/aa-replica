let b = false;
let a;
let t;
const p = new Promise((res) => {
    a = res;
    // t = setTimeout(() => {}, 1000);
    // let i = setInterval(() => {
    //     if (b) {
    //         clearInterval(i);
    //         a = res;
    //     }
    // }, 20);
});

async function main() {
    await Promise.all([
        p,
        new Promise((res, rej) => {
            setTimeout(() => {
                // b = true;
                clearTimeout(t);
                a(true);
                res();
            }, 3000);
        }),
    ]).then([first, second]);

    console.log("done");
}

main();
