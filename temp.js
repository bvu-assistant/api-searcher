

// let elems = {};

// console.log(elems);




const axios = require("axios").default;
axios.get('https://sinhvien.bvu.edu.vn/XemLichThi.aspx?k=8RGLKMSmcQfk3ZW7wev0sg')
    .then(res =>
        {
            console.log(res);
        })
    .catch(err =>
        {
            console.log(err);
        });