const config = require('../src/config.js');
let cfg = {};
console.log('Checking Config ...');

console.log(`  Reading config file: `);
try{
    cfg = config.read();
    console.log(`\x1b[32m    success\x1b[0m`);
} catch(err) {
    console.error(`\x1b[31m    ERROR reading config\x1b[0m`);
    console.log(err);
}

console.log(`  Test Schild DB: `);
try{
    const schildnrw = require('../src/schildnrw.js');
    let db = new schildnrw.SchildNRW(cfg.SchildNRW.path);
    console.log(`    ${cfg.SchildNRW.path} \x1b[32msuccess\x1b[0m`);

    (async () => {
        let cur = await db.get_current();
        console.log(`    Year: ${cur[0].Schuljahr}  Term: ${cur[0].SchuljahrAbschnitt}  \t\x1b[32mok\x1b[0m`);
        let teachers = await db.get_teachers(cur[0].Schuljahr,cur[0].SchuljahrAbschnitt);
        console.log(`    Teachers: ${teachers.length}    \t\t\x1b[32mok\x1b[0m`);
        let students = await db.get_students(cur[0].Schuljahr,cur[0].SchuljahrAbschnitt);
        console.log(`    Students: ${students.length}    \t\t\x1b[32mok\x1b[0m`);
        let classes = await db.get_classes(cur[0].Schuljahr,cur[0].SchuljahrAbschnitt);
        console.log(`    Classes: ${classes.length}      \t\t\x1b[32mok\x1b[0m`);
        let courses = await db.get_courses(cur[0].Schuljahr,cur[0].SchuljahrAbschnitt);
        console.log(`    Courses: ${courses.length}      \t\t\x1b[32mok\x1b[0m`);
        let alloc = await db.get_course_allocation(cur[0].Schuljahr,cur[0].SchuljahrAbschnitt);
        console.log(`    Allocations: ${alloc.length} \t\t\x1b[32mok\x1b[0m`);
        

    })();
    
} catch(err) {
    console.error(`\x1b[31m    ERROR reading database\x1b[0m`);
    console.log(err);
}

//console.log(`  Test Office365: `);
//try{
//    let cfg = config.read(); 
//    console.log(`\x1b[32m    \x1b[0m`);
//} catch(err) {
//    console.error(`\x1b[31m    \x1b[0m`);
//    console.log(err);
//}