var course = document.querySelector("#courses");
var courseList = [
    "Architectural Structural Mechanics", 
    "construction management", 
    "building equipment", 
    "building construction", 
    "building and energy", 
    "reinforced concrete structure",
    "steel structure",
    "Smart Architectural Engineering Design",
    "Architectural Engineering Comprehensive Design",
    "Understanding Architectural Engineering",
    "statics",
    "building materials science",
    "building environment plan",
    "Architectural Engineering Computer Utilization",
    "Building elements and technology",
    "building economy",
    "building dynamics",
    "Building material experiment and mixing design",
    "Reinforced concrete structure design",
    "Structural planning and seismic design"
];

for (i = 0; i < courseList.length; i++) {
    courseList[i] = "<span class='a-course'><code>" + courseList[i].toString() + "</code></span>";
}

course.innerHTML = courseList.join("");