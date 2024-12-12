import interact from 'interactjs'

const position = { x: 0, y: 0 };

(interact as any)('.draggable').draggable({
    listeners: {
        move(event) {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
        },
    },
})[1][3];
