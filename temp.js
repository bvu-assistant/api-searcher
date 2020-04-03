

let elems = [];
let currIndex = -1;


elems.push({Term: 'A', Subjects: []});
currIndex++;
elems[currIndex].Subjects.push({Math: '5'});


console.log(elems);
console.log(elems[currIndex].Subjects[0]);