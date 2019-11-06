x = 17
r=1
count = 0;
for(;;) {
    r = x%2019;
    if(r == 0) {
        console.log(x);
        console.log(count)
        break;
    }
    else {
        count++
        x = 100*r + 17

    }
}
