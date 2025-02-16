function renderMarkdown() {
    const input = document.getElementById("markdown-input").value;
    document.getElementById("preview").innerHTML = snarkdown(input);
}

const textPickr = Pickr.create({
    el: "#text-color-picker",
    theme: "classic",
    default: "#000000",
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            input: true,
            clear: true,
            save: true,
        },
    },
});

const bgPickr = Pickr.create({
    el: '#bg-color-picker',
    theme: 'classic',
    default: '#ffffff',
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            input: true,
            clear: true,
            save: true
        }
    }
});

textPickr.on("save", (color) => {
    document.getElementById("preview").style.color = color.toHEXA().toString();
});

bgPickr.on('save', (color) => {
    document.getElementById('preview').style.backgroundColor = color.toHEXA().toString();
});

const alignButtons = {
    left: document.getElementById('align-left'),
    center: document.getElementById('align-center'),
    right: document.getElementById('align-right')
};

function setAlignment(alignment) {
    document.getElementById('preview').style.textAlign = alignment;
    Object.values(alignButtons).forEach(btn => btn.classList.remove('active'));
    alignButtons[alignment].classList.add('active');
}

alignButtons.left.addEventListener('click', () => setAlignment('left'));
alignButtons.center.addEventListener('click', () => setAlignment('center'));
alignButtons.right.addEventListener('click', () => setAlignment('right'));

setAlignment('left');

document
    .getElementById("markdown-input")
    .addEventListener("input", renderMarkdown);