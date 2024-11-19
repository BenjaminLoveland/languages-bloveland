% Facts: Available courses
course(math, [freshman, sophomore, junior, senior]).
course(english, [freshman, sophomore, junior, senior]).
course(biology, [freshman, sophomore]).
course(chemistry, [junior, senior]).
course(physics, [senior]).
course(history, [sophomore, junior, senior]).
course(computer_science, [junior, senior]).
course(art, [freshman, sophomore, junior, senior]).

% Facts: Student interests
interested_in(ben, computer_science).
interested_in(ben, history).
interested_in(ben, english).
interested_in(john, math).
interested_in(john, computer_science).
interested_in(jane, biology).
interested_in(jane, art).
interested_in(alex, physics).
interested_in(alex, chemistry).

% Rule: Determine eligible courses for a grade level
eligible_courses(Grade, Course) :-
    course(Course, Grades),
    member(Grade, Grades).

% Rule: Build a schedule for a student
build_schedule(Student, Grade, Schedule) :-
    findall(Course, (interested_in(Student, Course), eligible_courses(Grade, Course)), Schedule).
