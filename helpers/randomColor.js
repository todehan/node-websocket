const colors = ["blue", "green", "red", "yellow", "purple"];

const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]; 

};

module.exports = randomColor;




