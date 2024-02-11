let btnschool = document.querySelector("#btnschool");
let inpforschool = document.querySelector("#schoolname");
let btncloseschool = document.querySelector("#btn-close-school");

let btnprogram = document.querySelector("#btnprogram");
let inpforprogram = document.querySelector("#programname");
let btncloseprogram = document.querySelector("#btn-close-program");

let btnsemester = document.querySelector("#btnsemester");
let inpforsemester = document.querySelector("#semestername");
let btnclosesemester = document.querySelector("#btn-close-semester");
let schooljson = "";

const listItemsschool = document.querySelectorAll("#clickableListschool li ");
btnschool.addEventListener("click", () => {
  listItemsschool.forEach((item) => {
    if (item.classList.contains("choosenschool")) {
      // If the element has the class name, remove it
      item.classList.remove("choosenschool");
    }
  });
});
listItemsschool.forEach((item) => {
  item.addEventListener("click", function () {
    item.classList.add("choosenschool");
    let jsonstring = document.querySelector(".choosenschool h1").innerText;
    let schooljson = JSON.parse(jsonstring);

    btnschool.textContent = schooljson.name;
    inpforschool.value = schooljson.name;
    btncloseschool.click();

    let btnprogram = document.querySelector("#btnprogram");
    let olprogram = document.querySelector("#clickableListprogram");

    btnprogram.addEventListener("click", () => {
      olprogram.innerHTML = "";
      schooljson.courses.forEach((course) => {
        let listitem = document.createElement("li");
        listitem.classList.add("list-group-item");
        listitem.classList.add("list-group-item-primary");
        listitem.textContent = course.name;
        olprogram.append(listitem);
      });
      const listItemsprogram = document.querySelectorAll(
        "#clickableListprogram li"
      );
      btnprogram.addEventListener("click", () => {
        listItemsprogram.forEach((item) => {
          if (item.classList.contains("choosenprogram")) {
            // If the element has the class name, remove it
            item.classList.remove("choosenprogram");
          }
        });
      });
      listItemsprogram.forEach((programsname) => {
        programsname.addEventListener("click", () => {
          let programTextContent = programsname.textContent;
          programsname.classList.add("choosenprogram");
          btnprogram.textContent = programTextContent;
          inpforprogram.value = programTextContent;
          olprogram.innerHTML = "";
          btncloseprogram.click();

          let btnsemester = document.querySelector("#btnsemester");
          btnsemester.addEventListener("click", () => {
            let ulsemester = document.querySelector("#clickableListsemester");
            ulsemester.innerHTML = "";
            schooljson.courses.forEach((course) => {
              if (course.name == programsname.textContent) {
                for (sem of course.semesters) {
                  let listitem = document.createElement("li");
                  listitem.classList.add("list-group-item");
                  listitem.classList.add("list-group-item-primary");
                  listitem.textContent = sem.number;
                  ulsemester.append(listitem);
                }
              }
            });
            const listItemssem = document.querySelectorAll(
              "#clickableListsemester li"
            );
            btnsemester.addEventListener("click", () => {
              listItemssem.forEach((item) => {
                if (item.classList.contains("choosensem")) {
                  // If the element has the class name, remove it
                  item.classList.remove("choosensem");
                }
              });
            });
            listItemssem.forEach((sem) => {
              sem.addEventListener("click", () => {
                btnsemester.textContent = sem.textContent;
                sem.classList.add("choosensem");
                inpforsemester.value = sem.textContent;
                btnclosesemester.click();
                ulsemester.innerHTML = "";
              });
            });
            // let submitbtn = document.querySelector("#indexsubmitbtn");
            // submitbtn.addEventListener("click", () => {
            //   ulsemester.innerHTML = "";
            //   olprogram.innerHTML = "";
            //   schoollist.innerHTML = "";
            // });
          });
        });
      });
    });
  });
});
let submitbtn = document.querySelector("#indexsubmitbtn");
let warnh1 = document.querySelector("#warningtext");
submitbtn.addEventListener("click", (event) => {
  if (inpforprogram.value == "" || inpforschool.value == "" || inpforsemester.value == "") {
    alert( "Please Fill all the Fields !");
  } else {
    submitbtn.closest("form").submit();
  }
});
