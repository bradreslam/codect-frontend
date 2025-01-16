import interact from 'interactjs'

let startPos = null;

// target elements with the "draggable" class
addEventListener("DOMContentLoaded", () => {
    interact(".draggable").draggable({
            onmove: function(event) {
                const target = event.target;
                let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
                let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

                target.style.transform = "translate(" + x + "px, " + y + "px)";
                target.setAttribute("data-x", x);
                target.setAttribute("data-y", y);
            },
            autoScroll: {
                // container: document.body,
                margin: 50,
                distance: 5,
                interval: 10
            },
            inertia: true,
            restrict: {
                restriction: '.parent-div',
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            snap: {
                enabled: false,
                endOnly: true,
                targets: [],
                relativePoints: [{ x: 0.5, y: 0.5 }]
            }
        })
        .on("dragstart", function(event) {
            const target = event.target;

            // Prevent appending the element to the grid repeatedly
            const grid = document.querySelector('[data-target="grid"]');
            if (target.parentElement !== grid) {
                grid.appendChild(target);  // Append only if it's not already in the grid
                target.style.position = 'absolute'; // Use absolute positioning to avoid affecting layout
                target.style.top = `${target.getBoundingClientRect().top}px`;  // Set the initial position
                target.style.left = `${target.getBoundingClientRect().left}px`;  // Set the initial position
            }
        });
    interact(".dropzone")
        // enable draggables to be dropped into this
        .dropzone({
            overlap: "center",
            // only accept elements matching this CSS selector
            accept: ".draggable"
        })
        // listen for drop related events
        .on("dragenter", function (event) {
            var dropRect = event.target.getBoundingClientRect();
            var dropCenter = {
                x: dropRect.left + dropRect.width / 2,
                y: dropRect.top + dropRect.height / 2,
                range: Infinity
            };

            event.draggable.options.drag.snap.enabled = true;
            event.draggable.options.drag.snap.targets = [dropCenter];

            var draggableElement = event.relatedTarget,
                dropzoneElement = event.target;

            // feedback the possibility of a drop
            dropzoneElement.classList.add("drop-target");
            draggableElement.classList.add("can-drop");
        })
        .on("dragleave", function (event) {
            // event.draggable.snap(false);
            event.draggable.options.drag.snap.enabled = false;
            event.draggable.options.drag.snap.targets = [startPos];

            // remove the drop feedback style
            event.target.classList.remove("drop-target");
            event.relatedTarget.classList.remove("can-drop");
        })
        .on("dropactivate", function (event) {
            // add active dropzone feedback
            event.target.classList.add("drop-active");
        })
        .on("dropdeactivate", function (event) {
            // remove active dropzone feedback
            event.target.classList.remove("drop-active");
            event.target.classList.remove("drop-target");
        });
});